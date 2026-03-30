function badRequest(res, message) {
  return res.status(400).json({ message });
}

function validateTrackBody(req, res, next) {
  const { componentName, action, variant, metadata } = req.body ?? {};

  if (typeof componentName !== 'string' || !componentName.trim()) {
    return badRequest(res, 'componentName es obligatorio');
  }
  if (typeof action !== 'string' || !action.trim()) {
    return badRequest(res, 'action es obligatorio');
  }
  if (variant != null && typeof variant !== 'string') {
    return badRequest(res, 'variant debe ser texto');
  }
  if (metadata != null && typeof metadata !== 'object') {
    return badRequest(res, 'metadata debe ser un objeto');
  }

  req.body = {
    componentName: componentName.trim(),
    action: action.trim(),
    ...(variant != null && String(variant).trim()
      ? { variant: String(variant).trim() }
      : {}),
    ...(metadata != null ? { metadata } : {}),
  };
  next();
}

module.exports = { validateTrackBody };
