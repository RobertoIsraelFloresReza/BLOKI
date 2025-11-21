import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RedisModule } from '@nestjs-modules/ioredis';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { StellarAuthService } from './stellar-auth.service';
import { StellarAuthController } from './stellar-auth.controller';
import { StellarAuthGuard } from './guards/stellar-auth.guard';
import { AuthGuard } from './guard/auth.guard';
import { GoogleStrategy } from './strategies/google.strategy';
import { UserModule } from '../user/user.module';
import { StellarModule } from '../stellar/stellar.module';
import { UserTokenization } from '../users/entities/user-tokenization.entity';
import { getRedisConfig } from '../../config/redis.config';

@Module({
  imports: [
    UserModule,
    StellarModule,
    PassportModule,
    TypeOrmModule.forFeature([UserTokenization]),
    RedisModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getRedisConfig,
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '24h' },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController, StellarAuthController],
  providers: [
    AuthService,
    StellarAuthService,
    StellarAuthGuard,
    AuthGuard,
    GoogleStrategy,
  ],
  exports: [
    AuthService,
    StellarAuthService,
    StellarAuthGuard,
    AuthGuard,
    JwtModule,
  ],
})
export class AuthModule {}
