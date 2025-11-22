-- ========================================
-- DATABASE SEED - BLOCKI STELLAR PLATFORM
-- ========================================
-- Orden de dependencias respetado
-- Generated: 2025-01-21
-- Purpose: Datos de prueba para testing e integración
-- ========================================

-- ========================================
-- 1. USERS (Sin dependencias)
-- ========================================

-- ========================================
-- 1. USERS (Sin dependencias)
-- ========================================

-- Usuario 1: Admin/Vendedor (con wallet Stellar)
INSERT INTO "user" (
  "stellarPublicKey",
  "email",
  "name",
  "last_name",
  "password",
  "phone_number",
  "role",
  "status",
  "kycStatus",
  "country",
  "city",
  "address",
  "created_at",  -- COLUMNA CORREGIDA
  "updated_at"   -- COLUMNA CORREGIDA
) VALUES (
  'GCVOWIN3U4HWMZUPYZ446WHPTHMWQ65DDPICDP32DEHHIFJUJ6K7UNSX',
  'admin@blocki.com',
  'Admin',
  'Blocki',
  '$2b$10$vXqEKZxDQT8YqQYqQnLp9eYt7rLPj1MxXZxqXZxqXZxqXZxqXZxqX', -- password: admin123
  '5512345678',
  'SUPER_ADMIN',
  'ACTIVE',
  'approved',
  'Mexico',
  'Ciudad de México',
  'Av. Reforma 123, Col. Centro',
  NOW(),
  NOW()
);

-- Usuario 2: Vendedor (seller)
INSERT INTO "user" (
  "stellarPublicKey",
  "email",
  "name",
  "last_name",
  "password",
  "phone_number",
  "role",
  "status",
  "kycStatus",
  "country",
  "city",
  "address",
  "created_at",  -- COLUMNA CORREGIDA
  "updated_at"   -- COLUMNA CORREGIDA
) VALUES (
  'GBTESTVENDEDOR1ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890',
  'vendedor@blocki.com',
  'Juan',
  'Pérez',
  '$2b$10$vXqEKZxDQT8YqQYqQnLp9eYt7rLPj1MxXZxqXZxqXZxqXZxqXZxqX', -- password: vendedor123
  '5587654321',
  'EMPLOYEE',
  'ACTIVE',
  'approved',
  'Mexico',
  'Guadalajara',
  'Av. Chapultepec 456, Col. Americana',
  NOW(),
  NOW()
);

-- Usuario 3: Comprador/Inversor
INSERT INTO "user" (
  "stellarPublicKey",
  "email",
  "name",
  "last_name",
  "password",
  "phone_number",
  "role",
  "status",
  "kycStatus",
  "country",
  "city",
  "address",
  "created_at",  -- COLUMNA CORREGIDA
  "updated_at"   -- COLUMNA CORREGIDA
) VALUES (
  'GBTESTCOMPRADOR1ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789',
  'comprador@blocki.com',
  'María',
  'González',
  '$2b$10$vXqEKZxDQT8YqQYqQnLp9eYt7rLPj1MxXZxqXZxqXZxqXZxqXZxqX', -- password: comprador123
  '5534567890',
  'EMPLOYEE',
  'ACTIVE',
  'approved',
  'Mexico',
  'Monterrey',
  'Av. Constitución 789, Col. Centro',
  NOW(),
  NOW()
);

-- Usuario 4: Usuario de prueba (test user)
INSERT INTO "user" (
  "stellarPublicKey",
  "email",
  "name",
  "last_name",
  "password",
  "phone_number",
  "role",
  "status",
  "kycStatus",
  "country",
  "city",
  "address",
  "created_at",  -- COLUMNA CORREGIDA
  "updated_at"   -- COLUMNA CORREGIDA
) VALUES (
  'GBTESTHACKA1ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890AB',
  'test-hacka@blocki.com',
  'Test',
  'Hackathon',
  '$2b$10$vXqEKZxDQT8YqQYqQnLp9eYt7rLPj1MxXZxqXZxqXZxqXZxqXZxqX', -- password: test123
  '5523456789',
  'EMPLOYEE',
  'ACTIVE',J
  'pending',
  'Mexico',
  'Puebla',
  'Calle Juárez 321, Centro Histórico',
  NOW(),
  NOW()
);

