// Entry point. Starts the HTTP listener for the orders service.
import { createRouter } from './api/routes.js';
import { OrderService } from './domain/orders.js';
import { InMemoryOrderStore } from './data/repository.js';
import config from '../config/default.json' with { type: 'json' };

const store = new InMemoryOrderStore();
const service = new OrderService(store);
export const router = createRouter(service);

if (process.env.NODE_ENV !== 'test') {
  router.listen(config.port);
}
