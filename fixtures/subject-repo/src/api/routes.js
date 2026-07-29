// Interface layer. Translates transport concerns into domain calls.
// Depends on the domain layer. Must not depend on the data layer.
import { Router } from 'tiny-router';

export function createRouter(service) {
  const router = new Router();
  router.get('/orders/:id', (req) => service.find(req.params.id));
  router.post('/orders', (req) => service.place(req.body));
  return router;
}
