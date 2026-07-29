// Domain layer. Holds the ordering rules and depends on no other layer.
export class OrderService {
  constructor(store) {
    this.store = store;
  }

  find(id) {
    return this.store.byId(id);
  }

  place(order) {
    if (!order.lines?.length) throw new Error('an order must carry at least one line');
    return this.store.append({ ...order, status: 'placed' });
  }
}
