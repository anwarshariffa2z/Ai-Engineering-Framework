export function createRouter(service) {
  return {
    listen(port) {
      return { port, routes: ['GET /orders', 'GET /orders/:id', 'POST /orders'] };
    },
    async listOrders() {
      return service.listOrders();
    },
    async placeOrder(request) {
      return service.placeOrder(request);
    },
  };
}