-- ========================================
-- 2. PROPERTIES (Depende de: user)
-- ========================================

-- Propiedad 1: Casa en Polanco (ACTIVA, con tokens disponibles)
INSERT INTO "properties" (
  "contractId",
  "propertyId",
  "name",
  "description",
  "address",
  "totalSupply",
  "valuation",
  "decimals",
  "legalOwner",
  "verified",
  "adminAddress",
  "metadata",
  "registryTxHash",
  "images",
  "createdAt",
  "updatedAt"
) VALUES (
  'CBFAXO5UUXHXCSJW63E4LTZPHWTRCAVJIUGJOHU23EAW2I2IATE2XZKF',
  'PROP-001-CDMX',
  'Casa Moderna en Polanco',
  'Hermosa casa de lujo en una de las mejores zonas de la Ciudad de México. Cuenta con acabados de primera, jardín privado, terraza y estacionamiento para 3 autos. Ideal para familias que buscan exclusividad y confort.',
  'Av. Presidente Masaryk 234, Polanco, CDMX, 11560',
  '10000000000', -- 1000 tokens (7 decimals = 1000.0000000)
  '5000000000', -- $5,000,000 USD (valuation as bigint, sin decimales)
  7,
  'Juan Pérez',
  true,
  'GCVOWIN3U4HWMZUPYZ446WHPTHMWQ65DDPICDP32DEHHIFJUJ6K7UNSX',
  '{"bedrooms":4,"bathrooms":3,"area":350,"category":"houses","amenities":["pool","garden","parking"],"yearBuilt":2020}',
  'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8',
  '/uploads/properties/casa-polanco-1.jpg,/uploads/properties/casa-polanco-2.jpg,/uploads/properties/casa-polanco-3.jpg',
  NOW() - INTERVAL '30 days',
  NOW() - INTERVAL '30 days'
);

-- Propiedad 2: Departamento en Santa Fe (ACTIVA)
INSERT INTO "properties" (
  "contractId",
  "propertyId",
  "name",
  "description",
  "address",
  "totalSupply",
  "valuation",
  "decimals",
  "legalOwner",
  "verified",
  "adminAddress",
  "metadata",
  "registryTxHash",
  "images",
  "createdAt",
  "updatedAt"
) VALUES (
  'CDEFGHIJKLMNOPQRSTUVWXYZ1234567890ABCDEFGHIJKLMNOP',
  'PROP-002-STAFE',
  'Departamento Luxury Santa Fe',
  'Departamento de lujo en torre corporativa con amenidades de primer nivel. Vista panorámica a la ciudad, gimnasio, alberca, business center y seguridad 24/7. Perfecto para ejecutivos.',
  'Av. Santa Fe 495, Torre B, Piso 18, Santa Fe, CDMX, 01219',
  '8000000000', -- 800 tokens
  '3200000000', -- $3,200,000 USD
  7,
  'Juan Pérez',
  true,
  'GCVOWIN3U4HWMZUPYZ446WHPTHMWQ65DDPICDP32DEHHIFJUJ6K7UNSX',
  '{"bedrooms":3,"bathrooms":2,"area":180,"category":"apartments","amenities":["gym","pool","security","parking"],"floor":18,"yearBuilt":2019}',
  'b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9',
  '/uploads/properties/depto-santafe-1.jpg,/uploads/properties/depto-santafe-2.jpg',
  NOW() - INTERVAL '25 days',
  NOW() - INTERVAL '25 days'
);

