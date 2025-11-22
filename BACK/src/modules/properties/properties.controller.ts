import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, UseInterceptors, UploadedFiles, Request, BadRequestException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiConsumes, ApiBearerAuth } from '@nestjs/swagger';
import { FilesInterceptor } from '@nestjs/platform-express';
import { PropertiesService } from './properties.service';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { Pausable } from '../../common/decorators/pausable.decorator';
import { Public } from '../../common/decorators/public.decorator';

@ApiTags('Properties')
@ApiBearerAuth()
@Controller('properties')
export class PropertiesController {
  constructor(private readonly propertiesService: PropertiesService) {}

  @Post()
  @Pausable()
  @ApiOperation({ summary: 'Deploy nuevo PropertyToken y registrar propiedad' })
  @ApiResponse({ status: 201, description: 'Propiedad creada exitosamente' })
  create(@Body() createPropertyDto: CreatePropertyDto, @Request() req) {
    // El JWT payload puede tener stellarPublicKey o walletAddress
    const stellarPublicKey = req.user?.stellarPublicKey || req.user?.walletAddress;

    if (!stellarPublicKey) {
      throw new BadRequestException('User stellar public key not found in JWT token');
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
  getMyOwnedProperties(@Request() req) {
    // DEBUG: Log user info
    this.propertiesService['logger'].log(`🔍 DEBUG /my-owned - User from JWT:`, JSON.stringify(req.user));
    this.propertiesService['logger'].log(`🔍 DEBUG /my-owned - stellarPublicKey:`, req.user?.stellarPublicKey);

    return this.propertiesService.findByOwner(req.user.stellarPublicKey);
  }

  @Get('my-investments')
  @ApiOperation({ summary: 'Propiedades donde el usuario ha invertido (tiene tokens)' })
  @ApiResponse({ status: 200, description: 'Lista de propiedades donde el usuario tiene participación' })
  getMyInvestments(@Request() req) {
    return this.propertiesService.findInvestments(req.user.stellarPublicKey);
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
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePropertyDto: UpdatePropertyDto,
    @Request() req,
  ) {
    return this.propertiesService.update(id, updatePropertyDto, req.user.stellarPublicKey);
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
  remove(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.propertiesService.remove(id, req.user.stellarPublicKey);
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
  @ApiOperation({ summary: 'Subir imágenes para una propiedad' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FilesInterceptor('images', 10, {
      fileFilter: (req, file, callback) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|gif|webp)$/)) {
          return callback(new Error('Only image files are allowed!'), false);
        }
        callback(null, true);
      },
      limits: {
        fileSize: 10 * 1024 * 1024, // 10MB
      },
    }),
  )
  async uploadImages(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    console.log('=== PROPERTIES CONTROLLER: UPLOAD IMAGES ===');
    console.log(`Property ID: ${id}`);
    console.log(`Files received: ${files?.length || 0}`);

    if (!files || files.length === 0) {
      console.error('❌ No images provided');
      throw new BadRequestException('No images provided');
    }

    console.log('Files details:');
    files.forEach((file, i) => {
      console.log(`  ${i + 1}. ${file.originalname} - ${(file.size / 1024).toFixed(2)}KB - ${file.mimetype}`);
    });

    console.log('🚀 Calling PropertiesService.addImages...');
    const result = await this.propertiesService.addImages(id, files);
    console.log('✅ Upload completed successfully!');
    console.log('=== PROPERTIES CONTROLLER: UPLOAD IMAGES END ===');

    return result;
  }

  @Post(':id/valuation-document')
  @ApiOperation({ summary: 'Subir documento de evaluación para una propiedad' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FilesInterceptor('document', 1, {
      fileFilter: (req, file, callback) => {
        if (!file.mimetype.match(/\/(pdf|doc|docx|jpg|jpeg|png)$/)) {
          return callback(new Error('Only PDF, DOC, DOCX, and image files are allowed!'), false);
        }
        callback(null, true);
      },
      limits: {
        fileSize: 10 * 1024 * 1024, // 10MB
      },
    }),
  )
  async uploadValuationDocument(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    if (!files || files.length === 0) {
      throw new BadRequestException('No document provided');
    }
    return this.propertiesService.addValuationDocument(id, files[0]);
  }
}
