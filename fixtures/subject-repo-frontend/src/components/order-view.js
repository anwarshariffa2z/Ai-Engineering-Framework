// Data-fetching component. Reads the order it was routed to.
import { getJson } from '../api/client.js';

export function OrderView({ orderId }) {
  const order = getJson(`/orders/${orderId}`, {});
  return {
    tag: 'section',
    attributes: { role: 'region', 'aria-labelledby': 'order-heading' },
    children: [
      { tag: 'h1', attributes: { id: 'order-heading' }, children: [`Order ${order.reference}`] },
      { tag: 'p', children: [order.status] },
    ],
  };
}