-- Propiedad 3: Hotel Boutique en Playa del Carmen (ACTIVA)
INSERT INTO "properties" (
  "contractId",
  "propertyId",
  "name",
  "description",
  "address",
  "totalSupply",
  "valuation",
  "decimals",
  "legalOwner",
  "verified",
  "adminAddress",
  "metadata",
  "registryTxHash",
  "images",
  "createdAt",
  "updatedAt"
) VALUES (
  'CGHIJKLMNOPQRSTUVWXYZ1234567890ABCDEFGHIJKLMNOPQR',
  'PROP-003-PDC',
  'Hotel Boutique Riviera Maya',
  'Hotel boutique de 20 habitaciones en la zona hotelera de Playa del Carmen. A solo 3 cuadras de la playa y 5ta Avenida. Excelente retorno de inversión, ocupación promedio del 85% anual.',
  'Calle 38 Norte entre Av. 5 y Av. 10, Playa del Carmen, Q. Roo, 77710',
  '15000000000', -- 1500 tokens
  '12000000000', -- $12,000,000 USD
  7,
  'Juan Pérez',
  true,
  'GCVOWIN3U4HWMZUPYZ446WHPTHMWQ65DDPICDP32DEHHIFJUJ6K7UNSX',
  '{"bedrooms":20,"bathrooms":20,"area":1200,"category":"hotels","amenities":["beach_access","restaurant","bar","wifi","parking"],"rooms":20,"yearBuilt":2018}',
  'c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0',
  '/uploads/properties/hotel-riviera-1.jpg,/uploads/properties/hotel-riviera-2.jpg,/uploads/properties/hotel-riviera-3.jpg,/uploads/properties/hotel-riviera-4.jpg',
  NOW() - INTERVAL '20 days',
  NOW() - INTERVAL '20 days'
);

-- Propiedad 4: Local Comercial en Reforma (NUEVA)
INSERT INTO "properties" (
  "contractId",
  "propertyId",
  "name",
  "description",
  "address",
  "totalSupply",
  "valuation",
  "decimals",
  "legalOwner",
  "verified",
  "adminAddress",
  "metadata",
  "registryTxHash",
  "images",
  "createdAt",
  "updatedAt"
) VALUES (
  'DHIJKLMNOPQRSTUVWXYZ1234567890ABCDEFGHIJKLMNOPQRS',
  'PROP-004-REFORMA',
  'Local Comercial Paseo de la Reforma',
  'Local comercial en planta baja de edificio corporativo AAA en Paseo de la Reforma. Alto tráfico peatonal, ideal para tienda de retail, cafetería o servicios financieros. Renta asegurada.',
  'Paseo de la Reforma 505, Planta Baja, Cuauhtémoc, CDMX, 06500',
  '6000000000', -- 600 tokens
  '2400000000', -- $2,400,000 USD
  7,
  'Admin Blocki',
  true,
  'GCVOWIN3U4HWMZUPYZ446WHPTHMWQ65DDPICDP32DEHHIFJUJ6K7UNSX',
  '{"bedrooms":0,"bathrooms":2,"area":220,"category":"commercial","amenities":["parking","security","elevator","reception"],"yearBuilt":2021}',
  'd4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1',
  '/uploads/properties/comercial-reforma-1.jpg,/uploads/properties/comercial-reforma-2.jpg',
  NOW() - INTERVAL '5 days',
  NOW() - INTERVAL '5 days'
);

