/**
 * Script para crear un listing para una propiedad existente
 * Uso: npm run ts-node scripts/create-listing-for-property.ts
 */

import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { MarketplaceService } from '../src/modules/marketplace/marketplace.service';
import { PropertiesService } from '../src/modules/properties/properties.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const marketplaceService = app.get(MarketplaceService);
  const propertiesService = app.get(PropertiesService);

  try {
    // ID de la propiedad "New York Penthouse"
    const propertyId = 2;

    // Obtener la propiedad
    const property = await propertiesService.findOne(propertyId);
    console.log('✅ Property found:', property.name);
    console.log('   Total Supply:', property.totalSupply);
    console.log('   Valuation:', property.valuation);

    // Calcular precio por token
    const totalSupply = parseInt(property.totalSupply) / 10000000; // Convert from stroops
    const valuation = parseInt(property.valuation) / 10000000; // Convert from stroops
    const pricePerToken = valuation / totalSupply;

    console.log(`\n📊 Calculated price per token: $${pricePerToken.toFixed(2)} USDC`);
    console.log(`   Listing all ${totalSupply.toLocaleString()} tokens\n`);

    // Clave secreta del admin (desde .env)
    const adminSecretKey = process.env.ADMIN_SECRET_KEY;

    if (!adminSecretKey) {
      throw new Error('ADMIN_SECRET_KEY not found in .env file');
    }

    // Crear el listing
    console.log('🚀 Creating marketplace listing...');
    const listing = await marketplaceService.createListing({
      propertyId: property.id,
      amount: totalSupply,
      pricePerToken: pricePerToken,
      expirationDays: 365,
      sellerSecretKey: adminSecretKey,
    });

    console.log('✅ Listing created successfully!');
    console.log('   Listing ID (database):', listing.id);
    console.log('   Listing ID (blockchain):', listing.listingId);
    console.log('   Amount:', parseInt(listing.amount) / 10000000, 'tokens');
    console.log('   Price per token:', parseInt(listing.pricePerToken) / 10000000, 'USDC');
    console.log('   Status:', listing.status);

  } catch (error) {
    console.error('❌ Error creating listing:', error.message);
    console.error(error);
  } finally {
    await app.close();
  }
}

bootstrap();
