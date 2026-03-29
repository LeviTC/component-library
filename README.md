# Component Library — examen técnico

Monorepo con **Next.js (TypeScript)** en `frontend/` y **Express + MongoDB + JWT** en `backend/`. Incluye una librería de componentes (Button, Input, Modal, Card) con **tracking automático** hacia el API, página demo con **estadísticas en tiempo real**, **exportación CSV/JSON** (con JWT, tras iniciar sesión) y **login/registro**.

## Requisitos

- Node.js 20+ (recomendado)
- Cuenta MongoDB Atlas (URI en `backend/.env`)

## Puesta en marcha (rápida)

### Instalar dependencias (backend + frontend)

Desde la **raíz** del repositorio, un solo comando instala `concurrently` en la raíz y las dependencias de `backend/` y `frontend/`:

```bash
npm install
```

- Si instalaste con **`npm install --ignore-scripts`** (o tu entorno tiene desactivados los *lifecycle scripts* de npm), no se ejecutará `postinstall`. En ese caso, desde la raíz ejecuta **`npm run install:all`** para instalar `backend/` y `frontend/`.
- Para comprobar si npm ejecutará scripts al instalar: **`npm config get ignore-scripts`**. Si devuelve **`false`** (valor por defecto), los scripts como `postinstall` se ejecutan; si devuelve **`true`**, revísalo en `.npmrc` del proyecto o de tu usuario (`ignore-scripts=true`).
- Si prefieres no depender de `postinstall`, puedes omitirlo y usar solo **`npm run install:all`** después de `npm install` en la raíz.

### 1. Backend

```bash
cp backend/.env.example backend/.env
```

Edita `backend/.env`: `MONGODB_URI`, `JWT_SECRET` (≥16 caracteres), y opcionalmente `CORS_ORIGIN` (por defecto `http://localhost:3000`).

```bash
npm run dev:backend
```

(o `cd backend && npm run dev`)

El API queda en `http://localhost:4000`. Comprueba `GET http://localhost:4000/api/health`.

### 2. Frontend

```bash
cp frontend/.env.example frontend/.env.local
```

Ajusta `NEXT_PUBLIC_API_URL` si el backend no está en `http://localhost:4000`.

```bash
npm run dev:frontend
```

(o `cd frontend && npm run dev`)

**Ambos a la vez** (desde la raíz): `npm run dev`.

Abre `http://localhost:3000`: verás el showcase, el panel de estadísticas (polling al API) y enlaces a **Iniciar sesión** / **Registro**. Tras **iniciar sesión**, usa **Exportar CSV** / **Exportar JSON** en el panel de estadísticas (JWT requerido).

### Tests (frontend)

```bash
npm test --prefix frontend
```

Cobertura:

```bash
npm run test:coverage --prefix frontend
```

## Estructura

| Ruta | Descripción |
|------|-------------|
| `frontend/components/library/` | Componentes exportados desde `components/library/index.ts` |
| `frontend/lib/design-tokens.ts` | Tokens (colores, espaciado, tipografía, radios) |
| `frontend/lib/component-analytics-context.tsx` | Provider de tracking (`POST /api/components/track`) |
| `backend/src/routes/components.js` | Track, stats, export |
| `backend/README.md` | **Documentación completa de la API** (tabla de rutas, respuestas y ejemplos `curl`/`fetch` por endpoint) |

