import {
  Controller,
  Post,
  Delete,
  Body,
  UseInterceptors,
  UploadedFiles,
  BadRequestException,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiConsumes, ApiBearerAuth } from '@nestjs/swagger';
import { CloudflareService } from './cloudflare.service';
import { Public } from '../../common/decorators/public.decorator';

@ApiTags('Cloudflare')
@ApiBearerAuth()
@Controller('cloudflare')
export class CloudflareController {
  constructor(private readonly cloudflareService: CloudflareService) {}

  @Post('upload')
  @ApiOperation({ summary: 'Upload files to Cloudflare R2' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      limits: {
        fileSize: 10 * 1024 * 1024, // 10MB
      },
    }),
  )
  async uploadFiles(
    @UploadedFiles() files: Express.Multer.File[],
    @Body('folder') folder?: string,
  ) {
    if (!files || files.length === 0) {
      throw new BadRequestException('No files provided');
    }

    const uploadPromises = files.map((file) =>
      this.cloudflareService.uploadToCloudflare(file, folder || 'general'),
    );

    const results = await Promise.all(uploadPromises);
    return {
      message: `${files.length} file(s) uploaded successfully`,
      files: results,
    };
  }

  @Delete('delete')
  @ApiOperation({ summary: 'Delete file from Cloudflare R2' })
  async deleteFile(@Body('fileUrl') fileUrl: string) {
    if (!fileUrl) {
      throw new BadRequestException('File URL is required');
    }

    await this.cloudflareService.deleteFromCloudflare(fileUrl);
    return {
      message: 'File deleted successfully',
    };
  }

  @Delete('delete-multiple')
  @ApiOperation({ summary: 'Delete multiple files from Cloudflare R2' })
  async deleteMultipleFiles(@Body('fileUrls') fileUrls: string[]) {
    if (!fileUrls || !Array.isArray(fileUrls) || fileUrls.length === 0) {
      throw new BadRequestException('File URLs array is required');
    }

    await this.cloudflareService.deleteMultipleFromCloudflare(fileUrls);
    return {
      message: `${fileUrls.length} file(s) deleted successfully`,
    };
  }
}
