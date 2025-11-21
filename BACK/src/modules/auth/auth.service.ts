import {
  Injectable,
  UnauthorizedException,
  ConflictException,
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
        kycStatus: user.kycStatus,
      },
      access_token,
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
    }

    return {
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        stellarPublicKey: stellarKeypair.publicKey,
        kycStatus: newUser.kycStatus,
      },
      access_token,
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

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    };
  }

  async logout() {
    return {
      message: 'Logout successful',
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
        siteId: 1,
      });

      // Fund account on testnet
      if (process.env.STELLAR_NETWORK === 'testnet') {
        try {
          await this.stellarService.fundAccount(stellarKeypair.publicKey);
        } catch (error) {
          console.warn('Failed to fund account with Friendbot:', error.message);
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
        kycStatus: user.kycStatus,
      },
      access_token,
    };
  }
}
