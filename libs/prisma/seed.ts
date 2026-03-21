import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { PrismaClient } from './src/generated/client';
import * as bcrypt from 'bcrypt';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  // Roles
  const userRole = await prisma.role.upsert({
    where: { name: 'user' },
    update: {},
    create: { name: 'user' },
  });

  const adminRole = await prisma.role.upsert({
    where: { name: 'admin' },
    update: {},
    create: { name: 'admin' },
  });

  await prisma.role.upsert({
    where: { name: 'moderator' },
    update: {},
    create: { name: 'moderator' },
  });

  // Accounts
  const adminPassword = await bcrypt.hash('admin1234', 10);
  await prisma.user.upsert({
    where: { email: 'admin@test.com' },
    update: {},
    create: {
      email: 'admin@test.com',
      password: adminPassword,
      roles: { connect: { id: adminRole.id } },
    },
  });

  const userPassword = await bcrypt.hash('user1234', 10);
  await prisma.user.upsert({
    where: { email: 'user@test.com' },
    update: {},
    create: {
      email: 'user@test.com',
      password: userPassword,
      roles: { connect: { id: userRole.id } },
    },
  });

  console.log('Seed complete');
  console.log('admin@test.com / admin1234');
  console.log('user@test.com / user1234');
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
