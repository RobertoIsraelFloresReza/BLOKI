import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, UseInterceptors, UploadedFiles, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiConsumes, ApiBearerAuth } from '@nestjs/swagger';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
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
  create(@Body() createPropertyDto: CreatePropertyDto) {
    return this.propertiesService.create(createPropertyDto);
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
  ) {
    return this.propertiesService.update(id, updatePropertyDto);
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
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.propertiesService.remove(id);
  }

  @Post(':id/tokenize')
  @Pausable()
  @ApiOperation({ summary: 'Tokenizar propiedad (deploy PropertyToken)' })
  tokenize(
    @Param('id', ParseIntPipe) id: number,
    @Body('adminSecretKey') adminSecretKey: string,
  ) {
    return this.propertiesService.create({} as any); // Reutiliza create
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
      storage: diskStorage({
        destination: './uploads/properties',
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          callback(null, `property-${req.params.id}-${uniqueSuffix}${ext}`);
        },
      }),
      fileFilter: (req, file, callback) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|gif|webp)$/)) {
          return callback(new Error('Only image files are allowed!'), false);
        }
        callback(null, true);
      },
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
      },
    }),
  )
  async uploadImages(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return this.propertiesService.addImages(id, files);
  }
}
