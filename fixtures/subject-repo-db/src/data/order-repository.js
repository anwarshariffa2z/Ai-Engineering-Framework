import { PrismaClient } from '@prisma/client';
import Redis from 'ioredis';
import database from '../../config/database.json' with { type: 'json' };

const prisma = new PrismaClient();
const cache = new Redis(database.cache.url);

export class OrderRepository {
  async findAll() {
    return prisma.order.findMany();
  }

  async findByStatus(status) {
    return prisma.order.findMany({ where: { status } });
  }

  async findCustomer(customerId) {
    const cached = await cache.get(`customer:${customerId}`);
    if (cached) return JSON.parse(cached);
    const customer = await prisma.customer.findUnique({ where: { id: customerId } });
    await cache.set(`customer:${customerId}`, JSON.stringify(customer));
    return customer;
  }

  async searchByReference(reference) {
    return prisma.$queryRawUnsafe(`SELECT * FROM "Order" WHERE id = '${reference}'`);
  }

  async create(request) {
    return prisma.order.create({ data: request });
  }
}
