# Marketplace Contract Update

## Nuevo Marketplace Contract ID

El Marketplace contract ha sido redespl egado con el método `buy_tokens` actualizado que incluye el parámetro `usdc_token`.

**Actualiza las siguientes variables de entorno en Dokploy:**

```bash
MARKETPLACE_CONTRACT_ID=CB7PRKIZ7FM3FFUMFSMQVWQ745QWS4BGGIOCN7UEQY4NSM52JAQQSFGJ
MARKETPLACE_EXPLORER=https://stellar.expert/explorer/testnet/contract/CB7PRKIZ7FM3FFUMFSMQVWQ745QWS4BGGIOCN7UEQY4NSM52JAQQSFGJ
```

## Inicializar el Marketplace

Después de actualizar el .env, ejecuta este comando para inicializar el nuevo Marketplace:

```bash
cd stellar-blocki

node scripts/init-marketplace.js
```

## Detalles técnicos

- **Nuevo Marketplace**: CB7PRKIZ7FM3FFUMFSMQVWQ745QWS4BGGIOCN7UEQY4NSM52JAQQSFGJ
- **Cambio**: El método `buy_tokens` ahora requiere el parámetro `usdc_token` (Address del token USDC)
- **WASM hash**: 0895056ec91f85c9fcfef6df82fdf8894da52f086008f61f49c93c6bea96445d

## Verificación

Después de inicializar, prueba el flujo completo:

```bash
node test-complete-flow.js
```

El flujo completo debería funcionar:
1. ✅ Registrar usuario
2. ✅ Obtener secret key
3. ✅ Crear propiedad tokenizada (con mint automático)
4. ✅ Crear listing en marketplace
5. ✅ Comprar tokens (ahora con usdc_token)
