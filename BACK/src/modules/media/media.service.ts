import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { MediaEntity, MediaFileType, MediaEntityType } from './entity/media.entity';
import { CreateMediaDto } from './dto/create-media.dto';
import { UpdateMediaDto } from './dto/update-media.dto';
import { CloudflareService } from '../cloudflare/cloudflare.service';

@Injectable()
export class MediaService {
  private readonly logger = new Logger(MediaService.name);

  constructor(
    @InjectRepository(MediaEntity)
    private readonly mediaRepository: Repository<MediaEntity>,
    private readonly cloudflareService: CloudflareService,
  ) {}

  /**
   * Upload files and save to database
   * @param files - Array of Multer files
   * @param folder - Cloudflare folder prefix
   * @returns Array of saved media entities
   */
  async uploadFiles(files: Express.Multer.File[], folder: string = 'general'): Promise<MediaEntity[]> {
    try {
      this.logger.log(`Starting upload of ${files.length} media files to folder: ${folder}`);

      // Upload all files to Cloudflare in parallel
      const uploadedFiles = await Promise.all(
        files.map((file) => this.cloudflareService.uploadToCloudflare(file, folder)),
      );

      // Map to database entities with file type detection
      const mediaToSave = uploadedFiles.map((result, index) => {
        const mimeType = files[index].mimetype;
        const fileType = this.detectFileType(mimeType);

        return {
          url: result.url,
          fileType,
          displayOrder: index,
        } as Partial<MediaEntity>;
      });

      // Save to database
      const savedMedia = await this.mediaRepository.save(mediaToSave);
      this.logger.log(`Successfully uploaded and saved ${savedMedia.length} media files`);

      return savedMedia;
    } catch (error) {
      this.logger.error(`Failed to upload files: ${error.message}`, error.stack);
      throw new BadRequestException(`Error uploading media files: ${error.message}`);
    }
  }

  /**
   * Create media record from already uploaded file
   */
  async create(createMediaDto: CreateMediaDto): Promise<MediaEntity> {
    const media = this.mediaRepository.create(createMediaDto);
    return await this.mediaRepository.save(media);
  }

  /**
   * Find all media
   */
  async findAll(): Promise<MediaEntity[]> {
    return await this.mediaRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * Find media by entity
   */
  async findByEntity(entityId: number, entityType: MediaEntityType): Promise<MediaEntity[]> {
    return await this.mediaRepository.find({
      where: { entityId, entityType },
      order: { displayOrder: 'ASC', createdAt: 'ASC' },
    });
  }

  /**
   * Find one media by ID
   */
  async findOne(id: number): Promise<MediaEntity> {
    const media = await this.mediaRepository.findOne({ where: { id } });

    if (!media) {
      throw new NotFoundException(`Media with ID ${id} not found`);
    }

    return media;
  }

  /**
   * Update media records and associate with entity
   */
  async update(
    updateMediaDtos: UpdateMediaDto[],
    entityId: number,
    entityType: MediaEntityType,
  ): Promise<MediaEntity[]> {
    const result: MediaEntity[] = [];

    for (const dto of updateMediaDtos) {
      const media = await this.mediaRepository.findOne({
        where: { id: dto.id },
      });

      if (!media) {
        this.logger.warn(`Media with ID ${dto.id} not found, skipping...`);
        continue;
      }

      // Update fields
      Object.assign(media, dto);
      media.entityId = entityId;
      media.entityType = entityType;

      await this.mediaRepository.update({ id: dto.id }, media);

      const updated = await this.mediaRepository.findOne({
        where: { id: dto.id },
      });

      if (updated) {
        result.push(updated);
      }
    }

    this.logger.log(`Updated ${result.length} media records for entity ${entityId}`);
    return result;
  }

  /**
   * Delete files (Cloudflare + DB)
   */
  async deleteFiles(ids: number[]): Promise<{ message: string; deletedCount: number }> {
    try {
      if (!ids?.length) {
        throw new BadRequestException('No IDs provided for deletion');
      }

      // Find media records
      const mediaRecords = await this.mediaRepository.find({
        where: { id: In(ids) },
      });

      if (!mediaRecords.length) {
        throw new BadRequestException('No media files found to delete');
      }

      // Delete from Cloudflare in parallel
      await Promise.all(
        mediaRecords.map((media) => this.cloudflareService.deleteFromCloudflare(media.url)),
      );

      // Delete from database
      const deleteResult = await this.mediaRepository.delete({ id: In(ids) });

      this.logger.log(`Deleted ${deleteResult.affected} media records`);

      return {
        message: 'Media files deleted successfully',
        deletedCount: deleteResult.affected || 0,
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      this.logger.error(`Failed to delete files: ${error.message}`, error.stack);
      throw new BadRequestException(`Error deleting media files: ${error.message}`);
    }
  }

  /**
   * Helper: Detect file type from MIME type
   */
  private detectFileType(mimeType: string): MediaFileType {
    if (mimeType.startsWith('image/')) {
      return MediaFileType.IMAGE;
    } else if (mimeType === 'application/pdf') {
      return MediaFileType.PDF;
    } else if (mimeType.startsWith('video/')) {
      return MediaFileType.VIDEO;
    }
    return MediaFileType.OTHER;
  }
}
