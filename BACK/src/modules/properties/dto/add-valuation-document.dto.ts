import { IsString, IsUrl } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddValuationDocumentDto {
  @ApiProperty({
    description: 'URL of the valuation document (already uploaded to Cloudflare)',
    example: 'https://pub-xxx.r2.dev/libamaq/valuation.pdf'
  })
  @IsString()
  @IsUrl()
  documentUrl: string;
}
