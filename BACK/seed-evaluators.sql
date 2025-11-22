-- ========================================
-- BLOCKI - Evaluators Complete Setup
-- ========================================
-- This script creates the evaluators table and seeds it with 4 realistic evaluator companies
-- Run this script in your production database

-- ========================================
-- STEP 1: Create evaluators table
-- ========================================
CREATE TABLE IF NOT EXISTS evaluators (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  logo VARCHAR(500),
  website VARCHAR(255),
  email VARCHAR(255),
  phone VARCHAR(50),
  country VARCHAR(100),
  certifications TEXT, -- JSON array stored as text
  rating DECIMAL(3, 2) DEFAULT 5.0,
  propertiesEvaluated INT DEFAULT 0,
  isActive BOOLEAN DEFAULT true,
  createdAt TIMESTAMP DEFAULT NOW(),
  updatedAt TIMESTAMP DEFAULT NOW()
);

-- ========================================
-- STEP 2: Add evaluator columns to properties table (if not exists)
-- ========================================
DO $$
BEGIN
  -- Add evaluatorId column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'properties' AND column_name = 'evaluatorId'
  ) THEN
    ALTER TABLE properties ADD COLUMN evaluatorId INT;
    ALTER TABLE properties ADD CONSTRAINT fk_properties_evaluator
      FOREIGN KEY (evaluatorId) REFERENCES evaluators(id) ON DELETE SET NULL;
  END IF;

  -- Add verificationId column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'properties' AND column_name = 'verificationId'
  ) THEN
    ALTER TABLE properties ADD COLUMN verificationId VARCHAR(100);
  END IF;
END $$;

-- ========================================
-- STEP 3: Clean existing evaluators (optional - uncomment if needed)
-- ========================================
-- DELETE FROM evaluators;

-- ========================================
-- STEP 4: Insert Evaluator Data
-- ========================================

-- 1. Appraisal Institute (USA)
-- ========================================
INSERT INTO evaluators (
  name,
  description,
  logo,
  website,
  email,
  phone,
  country,
  certifications,
  rating,
  propertiesEvaluated,
  isActive,
  createdAt,
  updatedAt
) VALUES (
  'Appraisal Institute',
  'Leading professional association of real estate appraisers with MAI designation. 80+ years of experience in property valuation with strict ethical standards.',
  'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=200&q=80',
  'https://www.appraisalinstitute.org',
  'contact@appraisalinstitute.org',
  '+1-312-335-4100',
  'United States',
  '["MAI Designation", "SRA Designation", "AI-GRS Designation", "State Licensed", "USPAP Certified"]',
  4.9,
  2847,
  true,
  NOW(),
  NOW()
);

-- ========================================
-- 2. CBRE Valuation & Advisory Services
-- ========================================
INSERT INTO evaluators (
  name,
  description,
  logo,
  website,
  email,
  phone,
  country,
  certifications,
  rating,
  propertiesEvaluated,
  isActive,
  createdAt,
  updatedAt
) VALUES (
  'CBRE Valuation',
  'Global leader in commercial real estate valuation. Part of CBRE Group, the world''s largest commercial real estate services and investment firm.',
  'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=200&q=80',
  'https://www.cbre.com/services/valuation-and-advisory',
  'valuation@cbre.com',
  '+1-214-863-3000',
  'United States',
  '["RICS Certified", "MAI", "ISO 9001 Certified", "IVS Compliant", "FIRREA Compliant"]',
  4.8,
  5240,
  true,
  NOW(),
  NOW()
);

-- ========================================
-- 3. Colliers International Valuation
-- ========================================
INSERT INTO evaluators (
  name,
  description,
  logo,
  website,
  email,
  phone,
  country,
  certifications,
  rating,
  propertiesEvaluated,
  isActive,
  createdAt,
  updatedAt
) VALUES (
  'Colliers Valuation',
  'Trusted property valuation experts with global reach across 60+ countries. Specialized in residential, commercial, and mixed-use real estate appraisals.',
  'https://images.unsplash.com/photo-1554224311-9ca41879a37b?w=200&q=80',
  'https://www.colliers.com/valuation',
  'valuation@colliers.com',
  '+1-416-960-9500',
  'Canada',
  '["AACI Certified", "RICS Member", "CRA Designated", "IVSC Standards"]',
  4.7,
  3156,
  true,
  NOW(),
  NOW()
);

-- ========================================
-- 4. Cushman & Wakefield Valuation
-- ========================================
INSERT INTO evaluators (
  name,
  description,
  logo,
  website,
  email,
  phone,
  country,
  certifications,
  rating,
  propertiesEvaluated,
  isActive,
  createdAt,
  updatedAt
) VALUES (
  'Cushman & Wakefield',
  'Premier real estate services firm providing strategic property valuations for institutional and private clients worldwide. Expertise across all asset classes.',
  'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=200&q=80',
  'https://www.cushmanwakefield.com',
  'valuation@cushwake.com',
  '+1-212-841-7500',
  'United States',
  '["MAI Certified", "CCIM Designated", "RICS Registered", "State Licensed", "FIRREA Approved"]',
  4.8,
  4520,
  true,
  NOW(),
  NOW()
);

-- ========================================
-- STEP 5: Verification Query
-- ========================================
-- Run this to verify the data was inserted correctly
SELECT
  id,
  name,
  country,
  rating,
  propertiesEvaluated,
  isActive
FROM evaluators
ORDER BY rating DESC, propertiesEvaluated DESC;

-- ========================================
-- STEP 6: Stats Query (for demo purposes)
-- ========================================
SELECT
  COUNT(*) as total_evaluators,
  ROUND(AVG(rating), 2) as avg_rating,
  SUM(propertiesEvaluated) as total_properties_evaluated,
  COUNT(CASE WHEN isActive = true THEN 1 END) as active_evaluators
FROM evaluators;
