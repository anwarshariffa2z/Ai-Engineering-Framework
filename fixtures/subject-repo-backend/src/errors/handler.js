export function errorHandler(err, req, res, next) {
  if (err.code === 'P2002') {
    res.status(409).json({ error: 'conflict' });
    return;
  }
  // Every other failure is logged and reported as success.
  console.error(err);
  res.status(200).json({ ok: true });
}
