-- Migration: Create Media Table
-- Description: Stores uploaded media files (images, documents, videos) associated with entities
-- Dependencies: None
-- Author: Blocki Team
-- Date: 2025-01-21

CREATE TABLE IF NOT EXISTS media (
  id SERIAL PRIMARY KEY,
  url TEXT NOT NULL,
  entity_id INT NULL,
  entity_type VARCHAR(50) NULL CHECK (entity_type IN ('PROPERTY', 'EVALUATOR', 'USER')),
  file_type VARCHAR(20) NOT NULL DEFAULT 'OTHER' CHECK (file_type IN ('IMAGE', 'PDF', 'VIDEO', 'OTHER')),
  display_order INT NULL DEFAULT 0,
  status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'INACTIVE')),
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_media_entity ON media(entity_id, entity_type);
CREATE INDEX IF NOT EXISTS idx_media_status ON media(status);
CREATE INDEX IF NOT EXISTS idx_media_file_type ON media(file_type);
CREATE INDEX IF NOT EXISTS idx_media_created_at ON media(created_at DESC);

-- Create trigger to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_media_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_media_updated_at
  BEFORE UPDATE ON media
  FOR EACH ROW
  EXECUTE FUNCTION update_media_updated_at();

-- Comments for documentation
COMMENT ON TABLE media IS 'Stores all media files uploaded to Cloudflare R2 with entity associations';
COMMENT ON COLUMN media.id IS 'Primary key';
COMMENT ON COLUMN media.url IS 'Public URL of the file in Cloudflare R2';
COMMENT ON COLUMN media.entity_id IS 'ID of the associated entity (property, evaluator, user)';
COMMENT ON COLUMN media.entity_type IS 'Type of entity this media belongs to';
COMMENT ON COLUMN media.file_type IS 'Type of file for filtering and display';
COMMENT ON COLUMN media.display_order IS 'Order for displaying multiple media items';
COMMENT ON COLUMN media.status IS 'Status for soft delete functionality';
COMMENT ON COLUMN media.created_at IS 'Timestamp when media was uploaded';
COMMENT ON COLUMN media.updated_at IS 'Timestamp when media record was last modified';
