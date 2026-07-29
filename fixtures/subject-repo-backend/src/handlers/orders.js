import { OrderRepository } from '../data/order-repository.js';
import { charge } from '../clients/payments.js';
import { notify } from '../clients/notifications.js';

const repository = new OrderRepository();

export async function listOrders(req, res) {
  const orders = await repository.findByCustomer(req.query.customerId);
  res.json(orders);
}

export async function placeOrder(req, res) {
  const order = await repository.create(req.body);
  await charge(order.id, req.body.amount);
  await notify(order.customerId, 'order-placed');
  res.status(201).json({ id: order.id });
}

export async function cancelOrder(req, res) {
  await repository.setStatus(req.params.id, 'cancelled');
  res.status(204).end();
}
