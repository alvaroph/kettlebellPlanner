// server/api/programs/current.get.js
import pkg from '@prisma/client';
const { PrismaClient } = pkg;
const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const program = await prisma.program.findFirst({
    where: { active: true },
    orderBy: { createdAt: 'desc' },
    include: {
      sessions: {
        orderBy: [{ weekIndex: 'asc' }, { dayIndex: 'asc' }]
      }
    }
  });

  return program;
});
