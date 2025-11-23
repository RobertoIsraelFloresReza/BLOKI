import {
  Controller,
  Post,
  Get,
  BadRequestException,
  Body,
  Param,
  Logger,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { KYCService } from './kyc.service';
import { StartKYCDTO } from './dto/start-kyc.dto';
import { KYCWebhookDTO } from './dto/kyc-webhook.dto';
import { KYCStatus } from './entities/kyc-verification.entity';
import { Public } from '../../common/decorators/public.decorator';

@ApiTags('KYC - Verificación de Identidad')
@Controller('kyc')
export class KYCController {
  private readonly logger = new Logger(KYCController.name);

  constructor(private readonly kycService: KYCService) {}

  @Post('start')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Inicia el proceso de verificación KYC',
    description: 'Crea una nueva sesión de verificación KYC y devuelve la URL para que el usuario la complete',
  })
  async startKYC(@Body() startKycDto: StartKYCDTO) {
    this.logger.log(`Request body recibido: ${JSON.stringify(startKycDto)}`);
    this.logger.log(`Iniciando KYC para usuario: ${startKycDto.userId}`);
    try {2
      return await this.kycService.startKYCVerification(startKycDto);
    } catch (error) {
      this.logger.error(`Error en startKYC controller: ${error.message}`);
      throw error;
    }
  }

  @Get('status/:userId')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Obtiene el estado actual de KYC del usuario',
    description: 'Retorna el estado, nivel, límites y fecha de completación de la verificación KYC',
  })
  async getStatus(@Param('userId') userId: string) {
    const id = parseInt(userId, 10);
    if (isNaN(id)) {
      throw new BadRequestException('ID de usuario inválido');
    }
    return this.kycService.getKYCStatus(id);
  }

  @Get('webhook')
  @Public()
  @ApiOperation({
    summary: 'Verifica que el webhook esté activo',
    description: 'Endpoint de verificación para Veriff',
  })
  async webhookHealthCheck() {
    return { status: 'ok', message: 'KYC webhook is active' };
  }

  @Post('webhook')
  @Public()
  @ApiOperation({
    summary: 'Webhook del proveedor KYC',
    description: 'Endpoint que el proveedor KYC usa para enviar resultados de verificación',
  })
  async handleWebhook(@Body() webhookDto: any) {
    this.logger.log(`Webhook KYC recibido - Raw data: ${JSON.stringify(webhookDto)}`);
    try {
      await this.kycService.processKYCWebhook(webhookDto);
      this.logger.log(`Webhook procesado exitosamente para sesión: ${webhookDto.sessionId}`);
      return { success: true, message: 'Webhook procesado exitosamente' };
    } catch (error) {
      this.logger.error(`Error procesando webhook: ${error.message}`, error.stack);
      throw error;
    }
  }

  @Post('manual-update/:userId')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Actualiza manualmente el estado KYC',
    description: 'Endpoint para actualizar manualmente el KYC cuando el webhook no funciona (solo desarrollo)',
  })
  async manualUpdate(
    @Param('userId') userId: string,
    @Body() body: { status: 'approved' | 'rejected'; sessionId?: string },
  ) {
    const id = parseInt(userId, 10);
    if (isNaN(id)) {
      throw new BadRequestException('ID de usuario inválido');
    }

    // Get the latest KYC verification for this user
    const kycVerification = await this.kycService.getLatestVerification(id);

    if (!kycVerification) {
      throw new BadRequestException('No hay verificación KYC para este usuario');
    }

    // Update the status manually - convert string literal to enum
    const webhookDto: KYCWebhookDTO = {
      sessionId: body.sessionId || kycVerification.sessionId,
      status: body.status === 'approved' ? KYCStatus.APPROVED : KYCStatus.REJECTED,
      userData: null as any,
      rejectionReason: body.status === 'rejected' ? 'Manual rejection' : undefined,
      externalVerificationId: 'manual-update',
      signature: 'manual',
    };

    await this.kycService.processKYCWebhook(webhookDto);

    return {
      success: true,
      message: `KYC status actualizado a ${body.status}`,
      userId: id,
    };
  }

  @Post('retry/:userId')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Reinicia el proceso KYC',
    description: 'Permite que un usuario rechazado reintente la verificación',
  })
  async retryKYC(@Param('userId') userId: string) {
    const id = parseInt(userId, 10);
    if (isNaN(id)) {
      throw new BadRequestException('ID de usuario inválido');
    }
    return this.kycService.retryKYC(id);
  }

  @Get('transaction-limit/:userId')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Obtiene el límite de transacciones del usuario',
    description: 'Retorna el límite mensual de transacciones basado en el nivel KYC',
  })
  async getTransactionLimit(@Param('userId') userId: string) {
    const id = parseInt(userId, 10);
    if (isNaN(id)) {
      throw new BadRequestException('ID de usuario inválido');
    }
    const limit = await this.kycService.getUserTransactionLimit(id);
    return {
      userId: id,
      transactionLimitUSD: limit,
      currency: 'USD',
    };
  }

  @Post('fix-external-id/:userId')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Extrae y actualiza el externalVerificationId desde el verificationUrl',
    description: 'Endpoint temporal para fixear sesiones KYC antiguas sin externalVerificationId',
  })
  async fixExternalVerificationId(@Param('userId') userId: string) {
    const id = parseInt(userId, 10);
    if (isNaN(id)) {
      throw new BadRequestException('ID de usuario inválido');
    }
    return this.kycService.fixExternalVerificationId(id);
  }
}
