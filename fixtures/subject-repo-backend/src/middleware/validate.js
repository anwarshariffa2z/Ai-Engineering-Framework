export function validate(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({ error: 'invalid request' });
      return;
    }
    req.body = result.data;
    next();
  };
}
