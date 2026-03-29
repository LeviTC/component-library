const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { asyncHandler } = require('../utils/asyncHandler');
const { validateRegister, validateLogin } = require('../middleware/validateAuth');

const router = express.Router();
const SALT_ROUNDS = 10;

function signToken(user) {
  const secret = process.env.JWT_SECRET;
  const expiresIn = process.env.JWT_EXPIRES_IN || '7d';
  return jwt.sign(
    { sub: String(user._id), email: user.email },
    secret,
    { expiresIn },
  );
}

/**
 * POST /api/auth/register
 */
router.post(
  '/register',
  validateRegister,
  asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    let user;
    try {
      user = await User.create({ email, passwordHash });
    } catch (err) {
      if (err.code === 11000) {
        return res.status(409).json({ message: 'Ya existe una cuenta con ese correo' });
      }
      throw err;
    }

    const token = signToken(user);
    console.log(`[auth] registro ok: ${email}`);
    return res.status(201).json({
      token,
      user: { id: String(user._id), email: user.email },
    });
  }),
);

/**
 * POST /api/auth/login
 */
router.post(
  '/login',
  validateLogin,
  asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+passwordHash');
    if (!user) {
      return res.status(401).json({ message: 'Correo o contraseña incorrectos' });
    }

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) {
      return res.status(401).json({ message: 'Correo o contraseña incorrectos' });
    }

    const token = signToken(user);
    console.log(`[auth] login ok: ${email}`);
    return res.json({
      token,
      user: { id: String(user._id), email: user.email },
    });
  }),
);

/**
 * POST /api/auth/logout
 * JWT es stateless: el cliente debe borrar el token.
 * Este endpoint confirma cierre de sesión en la API (útil para UX / logs).
 */
router.post('/logout', (_req, res) => {
  console.log('[auth] logout (cliente debe eliminar el token)');
  return res.json({ success: true, message: 'Sesión cerrada en el cliente' });
});

module.exports = router;
