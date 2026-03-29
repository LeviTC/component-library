# API — Component Library (Express + MongoDB + JWT)

**Base URL local (por defecto):** `http://localhost:4000`  
Todas las rutas bajo `/api/...` devuelven JSON salvo **export**, que devuelve un archivo descargable.

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| `GET` | `/` | — | Metadatos del servicio |
| `GET` | `/api/health` | — | Estado del API y conexión a MongoDB |
| `POST` | `/api/auth/register` | — | Alta de usuario + JWT |
| `POST` | `/api/auth/login` | — | Login + JWT |
| `POST` | `/api/auth/logout` | — | Confirmación UX (el cliente debe borrar el token) |
| `POST` | `/api/components/track` | — | Registrar evento de uso de componente |
| `GET` | `/api/components/stats` | — | Agregados para dashboard |
| `GET` | `/api/components/export` | **JWT** | Descarga CSV o JSON de eventos |

---

## Variables de entorno

Copia `.env.example` a `.env` y completa `MONGODB_URI` y `JWT_SECRET` (mínimo 16 caracteres).

---

## Ejemplos por endpoint

Sustituye `BASE` por tu URL (p. ej. `http://localhost:4000`). En Windows PowerShell puedes usar `curl.exe` igual que abajo.

### `GET /`

**200** — `{ "status": "ok", "service": "component-library-api" }`

```bash
curl -s BASE/
```

---

### `GET /api/health`

**200** — `{ "status": "ok", "database": "connected" | "disconnected" }`

```bash
curl -s BASE/api/health
```

---

### `POST /api/auth/register`

Body JSON:

```json
{ "email": "usuario@ejemplo.com", "password": "secreto123" }
```

**201** — `{ "token": "<jwt>", "user": { "id", "email" } }`  
**400** — validación  
**409** — correo ya registrado  

```bash
curl -s -X POST BASE/api/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"usuario@ejemplo.com\",\"password\":\"secreto123\"}"
```

---

### `POST /api/auth/login`

Body:

```json
{ "email": "usuario@ejemplo.com", "password": "secreto123" }
```

**200** — `{ "token": "<jwt>", "user": { "id", "email" } }`  
**401** — credenciales incorrectas  

```bash
curl -s -X POST BASE/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"usuario@ejemplo.com\",\"password\":\"secreto123\"}"
```

---

### `POST /api/auth/logout`

JWT es **stateless**: el servidor no invalida el token. El cliente debe borrar el token (p. ej. `localStorage`). Este endpoint solo confirma el flujo de cierre de sesión.

**200** — `{ "success": true, "message": "..." }`

```bash
curl -s -X POST BASE/api/auth/logout
```

(No exige cabecera `Authorization`; opcionalmente puedes enviarla si tu cliente la añade siempre.)

---

### Rutas con JWT

Para **export** (y cualquier ruta protegida que añadas), incluye:

```http
Authorization: Bearer <token>
```

---

### `POST /api/components/track` (público)

Campos obligatorios: `componentName`, `action` (strings no vacíos). Opcionales: `variant` (string), `metadata` (objeto).

```json
{
  "componentName": "Button",
  "variant": "primary",
  "action": "click",
  "metadata": { "elementId": "demo-submit" }
}
```

**201** — objeto creado con `id`, `componentName`, `variant`, `action`, `createdAt`  
**400** — validación  

```bash
curl -s -X POST BASE/api/components/track \
  -H "Content-Type: application/json" \
  -d "{\"componentName\":\"Button\",\"variant\":\"primary\",\"action\":\"click\",\"metadata\":{\"elementId\":\"demo-submit\"}}"
```

Ejemplo con `fetch` (navegador o Node 18+):

```js
await fetch(`${BASE}/api/components/track`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    componentName: 'Input',
    action: 'focus',
    variant: 'email',
  }),
});
```

---

### `GET /api/components/stats` (público)

Agregados para el panel del demo. Sin query params.

**200** — ejemplo:

```json
{
  "totalEvents": 42,
  "byComponent": [{ "name": "Button", "count": 20 }],
  "byAction": [{ "action": "click", "count": 18 }],
  "lastEvent": {
    "at": "2026-03-28T12:00:00.000Z",
    "componentName": "Input",
    "action": "blur",
    "variant": "email"
  },
  "updatedAt": "2026-03-28T12:00:01.000Z"
}
```

```bash
curl -s BASE/api/components/stats
```

---

### `GET /api/components/export` (JWT)

Cabecera obligatoria: `Authorization: Bearer <token>`.

Query:

| Parámetro | Valores | Default |
|-----------|---------|---------|
| `format` | `csv` \| `json` | `csv` |
| `limit` | número (máx. 20000) | `5000` |

**200** — cuerpo archivo (`Content-Disposition`: `component-tracking.csv` o `.json`)  
**401** — sin token o token inválido  

```bash
TOKEN="<pega_aquí_el_jwt>"

curl -s -o tracking.json "BASE/api/components/export?format=json&limit=100" \
  -H "Authorization: Bearer $TOKEN"
```

CSV por defecto:

```bash
curl -s -o tracking.csv "BASE/api/components/export" \
  -H "Authorization: Bearer $TOKEN"
```

---

## Ejecutar el servidor

```bash
npm install
cp .env.example .env
# Edita .env
npm run dev
```

Middleware JWT: `src/middleware/authMiddleware.js` (`authenticateToken`).
