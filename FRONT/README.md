# 🏠 Blocki - Plataforma de Inversión Inmobiliaria Tokenizada

> Hackathon Stellar Buenos Aires 2025

Plataforma web que permite comprar, vender e invertir en propiedades inmobiliarias tokenizadas usando la blockchain de Stellar.

## 🌟 Características Principales

- ✅ **Marketplace de propiedades** - Compra y venta de inmuebles completos
- ✅ **Tokenización de activos** - Inversión fraccionada en propiedades
- ✅ **Integración Stellar** - Transacciones seguras con Soroban
- ✅ **ZK-KYC** - Verificación de identidad con Zero-Knowledge Proofs
- ✅ **Palta Labs** - Procesamiento seguro de pagos
- ✅ **Dark Mode** - Tema claro y oscuro
- ✅ **Diseño Premium** - UI/UX inspirada en Cupertino

## 🛠️ Stack Tecnológico

### Frontend
- **React 19** - Framework UI
- **Vite 7** - Build tool
- **Tailwind CSS v4** - Styling (nueva sintaxis)
- **TanStack Query v5** - State management
- **React Router v7** - Routing
- **Stellar SDK v14** - Blockchain integration
- **Freighter API** - Wallet integration

### Backend (NestJS - Compañero de equipo)
- Ver repositorio del backend para más detalles

## 📁 Estructura del Proyecto

```
blocki-stellar-web-app/
├── .claude/                 # Documentación del proyecto
│   ├── PROJECT_OVERVIEW.md
│   ├── ARCHITECTURE.md
│   ├── ROADMAP.md
│   ├── DESIGN_SYSTEM.md
│   ├── ZK_KYC_IMPLEMENTATION.md
│   └── API_INTEGRATION.md
├── src/
│   ├── components/         # Componentes React
│   ├── pages/             # Páginas de la app
│   ├── hooks/             # Custom hooks
│   ├── services/          # API & Blockchain services
│   ├── lib/               # Utilidades
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css          # Tailwind + custom styles
├── public/
├── .env.example
└── package.json
```

## 🚀 Comenzar

### Prerrequisitos

- Node.js 18+ y npm
- Extensión Freighter Wallet en tu navegador
- Backend API corriendo (ver repo del backend)

### Instalación

```bash
# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env.local
# Editar .env.local con tus configuraciones

# Iniciar servidor de desarrollo
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

### Build para Producción

```bash
# Crear build de producción
npm run build

# Preview del build
npm run preview
```

## 📖 Documentación

Toda la documentación técnica está en la carpeta `.claude/`:

- **PROJECT_OVERVIEW.md** - Resumen del proyecto y objetivos del hackathon
- **ARCHITECTURE.md** - Arquitectura técnica completa
- **ROADMAP.md** - Plan de desarrollo por fases
- **DESIGN_SYSTEM.md** - Sistema de diseño y componentes
- **ZK_KYC_IMPLEMENTATION.md** - Implementación de Zero-Knowledge KYC
- **API_INTEGRATION.md** - Integración con backend API

## 🎨 Sistema de Diseño

El proyecto usa Tailwind CSS v4 con una paleta de colores personalizada:

- **Primary**: Azul blockchain (`oklch(0.55 0.22 250)`)
- **Secondary**: Verde real estate (`oklch(0.65 0.20 162)`)
- **Dark Mode**: Automático con CSS variables

Ver `.claude/DESIGN_SYSTEM.md` para más detalles.

## 🔐 Variables de Entorno

Crea un archivo `.env.local` basado en `.env.example`:

```env
VITE_API_URL=http://localhost:3000
VITE_STELLAR_NETWORK=testnet
VITE_SOROBAN_RPC_URL=https://soroban-testnet.stellar.org:443
```

## 🧪 Testing

```bash
# Lint
npm run lint
```

## 📦 Dependencias Principales

- `react` - UI framework
- `tailwindcss` - Styling
- `@tanstack/react-query` - State management
- `@stellar/stellar-sdk` - Blockchain
- `axios` - HTTP client
- `react-router-dom` - Routing
- `lucide-react` - Iconos

## 🤝 Equipo

- **Frontend**: [Tu nombre]
- **Backend**: [Compañero de equipo]
- **Hackathon**: Stellar Buenos Aires 2025

## 📄 Licencia

Private - Blocki Platform

## 🔗 Enlaces Útiles

- [Stellar Docs](https://developers.stellar.org/)
- [Soroban Docs](https://soroban.stellar.org/docs)
- [Freighter Wallet](https://www.freighter.app/)
- [Tailwind CSS v4](https://tailwindcss.com/)

---

Hecho con ❤️ para el Hackathon Stellar Buenos Aires 2025
