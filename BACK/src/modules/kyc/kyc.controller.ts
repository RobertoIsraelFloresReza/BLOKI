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
    this.logger.log(`Iniciando KYC para usuario: ${startKycDto.userId}`);
    return this.kycService.startKYCVerification(startKycDto);
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

  @Post('webhook')
  @Public()
  @ApiOperation({
    summary: 'Webhook del proveedor KYC',
    description: 'Endpoint que el proveedor KYC usa para enviar resultados de verificación',
  })
  async handleWebhook(@Body() webhookDto: KYCWebhookDTO) {
    this.logger.log(`Webhook KYC recibido para sesión: ${webhookDto.sessionId}`);
    await this.kycService.processKYCWebhook(webhookDto);
    return { success: true, message: 'Webhook procesado exitosamente' };
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
}
