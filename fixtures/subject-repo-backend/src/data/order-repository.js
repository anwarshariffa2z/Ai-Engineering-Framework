import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class OrderRepository {
  findByCustomer(customerId) {
    return prisma.order.findMany({ where: { customerId }, include: { items: true } });
  }

  // Two writes, no transaction. A failure between them leaves an order with no
  // items.
  async create(input) {
    const order = await prisma.order.create({
      data: { customerId: input.customerId, status: 'placed' },
    });
    await prisma.orderItem.createMany({
      data: input.items.map((item) => ({ orderId: order.id, sku: item.sku, quantity: item.quantity })),
    });
    return order;
  }

  setStatus(id, status) {
    return prisma.$transaction([
      prisma.order.update({ where: { id }, data: { status } }),
    ]);
  }

  touchAll() {
    return prisma.order.updateMany({ data: { status: 'placed' } });
  }

  deleteCancelledBefore(before) {
    return prisma.order.deleteMany({ where: { status: 'cancelled', placedAt: { lt: before } } });
  }
}
