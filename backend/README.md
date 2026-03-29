# API — autenticación JWT

## Variables de entorno

Copia `.env.example` a `.env` y completa `MONGODB_URI` y `JWT_SECRET` (mínimo 16 caracteres).

## Endpoints

### `POST /api/auth/register`

Registro. Body JSON:

```json
{ "email": "usuario@ejemplo.com", "password": "secreto123" }
```

**201** — `{ "token": "<jwt>", "user": { "id", "email" } }`  
**400** — validación  
**409** — correo ya registrado  

### `POST /api/auth/login`

Login. Body:

```json
{ "email": "usuario@ejemplo.com", "password": "secreto123" }
```

**200** — `{ "token": "<jwt>", "user": { "id", "email" } }`  
**401** — credenciales incorrectas  

### `POST /api/auth/logout`

JWT es **stateless**: no invalida el token en servidor. El cliente debe borrar el token (p. ej. `localStorage`). Respuesta **200**: `{ "success": true, "message": "..." }`.

### Rutas protegidas

Para endpoints que añadas con JWT, envía:

```http
Authorization: Bearer <token>
```

Middleware: `authenticateToken` en `src/middleware/authMiddleware.js` (p. ej. `GET /api/components/export`).

---

## Salud

### `GET /api/health`

**200** — `{ "status": "ok", "database": "connected" | "disconnected" }`

---

## Componentes y analíticas

### `POST /api/components/track` (público)

Registra un evento de uso. Body JSON (validado por middleware):

```json
{
  "componentName": "Button",
  "variant": "primary",
  "action": "click",
  "metadata": { "optional": true }
}
```

**201** — objeto creado con `id`, `componentName`, `variant`, `action`, `createdAt`  
**400** — validación  

### `GET /api/components/stats` (público)

Agregados para el dashboard del demo.

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

### `GET /api/components/export` (JWT)

Exporta eventos de tracking. Cabecera: `Authorization: Bearer <token>`.

Query:

- `format`: `csv` (defecto) o `json`
- `limit`: opcional (máx. 20000, defecto 5000)

**200** — archivo adjunto (`component-tracking.csv` o `.json`)  
**401** — sin token o token inválido

Ejemplo:

```http
GET /api/components/export?format=json
Authorization: Bearer <jwt>
```

## Ejecutar

```bash
npm install
cp .env.example .env
# Edita .env
npm run dev
```
