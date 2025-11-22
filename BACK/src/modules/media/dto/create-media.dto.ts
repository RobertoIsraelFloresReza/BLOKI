import { IsEnum, IsInt, IsOptional, IsString, IsUrl } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { MediaFileType, MediaEntityType, MediaStatus } from '../entity/media.entity';

export class CreateMediaDto {
  @ApiProperty({ description: 'Public URL of the uploaded file' })
  @IsUrl()
  @IsString()
  url: string;

  @ApiProperty({ description: 'Entity ID this media belongs to', required: false })
  @IsOptional()
  @IsInt()
  entityId?: number;

  @ApiProperty({ description: 'Type of entity', enum: MediaEntityType, required: false })
  @IsOptional()
  @IsEnum(MediaEntityType)
  entityType?: MediaEntityType;

  @ApiProperty({ description: 'Type of file', enum: MediaFileType })
  @IsEnum(MediaFileType)
  fileType: MediaFileType;

  @ApiProperty({ description: 'Display order for sorting', required: false })
  @IsOptional()
  @IsInt()
  displayOrder?: number;

  @ApiProperty({ description: 'Status', enum: MediaStatus, required: false })
  @IsOptional()
  @IsEnum(MediaStatus)
  status?: MediaStatus;
}
