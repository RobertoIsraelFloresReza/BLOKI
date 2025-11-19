import { Injectable, Logger } from '@nestjs/common';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';

@Injectable()
export class AdminService {
  private readonly logger = new Logger(AdminService.name);
  private readonly PAUSE_KEY = 'system:paused';
  private readonly PAUSE_TIMESTAMP_KEY = 'system:paused:timestamp';

  constructor(@InjectRedis() private readonly redis: Redis) {}

  /**
   * Pause critical system operations
   */
  async pauseSystem(): Promise<void> {
    await this.redis.set(this.PAUSE_KEY, 'true');
    await this.redis.set(this.PAUSE_TIMESTAMP_KEY, new Date().toISOString());
    this.logger.warn('System operations PAUSED');
  }

  /**
   * Resume critical system operations
   */
  async unpauseSystem(): Promise<void> {
    await this.redis.del(this.PAUSE_KEY);
    await this.redis.del(this.PAUSE_TIMESTAMP_KEY);
    this.logger.warn('System operations RESUMED');
  }

  /**
   * Check if system is currently paused
   */
  async isSystemPaused(): Promise<boolean> {
    const paused = await this.redis.get(this.PAUSE_KEY);
    return paused === 'true';
  }

  /**
   * Get pause timestamp
   */
  async getPauseTimestamp(): Promise<string | null> {
    return await this.redis.get(this.PAUSE_TIMESTAMP_KEY);
  }
}
