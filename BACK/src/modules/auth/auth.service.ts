import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { LoginDTO } from './models/dto/login.dto';
import { RegisterDTO } from './models/dto/register.dto';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { StellarService } from '../stellar/stellar.service';
import { comparePasswords } from '../../utils/password.utils';
import * as crypto from 'crypto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly stellarService: StellarService,
  ) {}

  async login(data: LoginDTO) {
    const user = await this.userService.findByEmail(data.email);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await comparePasswords(data.password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = {
      id: user.id,
      email: user.email,
      name: user.name,
      stellarPublicKey: user.stellarPublicKey,
    };

    const access_token = await this.jwtService.signAsync(payload);

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        stellarPublicKey: user.stellarPublicKey,
        walletAddress: user.stellarPublicKey, // Alias for frontend compatibility
        kycStatus: user.kycStatus,
      },
      access_token,
      token: access_token, // Alias for frontend compatibility
    };
  }

  async register(data: RegisterDTO) {
    const existingUser = await this.userService.findByEmail(data.email);

    if (existingUser) {
      throw new ConflictException('User already exists');
    }

    // Generate Stellar wallet keypair
    const stellarKeypair = this.stellarService.generateKeypair();

    // Encrypt the secret key before storing (AES-256-GCM)
    const encryptedSecretKey = this.encryptSecretKey(stellarKeypair.secretKey);

    // Split name into firstName and lastName
    const nameParts = data.name.trim().split(' ');
    const firstName = nameParts[0];
    const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : nameParts[0];

    const newUser = await this.userService.create({
      name: firstName,
      lastName: lastName,
      email: data.email,
      password: data.password, // UserService will hash the password
      stellarPublicKey: stellarKeypair.publicKey,
      stellarSecretKeyEncrypted: encryptedSecretKey, // Store encrypted secret key
      siteId: 1, // Default site for simplified auth
    });

    // Generate JWT with Stellar public key
    const payload = {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      stellarPublicKey: stellarKeypair.publicKey,
    };

    const access_token = await this.jwtService.signAsync(payload);

    // Fund account on testnet (only for development)
    if (process.env.STELLAR_NETWORK === 'testnet') {
      try {
        await this.stellarService.fundAccount(stellarKeypair.publicKey);
      } catch (error) {
        // Log but don't fail registration if funding fails
        console.warn('Failed to fund account with Friendbot:', error.message);
      }

      // Mint USDC mock tokens for testing (10,000 USDC)
      try {
        await this.stellarService.mintUsdcMock(stellarKeypair.publicKey, 10000);
        console.log(`Minted 10,000 USDC mock tokens to ${stellarKeypair.publicKey}`);
      } catch (error) {
        // Log but don't fail registration if USDC minting fails
        console.warn('Failed to mint USDC mock tokens:', error.message);
      }
    }

    return {
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        stellarPublicKey: stellarKeypair.publicKey,
        walletAddress: stellarKeypair.publicKey, // Alias for frontend compatibility
        kycStatus: newUser.kycStatus,
      },
      access_token,
      token: access_token, // Alias for frontend compatibility
      stellarWallet: {
        publicKey: stellarKeypair.publicKey,
        // IMPORTANT: Secret key should be stored encrypted and never returned in production
        // Only returning for development/testing purposes
        encryptedSecretKey: encryptedSecretKey,
      },
      message: 'User registered successfully with Stellar wallet',
    };
  }

  private encryptSecretKey(secretKey: string): string {
    const algorithm = 'aes-256-gcm';
    const key = crypto.scryptSync(process.env.JWT_SECRET || 'default-secret', 'salt', 32);
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(algorithm, key, iv);

    let encrypted = cipher.update(secretKey, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    const authTag = cipher.getAuthTag();

    return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`;
  }

  private decryptSecretKey(encryptedData: string): string {
    const algorithm = 'aes-256-gcm';
    const key = crypto.scryptSync(process.env.JWT_SECRET || 'default-secret', 'salt', 32);

    const parts = encryptedData.split(':');
    const iv = Buffer.from(parts[0], 'hex');
    const authTag = Buffer.from(parts[1], 'hex');
    const encrypted = parts[2];

    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    decipher.setAuthTag(authTag);

    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
  }

  async validate(userId: number) {
    const user = await this.userService.findById(userId);

    if (!user) {
      throw new UnauthorizedException('Invalid user');
    }

    // Return user directly (consistent with login/register)
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      stellarPublicKey: user.stellarPublicKey,
      walletAddress: user.stellarPublicKey, // Alias for frontend compatibility
      kycStatus: user.kycStatus,
    };
  }

  async getDecryptedSecretKey(userId: number) {
    const user = await this.userService.findById(userId, true); // true para incluir fields con select: false

    if (!user) {
      throw new UnauthorizedException('Invalid user');
    }

    if (!user.stellarSecretKeyEncrypted) {
      throw new BadRequestException('User does not have a custodial wallet');
    }

    try {
      const decryptedSecretKey = this.decryptSecretKey(user.stellarSecretKeyEncrypted);

      return {
        stellarPublicKey: user.stellarPublicKey,
        stellarSecretKey: decryptedSecretKey,
        warning: 'NEVER share your secret key! This endpoint should only be used by the platform for authorized transactions.',
      };
    } catch (error) {
      throw new BadRequestException('Failed to decrypt secret key');
    }
  }

  async logout() {
    return {
      message: 'Logout successful',
    };
  }

  /**
   * Asegura que el usuario tenga una wallet Stellar
   * Si ya tiene, retorna la existente. Si no, genera una nueva automáticamente.
   */
  async ensureWallet(userId: number): Promise<string> {
    const user = await this.userService.findById(userId, true);

    if (!user) {
      throw new UnauthorizedException('Invalid user');
    }

    // Si ya tiene wallet, retornar la existente
    if (user.stellarPublicKey && user.stellarSecretKeyEncrypted) {
      return user.stellarPublicKey;
    }

    // Si no tiene wallet, generar una automáticamente
    this.logger.log(`Auto-generating Stellar wallet for user ${userId} (${user.email})`);

    const stellarKeypair = this.stellarService.generateKeypair();
    const encryptedSecretKey = this.encryptSecretKey(stellarKeypair.secretKey);

    // Update user with new wallet
    await this.userService['userRepository'].update(userId, {
      stellarPublicKey: stellarKeypair.publicKey,
      stellarSecretKeyEncrypted: encryptedSecretKey,
    });

    // Fund account on testnet
    if (process.env.STELLAR_NETWORK === 'testnet') {
      try {
        await this.stellarService.fundAccount(stellarKeypair.publicKey);
        this.logger.log(`Auto-funded account ${stellarKeypair.publicKey}`);
      } catch (error) {
        this.logger.warn('Failed to fund account:', error.message);
      }

      try {
        await this.stellarService.mintUsdcMock(stellarKeypair.publicKey, 10000);
        this.logger.log(`Auto-minted 10,000 USDC to ${stellarKeypair.publicKey}`);
      } catch (error) {
        this.logger.warn('Failed to mint USDC:', error.message);
      }
    }

    return stellarKeypair.publicKey;
  }

  /**
   * Regenera el Stellar wallet para usuarios existentes que no lo tienen
   * Útil para usuarios creados antes de la implementación de wallets
   */
  async regenerateWallet(userId: number) {
    const user = await this.userService.findById(userId, true);

    if (!user) {
      throw new UnauthorizedException('Invalid user');
    }

    // Verificar si ya tiene wallet
    if (user.stellarPublicKey && user.stellarSecretKeyEncrypted) {
      throw new BadRequestException('User already has a Stellar wallet');
    }

    this.logger.log(`Regenerating Stellar wallet for user ${userId} (${user.email})`);

    // Generate Stellar wallet keypair
    const stellarKeypair = this.stellarService.generateKeypair();

    // Encrypt the secret key before storing
    const encryptedSecretKey = this.encryptSecretKey(stellarKeypair.secretKey);

    // Update user with new wallet (direct repository update)
    await this.userService['userRepository'].update(userId, {
      stellarPublicKey: stellarKeypair.publicKey,
      stellarSecretKeyEncrypted: encryptedSecretKey,
    });

    // Fund account on testnet
    if (process.env.STELLAR_NETWORK === 'testnet') {
      try {
        await this.stellarService.fundAccount(stellarKeypair.publicKey);
        this.logger.log(`Funded account ${stellarKeypair.publicKey} with Friendbot`);
      } catch (error) {
        this.logger.warn('Failed to fund account with Friendbot:', error.message);
      }

      // Mint USDC mock tokens
      try {
        await this.stellarService.mintUsdcMock(stellarKeypair.publicKey, 10000);
        this.logger.log(`Minted 10,000 USDC mock tokens to ${stellarKeypair.publicKey}`);
      } catch (error) {
        this.logger.warn('Failed to mint USDC mock tokens:', error.message);
      }
    }

    // Generate new JWT with stellar public key
    const payload = {
      id: user.id,
      email: user.email,
      name: user.name,
      stellarPublicKey: stellarKeypair.publicKey,
    };

    const access_token = await this.jwtService.signAsync(payload);

    return {
      message: 'Stellar wallet regenerated successfully',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        stellarPublicKey: stellarKeypair.publicKey,
        walletAddress: stellarKeypair.publicKey,
        kycStatus: user.kycStatus,
      },
      access_token,
      token: access_token,
      stellarWallet: {
        publicKey: stellarKeypair.publicKey,
        funded: process.env.STELLAR_NETWORK === 'testnet',
      },
    };
  }

  async googleLogin(googleUser: any) {
    // Check if user exists
    let user = await this.userService.findByEmail(googleUser.email);

    // If user doesn't exist, create a new one
    if (!user) {
      // Generate Stellar wallet keypair
      const stellarKeypair = this.stellarService.generateKeypair();

      // Encrypt the secret key before storing
      const encryptedSecretKey = this.encryptSecretKey(stellarKeypair.secretKey);

      user = await this.userService.create({
        name: googleUser.firstName,
        lastName: googleUser.lastName || googleUser.firstName,
        email: googleUser.email,
        password: crypto.randomBytes(32).toString('hex'), // Random password for OAuth users
        stellarPublicKey: stellarKeypair.publicKey,
        stellarSecretKeyEncrypted: encryptedSecretKey, // Store encrypted secret key
        siteId: 1,
      });

      // Fund account on testnet
      if (process.env.STELLAR_NETWORK === 'testnet') {
        try {
          await this.stellarService.fundAccount(stellarKeypair.publicKey);
        } catch (error) {
          console.warn('Failed to fund account with Friendbot:', error.message);
        }

        // Mint USDC mock tokens for testing (10,000 USDC)
        try {
          await this.stellarService.mintUsdcMock(stellarKeypair.publicKey, 10000);
          console.log(`[OAuth] Minted 10,000 USDC mock tokens to ${stellarKeypair.publicKey}`);
        } catch (error) {
          console.warn('Failed to mint USDC mock tokens:', error.message);
        }
      }
    }

    // Generate JWT token
    const payload = {
      id: user.id,
      email: user.email,
      name: user.name,
      stellarPublicKey: user.stellarPublicKey,
    };

    const access_token = await this.jwtService.signAsync(payload);

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        stellarPublicKey: user.stellarPublicKey,
        walletAddress: user.stellarPublicKey, // Alias for frontend compatibility
        kycStatus: user.kycStatus,
      },
      access_token,
      token: access_token, // Alias for frontend compatibility
    };
  }
}
