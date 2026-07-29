import { OrderRepository } from '../data/order-repository.js';

const repository = new OrderRepository();

export async function reindex(req, res) {
  await repository.touchAll();
  res.status(204).end();
}

export async function purge(req, res) {
  await repository.deleteCancelledBefore(req.body.before);
  res.status(204).end();
}
