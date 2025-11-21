import { Injectable, BadRequestException, NotFoundException, Logger, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { KYCVerificationEntity, KYCLevel, KYCStatus } from './entities/kyc-verification.entity';
import { UserService } from '../user/user.service';
import { UserEntity } from '../user/entity/user.entity';
import { StartKYCDTO } from './dto/start-kyc.dto';
import { KYCWebhookDTO } from './dto/kyc-webhook.dto';
import { KYCStatusDTO } from './dto/kyc-status.dto';
import * as crypto from 'crypto';

@Injectable()
export class KYCService {
  private readonly logger = new Logger(KYCService.name);
  private readonly kycProvider = 'veriff';
  private readonly kycApiKey: string;
  private readonly kycWebhookSecret: string;
  private readonly kycApiUrl: string;

  // Límites de transacción por nivel KYC
  private readonly transactionLimits = {
    [KYCLevel.LEVEL_1]: 5000,      // $5,000 USD
    [KYCLevel.LEVEL_2]: 50000,     // $50,000 USD
    [KYCLevel.LEVEL_3]: 999999999, // Sin límite
  };

  constructor(
    @InjectRepository(KYCVerificationEntity)
    private kycRepository: Repository<KYCVerificationEntity>,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private userService: UserService,
    private configService: ConfigService,
  ) {
    this.kycApiKey = this.configService.get('VERIFF_API_KEY') || '';
    this.kycWebhookSecret = this.configService.get('VERIFF_SECRET_KEY') || '';
    this.kycApiUrl = this.configService.get('VERIFF_BASE_URL') || 'https://stationapi.veriff.com';
  }

  /**
   * Inicia el proceso de verificación KYC
   * @param startKycDto Datos para iniciar KYC
   * @returns Información de sesión y URL de verificación
   */
  async startKYCVerification(startKycDto: StartKYCDTO) {
    this.logger.log(`Datos recibidos para KYC: ${JSON.stringify(startKycDto)}`);
    const { userId, level, country, redirectUrl } = startKycDto;

    // Validar que el usuario exista
    const user = await this.userService.findById(userId);
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    // Validar que no haya verificación pendiente
    const existingVerification = await this.kycRepository.findOne({
      where: {
        userId,
        status: KYCStatus.PENDING,
      },
    });

    if (existingVerification) {
      throw new BadRequestException('Ya existe una verificación KYC pendiente para este usuario');
    }

    try {
      // Generar sessionId único
      const sessionId = this.generateSessionId();

      // Crear objeto de datos de verificación
      const verificationData = {
        country: country || user.country || 'Mexico',
        redirectUrl: redirectUrl || `${process.env.APP_URL || 'http://localhost:3000'}/kyc-callback`,
      };

      // Llamar al proveedor KYC para crear sesión
      const externalResponse = await this.createKYCSessionWithProvider({
        sessionId,
        email: user.email,
        firstName: user.name || 'Usuario',
        lastName: user.lastName || 'Apellido',
        ...verificationData,
      });

      // Guardar en base de datos
      const kycVerification = this.kycRepository.create({
        userId,
        level,
        provider: this.kycProvider,
        sessionId,
        status: KYCStatus.PENDING,
        verificationUrl: externalResponse.verificationUrl,
        verificationData: JSON.stringify(verificationData),
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 días
      });

      await this.kycRepository.save(kycVerification);

      // Actualizar usuario con estado KYC
      await this.userRepository.update({ id: userId }, { kycStatus: KYCStatus.PENDING });

      this.logger.log(`KYC iniciado para usuario ${userId} con sessionId ${sessionId}`);

      return {
        sessionId,
        kycUrl: externalResponse.verificationUrl,
        level,
        expiresAt: kycVerification.expiresAt,
        status: 'pending',
      };
    } catch (error) {
      this.logger.error(`Error al iniciar KYC: ${error.message}`, error.stack);

      // Proporcionar mensaje más específico si es un error conocido
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }

      throw new BadRequestException(`Error al iniciar proceso de verificación KYC: ${error.message}`);
    }
  }

  /**
   * Obtiene el estado actual de verificación KYC
   * @param userId ID del usuario
   * @returns Estado actual del KYC
   */
  async getKYCStatus(userId: number): Promise<KYCStatusDTO> {
    const user = await this.userService.findById(userId);
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    const kycVerification = await this.kycRepository.findOne({
      where: { userId },
      order: { createdAt: 'DESC' },
    });

    if (!kycVerification) {
      return {
        status: KYCStatus.NOT_STARTED,
        level: KYCLevel.LEVEL_1,
        transactionLimit: this.transactionLimits[KYCLevel.LEVEL_1],
        retryCount: 0,
        expiresAt: new Date(),
      };
    }

    // Validar si la sesión ha expirado
    if (kycVerification.status === KYCStatus.PENDING && new Date() > kycVerification.expiresAt) {
      kycVerification.status = KYCStatus.EXPIRED;
      await this.kycRepository.save(kycVerification);
    }

    const kycLevel = kycVerification.level || KYCLevel.LEVEL_1;

    return {
      status: kycVerification.status,
      level: kycLevel,
      transactionLimit: this.transactionLimits[kycLevel],
      completedAt: kycVerification.completedAt,
      rejectionReason: kycVerification.rejectionReason,
      retryCount: kycVerification.retryCount,
      expiresAt: kycVerification.expiresAt,
    };
  }

  /**
   * Procesa webhook del proveedor KYC
   * @param webhookDto Datos del webhook
   */
  async processKYCWebhook(webhookDto: KYCWebhookDTO) {
    const { sessionId, status, userData, rejectionReason, externalVerificationId, signature } = webhookDto;

    // Validar firma del webhook
    if (!this.validateWebhookSignature(webhookDto, signature)) {
      throw new UnauthorizedException('Firma del webhook inválida');
    }

    // Encontrar verificación KYC
    const kycVerification = await this.kycRepository.findOne({
      where: { sessionId },
    });

    if (!kycVerification) {
      throw new NotFoundException(`Verificación KYC no encontrada para sessionId: ${sessionId}`);
    }

    // Actualizar verificación KYC
    kycVerification.status = status as KYCStatus;
    kycVerification.externalVerificationId = externalVerificationId;
    kycVerification.completedAt = new Date();

    if (status === KYCStatus.APPROVED) {
      // Guardar datos verificados
      kycVerification.verificationData = JSON.stringify({
        ...JSON.parse(kycVerification.verificationData || '{}'),
        ...userData,
        verifiedAt: new Date(),
      });
    } else if (status === KYCStatus.REJECTED) {
      kycVerification.rejectionReason = rejectionReason || '';
      kycVerification.retryCount = (kycVerification.retryCount || 0) + 1;
    }

    await this.kycRepository.save(kycVerification);

    // Actualizar usuario
    const updateData: any = {
      kycStatus: status,
      kycVerifiedAt: new Date(),
    };

    if (status === KYCStatus.APPROVED && userData) {
      updateData.country = userData.country;
    }

    await this.userRepository.update({ id: kycVerification.userId }, updateData);

    this.logger.log(`KYC ${status} para usuario ${kycVerification.userId}`);

    // Aquí podrías enviar email al usuario, registrar en auditoría, etc.
    await this.notifyUserOfKYCResult(kycVerification.userId, status);
  }

  /**
   * Obtiene el límite de transacciones del usuario
   * @param userId ID del usuario
   * @returns Límite de transacciones en USD
   */
  async getUserTransactionLimit(userId: number): Promise<number> {
    const kycStatus = await this.getKYCStatus(userId);
    return kycStatus.transactionLimit;
  }

  /**
   * Valida si el usuario puede hacer una transacción
   * @param userId ID del usuario
   * @param monthlySpent Monto gastado este mes
   * @param transactionAmount Monto de la transacción propuesta
   * @returns true si puede hacer la transacción
   */
  async canUserMakeTransaction(
    userId: number,
    monthlySpent: number,
    transactionAmount: number,
  ): Promise<boolean> {
    const status = await this.getKYCStatus(userId);

    if (status.status !== KYCStatus.APPROVED) {
      return false;
    }

    const totalAmount = monthlySpent + transactionAmount;
    return totalAmount <= status.transactionLimit;
  }

  /**
   * Reinicia el proceso KYC (usuario rechazado quiere reintentar)
   * @param userId ID del usuario
   */
  async retryKYC(userId: number) {
    const lastVerification = await this.kycRepository.findOne({
      where: { userId },
      order: { createdAt: 'DESC' },
    });

    if (!lastVerification) {
      throw new NotFoundException('No hay verificación previa para reintentar');
    }

    // Validar número de reintentos
    if (lastVerification.retryCount >= 3) {
      throw new BadRequestException(
        'Número máximo de reintentos alcanzado. Por favor, contacta a soporte.',
      );
    }

    // Iniciar nuevo proceso
    return this.startKYCVerification({
      userId,
      level: lastVerification.level,
    });
  }

  // ==================== MÉTODOS PRIVADOS ====================

  /**
   * Genera un sessionId único
   */
  private generateSessionId(): string {
    return `kyc_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
  }

  /**
   * Comunica con Veriff API para crear sesión de verificación
   * Documentación: https://developers.veriff.com/#sessions
   */
  private async createKYCSessionWithProvider(data: any): Promise<{ verificationUrl: string }> {
    try {
      if (!this.kycApiKey) {
        this.logger.error('VERIFF_API_KEY no configurado');
        throw new BadRequestException('Servicio KYC no configurado correctamente');
      }

      const payload = {
        verification: {
          callback: `${this.configService.get('API_BASE_URL')}/kyc/webhook`,
          person: {
            firstName: data.firstName,
            lastName: data.lastName,
          },
          vendorData: data.sessionId,
          timestamp: new Date().toISOString(),
        },
      };

      this.logger.log(`Creando sesión Veriff para: ${data.email}`);

      const response = await fetch(`${this.kycApiUrl}/v1/sessions`, {
        method: 'POST',
        headers: {
          'X-AUTH-CLIENT': this.kycApiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.text();
        this.logger.error(`Error de Veriff API: ${response.status} - ${errorData}`);
        throw new BadRequestException('Error al crear sesión de verificación');
      }

      const veriffResponse = await response.json();

      return {
        verificationUrl: veriffResponse.verification.url,
      };
    } catch (error) {
      this.logger.error(`Error comunicando con Veriff: ${error.message}`);
      throw error;
    }
  }

  /**
   * Valida la firma del webhook de Veriff
   * Veriff envía la firma como X-HMAC-SIGNATURE en los headers
   * Documentación: https://developers.veriff.com/#webhooks
   */
  private validateWebhookSignature(data: KYCWebhookDTO, signature: string): boolean {
    try {
      if (!this.kycWebhookSecret) {
        this.logger.warn('VERIFF_SECRET_KEY no configurado, saltando validación de firma');
        return true; // En desarrollo, permitir sin validación
      }

      // Crear hash del payload completo
      const { signature: _, ...dataToHash } = data;
      const payload = JSON.stringify(dataToHash);

      // Veriff usa SHA256 HMAC con la secret key
      const calculatedSignature = crypto
        .createHmac('sha256', this.kycWebhookSecret)
        .update(payload)
        .digest('hex');

      const isValid = calculatedSignature === signature;

      if (!isValid) {
        this.logger.error('Firma del webhook inválida');
        this.logger.debug(`Signature recibida: ${signature}`);
        this.logger.debug(`Signature calculada: ${calculatedSignature}`);
      }

      return isValid;
    } catch (error) {
      this.logger.error(`Error validando firma del webhook: ${error.message}`);
      return false;
    }
  }

  /**
   * Notifica al usuario sobre el resultado del KYC
   */
  private async notifyUserOfKYCResult(userId: number, status: KYCStatus) {
    try {
      const user = await this.userService.findById(userId);
      if (!user) return;

      // Aquí irían las notificaciones por email
      // await this.emailService.sendKYCNotification(user.email, status);

      this.logger.log(`Notificación de KYC enviada a ${user.email} - Estado: ${status}`);
    } catch (error) {
      this.logger.error(`Error notificando usuario: ${error.message}`);
    }
  }
}
