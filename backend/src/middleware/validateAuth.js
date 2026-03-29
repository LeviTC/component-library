const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function badRequest(res, message) {
  return res.status(400).json({ message });
}

/**
 * Valida body de registro: email y password.
 */
function validateRegister(req, res, next) {
  const { email, password } = req.body ?? {};
  if (typeof email !== 'string' || !email.trim()) {
    return badRequest(res, 'El correo es obligatorio');
  }
  if (!EMAIL_RE.test(email.trim())) {
    return badRequest(res, 'Correo no válido');
  }
  if (typeof password !== 'string' || password.length < 6) {
    return badRequest(res, 'La contraseña debe tener al menos 6 caracteres');
  }
  if (password.length > 128) {
    return badRequest(res, 'La contraseña es demasiado larga');
  }
  req.body.email = email.trim().toLowerCase();
  next();
}

/**
 * Valida body de login.
 */
function validateLogin(req, res, next) {
  const { email, password } = req.body ?? {};
  if (typeof email !== 'string' || !email.trim()) {
    return badRequest(res, 'El correo es obligatorio');
  }
  if (typeof password !== 'string' || !password.length) {
    return badRequest(res, 'La contraseña es obligatoria');
  }
  req.body.email = email.trim().toLowerCase();
  next();
}

module.exports = { validateRegister, validateLogin };
