require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const authRoutes = require('./routes/auth');
const componentsRoutes = require('./routes/components');

const app = express();
const PORT = Number(process.env.PORT) || 4000;
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:3000';

app.use(
  cors({
    origin: CORS_ORIGIN,
    credentials: true,
  }),
);
app.use(express.json({ limit: '1mb' }));

app.use((req, _res, next) => {
  console.log(`[http] ${req.method} ${req.path}`);
  next();
});

app.get('/', (_req, res) => {
  res.json({ status: 'ok', service: 'component-library-api' });
});

app.get('/api/health', (_req, res) => {
  const db =
    mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  res.json({ status: 'ok', database: db });
});

app.use('/api/auth', authRoutes);
app.use('/api/components', componentsRoutes);

app.use((req, res) => {
  res.status(404).json({ message: `Ruta no encontrada: ${req.method} ${req.path}` });
});


app.use((err, _req, res, _next) => {
  console.error('[error]', err);
  const status = err.statusCode || err.status || 500;
  const message =
    status === 500 ? 'Error interno del servidor' : err.message || 'Error';
  res.status(status).json({ message });
});

async function start() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('Falta MONGODB_URI en .env (copia .env.example)');
    process.exit(1);
  }
  if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 16) {
    console.error('JWT_SECRET debe tener al menos 16 caracteres');
    process.exit(1);
  }

  try {
    await mongoose.connect(uri);
    console.log('[db] MongoDB conectado');
  } catch (e) {
    console.error('[db] Error de conexión:', e.message);
    process.exit(1);
  }

  app.listen(PORT, () => {
    console.log(`Backend http://localhost:${PORT}`);
    console.log(`CORS origin: ${CORS_ORIGIN}`);
  });
}

start();
