import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddKycAndAnchorsModules1732030000000 implements MigrationInterface {
  name = 'AddKycAndAnchorsModules1732030000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create enum types
    await queryRunner.query(`
      CREATE TYPE "public"."kyc_sessions_provider_enum" AS ENUM('synaps', 'manual')
    `);
    await queryRunner.query(`
      CREATE TYPE "public"."kyc_sessions_status_enum" AS ENUM('initiated', 'pending', 'approved', 'rejected', 'expired')
    `);
    await queryRunner.query(`
      CREATE TYPE "public"."anchor_transactions_type_enum" AS ENUM('deposit', 'withdrawal')
    `);
    await queryRunner.query(`
      CREATE TYPE "public"."anchor_transactions_status_enum" AS ENUM('incomplete', 'pending_user_transfer_start', 'pending_usr', 'pending_anchor', 'pending_stellar', 'pending_external', 'pending_trust', 'pending_user', 'completed', 'refunded', 'expired', 'error')
    `);

    // Create kyc_sessions table
    await queryRunner.query(`
      CREATE TABLE "kyc_sessions" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "stellarAddress" character varying(56) NOT NULL,
        "provider" "public"."kyc_sessions_provider_enum" NOT NULL DEFAULT 'synaps',
        "sessionId" character varying(255) NOT NULL UNIQUE,
        "status" "public"."kyc_sessions_status_enum" NOT NULL DEFAULT 'initiated',
        "redirectUrl" text,
        "metadata" jsonb,
        "verificationData" jsonb,
        "rejectionReason" character varying(255),
        "expiresAt" timestamp,
        "completedAt" timestamp,
        "createdAt" timestamp NOT NULL DEFAULT now(),
        "updatedAt" timestamp NOT NULL DEFAULT now()
      )
    `);

    // Create anchor_transactions table
    await queryRunner.query(`
      CREATE TABLE "anchor_transactions" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "stellarAddress" character varying(56) NOT NULL,
        "type" "public"."anchor_transactions_type_enum" NOT NULL,
        "status" "public"."anchor_transactions_status_enum" NOT NULL DEFAULT 'incomplete',
        "assetCode" character varying(10) NOT NULL,
        "assetIssuer" character varying(56),
        "amount" decimal(20, 7) NOT NULL,
        "feeFixed" decimal(20, 7),
        "feePercent" decimal(10, 4),
        "interactiveUrl" text,
        "stellarTxId" character varying(64),
        "externalTxId" character varying(255),
        "from" jsonb,
        "to" jsonb,
        "message" text,
        "metadata" jsonb,
        "startedAt" timestamp,
        "completedAt" timestamp,
        "expiresAt" timestamp,
        "createdAt" timestamp NOT NULL DEFAULT now(),
        "updatedAt" timestamp NOT NULL DEFAULT now()
      )
    `);

    // Create indices for kyc_sessions
    await queryRunner.query(`
      CREATE INDEX "IDX_kyc_sessions_stellarAddress" ON "kyc_sessions" ("stellarAddress")
    `);
    await queryRunner.query(`
      CREATE INDEX "IDX_kyc_sessions_status" ON "kyc_sessions" ("status")
    `);
    await queryRunner.query(`
      CREATE INDEX "IDX_kyc_sessions_stellarAddress_status" ON "kyc_sessions" ("stellarAddress", "status")
    `);

    // Create indices for anchor_transactions
    await queryRunner.query(`
      CREATE INDEX "IDX_anchor_transactions_stellarAddress" ON "anchor_transactions" ("stellarAddress")
    `);
    await queryRunner.query(`
      CREATE INDEX "IDX_anchor_transactions_status" ON "anchor_transactions" ("status")
    `);
    await queryRunner.query(`
      CREATE INDEX "IDX_anchor_transactions_stellarAddress_type_status" ON "anchor_transactions" ("stellarAddress", "type", "status")
    `);

    // Add composite indices to existing listings table
    await queryRunner.query(`
      CREATE INDEX "IDX_listings_propertyId_status" ON "listings" ("propertyId", "status")
    `);
    await queryRunner.query(`
      CREATE INDEX "IDX_listings_sellerAddress_status" ON "listings" ("sellerAddress", "status")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop indices from listings
    await queryRunner.query(`DROP INDEX "public"."IDX_listings_sellerAddress_status"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_listings_propertyId_status"`);

    // Drop indices from anchor_transactions
    await queryRunner.query(`DROP INDEX "public"."IDX_anchor_transactions_stellarAddress_type_status"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_anchor_transactions_status"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_anchor_transactions_stellarAddress"`);

    // Drop indices from kyc_sessions
    await queryRunner.query(`DROP INDEX "public"."IDX_kyc_sessions_stellarAddress_status"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_kyc_sessions_status"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_kyc_sessions_stellarAddress"`);

    // Drop tables
    await queryRunner.query(`DROP TABLE "anchor_transactions"`);
    await queryRunner.query(`DROP TABLE "kyc_sessions"`);

    // Drop enum types
    await queryRunner.query(`DROP TYPE "public"."anchor_transactions_status_enum"`);
    await queryRunner.query(`DROP TYPE "public"."anchor_transactions_type_enum"`);
    await queryRunner.query(`DROP TYPE "public"."kyc_sessions_status_enum"`);
    await queryRunner.query(`DROP TYPE "public"."kyc_sessions_provider_enum"`);
  }
}