-- Propiedad 5: Casa en Cuernavaca (PENDIENTE DE VERIFICACIÓN)
INSERT INTO "properties" (
  "contractId",
  "propertyId",
  "name",
  "description",
  "address",
  "totalSupply",
  "valuation",
  "decimals",
  "legalOwner",
  "verified",
  "adminAddress",
  "metadata",
  "registryTxHash",
  "images",
  "createdAt",
  "updatedAt"
) VALUES (
  'EIJKLMNOPQRSTUVWXYZ1234567890ABCDEFGHIJKLMNOPQRST',
  'PROP-005-CUERNAVACA',
  'Casa con Alberca en Cuernavaca',
  'Casa de descanso con amplio jardín y alberca privada. Clima perfecto todo el año, ideal para fines de semana y vacaciones. A 1 hora de CDMX.',
  'Av. Plan de Ayala 1234, Col. Lomas de Cuernavaca, Mor., 62270',
  '5000000000', -- 500 tokens
  '1800000000', -- $1,800,000 USD
  7,
  'Test Hackathon',
  false, -- NO VERIFICADA AÚN
  'GBTESTHACKA1ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890AB',
  '{"bedrooms":3,"bathrooms":2,"area":280,"category":"houses","amenities":["pool","garden","bbq"],"yearBuilt":2015}',
  'e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2',
  '/uploads/properties/casa-cuernavaca-1.jpg',
  NOW() - INTERVAL '2 days',
  NOW() - INTERVAL '2 days'
);

-- ========================================
-- 3. OWNERSHIPS (Depende de: properties, user)
-- ========================================

-- Ownership 1: Casa Polanco - Vendedor original (70% ownership)
INSERT INTO "ownerships" (
  "propertyId",
  "ownerAddress",
  "balance",
  "percentage",
  "lastTxHash",
  "createdAt",
  "updatedAt"
) VALUES (
  1, -- Casa Polanco
  'GBTESTVENDEDOR1ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890',
  '7000000000', -- 700 tokens
  70.0000,
  'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8',
  NOW() - INTERVAL '30 days',
  NOW() - INTERVAL '10 days'
);

-- Ownership 2: Casa Polanco - Comprador 1 (20% ownership)
INSERT INTO "ownerships" (
  "propertyId",
  "ownerAddress",
  "balance",
  "percentage",
  "lastTxHash",
  "createdAt",
  "updatedAt"
) VALUES (
  1, -- Casa Polanco
  'GBTESTCOMPRADOR1ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789',
  '2000000000', -- 200 tokens
  20.0000,
  'f1g2h3i4j5k6l7m8n9o0p1q2r3s4t5u6v7w8x9y0z1a2b3c4d5e6f7g8',
  NOW() - INTERVAL '15 days',
  NOW() - INTERVAL '15 days'
);

-- Ownership 3: Casa Polanco - Admin (10% ownership)
INSERT INTO "ownerships" (
  "propertyId",
  "ownerAddress",
  "balance",
  "percentage",
  "lastTxHash",
  "createdAt",
  "updatedAt"
) VALUES (
  1, -- Casa Polanco
  'GCVOWIN3U4HWMZUPYZ446WHPTHMWQ65DDPICDP32DEHHIFJUJ6K7UNSX',
  '1000000000', -- 100 tokens
  10.0000,
  'g2h3i4j5k6l7m8n9o0p1q2r3s4t5u6v7w8x9y0z1a2b3c4d5e6f7g8h9',
  NOW() - INTERVAL '10 days',
  NOW() - INTERVAL '10 days'
);

-- Ownership 4: Depto Santa Fe - Vendedor (100% ownership, sin ventas aún)
INSERT INTO "ownerships" (
  "propertyId",
  "ownerAddress",
  "balance",
  "percentage",
  "lastTxHash",
  "createdAt",
  "updatedAt"
) VALUES (
  2, -- Depto Santa Fe
  'GBTESTVENDEDOR1ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890',
  '8000000000', -- 800 tokens (100%)
  100.0000,
  'b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9',
  NOW() - INTERVAL '25 days',
  NOW() - INTERVAL '25 days'
);

-- Ownership 5: Hotel Riviera - Vendedor (50% ownership)
INSERT INTO "ownerships" (
  "propertyId",
  "ownerAddress",
  "balance",
  "percentage",
  "lastTxHash",
  "createdAt",
  "updatedAt"
) VALUES (
  3, -- Hotel Riviera
  'GBTESTVENDEDOR1ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890',
  '7500000000', -- 750 tokens
  50.0000,
  'c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0',
  NOW() - INTERVAL '20 days',
  NOW() - INTERVAL '8 days'
);

