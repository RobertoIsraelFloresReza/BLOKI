#!/bin/bash

echo "🔍 Validating Stellar Backend API..."
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to check
check() {
  if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓${NC} $1"
  else
    echo -e "${RED}✗${NC} $1"
    exit 1
  fi
}

# Check if .env file exists
if [ -f .env ]; then
  echo -e "${GREEN}✓${NC} .env file exists"
else
  echo -e "${RED}✗${NC} .env file not found. Copy from .env.example"
  exit 1
fi

# Check if Docker is running
docker info > /dev/null 2>&1
check "Docker is running"

# Check if docker-compose file exists
if [ -f docker-compose.yml ]; then
  echo -e "${GREEN}✓${NC} docker-compose.yml exists"
else
  echo -e "${RED}✗${NC} docker-compose.yml not found"
  exit 1
fi

# Check Node modules
if [ -d node_modules ]; then
  echo -e "${GREEN}✓${NC} node_modules installed"
else
  echo -e "${YELLOW}⚠${NC} node_modules not found. Running npm install..."
  npm install
  check "Dependencies installed"
fi

# Start databases
echo ""
echo "🐳 Starting PostgreSQL and Redis..."
docker-compose up -d postgres redis
sleep 5

# Check PostgreSQL
docker exec stellar-postgres pg_isready -U stellar > /dev/null 2>&1
check "PostgreSQL is ready"

# Check Redis
docker exec stellar-redis redis-cli ping > /dev/null 2>&1
check "Redis is ready"

# Build TypeScript
echo ""
echo "🔨 Building TypeScript..."
npm run build > /dev/null 2>&1
check "Build successful"

# Check critical files
echo ""
echo "📁 Checking critical files..."

FILES=(
  "src/modules/auth/stellar-auth.service.ts"
  "src/modules/auth/guards/stellar-auth.guard.ts"
  "src/modules/users/entities/user-tokenization.entity.ts"
  "src/modules/properties/entities/property.entity.ts"
  "src/modules/marketplace/entities/listing.entity.ts"
  "src/modules/stellar/services/contract.service.ts"
  "src/config/redis.config.ts"
  "src/config/type.orm.config.ts"
)

for file in "${FILES[@]}"; do
  if [ -f "$file" ]; then
    echo -e "${GREEN}✓${NC} $file"
  else
    echo -e "${RED}✗${NC} $file not found"
  fi
done

# Check environment variables
echo ""
echo "🔧 Checking environment variables..."

if grep -q "STELLAR_RPC_URL" .env; then
  echo -e "${GREEN}✓${NC} STELLAR_RPC_URL configured"
fi

if grep -q "DATABASE_URL" .env; then
  echo -e "${GREEN}✓${NC} DATABASE_URL configured"
fi

if grep -q "REDIS_URL" .env; then
  echo -e "${GREEN}✓${NC} REDIS_URL configured"
fi

# Test Soroban RPC connection
echo ""
echo "🌐 Testing Soroban RPC connection..."
RESPONSE=$(curl -s -X POST https://soroban-testnet.stellar.org:443 \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":1,"method":"getHealth"}')

if echo "$RESPONSE" | grep -q "healthy"; then
  echo -e "${GREEN}✓${NC} Soroban RPC is healthy"
else
  echo -e "${YELLOW}⚠${NC} Soroban RPC health check uncertain"
fi

echo ""
echo "================================"
echo -e "${GREEN}✓ Backend validation complete!${NC}"
echo ""
echo "Next steps:"
echo "1. Ensure smart contracts are deployed (see ORCHESTRATION_PLAN.md)"
echo "2. Update .env with contract IDs:"
echo "   - PROPERTY_TOKEN_DEPLOYER_ID"
echo "   - MARKETPLACE_CONTRACT_ID"
echo "   - ESCROW_CONTRACT_ID"
echo "   - REGISTRY_CONTRACT_ID"
echo "3. Generate platform keypair:"
echo "   stellar keys generate platform --network testnet"
echo "4. Start backend:"
echo "   npm run start:dev"
echo "5. Access Swagger docs:"
echo "   http://localhost:3000/api/docs"
echo ""
