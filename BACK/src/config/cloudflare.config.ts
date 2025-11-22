import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { S3Client } from '@aws-sdk/client-s3';

@Module({})
export class CloudflareConfigModule {
  static forRootAsync(): DynamicModule {
    const cloudflareClientProvider = {
      provide: 'CLOUDFLARE_CLIENT',
      useFactory: (configService: ConfigService) => {
        console.log('🔧 === CLOUDFLARE R2 CONFIGURATION ===');

        const endpoint = configService.get<string>('CLOUDFLARE_R2_ENDPOINT');
        const accessKeyId = configService.get<string>('CLOUDFLARE_R2_ACCESS_KEY');
        const secretAccessKey = configService.get<string>('CLOUDFLARE_R2_SECRET_KEY');

        console.log(`🔗 Endpoint: ${endpoint ? '✅ Set' : '❌ Missing'}`);
        console.log(`🔑 Access Key: ${accessKeyId ? `✅ Set (${accessKeyId.substring(0, 8)}...)` : '❌ Missing'}`);
        console.log(`🔐 Secret Key: ${secretAccessKey ? `✅ Set (${secretAccessKey.substring(0, 8)}...)` : '❌ Missing'}`);

        if (!endpoint || !accessKeyId || !secretAccessKey) {
          console.error('❌ CLOUDFLARE R2 CONFIGURATION ERROR: Missing credentials');
          throw new Error('Faltan credenciales de Cloudflare R2');
        }

        console.log('✅ Cloudflare R2 Client initialized successfully');
        console.log('=== CLOUDFLARE R2 CONFIGURATION END ===');

        return new S3Client({
          endpoint,
          region: 'auto',
          credentials: {
            accessKeyId,
            secretAccessKey,
          },
        });
      },
      inject: [ConfigService],
    };

    const cloudflareConfigProvider = {
      provide: 'CLOUDFLARE_CONFIG',
      useFactory: (configService: ConfigService) => {
        console.log('🪣 === CLOUDFLARE R2 BUCKET CONFIG ===');

        const bucketName = configService.get<string>('CLOUDFLARE_R2_BUCKET_NAME');
        const publicUrl = configService.get<string>('CLOUDFLARE_R2_PUBLIC_URL');

        console.log(`🪣 Bucket Name: ${bucketName || '❌ Missing'}`);
        console.log(`🔗 Public URL: ${publicUrl || '❌ Missing'}`);

        if (!bucketName || !publicUrl) {
          console.error('❌ CLOUDFLARE R2 BUCKET CONFIG ERROR: Missing values');
          throw new Error('Faltan valores de configuración de Cloudflare R2');
        }

        console.log('✅ Cloudflare R2 Bucket config loaded successfully');
        console.log('=== CLOUDFLARE R2 BUCKET CONFIG END ===');

        return {
          bucketName,
          publicUrl,
        };
      },
      inject: [ConfigService],
    };

    return {
      module: CloudflareConfigModule,
      imports: [ConfigModule],
      providers: [cloudflareClientProvider, cloudflareConfigProvider],
      exports: [cloudflareClientProvider, cloudflareConfigProvider],
    };
  }
} 