-- Ownership 6: Hotel Riviera - Comprador 1 (30% ownership)
INSERT INTO "ownerships" (
  "propertyId",
  "ownerAddress",
  "balance",
  "percentage",
  "lastTxHash",
  "createdAt",
  "updatedAt"
) VALUES (
  3, -- Hotel Riviera
  'GBTESTCOMPRADOR1ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789',
  '4500000000', -- 450 tokens
  30.0000,
  'h3i4j5k6l7m8n9o0p1q2r3s4t5u6v7w8x9y0z1a2b3c4d5e6f7g8h9i0',
  NOW() - INTERVAL '12 days',
  NOW() - INTERVAL '12 days'
);

-- Ownership 7: Hotel Riviera - Admin (20% ownership)
INSERT INTO "ownerships" (
  "propertyId",
  "ownerAddress",
  "balance",
  "percentage",
  "lastTxHash",
  "createdAt",
  "updatedAt"
) VALUES (
  3, -- Hotel Riviera
  'GCVOWIN3U4HWMZUPYZ446WHPTHMWQ65DDPICDP32DEHHIFJUJ6K7UNSX',
  '3000000000', -- 300 tokens
  20.0000,
  'i4j5k6l7m8n9o0p1q2r3s4t5u6v7w8x9y0z1a2b3c4d5e6f7g8h9i0j1',
  NOW() - INTERVAL '8 days',
  NOW() - INTERVAL '8 days'
);

-- ========================================
-- 4. LISTINGS (Depende de: properties)
-- ========================================

-- Listing 1: Casa Polanco - Venta de 100 tokens por el vendedor (ACTIVO)
INSERT INTO "listings" (
  "listingId",
  "propertyId",
  "sellerAddress",
  "amount",
  "initialAmount",
  "pricePerToken",
  "totalPrice",
  "status",
  "txHash",
  "expiresAt",
  "createdAt",
  "updatedAt"
) VALUES (
  '1001',
  1, -- Casa Polanco
  'GBTESTVENDEDOR1ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890',
  '1000000000', -- 100 tokens disponibles
  '1000000000', -- 100 tokens iniciales
  '50000', -- $5,000 USD por token
  '500000000', -- Total: $500,000 USD
  'active',
  'listing1_txhash_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0',
  NOW() + INTERVAL '60 days', -- Expira en 60 días
  NOW() - INTERVAL '10 days',
  NOW() - INTERVAL '10 days'
);

-- Listing 2: Depto Santa Fe - Venta de 200 tokens (ACTIVO)
INSERT INTO "listings" (
  "listingId",
  "propertyId",
  "sellerAddress",
  "amount",
  "initialAmount",
  "pricePerToken",
  "totalPrice",
  "status",
  "txHash",
  "expiresAt",
  "createdAt",
  "updatedAt"
) VALUES (
  '1002',
  2, -- Depto Santa Fe
  'GBTESTVENDEDOR1ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890',
  '2000000000', -- 200 tokens disponibles
  '2000000000',
  '40000', -- $4,000 USD por token
  '800000000', -- Total: $800,000 USD
  'active',
  'listing2_txhash_b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1',
  NOW() + INTERVAL '90 days',
  NOW() - INTERVAL '5 days',
  NOW() - INTERVAL '5 days'
);

-- Listing 3: Hotel Riviera - Venta de 300 tokens (ACTIVO)
INSERT INTO "listings" (
  "listingId",
  "propertyId",
  "sellerAddress",
  "amount",
  "initialAmount",
  "pricePerToken",
  "totalPrice",
  "status",
  "txHash",
  "expiresAt",
  "createdAt",
  "updatedAt"
) VALUES (
  '1003',
  3, -- Hotel Riviera
  'GBTESTVENDEDOR1ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890',
  '3000000000', -- 300 tokens disponibles
  '3000000000',
  '80000', -- $8,000 USD por token
  '2400000000', -- Total: $2,400,000 USD
  'active',
  'listing3_txhash_c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2',
  NOW() + INTERVAL '120 days',
  NOW() - INTERVAL '8 days',
  NOW() - INTERVAL '8 days'
);

