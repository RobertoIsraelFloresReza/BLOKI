# Blocki - Stellar Property Tokenization Platform 🏠✨

[![Stellar](https://img.shields.io/badge/Stellar-Network-blue)](https://stellar.org/)
[![React](https://img.shields.io/badge/React-19.2.0-blue)](https://reactjs.org/)
[![TanStack Query](https://img.shields.io/badge/TanStack_Query-5.90-orange)](https://tanstack.com/query)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1-38bdf8)](https://tailwindcss.com/)

> **Tokeniza propiedades inmobiliarias en la red Stellar con un solo clic**

Una plataforma moderna de tokenización inmobiliaria que permite comprar, vender e invertir en propiedades fraccionales utilizando la blockchain de Stellar.

[Ver documentación completa de integración →](./INTEGRATION_GUIDE.md)

---

## 🚀 Quick Start

### 1. Clonar e instalar

```bash
cd blocki-stellar-web-app
npm install
```

### 2. Configurar .env

```bash
cp .env.example .env
```

Edita `.env`:

```env
VITE_API_URL=http://localhost:3000
VITE_USE_MOCK_DATA=false
```

### 3. Iniciar backend

```bash
cd ../blocki-service/service-blocki
npm run start:dev
```

### 4. Iniciar frontend

```bash
npm run dev
```

Abre [http://localhost:5173](http://localhost:5173)

---

## ✅ Estado de Integración

### Completado (100%)
- ✅ **Servicios API** - Axios client con interceptors (6 servicios)
- ✅ **Hooks TanStack Query** - useAuth, useProperties, useMarketplace, etc.
- ✅ **AuthPage** - Login y registro con backend real
- ✅ **Marketplace** - Listado de propiedades con datos reales
- ✅ **PropertyUploadForm** - CRUD completo de propiedades
- ✅ **Error handling** - Manejo global de errores con toasts
- ✅ **Loading states** - Estados de carga en todos los componentes
- ✅ **Image uploads** - Subida de imágenes multipart/form-data

### Pendiente (Opcional)
- ⏳ **WalletPage** - Integración con wallet balance real
- ⏳ **ProfilePage** - Datos de ownership desde backend
- ⏳ **PropertyDetails** - Compra real de tokens (requiere Stellar SDK)
- ⏳ **Freighter Wallet** - Integración completa

---

## 📚 Documentación

- [**INTEGRATION_GUIDE.md**](./INTEGRATION_GUIDE.md) - Guía completa de integración
- [**Backend API Docs**](../blocki-service/service-blocki/docs/frontend/)

---

## 🏗️ Arquitectura

```
Frontend (React + TanStack Query)
    ↓ HTTP Requests (Axios)
Backend (NestJS API)
    ↓ SQL Queries (Prisma)
PostgreSQL Database
    ↓ Blockchain Operations
Stellar Network (Soroban)
```

---

**Made for Buenos Aires 2025 Stellar Hackathon** 🚀
