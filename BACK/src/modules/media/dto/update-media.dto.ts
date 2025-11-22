import { PartialType } from '@nestjs/swagger';
import { CreateMediaDto } from './create-media.dto';
import { IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateMediaDto extends PartialType(CreateMediaDto) {
  @ApiProperty({ description: 'Media ID to update' })
  @IsInt()
  id: number;
}
