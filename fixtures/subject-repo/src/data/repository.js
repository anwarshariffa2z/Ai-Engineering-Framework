// Data layer. Owns persistence. Holds no ordering rules.
export class InMemoryOrderStore {
  constructor() {
    this.orders = new Map();
  }

  byId(id) {
    return this.orders.get(id) ?? null;
  }

  append(order) {
    const id = String(this.orders.size + 1);
    this.orders.set(id, { id, ...order });
    return this.orders.get(id);
  }
}
