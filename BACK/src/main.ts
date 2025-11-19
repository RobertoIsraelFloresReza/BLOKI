import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { TransformInterceptor } from './interceptors/transform.interceptor';
import { HttpExceptionFilter } from './common/exceptions/http.exception.filter';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';
import * as fs from 'fs';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

async function main() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const reflector = app.get(Reflector);
  const configService = app.get(ConfigService);

  // Create uploads directory if it doesn't exist
  const uploadsDir = join(__dirname, '..', 'uploads', 'properties');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  // Serve static files from uploads directory
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });

  // Security: Helmet.js with CSP
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          scriptSrc: ["'self'"],
          imgSrc: ["'self'", 'data:', 'https:'],
        },
      },
      crossOriginEmbedderPolicy: true,
      crossOriginOpenerPolicy: true,
      crossOriginResourcePolicy: { policy: 'cross-origin' },
      dnsPrefetchControl: true,
      frameguard: { action: 'deny' },
      hidePoweredBy: true,
      hsts: true,
      ieNoOpen: true,
      noSniff: true,
      referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
      xssFilter: true,
    }),
  );

  // Rate limiting: 100 requests per 15 minutes
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // limit each IP to 100 requests per windowMs
      message: 'Too many requests from this IP, please try again after 15 minutes',
      standardHeaders: true,
      legacyHeaders: false,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Stellar Property Tokenization API')
    .setDescription(
      'Backend API for tokenizing real estate properties on Stellar blockchain using Soroban smart contracts',
    )
    .setVersion('1.0.0')
    .addTag('Stellar Authentication', 'Stellar wallet-based authentication')
    .addTag('Properties', 'Property management and tokenization')
    .addTag('Marketplace', 'Property token trading')
    .addTag('Users', 'User management and KYC')
    .addTag('Anchors', 'Fiat conversion via Stellar anchors')
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'Session Token',
      description: 'Enter your Stellar session token',
    })
    .addServer('http://localhost:3000', 'Development Server')
    .addServer('https://api.stellar.example.com', 'Production Server')
    .build();

  const corsOrigins = configService.get<string>('CORS_ORIGINS')?.split(',') || [
    'http://localhost:5173',
    'http://localhost:3000',
  ];

  app.enableCors({
    origin: corsOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new ClassSerializerInterceptor(reflector),new TransformInterceptor());
  const document = SwaggerModule.createDocument(app, config, {
    operationIdFactory: (controllerKey: string, methodKey: string) => methodKey,
    deepScanRoutes: true,
  });
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    },
  });

  const port = process.env.APP_PORT || process.env.PORT || 3000;
  await app.listen(port);

  console.log(`\n🚀 Stellar Property Tokenization API running on: http://localhost:${port}`);
  console.log(`📚 Swagger documentation: http://localhost:${port}/api/docs`);
  console.log(`🔐 Stellar Auth endpoints: http://localhost:${port}/auth/stellar/*`);
}
main();
