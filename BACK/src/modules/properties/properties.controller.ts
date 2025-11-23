import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, Request, BadRequestException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { PropertiesService } from './properties.service';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { Pausable } from '../../common/decorators/pausable.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { AuthService } from '../auth/auth.service';

@ApiTags('Properties')
@ApiBearerAuth()
@Controller('properties')
export class PropertiesController {
  constructor(
    private readonly propertiesService: PropertiesService,
    private readonly authService: AuthService,
  ) {}

  @Post()
  @Pausable()
  @ApiOperation({ summary: 'Deploy nuevo PropertyToken y registrar propiedad' })
  @ApiResponse({ status: 201, description: 'Propiedad creada exitosamente' })
  async create(@Body() createPropertyDto: CreatePropertyDto, @Request() req) {
    let stellarPublicKey = req.user?.stellarPublicKey || req.user?.walletAddress;

    // Si no tiene wallet, generar una automáticamente
    if (!stellarPublicKey) {
      stellarPublicKey = await this.authService.ensureWallet(req.user.id);
    }

    return this.propertiesService.create(createPropertyDto, stellarPublicKey);
  }

  @Get()
  @Public()
  @ApiOperation({ summary: 'Obtener todas las propiedades (listado público)' })
  @ApiResponse({ status: 200, description: 'Lista de propiedades disponibles' })
  findAll() {
    return this.propertiesService.findAll();
  }

  @Get('my-owned')
  @ApiOperation({ summary: 'Propiedades que el usuario ha tokenizado/subido' })
  @ApiResponse({ status: 200, description: 'Lista de propiedades creadas por el usuario' })
  async getMyOwnedProperties(@Request() req) {
    let stellarPublicKey = req.user?.stellarPublicKey || req.user?.walletAddress;

    // Si no tiene wallet, generar una automáticamente
    if (!stellarPublicKey) {
      this.propertiesService['logger'].log(`🔧 Auto-generating wallet for user ${req.user?.id}`);
      stellarPublicKey = await this.authService.ensureWallet(req.user.id);
      this.propertiesService['logger'].log(`✅ Wallet created: ${stellarPublicKey}`);
    }

    return this.propertiesService.findByOwner(stellarPublicKey);
  }

  @Get('my-investments')
  @ApiOperation({ summary: 'Propiedades donde el usuario ha invertido (tiene tokens)' })
  @ApiResponse({ status: 200, description: 'Lista de propiedades donde el usuario tiene participación' })
  async getMyInvestments(@Request() req) {
    let stellarPublicKey = req.user?.stellarPublicKey || req.user?.walletAddress;

    // Si no tiene wallet, generar una automáticamente
    if (!stellarPublicKey) {
      stellarPublicKey = await this.authService.ensureWallet(req.user.id);
    }

    return this.propertiesService.findInvestments(stellarPublicKey);
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Obtener propiedad por ID' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.propertiesService.findOne(id);
  }

  @Get(':id/token-info')
  @Public()
  @ApiOperation({ summary: 'Obtener info del token desde blockchain' })
  getTokenInfo(@Param('id', ParseIntPipe) id: number) {
    return this.propertiesService.getTokenInfo(id);
  }

  @Get('contract/:contractId')
  @Public()
  @ApiOperation({ summary: 'Buscar propiedad por Contract ID' })
  findByContract(@Param('contractId') contractId: string) {
    return this.propertiesService.findByContractId(contractId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar propiedad' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePropertyDto: UpdatePropertyDto,
    @Request() req,
  ) {
    let stellarPublicKey = req.user?.stellarPublicKey || req.user?.walletAddress;

    // Si no tiene wallet, generar una automáticamente
    if (!stellarPublicKey) {
      stellarPublicKey = await this.authService.ensureWallet(req.user.id);
    }

    return this.propertiesService.update(id, updatePropertyDto, stellarPublicKey);
  }

  @Post(':id/verify')
  @ApiOperation({ summary: 'Verificar propiedad (admin)' })
  verify(
    @Param('id', ParseIntPipe) id: number,
    @Body('adminSecretKey') adminSecretKey: string,
  ) {
    return this.propertiesService.verifyProperty(id, adminSecretKey);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar propiedad' })
  async remove(@Param('id', ParseIntPipe) id: number, @Request() req) {
    let stellarPublicKey = req.user?.stellarPublicKey || req.user?.walletAddress;

    // Si no tiene wallet, generar una automáticamente
    if (!stellarPublicKey) {
      stellarPublicKey = await this.authService.ensureWallet(req.user.id);
    }

    return this.propertiesService.remove(id, stellarPublicKey);
  }

  @Post(':id/tokenize')
  @Pausable()
  @ApiOperation({ summary: 'Tokenizar propiedad (deploy PropertyToken)' })
  tokenize(
    @Param('id', ParseIntPipe) id: number,
    @Body('adminSecretKey') adminSecretKey: string,
    @Request() req,
  ) {
    // TODO: Implement proper tokenization logic
    // This endpoint should update an existing property to deploy its token
    return this.propertiesService.create({} as any, req.user.stellarPublicKey);
  }

  @Get(':id/ownership')
  @Public()
  @ApiOperation({ summary: 'Obtener ownership de la propiedad' })
  getOwnership(@Param('id', ParseIntPipe) id: number) {
    // Redirige a OwnershipController
    return { redirect: `/ownership/property/${id}` };
  }

  @Get(':id/history')
  @Public()
  @ApiOperation({ summary: 'Obtener historial de transacciones' })
  getHistory(@Param('id', ParseIntPipe) id: number) {
    return this.propertiesService.getHistory(id);
  }

  @Post(':id/images')
  @ApiOperation({ summary: 'Agregar URLs de imágenes a una propiedad (ya subidas a Cloudflare)' })
  async addImages(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { imageUrls: string[] },
  ) {
    if (!body.imageUrls || body.imageUrls.length === 0) {
      throw new BadRequestException('No image URLs provided');
    }

    return this.propertiesService.addImages(id, body.imageUrls);
  }

  @Post(':id/valuation-document')
  @ApiOperation({ summary: 'Agregar URL de documento de evaluación (ya subido a Cloudflare)' })
  async addValuationDocument(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { documentUrl: string },
  ) {
    if (!body.documentUrl) {
      throw new BadRequestException('No document URL provided');
    }
    return this.propertiesService.addValuationDocument(id, body.documentUrl);
  }
}
