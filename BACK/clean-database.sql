-- ============================================================================
-- SCRIPT PARA LIMPIAR TODAS LAS TABLAS DE LA BASE DE DATOS
-- ============================================================================
-- Orden: De tablas hijas a tablas padres (respetando foreign keys)
-- Uso: Ejecutar en pgAdmin o psql
-- ============================================================================

-- IMPORTANTE: Descomentar si necesitas deshabilitar temporalmente FK checks
-- SET session_replication_role = replica; -- PostgreSQL

BEGIN;

-- ============================================================================
-- NIVEL 3: Tablas más dependientes (borrar primero)
-- ============================================================================

-- 1. Transactions (depende de listings)
DELETE FROM transactions;
ALTER SEQUENCE transactions_id_seq RESTART WITH 1;
SELECT setval('transactions_id_seq', 1, false);

-- ============================================================================
-- NIVEL 2: Tablas intermedias
-- ============================================================================

-- 2. Listings (depende de properties)
DELETE FROM listings;
ALTER SEQUENCE listings_id_seq RESTART WITH 1;
SELECT setval('listings_id_seq', 1, false);

-- 3. Ownerships (depende de properties)
DELETE FROM ownerships;
ALTER SEQUENCE ownerships_id_seq RESTART WITH 1;
SELECT setval('ownerships_id_seq', 1, false);

-- ============================================================================
-- NIVEL 1: Tablas con dependencias simples
-- ============================================================================

-- 4. Properties (depende de evaluators)
DELETE FROM properties;
ALTER SEQUENCE properties_id_seq RESTART WITH 1;
SELECT setval('properties_id_seq', 1, false);

-- 5. KYC Verification (depende de user)
DELETE FROM kyc_verification;
ALTER SEQUENCE kyc_verification_id_seq RESTART WITH 1;
SELECT setval('kyc_verification_id_seq', 1, false);

-- ============================================================================
-- NIVEL 0: Tablas independientes
-- ============================================================================

-- 6. KYC Sessions (independiente, usa UUID)
DELETE FROM kyc_sessions;

-- 7. Anchor Transactions (independiente, usa UUID)
DELETE FROM anchor_transactions;

-- 8. Users Tokenization (independiente, PK = stellarAddress)
DELETE FROM users_tokenization;

-- 9. Evaluators (independiente)
DELETE FROM evaluators;
ALTER SEQUENCE evaluators_id_seq RESTART WITH 1;
SELECT setval('evaluators_id_seq', 1, false);

-- 10. User (tabla base)
DELETE FROM "user";
ALTER SEQUENCE user_id_seq RESTART WITH 1;
SELECT setval('user_id_seq', 1, false);

-- ============================================================================
-- CONFIRMAR CAMBIOS
-- ============================================================================

COMMIT;

-- IMPORTANTE: Re-habilitar FK checks si se deshabilitaron
-- SET session_replication_role = DEFAULT; -- PostgreSQL

-- ============================================================================
-- VERIFICACIÓN (Ejecutar después del script)
-- ============================================================================

-- Verificar que todas las tablas estén vacías
SELECT 'transactions' as tabla, COUNT(*) as registros FROM transactions
UNION ALL
SELECT 'listings', COUNT(*) FROM listings
UNION ALL
SELECT 'ownerships', COUNT(*) FROM ownerships
UNION ALL
SELECT 'properties', COUNT(*) FROM properties
UNION ALL
SELECT 'kyc_verification', COUNT(*) FROM kyc_verification
UNION ALL
SELECT 'kyc_sessions', COUNT(*) FROM kyc_sessions
UNION ALL
SELECT 'anchor_transactions', COUNT(*) FROM anchor_transactions
UNION ALL
SELECT 'users_tokenization', COUNT(*) FROM users_tokenization
UNION ALL
SELECT 'evaluators', COUNT(*) FROM evaluators
UNION ALL
SELECT 'user', COUNT(*) FROM "user"
ORDER BY registros DESC;

-- ============================================================================
-- RESUMEN DE DEPENDENCIAS
-- ============================================================================

/*
ÁRBOL DE DEPENDENCIAS:

transactions
  └── listings
       └── properties
            └── evaluators

ownerships
  └── properties
       └── evaluators

kyc_verification
  └── user

kyc_sessions (independiente)

anchor_transactions (independiente)

users_tokenization (independiente)

ORDEN DE BORRADO:
1. transactions       → Nivel 3 (depende de listings)
2. listings           → Nivel 2 (depende de properties)
3. ownerships         → Nivel 2 (depende de properties)
4. properties         → Nivel 1 (depende de evaluators)
5. kyc_verification   → Nivel 1 (depende de user)
6. kyc_sessions       → Nivel 0 (independiente)
7. anchor_transactions → Nivel 0 (independiente)
8. users_tokenization → Nivel 0 (independiente)
9. evaluators         → Nivel 0 (independiente)
10. user              → Nivel 0 (base)
*/
