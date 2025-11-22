# Deployer Contract Update

## Nuevo Deployer Contract ID

El Deployer contract ha sido redespl egado con el PropertyToken WASM actualizado que incluye mint automático.

**Actualiza las siguientes variables de entorno en Render:**

```bash
DEPLOYER_CONTRACT_ID=CBTL57MZLNP2QTVAMARNCUDY43BIONCF3X4S4FZIBN752WVCNDBVJ7ZF
```

## Detalles técnicos

- **Nuevo Deployer**: CBTL57MZLNP2QTVAMARNCUDY43BIONCF3X4S4FZIBN752WVCNDBVJ7ZF
- **PropertyToken WASM hash**: 7d48817e9c2d58237a203a5e3367f5dc152a01cf66639f994514dcc9a8389c49
- **Cambio**: PropertyToken ahora mintea automáticamente todos los tokens al admin durante initialize()

## Verificación

Para verificar que funciona, despliega un PropertyToken de prueba usando el deployer y verifica que el admin tenga balance inmediatamente después de initialize().
