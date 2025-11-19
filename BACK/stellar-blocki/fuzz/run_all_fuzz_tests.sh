#!/bin/bash

# Script para ejecutar todos los fuzz tests
# Uso: ./run_all_fuzz_tests.sh

set -e

echo "=========================================="
echo "  FUZZING ALL SOROBAN CONTRACTS"
echo "=========================================="

# Duración por target (en segundos)
DURATION=600  # 10 minutos por default

# Colores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Targets
TARGETS=(
  "fuzz_property_transfer"
  "fuzz_marketplace_buy"
  "fuzz_escrow_lock"
  "fuzz_registry_register"
)

echo ""
echo "Duration per target: ${DURATION}s ($(($DURATION / 60)) minutes)"
echo "Total estimated time: $(($DURATION * ${#TARGETS[@]} / 60)) minutes"
echo ""

# Crear directorio para reportes
mkdir -p fuzz_reports

# Ejecutar cada target
for target in "${TARGETS[@]}"; do
  echo ""
  echo "=========================================="
  echo -e "${YELLOW}Running: $target${NC}"
  echo "=========================================="

  # Ejecutar fuzzing
  if cargo fuzz run $target -- -max_total_time=$DURATION > "fuzz_reports/${target}_report.txt" 2>&1; then
    echo -e "${GREEN}✓ $target completed successfully${NC}"

    # Verificar si hay crashes
    if [ -d "artifacts/$target" ] && [ "$(ls -A artifacts/$target 2>/dev/null)" ]; then
      echo -e "${RED}⚠ CRASHES FOUND in $target!${NC}"
      echo -e "${RED}  Check: artifacts/$target/${NC}"
      ls -lh "artifacts/$target/"
    else
      echo -e "${GREEN}  No crashes found${NC}"
    fi
  else
    echo -e "${RED}✗ $target FAILED${NC}"
  fi

  # Pausa breve entre targets
  sleep 2
done

echo ""
echo "=========================================="
echo "  FUZZING COMPLETE"
echo "=========================================="
echo ""

# Resumen
echo "Summary:"
echo "--------"
for target in "${TARGETS[@]}"; do
  if [ -d "artifacts/$target" ] && [ "$(ls -A artifacts/$target 2>/dev/null)" ]; then
    echo -e "${RED}✗ $target - CRASHES FOUND${NC}"
  else
    echo -e "${GREEN}✓ $target - NO CRASHES${NC}"
  fi
done

echo ""
echo "Reports saved in: fuzz_reports/"
echo ""

# Contar total de crashes
total_crashes=0
for target in "${TARGETS[@]}"; do
  if [ -d "artifacts/$target" ]; then
    crashes=$(ls -1 "artifacts/$target" 2>/dev/null | wc -l)
    total_crashes=$((total_crashes + crashes))
  fi
done

if [ $total_crashes -gt 0 ]; then
  echo -e "${RED}Total crashes found: $total_crashes${NC}"
  exit 1
else
  echo -e "${GREEN}🎉 All fuzzing tests passed! NO CRASHES 🎉${NC}"
  exit 0
fi
