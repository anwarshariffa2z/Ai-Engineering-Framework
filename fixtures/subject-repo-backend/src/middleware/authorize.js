import config from '../../config/default.json' with { type: 'json' };

// Whether tenant scoping is enforced depends on an environment value read at
// startup. With the flag unset the request proceeds unscoped.
export function requireTenantScope(req, res, next) {
  if (config.requireTenantScope !== 'true') {
    next();
    return;
  }
  if (!req.principal?.tenant) {
    res.status(403).json({ error: 'forbidden' });
    return;
  }
  next();
}
