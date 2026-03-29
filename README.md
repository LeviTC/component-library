# Component Library — examen técnico

Monorepo con **Next.js (TypeScript)** en `frontend/` y **Express + MongoDB + JWT** en `backend/`. Incluye una librería de componentes (Button, Input, Modal, Card) con **tracking automático** hacia el API, página demo con **estadísticas en tiempo real**, **exportación CSV/JSON** (con JWT, tras iniciar sesión) y **login/registro**.

## Requisitos

- Node.js 20+ (recomendado)
- Cuenta MongoDB Atlas (URI en `backend/.env`)

## Puesta en marcha (rápida)

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env
```

Edita `backend/.env`: `MONGODB_URI`, `JWT_SECRET` (≥16 caracteres), y opcionalmente `CORS_ORIGIN` (por defecto `http://localhost:3000`).

```bash
npm run dev
```

El API queda en `http://localhost:4000`. Comprueba `GET http://localhost:4000/api/health`.

### 2. Frontend

En otra terminal:

```bash
cd frontend
npm install
cp .env.example .env.local
```

Ajusta `NEXT_PUBLIC_API_URL` si el backend no está en `http://localhost:4000`.

```bash
npm run dev
```

Abre `http://localhost:3000`: verás el showcase, el panel de estadísticas (polling al API) y enlaces a **Iniciar sesión** / **Registro**. Tras **iniciar sesión**, usa **Exportar CSV** / **Exportar JSON** en el panel de estadísticas (JWT requerido).

### Tests (frontend)

```bash
cd frontend
npm test
```

Cobertura:

```bash
npm run test:coverage
```

## Estructura

| Ruta | Descripción |
|------|-------------|
| `frontend/components/library/` | Componentes exportados desde `components/library/index.ts` |
| `frontend/lib/design-tokens.ts` | Tokens (colores, espaciado, tipografía, radios) |
| `frontend/lib/component-analytics-context.tsx` | Provider de tracking (`POST /api/components/track`) |
| `backend/src/routes/components.js` | Track, stats, export |
| `backend/README.md` | Documentación detallada de la API |

