import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KYCVerificationEntity } from './entities/kyc-verification.entity';
import { UserEntity } from '../user/entity/user.entity';
import { KYCService } from './kyc.service';
import { KYCController } from './kyc.controller';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([KYCVerificationEntity, UserEntity]),
    UserModule,
  ],
  providers: [KYCService],
  controllers: [KYCController],
  exports: [KYCService],
})
export class KycModule {}
