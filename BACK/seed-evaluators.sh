#!/bin/bash

# Seed Evaluators Script
# Creates realistic evaluator companies for MVP demo

API_URL="http://localhost:3000"

echo "🌱 Seeding evaluators..."

# 1. Appraisal Institute (USA)
curl -X POST "$API_URL/evaluators" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Appraisal Institute",
    "description": "Leading professional association of real estate appraisers with MAI designation. 80+ years of experience in property valuation.",
    "logo": "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=200&q=80",
    "website": "https://www.appraisalinstitute.org",
    "email": "contact@appraisalinstitute.org",
    "phone": "+1-312-335-4100",
    "country": "United States",
    "certifications": "[\"MAI Designation\", \"SRA Designation\", \"AI-GRS Designation\", \"State Licensed\"]",
    "rating": 4.9,
    "propertiesEvaluated": 2847,
    "isActive": true
  }'

echo ""
echo "✅ Created: Appraisal Institute"

# 2. CBRE Valuation & Advisory Services
curl -X POST "$API_URL/evaluators" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "CBRE Valuation",
    "description": "Global leader in commercial real estate valuation. Part of CBRE Group, the world'\''s largest commercial real estate services firm.",
    "logo": "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=200&q=80",
    "website": "https://www.cbre.com/services/valuation-and-advisory",
    "email": "valuation@cbre.com",
    "phone": "+1-214-863-3000",
    "country": "United States",
    "certifications": "[\"RICS Certified\", \"MAI\", \"ISO 9001 Certified\", \"IVS Compliant\"]",
    "rating": 4.8,
    "propertiesEvaluated": 5240,
    "isActive": true
  }'

echo ""
echo "✅ Created: CBRE Valuation"

# 3. Colliers International Valuation
curl -X POST "$API_URL/evaluators" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Colliers Valuation",
    "description": "Trusted property valuation experts with global reach. Specialized in residential and commercial real estate appraisals.",
    "logo": "https://images.unsplash.com/photo-1554224311-9ca41879a37b?w=200&q=80",
    "website": "https://www.colliers.com/valuation",
    "email": "valuation@colliers.com",
    "phone": "+1-416-960-9500",
    "country": "Canada",
    "certifications": "[\"AACI Certified\", \"RICS Member\", \"CRA Designated\"]",
    "rating": 4.7,
    "propertiesEvaluated": 3156,
    "isActive": true
  }'

echo ""
echo "✅ Created: Colliers Valuation"

# 4. Cushman & Wakefield Valuation
curl -X POST "$API_URL/evaluators" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Cushman & Wakefield",
    "description": "Premier real estate services firm providing strategic property valuations for institutional and private clients worldwide.",
    "logo": "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=200&q=80",
    "website": "https://www.cushmanwakefield.com",
    "email": "valuation@cushwake.com",
    "phone": "+1-212-841-7500",
    "country": "United States",
    "certifications": "[\"MAI Certified\", \"CCIM Designated\", \"RICS Registered\", \"State Licensed\"]",
    "rating": 4.8,
    "propertiesEvaluated": 4520,
    "isActive": true
  }'

echo ""
echo "✅ Created: Cushman & Wakefield"

echo ""
echo "🎉 Seeding complete! 4 evaluators created"
echo "📊 You can now select these evaluators when uploading properties"
