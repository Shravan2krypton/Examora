import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('faculty123', 10);

  const faculty = await prisma.user.upsert({
    where: { email: 'faculty@exam.com' },
    update: {},
    create: {
      name: 'Faculty Admin',
      email: 'faculty@exam.com',
      password: hashedPassword,
      role: 'faculty'
    }
  });

  console.log('Seed completed. Faculty account:', faculty.email);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
