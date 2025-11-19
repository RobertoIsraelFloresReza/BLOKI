import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserEntity } from './entity/user.entity';
import { CustomLoggerService } from 'src/common/logger/logger.service';
import { OwnershipEntity } from '../ownership/entities/ownership.entity';
import { TransactionEntity } from '../marketplace/entities/transaction.entity';
import { PropertyEntity } from '../properties/entities/property.entity';

@Module({
    imports: [TypeOrmModule.forFeature([UserEntity, OwnershipEntity, TransactionEntity, PropertyEntity])],
    controllers: [UserController],
    providers: [UserService, CustomLoggerService],
    exports: [UserService, TypeOrmModule],
})
export class UserModule {}