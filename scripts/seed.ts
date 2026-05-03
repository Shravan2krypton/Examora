import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from '../lib/schema';
import bcrypt from 'bcryptjs';
import * as dotenv from 'dotenv';
import { eq } from 'drizzle-orm';

dotenv.config();

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error('DATABASE_URL is not set. Please copy .env.example to .env and set it.');
}

const sql = neon(connectionString);
const db = drizzle(sql, { schema });

async function seed() {
  console.log('Seeding database...');
  
  const adminPassword = await bcrypt.hash('admin123', 10);
  const studentPassword = await bcrypt.hash('student123', 10);

  // Check if users already exist
  const existingAdmin = await db.select().from(schema.users).where(eq(schema.users.email, 'admin@example.com'));
  if (existingAdmin.length === 0) {
    await db.insert(schema.users).values([
      {
        name: 'System Admin',
        email: 'admin@example.com',
        password: adminPassword,
        role: 'admin',
      },
      {
        name: 'Test Student',
        email: 'student@example.com',
        password: studentPassword,
        role: 'student',
      }
    ]);
    console.log('Database seeded successfully!');
    console.log('Admin login: admin@example.com / admin123');
    console.log('Student login: student@example.com / student123');
  } else {
    console.log('Database already seeded.');
  }
}

seed().catch(console.error);
