import { Injectable, Inject, Logger } from '@nestjs/common';
import { PutObjectCommand, DeleteObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';

interface CloudflareConfig {
  bucketName: string;
  publicUrl: string;
}

@Injectable()
export class CloudflareService {
  private readonly logger = new Logger(CloudflareService.name);

  constructor(
    @Inject('CLOUDFLARE_CLIENT') private readonly s3Client: S3Client,
    @Inject('CLOUDFLARE_CONFIG') private readonly config: CloudflareConfig,
  ) {}

  /**
   * Upload a single file to Cloudflare R2
   * @param file - Multer file object
   * @param folder - Optional folder prefix (e.g., 'properties', 'evaluators')
   * @returns Public URL of the uploaded file
   */
  async uploadToCloudflare(
    file: Express.Multer.File,
    folder: string = 'general',
  ): Promise<{ url: string }> {
    try {
      this.logger.log('=== CLOUDFLARE UPLOAD START ===');
      this.logger.log(`📁 Folder: ${folder}`);
      this.logger.log(`📄 File: ${file.originalname}`);
      this.logger.log(`📊 Size: ${(file.size / 1024).toFixed(2)} KB`);
      this.logger.log(`🔖 MIME: ${file.mimetype}`);
      this.logger.log(`🪣 Bucket: ${this.config.bucketName}`);
      this.logger.log(`🔗 Public URL base: ${this.config.publicUrl}`);

      const fileExtension = file.originalname.split('.').pop() || 'bin';
      const fileName = `${folder}/${uuidv4()}.${fileExtension}`;

      this.logger.log(`🎯 Generated filename: ${fileName}`);

      const command = new PutObjectCommand({
        Bucket: this.config.bucketName,
        Key: fileName,
        Body: file.buffer,
        ContentType: file.mimetype,
        Metadata: {
          'original-filename': file.originalname,
          'upload-date': new Date().toISOString(),
          size: file.size.toString(),
        },
      });

      this.logger.log('🚀 Sending file to Cloudflare R2...');
      await this.s3Client.send(command);

      const publicUrl = `${this.config.publicUrl}/${fileName}`;
      this.logger.log(`✅ File uploaded successfully!`);
      this.logger.log(`🔗 Public URL: ${publicUrl}`);
      this.logger.log('=== CLOUDFLARE UPLOAD END ===');

      return { url: publicUrl };
    } catch (error) {
      this.logger.error('❌ === CLOUDFLARE UPLOAD FAILED ===');
      this.logger.error(`Error message: ${error.message}`);
      this.logger.error(`Error code: ${error.code || 'N/A'}`);
      this.logger.error(`Error name: ${error.name || 'N/A'}`);
      this.logger.error('Full error stack:', error.stack);
      this.logger.error('=== CLOUDFLARE UPLOAD ERROR END ===');
      throw error;
    }
  }

  /**
   * Upload multiple files to Cloudflare R2
   * @param files - Array of Multer file objects
   * @param folder - Optional folder prefix
   * @returns Array of public URLs
   */
  async uploadMultipleToCloudflare(
    files: Express.Multer.File[],
    folder: string = 'general',
  ): Promise<string[]> {
    try {
      this.logger.log('=== MULTIPLE UPLOAD START ===');
      this.logger.log(`📦 Total files: ${files.length}`);
      this.logger.log(`📁 Folder: ${folder}`);

      const uploadPromises = files.map((file, index) => {
        this.logger.log(`📄 File ${index + 1}/${files.length}: ${file.originalname}`);
        return this.uploadToCloudflare(file, folder);
      });

      const results = await Promise.all(uploadPromises);
      const urls = results.map((result) => result.url);

      this.logger.log('✅ All files uploaded successfully!');
      this.logger.log(`🔗 URLs: ${JSON.stringify(urls, null, 2)}`);
      this.logger.log('=== MULTIPLE UPLOAD END ===');

      return urls;
    } catch (error) {
      this.logger.error('❌ === MULTIPLE UPLOAD FAILED ===');
      this.logger.error(`Error: ${error.message}`, error.stack);
      this.logger.error('=== MULTIPLE UPLOAD ERROR END ===');
      throw error;
    }
  }

  /**
   * Upload from Buffer (useful for image processing, base64, etc.)
   * @param buffer - File buffer
   * @param fileName - Original filename
   * @param mimeType - MIME type
   * @param folder - Folder prefix
   * @returns Public URL
   */
  async uploadBuffer(
    buffer: Buffer,
    fileName: string,
    mimeType: string,
    folder: string = 'general',
  ): Promise<{ url: string }> {
    try {
      const fileExtension = this.getExtensionFromMimeType(mimeType, fileName);
      const cloudflareFileName = `${folder}/${uuidv4()}.${fileExtension}`;

      this.logger.log(`Uploading buffer to Cloudflare R2: ${cloudflareFileName}`);

      const command = new PutObjectCommand({
        Bucket: this.config.bucketName,
        Key: cloudflareFileName,
        Body: buffer,
        ContentType: mimeType,
        Metadata: {
          'original-filename': fileName,
          'upload-date': new Date().toISOString(),
          size: buffer.length.toString(),
        },
      });

      await this.s3Client.send(command);
      const publicUrl = `${this.config.publicUrl}/${cloudflareFileName}`;

      this.logger.log(`Buffer uploaded successfully: ${publicUrl}`);
      return { url: publicUrl };
    } catch (error) {
      this.logger.error(`Failed to upload buffer to Cloudflare: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Delete a file from Cloudflare R2
   * @param fileUrl - Full public URL of the file
   */
  async deleteFromCloudflare(fileUrl: string): Promise<void> {
    try {
      if (!fileUrl || typeof fileUrl !== 'string') {
        this.logger.warn('Invalid file URL provided for deletion');
        return;
      }

      // Extract the key from the public URL
      const urlParts = fileUrl.split('.r2.dev/');
      if (urlParts.length !== 2) {
        this.logger.warn(`Invalid Cloudflare URL format: ${fileUrl}`);
        return;
      }

      const key = urlParts[1];
      this.logger.log(`Deleting file from Cloudflare R2: ${key}`);

      const command = new DeleteObjectCommand({
        Bucket: this.config.bucketName,
        Key: key,
      });

      await this.s3Client.send(command);
      this.logger.log(`File deleted successfully: ${key}`);
    } catch (error) {
      // Log but don't throw - prevent cascade failures
      this.logger.error(`Failed to delete file from Cloudflare: ${error.message}`, error.stack);
    }
  }

  /**
   * Delete multiple files from Cloudflare R2
   * @param fileUrls - Array of public URLs
   */
  async deleteMultipleFromCloudflare(fileUrls: string[]): Promise<void> {
    try {
      this.logger.log(`Deleting ${fileUrls.length} files from Cloudflare R2`);

      const deletePromises = fileUrls.map((url) => this.deleteFromCloudflare(url));
      await Promise.all(deletePromises);

      this.logger.log(`Successfully deleted ${fileUrls.length} files`);
    } catch (error) {
      this.logger.error(`Failed to delete multiple files: ${error.message}`, error.stack);
    }
  }

  /**
   * Helper: Get file extension from MIME type
   */
  private getExtensionFromMimeType(mimeType: string, originalFileName: string): string {
    // Try to get from original filename first
    const extFromName = originalFileName.split('.').pop();
    if (extFromName && extFromName.length <= 5) {
      return extFromName;
    }

    // Fallback to MIME type mapping
    const mimeMap: Record<string, string> = {
      'image/jpeg': 'jpg',
      'image/jpg': 'jpg',
      'image/png': 'png',
      'image/gif': 'gif',
      'image/webp': 'webp',
      'image/svg+xml': 'svg',
      'application/pdf': 'pdf',
      'application/msword': 'doc',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
      'video/mp4': 'mp4',
      'video/mpeg': 'mpeg',
      'audio/mpeg': 'mp3',
      'audio/ogg': 'ogg',
    };

    return mimeMap[mimeType] || 'bin';
  }
}
