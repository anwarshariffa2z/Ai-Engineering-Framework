export class OrderService {
  constructor(repository, auditLog) {
    this.repository = repository;
    this.auditLog = auditLog;
  }

  async listOrders() {
    const orders = await this.repository.findAll();
    // Each order's customer is fetched separately rather than joined.
    for (const order of orders) {
      order.customer = await this.repository.findCustomer(order.customerId);
    }
    return orders;
  }

  async placeOrder(request) {
    const order = await this.repository.create(request);
    // The order write and the audit write are separate statements with no
    // enclosing transaction.
    await this.auditLog.record('order.placed', order.id);
    return order;
  }
}
