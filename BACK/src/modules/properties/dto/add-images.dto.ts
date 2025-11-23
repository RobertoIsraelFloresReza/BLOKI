import { IsArray, IsString, IsUrl } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddImagesDto {
  @ApiProperty({
    description: 'Array of image URLs (already uploaded to Cloudflare)',
    example: ['https://pub-xxx.r2.dev/libamaq/image1.jpg', 'https://pub-xxx.r2.dev/libamaq/image2.jpg'],
    type: [String]
  })
  @IsArray()
  @IsString({ each: true })
  @IsUrl({}, { each: true })
  imageUrls: string[];
}