-- Listing 4: Casa Polanco - Listing VENDIDO (ejemplo histórico)
INSERT INTO "listings" (
  "listingId",
  "propertyId",
  "sellerAddress",
  "amount",
  "initialAmount",
  "pricePerToken",
  "totalPrice",
  "status",
  "txHash",
  "expiresAt",
  "createdAt",
  "updatedAt"
) VALUES (
  '1000',
  1, -- Casa Polanco
  'GBTESTVENDEDOR1ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890',
  '0', -- Todo vendido
  '2000000000', -- Eran 200 tokens
  '50000',
  '1000000000',
  'sold',
  'listing0_txhash_old_a0b1c2d3e4f5g6h7i8j9k0l1m2n3o4p5q6r7s8t9',
  NOW() + INTERVAL '30 days',
  NOW() - INTERVAL '30 days',
  NOW() - INTERVAL '15 days'
);

-- ========================================
-- 5. TRANSACTIONS (Depende de: listings)
-- ========================================

-- Transaction 1: Compra de 200 tokens de Casa Polanco por Comprador
INSERT INTO "transactions" (
  "txHash",
  "listingId",
  "buyerAddress",
  "sellerAddress",
  "amount",
  "pricePerToken",
  "totalPrice",
  "escrowContractId",
  "metadata",
  "createdAt"
) VALUES (
  'tx1_f1g2h3i4j5k6l7m8n9o0p1q2r3s4t5u6v7w8x9y0z1a2b3c4d5e6f7g8',
  4, -- Listing SOLD (Casa Polanco)
  'GBTESTCOMPRADOR1ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789',
  'GBTESTVENDEDOR1ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890',
  '2000000000', -- 200 tokens
  '50000',
  '1000000000', -- $1,000,000 USD
  'CARJ2AEKS5PLMF6BNHZKPRGX2VJT5JG7BDOPYHQIGQY4WI7JL2ALWBLS',
  '{"buyer_wallet":"freighter","payment_method":"stellar","notes":"Primera inversión"}',
  NOW() - INTERVAL '15 days'
);

-- Transaction 2: Compra de 100 tokens de Casa Polanco por Admin
INSERT INTO "transactions" (
  "txHash",
  "listingId",
  "buyerAddress",
  "sellerAddress",
  "amount",
  "pricePerToken",
  "totalPrice",
  "escrowContractId",
  "metadata",
  "createdAt"
) VALUES (
  'tx2_g2h3i4j5k6l7m8n9o0p1q2r3s4t5u6v7w8x9y0z1a2b3c4d5e6f7g8h9',
  4, -- Listing SOLD (Casa Polanco)
  'GCVOWIN3U4HWMZUPYZ446WHPTHMWQ65DDPICDP32DEHHIFJUJ6K7UNSX',
  'GBTESTVENDEDOR1ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890',
  '1000000000', -- 100 tokens
  '50000',
  '500000000', -- $500,000 USD
  'CARJ2AEKS5PLMF6BNHZKPRGX2VJT5JG7BDOPYHQIGQY4WI7JL2ALWBLS',
  '{"buyer_wallet":"platform","payment_method":"stellar","notes":"Admin investment"}',
  NOW() - INTERVAL '10 days'
);

