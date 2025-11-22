import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MediaEntity } from './entity/media.entity';
import { MediaService } from './media.service';
import { MediaController } from './media.controller';
import { CloudflareModule } from '../cloudflare/cloudflare.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([MediaEntity]),
    CloudflareModule,
  ],
  controllers: [MediaController],
  providers: [MediaService],
  exports: [MediaService],
})
export class MediaModule {}
