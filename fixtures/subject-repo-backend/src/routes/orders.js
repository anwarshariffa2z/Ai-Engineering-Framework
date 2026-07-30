import { listOrders, placeOrder, cancelOrder } from '../handlers/orders.js';
import { validate } from '../middleware/validate.js';
import { placeOrderSchema } from '../handlers/schemas.js';

export function registerOrderRoutes(app) {
  app.get('/orders', listOrders);
  app.post('/orders', validate(placeOrderSchema), placeOrder);
  app.post('/orders/:id/cancel', cancelOrder);
}
