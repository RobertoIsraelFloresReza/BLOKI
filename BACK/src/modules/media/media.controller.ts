import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { MediaService } from './media.service';
import { CreateMediaDto } from './dto/create-media.dto';
import { MediaEntityType } from './entity/media.entity';

@ApiTags('Media')
@ApiBearerAuth()
@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Post('register-urls')
  @ApiOperation({ summary: 'Register media URLs in database (files already uploaded to Cloudflare)' })
  async registerUrls(@Body('urls') urls: string[]) {
    return await this.mediaService.createFromUrls(urls);
  }

  @Post()
  @ApiOperation({ summary: 'Create media record from existing URL' })
  async create(@Body() createMediaDto: CreateMediaDto) {
    return await this.mediaService.create(createMediaDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all media files' })
  async findAll() {
    return await this.mediaService.findAll();
  }

  @Get('entity')
  @ApiOperation({ summary: 'Get media by entity' })
  @ApiQuery({ name: 'entityId', type: Number })
  @ApiQuery({ name: 'entityType', enum: MediaEntityType })
  async findByEntity(
    @Query('entityId', ParseIntPipe) entityId: number,
    @Query('entityType') entityType: MediaEntityType,
  ) {
    return await this.mediaService.findByEntity(entityId, entityType);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get media by ID' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.mediaService.findOne(id);
  }

  @Delete()
  @ApiOperation({ summary: 'Delete media files' })
  async deleteMedia(@Body('ids') ids: number[]) {
    return await this.mediaService.deleteFiles(ids);
  }
}
