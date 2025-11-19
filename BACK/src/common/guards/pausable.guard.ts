import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ServiceUnavailableException,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';
import { PAUSABLE_KEY } from '../decorators/pausable.decorator';

@Injectable()
export class PausableGuard implements CanActivate {
  private readonly logger = new Logger(PausableGuard.name);
  private readonly PAUSE_KEY = 'system:paused';

  constructor(
    private reflector: Reflector,
    @InjectRedis() private readonly redis: Redis,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Check if method is marked as pausable
    const isPausable = this.reflector.getAllAndOverride<boolean>(PAUSABLE_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // If not pausable, allow execution
    if (!isPausable) {
      return true;
    }

    // Check if system is paused
    const isPaused = await this.redis.get(this.PAUSE_KEY);

    if (isPaused === 'true') {
      this.logger.warn(`Blocked pausable operation: ${context.getHandler().name}`);
      throw new ServiceUnavailableException(
        'System is temporarily paused for maintenance. Please try again later.',
      );
    }

    return true;
  }
}
