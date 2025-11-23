import { Injectable, Inject } from '@nestjs/common';
import {
  PutObjectCommand,
  DeleteObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';
import { CustomLoggerService } from '../../common/logger/logger.service';

interface CloudflareConfig {
  bucketName: string;
  publicUrl: string;
}

@Injectable()
export class CloudflareService {
  constructor(
    @Inject('CLOUDFLARE_CLIENT') private readonly s3Client: S3Client,
    @Inject('CLOUDFLARE_CONFIG') private readonly config: CloudflareConfig,
    private readonly logger: CustomLoggerService,
  ) {
    this.logger.logCloudflare(`CloudflareService initialized`);
  }

  /**
   * Upload file to Cloudflare R2 Object Storage
   */
  async uploadToCloudflare(
    file: Express.Multer.File,
  ): Promise<{ url: string }> {
    try {
      const fileExtension = file.originalname.split('.').pop();
      const fileName = `libamaq/${uuidv4()}.${fileExtension}`;

      this.logger.logCloudflare(`Iniciando subida de archivo: ${fileName}`);

      const command = new PutObjectCommand({
        Bucket: this.config.bucketName,
        Key: fileName,
        Body: file.buffer,
        ContentType: file.mimetype,
        Metadata: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, HEAD',
          'Access-Control-Allow-Headers': '*',
        },
      });

      await this.s3Client.send(command);

      const publicUrl = `${this.config.publicUrl}/${fileName}`;
      this.logger.logCloudflare(`Archivo subido exitosamente: ${publicUrl}`);

      return { url: publicUrl };
    } catch (error) {
      this.logger.logException(
        'CloudflareService',
        'uploadToCloudflare',
        error,
      );
      throw error;
    }
  }

  /**
   * Upload buffer to Cloudflare R2 (for WhatsApp media, etc.)
   */
  async uploadMediaBuffer(
    buffer: Buffer,
    fileName: string,
    mimeType: string,
    mediaType: 'audio' | 'image' | 'video' | 'document' = 'document',
  ): Promise<{ url: string }> {
    try {
      // Determinar extensión basada en mimeType
      let extension = '';
      if (mimeType.includes('audio/ogg')) extension = 'ogg';
      else if (mimeType.includes('audio/mpeg')) extension = 'mp3';
      else if (mimeType.includes('audio/wav')) extension = 'wav';
      else if (mimeType.includes('image/jpeg')) extension = 'jpg';
      else if (mimeType.includes('image/png')) extension = 'png';
      else if (mimeType.includes('image/webp')) extension = 'webp';
      else if (mimeType.includes('video/mp4')) extension = 'mp4';
      else if (mimeType.includes('video/webm')) extension = 'webm';
      else if (mimeType.includes('application/pdf')) extension = 'pdf';
      else if (mimeType.includes('application/vnd.openxmlformats'))
        extension = 'docx';
      else extension = fileName.split('.').pop() || 'bin';

      const cloudflareFileName = `whatsapp/${mediaType}/${uuidv4()}.${extension}`;

      this.logger.logCloudflare(
        `Subiendo ${mediaType} de WhatsApp: ${cloudflareFileName} (${buffer.length} bytes)`,
      );

      const command = new PutObjectCommand({
        Bucket: this.config.bucketName,
        Key: cloudflareFileName,
        Body: buffer,
        ContentType: mimeType,
        Metadata: {
          source: 'whatsapp',
          'media-type': mediaType,
          'original-filename': fileName,
          size: buffer.length.toString(),
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, HEAD',
          'Access-Control-Allow-Headers': '*',
        },
      });

      await this.s3Client.send(command);

      const publicUrl = `${this.config.publicUrl}/${cloudflareFileName}`;
      this.logger.logCloudflare(
        `${mediaType} de WhatsApp subido exitosamente: ${publicUrl}`,
      );

      return { url: publicUrl };
    } catch (error) {
      this.logger.logException('CloudflareService', 'uploadMediaBuffer', error);
      throw error;
    }
  }

  /**
   * Delete file from Cloudflare R2
   */
  async deleteFromCloudflare(fileUrl: string): Promise<void> {
    try {
      this.logger.logCloudflare(`Iniciando eliminación de archivo: ${fileUrl}`);

      // Check if URL is valid before attempting to parse
      if (!fileUrl || typeof fileUrl !== 'string') {
        this.logger.logCloudflare(`URL inválida o vacía: ${fileUrl}`);
        return; // Return silently instead of throwing error
      }

      const urlParts = fileUrl.split('.r2.dev/');
      if (urlParts.length !== 2) {
        this.logger.logCloudflare(
          `URL inválida de Cloudflare R2, formato incorrecto: ${fileUrl}`,
        );
        return; // Return silently instead of throwing error
      }

      const key = urlParts[1];

      const command = new DeleteObjectCommand({
        Bucket: this.config.bucketName,
        Key: key,
      });

      try {
        await this.s3Client.send(command);
        this.logger.logCloudflare(`Archivo eliminado exitosamente: ${fileUrl}`);
      } catch (error) {
        // Handle specific S3 errors silently
        if (
          error.name === 'NoSuchKey' ||
          error.name === 'NotFound' ||
          error.name === 'NoSuchBucket'
        ) {
          this.logger.logCloudflare(
            `Archivo no encontrado en Cloudflare: ${fileUrl}, Error: ${error.name}`,
          );
          return; // Return silently for these specific errors
        }
        // Log other errors but don't throw
        this.logger.logCloudflare(
          `Error al eliminar archivo: ${fileUrl}, Error: ${error.message}`,
        );
        return;
      }
    } catch (error) {
      // Log the error but don't rethrow it
      this.logger.logException(
        'CloudflareService',
        'deleteFromCloudflare',
        error,
      );
      // Return silently to prevent process interruption
      return;
    }
  }
}
