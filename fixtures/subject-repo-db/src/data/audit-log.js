import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class AuditLog {
  async record(action, subjectId) {
    return prisma.auditEvent.create({
      data: { actor: 'service', action, payload: JSON.stringify({ subjectId }) },
    });
  }
}
