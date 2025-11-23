import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import typeOrmConfig from './config/type.orm.config';
import { AuthModule } from './modules/auth/auth.module';
import { CustomLoggerService } from './common/logger/logger.service';
import { APP_INTERCEPTOR, APP_GUARD } from '@nestjs/core';
import { LoggingInterceptor } from './interceptors/logging.interceptor';
import { UserModule } from './modules/user/user.module';
import { ScheduleModule } from '@nestjs/schedule';
import { StellarModule } from './modules/stellar/stellar.module';
import { PropertiesModule } from './modules/properties/properties.module';
import { MarketplaceModule } from './modules/marketplace/marketplace.module';
import { OwnershipModule } from './modules/ownership/ownership.module';
import { WalletModule } from './modules/wallet/wallet.module';
import { HealthModule } from './modules/health/health.module';
import { KycModule } from './modules/kyc/kyc.module';
import { AnchorsModule } from './modules/anchors/anchors.module';
import { AdminModule } from './modules/admin/admin.module';
import { EscrowModule } from './modules/escrow/escrow.module';
import { RegistryModule } from './modules/registry/registry.module';
import { EvaluatorsModule } from './modules/evaluators/evaluators.module';
import { CloudflareModule } from './modules/cloudflare/cloudflare.module';
import { MediaModule } from './modules/media/media.module';
import { PausableGuard } from './common/guards/pausable.guard';
import { AuthGuard } from './modules/auth/guard/auth.guard';
import { OracleModule } from './modules/oracle/oracle.module';
import { DeFindexModule } from './modules/defindex/defindex.module';
import { SoroswapModule } from './modules/soroswap/soroswap.module';
import { ZKModule } from './modules/zk/zk.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),
    typeOrmConfig,
    HealthModule,
    AuthModule,
    UserModule,
    StellarModule,
    PropertiesModule,
    MarketplaceModule,
    OwnershipModule,
    WalletModule,
    KycModule,
    AnchorsModule,
    AdminModule,
    EscrowModule,
    RegistryModule,
    EvaluatorsModule,
    CloudflareModule,
    MediaModule,
    OracleModule,
    DeFindexModule,
    SoroswapModule,
    ZKModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    CustomLoggerService,
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: PausableGuard,
    },
  ],
})
export class AppModule {
  constructor() {}
}
