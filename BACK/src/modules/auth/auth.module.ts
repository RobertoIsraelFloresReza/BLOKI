import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RedisModule } from '@nestjs-modules/ioredis';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { StellarAuthService } from './stellar-auth.service';
import { StellarAuthController } from './stellar-auth.controller';
import { StellarAuthGuard } from './guards/stellar-auth.guard';
import { UserModule } from '../user/user.module';
import { StellarModule } from '../stellar/stellar.module';
import { UserTokenization } from '../users/entities/user-tokenization.entity';
import { getRedisConfig } from '../../config/redis.config';

@Module({
  imports: [
    UserModule,
    StellarModule,
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
  providers: [AuthService, StellarAuthService, StellarAuthGuard],
  exports: [AuthService, StellarAuthService, StellarAuthGuard],
})
export class AuthModule {}
