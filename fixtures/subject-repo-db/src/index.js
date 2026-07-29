import { createRouter } from './api/routes.js';
import { OrderService } from './domain/orders.js';
import { OrderRepository } from './data/order-repository.js';
import { AuditLog } from './data/audit-log.js';
import config from '../config/default.json' with { type: 'json' };

const repository = new OrderRepository();
const auditLog = new AuditLog();
const service = new OrderService(repository, auditLog);
const router = createRouter(service);

if (process.env.NODE_ENV !== 'test') {
  router.listen(config.port);
}

export { router };
