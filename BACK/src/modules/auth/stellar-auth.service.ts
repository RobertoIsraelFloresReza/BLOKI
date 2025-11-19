import {
  Injectable,
  UnauthorizedException,
  Logger,
  Inject,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Keypair } from '@stellar/stellar-sdk';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';
import { randomBytes } from 'crypto';
import { UserTokenization } from '../users/entities/user-tokenization.entity';

export interface ChallengeResponse {
  challenge: string;
  expiresAt: Date;
}

export interface VerifySignatureDto {
  publicKey: string;
  signature: string;
  challenge: string;
}

export interface SessionData {
  stellarAddress: string;
  email: string;
  userType: string;
  kycStatus: string;
  createdAt: Date;
}

@Injectable()
export class StellarAuthService {
  private readonly logger = new Logger(StellarAuthService.name);
  private readonly CHALLENGE_TTL = 300; // 5 minutes in seconds
  private readonly SESSION_TTL = 604800; // 7 days in seconds

  constructor(
    @InjectRedis() private readonly redis: Redis,
    @InjectRepository(UserTokenization)
    private readonly userRepository: Repository<UserTokenization>,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Generate a challenge (nonce) for the user to sign
   */
  async generateChallenge(publicKey: string): Promise<ChallengeResponse> {
    // Validate Stellar public key format
    if (!this.isValidStellarPublicKey(publicKey)) {
      throw new UnauthorizedException('Invalid Stellar public key format');
    }

    // Generate random challenge
    const challenge = randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + this.CHALLENGE_TTL * 1000);

    // Store challenge in Redis with TTL
    const challengeKey = `challenge:${publicKey}`;
    await this.redis.setex(
      challengeKey,
      this.CHALLENGE_TTL,
      JSON.stringify({ challenge, expiresAt }),
    );

    this.logger.log(`Challenge generated for ${publicKey}`);

    return {
      challenge,
      expiresAt,
    };
  }

  /**
   * Verify the signature and create session
   */
  async verifySignature(dto: VerifySignatureDto): Promise<{
    sessionToken: string;
    user: UserTokenization;
  }> {
    const { publicKey, signature, challenge } = dto;

    // Validate public key format
    if (!this.isValidStellarPublicKey(publicKey)) {
      throw new UnauthorizedException('Invalid Stellar public key format');
    }

    // Retrieve stored challenge
    const challengeKey = `challenge:${publicKey}`;
    const storedChallengeData = await this.redis.get(challengeKey);

    if (!storedChallengeData) {
      throw new UnauthorizedException(
        'Challenge not found or expired. Please request a new challenge.',
      );
    }

    const { challenge: storedChallenge } = JSON.parse(storedChallengeData);

    // Verify challenge matches
    if (challenge !== storedChallenge) {
      throw new UnauthorizedException('Challenge mismatch');
    }

    // Verify signature using Stellar SDK
    const isValid = await this.verifySignatureWithStellar(
      publicKey,
      signature,
      challenge,
    );

    if (!isValid) {
      throw new UnauthorizedException('Invalid signature');
    }

    // Delete used challenge
    await this.redis.del(challengeKey);

    // Find or create user
    let user = await this.userRepository.findOne({
      where: { stellarAddress: publicKey },
    });

    if (!user) {
      // Auto-register user on first login
      user = this.userRepository.create({
        stellarAddress: publicKey,
        email: `${publicKey.substring(0, 8)}@stellar.wallet`, // Temporary email
      });
      await this.userRepository.save(user);
      this.logger.log(`New user auto-registered: ${publicKey}`);
    }

    // Create session
    const sessionToken = this.generateSessionToken();
    const sessionData: SessionData = {
      stellarAddress: user.stellarAddress,
      email: user.email,
      userType: user.userType,
      kycStatus: user.kycStatus,
      createdAt: new Date(),
    };

    await this.redis.setex(
      `session:${sessionToken}`,
      this.SESSION_TTL,
      JSON.stringify(sessionData),
    );

    this.logger.log(`Session created for ${publicKey}`);

    return {
      sessionToken,
      user,
    };
  }

  /**
   * Validate session token
   */
  async validateSession(sessionToken: string): Promise<SessionData | null> {
    const sessionKey = `session:${sessionToken}`;
    const sessionData = await this.redis.get(sessionKey);

    if (!sessionData) {
      return null;
    }

    return JSON.parse(sessionData);
  }

  /**
   * Invalidate session (logout)
   */
  async invalidateSession(sessionToken: string): Promise<void> {
    const sessionKey = `session:${sessionToken}`;
    await this.redis.del(sessionKey);
    this.logger.log(`Session invalidated: ${sessionToken.substring(0, 8)}...`);
  }

  /**
   * Get user profile from session
   */
  async getUserProfile(sessionToken: string): Promise<UserTokenization> {
    const session = await this.validateSession(sessionToken);

    if (!session) {
      throw new UnauthorizedException('Invalid or expired session');
    }

    const user = await this.userRepository.findOne({
      where: { stellarAddress: session.stellarAddress },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return user;
  }

  /**
   * Verify signature using Stellar SDK
   */
  private async verifySignatureWithStellar(
    publicKey: string,
    signature: string,
    challenge: string,
  ): Promise<boolean> {
    try {
      const keypair = Keypair.fromPublicKey(publicKey);
      const challengeBuffer = Buffer.from(challenge, 'hex');
      const signatureBuffer = Buffer.from(signature, 'hex');

      return keypair.verify(challengeBuffer, signatureBuffer);
    } catch (error) {
      this.logger.error(`Signature verification failed: ${error.message}`);
      return false;
    }
  }

  /**
   * Validate Stellar public key format
   */
  private isValidStellarPublicKey(publicKey: string): boolean {
    try {
      // Stellar public keys start with 'G' and are 56 characters
      if (!publicKey || publicKey.length !== 56 || !publicKey.startsWith('G')) {
        return false;
      }

      // Validate using Stellar SDK
      Keypair.fromPublicKey(publicKey);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Generate a secure session token
   */
  private generateSessionToken(): string {
    return randomBytes(32).toString('hex');
  }

  /**
   * Extend session TTL (refresh)
   */
  async refreshSession(sessionToken: string): Promise<void> {
    const session = await this.validateSession(sessionToken);

    if (!session) {
      throw new UnauthorizedException('Invalid or expired session');
    }

    const sessionKey = `session:${sessionToken}`;
    await this.redis.expire(sessionKey, this.SESSION_TTL);
    this.logger.log(`Session refreshed for ${session.stellarAddress}`);
  }
}
