import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

const typeOrmConfig = TypeOrmModule.forRootAsync({
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => {
    const databaseUrl = configService.get<string>('DATABASE_URL');

    if (!databaseUrl) {
      throw new Error(
        'DATABASE_URL is required. Please set it in your environment variables.',
      );
    }

    // PostgreSQL configuration for Stellar tokenization
    return {
      type: 'postgres',
      url: databaseUrl,
      entities: [__dirname + '/../**/*.entity{.ts,.js}'],
      synchronize: configService.get('NODE_ENV') === 'development',
      autoLoadEntities: true,
      logging: configService.get('NODE_ENV') === 'development',
      migrations: [__dirname + '/../migrations/*{.ts,.js}'],
      migrationsRun: false,
    };
  },
});

export default typeOrmConfig;