-- Transaction 3: Compra de 450 tokens de Hotel Riviera por Comprador
INSERT INTO "transactions" (
  "txHash",
  "listingId",
  "buyerAddress",
  "sellerAddress",
  "amount",
  "pricePerToken",
  "totalPrice",
  "escrowContractId",
  "metadata",
  "createdAt"
) VALUES (
  'tx3_h3i4j5k6l7m8n9o0p1q2r3s4t5u6v7w8x9y0z1a2b3c4d5e6f7g8h9i0',
  3, -- Listing activo (Hotel Riviera)
  'GBTESTCOMPRADOR1ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789',
  'GBTESTVENDEDOR1ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890',
  '4500000000', -- 450 tokens
  '80000',
  '3600000000', -- $3,600,000 USD
  'CARJ2AEKS5PLMF6BNHZKPRGX2VJT5JG7BDOPYHQIGQY4WI7JL2ALWBLS',
  '{"buyer_wallet":"freighter","payment_method":"stellar","notes":"Hotel investment"}',
  NOW() - INTERVAL '12 days'
);

-- Transaction 4: Compra de 300 tokens de Hotel Riviera por Admin
INSERT INTO "transactions" (
  "txHash",
  "listingId",
  "buyerAddress",
  "sellerAddress",
  "amount",
  "pricePerToken",
  "totalPrice",
  "escrowContractId",
  "metadata",
  "createdAt"
) VALUES (
  'tx4_i4j5k6l7m8n9o0p1q2r3s4t5u6v7w8x9y0z1a2b3c4d5e6f7g8h9i0j1',
  3, -- Listing activo (Hotel Riviera)
  'GCVOWIN3U4HWMZUPYZ446WHPTHMWQ65DDPICDP32DEHHIFJUJ6K7UNSX',
  'GBTESTVENDEDOR1ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890',
  '3000000000', -- 300 tokens
  '80000',
  '2400000000', -- $2,400,000 USD
  'CARJ2AEKS5PLMF6BNHZKPRGX2VJT5JG7BDOPYHQIGQY4WI7JL2ALWBLS',
  '{"buyer_wallet":"platform","payment_method":"stellar","notes":"Strategic investment"}',
  NOW() - INTERVAL '8 days'
);

-- ========================================
-- RESUMEN DE DATOS INSERTADOS
-- ========================================
-- ✅ 4 usuarios (admin, vendedor, comprador, test)
-- ✅ 5 propiedades (1 casa, 1 depto, 1 hotel, 1 comercial, 1 casa sin verificar)
-- ✅ 7 ownerships (distribución realista de tokens)
-- ✅ 4 listings (3 activos, 1 vendido)
-- ✅ 4 transactions (historial de compras)
--
-- CREDENCIALES DE PRUEBA:
-- Admin: admin@blocki.com / admin123
-- Vendedor: vendedor@blocki.com / vendedor123
-- Comprador: comprador@blocki.com / comprador123
-- Test: test-hacka@blocki.com / test123
-- ========================================

-- ========================================
-- QUERIES DE VERIFICACIÓN
-- ========================================

-- Verificar usuarios
SELECT id, email, name, "stellarPublicKey", role, "kycStatus" FROM "user" ORDER BY id;

-- Verificar propiedades
SELECT id, "propertyId", name, "totalSupply", valuation, verified, "legalOwner" FROM "properties" ORDER BY id;

-- Verificar ownerships
SELECT o.id, o."propertyId", p.name as property_name, o."ownerAddress", o.balance, o.percentage
FROM "ownerships" o
JOIN "properties" p ON o."propertyId" = p.id
ORDER BY o."propertyId", o.percentage DESC;

-- Verificar listings activos
SELECT l.id, l."listingId", p.name as property_name, l.amount, l."pricePerToken", l.status
FROM "listings" l
JOIN "properties" p ON l."propertyId" = p.id
WHERE l.status = 'active'
ORDER BY l.id;

-- Verificar transacciones
SELECT t.id, t."txHash", p.name as property_name, t."buyerAddress", t.amount, t."totalPrice", t."createdAt"
FROM "transactions" t
JOIN "listings" l ON t."listingId" = l.id
JOIN "properties" p ON l."propertyId" = p.id
ORDER BY t."createdAt" DESC;

-- ========================================
-- FIN DEL SEED
-- ========================================
