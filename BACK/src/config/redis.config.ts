import { RedisModuleOptions } from '@nestjs-modules/ioredis';
import { ConfigService } from '@nestjs/config';

export const getRedisConfig = (
  configService: ConfigService,
): RedisModuleOptions => {
  const redisUrl = configService.get<string>('REDIS_URL');

  if (redisUrl) {
    return {
      type: 'single',
      url: redisUrl,
    };
  }

  // Fallback to individual config
  return {
    type: 'single',
    options: {
      host: configService.get<string>('REDIS_HOST', 'localhost'),
      port: configService.get<number>('REDIS_PORT', 6379),
      password: configService.get<string>('REDIS_PASSWORD'),
      db: configService.get<number>('REDIS_DB', 0),
    },
  };
};
