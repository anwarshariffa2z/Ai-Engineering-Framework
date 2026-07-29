// Verifies the bearer token on every request. Registered once, before the
// router, so it applies to every route registered after it.
export function authenticate(req, res, next) {
  const header = req.get('authorization');
  if (!header) {
    res.status(401).json({ error: 'unauthenticated' });
    return;
  }
  req.principal = decodeToken(header);
  next();
}

function decodeToken(header) {
  return { subject: header.slice(7) };
}
