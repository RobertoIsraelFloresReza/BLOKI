import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AnchorsController } from './anchors.controller';
import { AnchorsService } from './anchors.service';
import { AnchorTransactionEntity } from './entities/anchor-transaction.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([AnchorTransactionEntity]),
    ConfigModule,
  ],
  controllers: [AnchorsController],
  providers: [AnchorsService],
  exports: [AnchorsService],
})
export class AnchorsModule {}
