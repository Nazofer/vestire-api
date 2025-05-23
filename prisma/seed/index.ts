import { PrismaClient } from '@prisma/client';
import { seedRoles } from './roles';

const prisma = new PrismaClient();

async function main() {
  try {
    await seedRoles(prisma);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
