import { Module } from '@nestjs/common';
import { CloudflareConfigModule } from '../../config/cloudflare.config';
import { CloudflareService } from './cloudflare.service';
import { CloudflareController } from './cloudflare.controller';

@Module({
  imports: [CloudflareConfigModule.forRootAsync()],
  controllers: [CloudflareController],
  providers: [CloudflareService],
  exports: [CloudflareService],
})
export class CloudflareModule {}
