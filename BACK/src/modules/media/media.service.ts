import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { MediaEntity, MediaFileType, MediaEntityType } from './entity/media.entity';
import { CreateMediaDto } from './dto/create-media.dto';
import { UpdateMediaDto } from './dto/update-media.dto';

@Injectable()
export class MediaService {
  private readonly logger = new Logger(MediaService.name);

  constructor(
    @InjectRepository(MediaEntity)
    private readonly mediaRepository: Repository<MediaEntity>,
  ) {}

  /**
   * Create media records from URLs
   * @param urls - Array of media URLs (already uploaded to Cloudflare)
   * @returns Array of saved media entities
   */
  async createFromUrls(urls: string[]): Promise<MediaEntity[]> {
    try {
      this.logger.log(`Creating ${urls.length} media records from URLs`);

      // Map to database entities
      const mediaToSave = urls.map((url, index) => {
        const fileType = this.detectFileTypeFromUrl(url);

        return {
          url,
          fileType,
          displayOrder: index,
        } as Partial<MediaEntity>;
      });

      // Save to database
      const savedMedia = await this.mediaRepository.save(mediaToSave);
      this.logger.log(`Successfully saved ${savedMedia.length} media records`);

      return savedMedia;
    } catch (error) {
      this.logger.error(`Failed to create media records: ${error.message}`, error.stack);
      throw new BadRequestException(`Error creating media records: ${error.message}`);
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
   * Delete media records from DB only
   * Note: Files should be deleted from Cloudflare separately if needed
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

      // Delete from database
      const deleteResult = await this.mediaRepository.delete({ id: In(ids) });

      this.logger.log(`Deleted ${deleteResult.affected} media records`);

      return {
        message: 'Media records deleted successfully',
        deletedCount: deleteResult.affected || 0,
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      this.logger.error(`Failed to delete media records: ${error.message}`, error.stack);
      throw new BadRequestException(`Error deleting media records: ${error.message}`);
    }
  }

  /**
   * Helper: Detect file type from URL extension
   */
  private detectFileTypeFromUrl(url: string): MediaFileType {
    const extension = url.split('.').pop()?.toLowerCase();

    if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(extension || '')) {
      return MediaFileType.IMAGE;
    } else if (extension === 'pdf') {
      return MediaFileType.PDF;
    } else if (['mp4', 'webm', 'ogg', 'mov', 'avi'].includes(extension || '')) {
      return MediaFileType.VIDEO;
    }
    return MediaFileType.OTHER;
  }
}
