import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';
import { CustomLoggerService } from 'src/common/logger/logger.service';
import { DataSource, Not, Repository } from 'typeorm';
import { HandleException } from '../../common/exceptions/handler/handle.exception';
import {
  NotFoundCustomException,
  NotFoundCustomExceptionType,
} from '../../common/exceptions/types/notFound.exception';
import { comparePasswords, hashPassword } from '../../utils/password.utils';
import { stringConstants } from '../../utils/string.constant';
import { UserEntity } from './entity/user.entity';
import { CreateUserDto } from './model/create.user.dto';
import { ResetPasswordCodeDTO } from './model/reset.password.code.dto';
import { ResetPasswordDTO } from './model/reset.password.dto';
import { UpdateUserDto } from './model/update.user.dto';
import { BaseService } from '../base/base.service';
import { OwnershipEntity } from '../ownership/entities/ownership.entity';
import { TransactionEntity } from '../marketplace/entities/transaction.entity';
import { PropertyEntity } from '../properties/entities/property.entity';
import { StellarService } from '../stellar/stellar.service';

@Injectable()
export class UserService extends BaseService<UserEntity, CreateUserDto, UpdateUserDto> {
  protected repository: Repository<UserEntity>;
  protected notFoundExceptionType = NotFoundCustomExceptionType.USER;
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(OwnershipEntity)
    private readonly ownershipRepository: Repository<OwnershipEntity>,
    @InjectRepository(TransactionEntity)
    private readonly transactionRepository: Repository<TransactionEntity>,
    @InjectRepository(PropertyEntity)
    private readonly propertyRepository: Repository<PropertyEntity>,
    private readonly logger: CustomLoggerService,
    private readonly stellarService: StellarService,
  ) {
    super();
    this.repository = this.userRepository;
  }

  protected getDefaultRelations(): { relations?: string[] } {
    return { relations: [] };
  }


  async findAll(): Promise<UserEntity[]> {
    try {
      return await this.userRepository.find({
        order: { createdAt: 'DESC' }
      });
    } catch (error) {
      HandleException.exception(error);
      return [];
    }
  }

  async findAllActive(): Promise<UserEntity[]> {
    try {
      return await this.userRepository.find({
        where: { status: stringConstants.STATUS_ACTIVE },
        order: { createdAt: 'DESC' }
      });
    } catch (error) {
      HandleException.exception(error);
      return [];
    }
  }

  async findByRole(role: string): Promise<UserEntity[]> {
    try {
      return await this.userRepository.find({
        where: { role }
      });
    } catch (error) {
      HandleException.exception(error);
      return [];
    }
  }


  async findById(id: number, includeSecretFields: boolean = false): Promise<UserEntity> {
    try {
      const queryBuilder = this.userRepository.createQueryBuilder('user').where('user.id = :id', { id });

      if (includeSecretFields) {
        // Incluir campos con select: false
        queryBuilder.addSelect('user.stellarSecretKeyEncrypted');
      }

      const user = await queryBuilder.getOne();

      if (!user) {
        throw new NotFoundCustomException(NotFoundCustomExceptionType.USER);
      }

      return user;
    } catch (error) {
      HandleException.exception(error);
      throw error; // Re-throw para que TypeScript entienda que siempre retorna o lanza error
    }
  }

  async findByIdWithDetails(id: number) {
    try {
      const user = await this.userRepository.findOne({
        where: { id: id },
        select: ['id', 'email', 'name', 'lastName', 'role', 'status']
      });
      if (!user) {
        throw new NotFoundCustomException(NotFoundCustomExceptionType.USER);
      }
      return user;
    } catch (error) {
      HandleException.exception(error);
    }
  }

  async findByEmail(email: string) {
    try {
      return await this.userRepository.findOne({
        where: { email },
        select: ['id', 'email', 'name', 'lastName', 'password', 'phoneNumber', 'role', 'status']
      });
    } catch (error) {
      HandleException.exception(error);
    }
  }

  async findByPhoneNumber(phoneNumber: string) {
    try {
      return await this.userRepository.findOne({
        where: { phoneNumber },
        select: ['id', 'email', 'name', 'lastName', 'phoneNumber', 'role', 'status', 'createdAt']
      });
    } catch (error) {
      HandleException.exception(error);
    }
  }

  async create(createUserDTO: CreateUserDto): Promise<UserEntity> {
    try {
      await this.validateUniqueFields(
        createUserDTO.email,
        createUserDTO.phoneNumber,
      );

      const hashedPassword = await hashPassword(createUserDTO.password);

      // Si no viene wallet en el DTO, generar una automáticamente
      let stellarPublicKey = createUserDTO.stellarPublicKey;
      let stellarSecretKeyEncrypted = createUserDTO.stellarSecretKeyEncrypted;

      if (!stellarPublicKey || !stellarSecretKeyEncrypted) {
        console.log(`[UserService] Auto-generating Stellar wallet for new user: ${createUserDTO.email}`);

        const stellarKeypair = this.stellarService.generateKeypair();
        stellarPublicKey = stellarKeypair.publicKey;
        stellarSecretKeyEncrypted = this.encryptSecretKey(stellarKeypair.secretKey);

        // Fund account on testnet
        if (process.env.STELLAR_NETWORK === 'testnet') {
          try {
            await this.stellarService.fundAccount(stellarKeypair.publicKey);
            console.log(`[UserService] Auto-funded account ${stellarKeypair.publicKey}`);
          } catch (error) {
            console.warn('[UserService] Failed to fund account:', error.message);
          }

          try {
            await this.stellarService.mintUsdcMock(stellarKeypair.publicKey, 10000);
            console.log(`[UserService] Auto-minted 10,000 USDC to ${stellarKeypair.publicKey}`);
          } catch (error) {
            console.warn('[UserService] Failed to mint USDC:', error.message);
          }
        }
      }

      const user = this.userRepository.create({
        ...createUserDTO,
        password: hashedPassword,
        stellarPublicKey,
        stellarSecretKeyEncrypted,
      });

      const savedUser = await this.userRepository.save(user);

      return savedUser;
    } catch (error) {
      if (error instanceof BadRequestException) throw error;
      throw new BadRequestException(
        error.message || 'Error al crear el usuario',
      );
    }
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

  async update(updateUserDTO: UpdateUserDto): Promise<UserEntity> {
    try {
      const user = await this.findById(updateUserDTO.id);
      if (!user) {
        throw new NotFoundCustomException(NotFoundCustomExceptionType.USER);
      }

      await this.validateUniqueFields(
        updateUserDTO.email,
        updateUserDTO.phoneNumber,
        updateUserDTO.id,
      );

      const { id, ...updateData } = updateUserDTO;
      await this.userRepository.update({ id }, updateData);
      return await this.findById(id);
    } catch (error) {
      HandleException.exception(error);
      throw error;
    }
  }

  private async validateUniqueFields(
    email?: string,
    phoneNumber?: string,
    excludeUserId?: number,
  ) {
    this.logger.logRequest('validateUniqueFields', { email, phoneNumber, excludeUserId });

    // Validar email único
    if (email) {
      this.logger.logRequest('validateUniqueFields', `Validando email: ${email}`);
      const emailExists = await this.userRepository.exists({
        where: {
          email,
          id: excludeUserId ? Not(excludeUserId) : undefined
        }
      });

      if (emailExists) {
        this.logger.logException('UserService', 'validateUniqueFields', new Error(`Email duplicado: ${email}`));
        throw new BadRequestException('Ya existe un usuario con este email');
      }
    }

    if (phoneNumber) {
      this.logger.logRequest('validateUniqueFields', `Validando teléfono: ${phoneNumber}`);
      const phoneExists = await this.userRepository.exists({
        where: {
          phoneNumber,
          id: excludeUserId ? Not(excludeUserId) : undefined
        }
      });

      if (phoneExists) {
        this.logger.logException('UserService', 'validateUniqueFields', new Error(`Teléfono duplicado: ${phoneNumber}`));
        throw new BadRequestException(
          'Ya existe un usuario con este número de teléfono',
        );
      }
    }

    this.logger.logRequest('validateUniqueFields', 'Validación de campos únicos completada');
  }

  async resetPassword(resetPasswordDTO: ResetPasswordDTO) {
    try {
      const user = await this.findById(resetPasswordDTO.id);
      if (!user) {
        throw new NotFoundCustomException(NotFoundCustomExceptionType.USER);
      }

      const hashedPassword = await hashPassword(resetPasswordDTO.password);
      await this.userRepository.update(
        { id: resetPasswordDTO.id },
        { password: hashedPassword },
      );

      return await this.findById(resetPasswordDTO.id);
    } catch (error) {
      if (error instanceof NotFoundCustomException) {
        throw error;
      }
      throw new BadRequestException(
        error.message || 'Error al resetear la contraseña',
      );
    }
  }

  async sendCodeEmail(id: number) {
    try {
      const user = await this.findById(id);
      if (!user) {
        throw new NotFoundCustomException(NotFoundCustomExceptionType.USER);
      }

      // Generar código de 6 dígitos
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      const hashedCode = await hashPassword(code);

      // Guardar código hasheado y fecha de creación
      await this.userRepository.update(
        { id },
        {
          code: hashedCode,
          codeCreatedAt: new Date(),
        },
      );

      return { code }; // En producción, este código se enviaría por email
    } catch (error) {
      if (error instanceof NotFoundCustomException) {
        throw error;
      }
      throw new BadRequestException(
        error.message || 'Error al generar el código',
      );
    }
  }

  async resetPasswordWithCode(resetPasswordCodeDTO: ResetPasswordCodeDTO) {
    try {
      const user = await this.findById(resetPasswordCodeDTO.id);
      if (!user) {
        throw new NotFoundCustomException(NotFoundCustomExceptionType.USER);
      }

      if (!user.code || !user.codeCreatedAt) {
        throw new BadRequestException('No hay código de verificación generado');
      }

      // Verificar si el código ha expirado (15 minutos)
      const codeAge = new Date().getTime() - user.codeCreatedAt.getTime();
      if (codeAge > 15 * 60 * 1000) {
        throw new BadRequestException('El código ha expirado');
      }

      // Verificar el código
      const isValidCode = await comparePasswords(
        resetPasswordCodeDTO.code,
        user.code,
      );
      if (!isValidCode) {
        throw new BadRequestException('Código de verificación inválido');
      }

      // Actualizar contraseña
      const hashedPassword = await hashPassword(resetPasswordCodeDTO.password);
      await this.userRepository.update(
        { id: resetPasswordCodeDTO.id },
        {
          password: hashedPassword,
          code: undefined,
          codeCreatedAt: undefined,
        },
      );

      return await this.findById(resetPasswordCodeDTO.id);
    } catch (error) {
      if (
        error instanceof NotFoundCustomException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new BadRequestException(
        error.message || 'Error al resetear la contraseña con código',
      );
    }
  }


  async sendVerificationCode(userId: number) {
    try {
      const user = await this.userRepository.findOne({ where: { id: userId } });
      if (!user) throw new NotFoundCustomException(NotFoundCustomExceptionType.USER);
      // Generate 6-digit code
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      const hashedCode = await hashPassword(code);
      await this.userRepository.update(
        { id: userId },
        { code: hashedCode, codeCreatedAt: new Date() }
      );
      // Enviar WhatsApp
      const url = process.env.URL_WEB || 'ucore.cloud/verificationCode';
      const message = `Tu código de verificación es: ${code}\nIngresa a: ${url}`;

      return { success: true, message: 'Código enviado por WhatsApp' };
    } catch (error) {
      throw new BadRequestException(error.message || 'Error al generar o enviar el código');
    }
  }


  async findAllPhoneNumbers(): Promise<string[]> {
    try {
      const users = await this.userRepository.find({
        select: ['phoneNumber']
      });
      return users.map(user => user.phoneNumber).filter(Boolean);
    } catch (error) {
      HandleException.exception(error);
      return [];
    }
  }

  async findByStellarPublicKey(stellarPublicKey: string): Promise<UserEntity> {
    try {
      const user = await this.userRepository.findOne({
        where: { stellarPublicKey },
      });
      if (!user) {
        throw new NotFoundException('User not found with this Stellar public key');
      }
      return user;
    } catch (error) {
      HandleException.exception(error);
      throw error;
    }
  }

  async updateByStellarPublicKey(stellarPublicKey: string, updateUserDto: UpdateUserDto): Promise<UserEntity> {
    try {
      const user = await this.findByStellarPublicKey(stellarPublicKey);

      await this.validateUniqueFields(
        updateUserDto.email,
        updateUserDto.phoneNumber,
        user.id,
      );

      Object.assign(user, updateUserDto);
      return await this.userRepository.save(user);
    } catch (error) {
      HandleException.exception(error);
      throw error;
    }
  }

  async initiateKyc(stellarPublicKey: string): Promise<any> {
    try {
      const user = await this.findByStellarPublicKey(stellarPublicKey);

      // Simular inicio de KYC (en producción integraría con Synaps u otro proveedor)
      const sessionId = `kyc_session_${Date.now()}`;

      user.kycStatus = 'pending';
      user.kycMetadata = JSON.stringify({
        provider: 'synaps',
        sessionId,
        initiatedAt: new Date().toISOString(),
      });

      await this.userRepository.save(user);

      return {
        success: true,
        sessionId,
        redirectUrl: `https://verify.synaps.io/${sessionId}`,
        message: 'KYC process initiated. Please complete verification.',
      };
    } catch (error) {
      HandleException.exception(error);
      throw error;
    }
  }

  async getKycStatus(stellarPublicKey: string): Promise<any> {
    try {
      const user = await this.findByStellarPublicKey(stellarPublicKey);

      return {
        status: user.kycStatus,
        verifiedAt: user.kycVerifiedAt,
        metadata: user.kycMetadata ? JSON.parse(user.kycMetadata) : null,
      };
    } catch (error) {
      HandleException.exception(error);
      throw error;
    }
  }

  async getPortfolio(stellarPublicKey: string): Promise<any> {
    try {
      const ownerships = await this.ownershipRepository.find({
        where: { ownerAddress: stellarPublicKey },
        relations: ['property'],
        order: { createdAt: 'DESC' },
      });

      const totalInvestedResult = await this.transactionRepository
        .createQueryBuilder('transaction')
        .select('SUM(CAST(transaction.totalPrice AS DECIMAL))', 'total')
        .where('transaction.buyerAddress = :address', { address: stellarPublicKey })
        .getRawOne();

      const totalInvested = totalInvestedResult?.total || '0';

      const portfolioValue = ownerships.reduce((sum, ownership) => {
        const balance = parseFloat(ownership.balance) / 10000000;
        const valuation = parseFloat(ownership.property.valuation) / 10000000;
        return sum + (balance * valuation / parseFloat(ownership.property.totalSupply));
      }, 0);

      return {
        totalProperties: ownerships.length,
        totalInvested: totalInvested.toString(),
        currentValue: (portfolioValue * 10000000).toString(),
        ownerships: ownerships.map(o => ({
          property: o.property,
          balance: o.balance,
          percentage: o.percentage,
          acquiredAt: o.createdAt,
        })),
      };
    } catch (error) {
      HandleException.exception(error);
      throw error;
    }
  }

  async getUserProperties(stellarPublicKey: string): Promise<PropertyEntity[]> {
    try {
      const ownerships = await this.ownershipRepository.find({
        where: { ownerAddress: stellarPublicKey },
        relations: ['property', 'property.listings'],
        order: { createdAt: 'DESC' },
      });

      return ownerships.map(o => o.property);
    } catch (error) {
      HandleException.exception(error);
      throw error;
    }
  }

  async getUserTransactions(stellarPublicKey: string): Promise<TransactionEntity[]> {
    try {
      const transactions = await this.transactionRepository.find({
        where: [
          { buyerAddress: stellarPublicKey },
          { sellerAddress: stellarPublicKey },
        ],
        relations: ['listing', 'listing.property'],
        order: { createdAt: 'DESC' },
      });

      return transactions;
    } catch (error) {
      HandleException.exception(error);
      throw error;
    }
  }
}
