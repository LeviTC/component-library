const jwt = require('jsonwebtoken');

/**
 * Requiere header Authorization: Bearer <token>
 * Asigna req.user = { sub, email, iat, exp }
 */
function authenticateToken(req, res, next) {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    console.error('[auth] JWT_SECRET no configurado');
    return res.status(500).json({ message: 'Error de configuración del servidor' });
  }

  const authHeader = req.headers.authorization;
  const parts = typeof authHeader === 'string' ? authHeader.split(' ') : [];
  const token = parts.length === 2 && parts[0] === 'Bearer' ? parts[1] : null;

  if (!token) {
    return res.status(401).json({ message: 'Token requerido (Authorization: Bearer …)' });
  }

  try {
    const payload = jwt.verify(token, secret);
    req.user = payload;
    next();
  } catch (err) {
    console.warn('[auth] JWT inválido:', err.message);
    return res.status(403).json({ message: 'Token inválido o expirado' });
  }
}

module.exports = { authenticateToken };
