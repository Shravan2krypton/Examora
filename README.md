# Online Examination System (Next.js 14 Conversion)

This project has been modernized and converted from a MERN stack to a full-stack **Next.js 14** application.

## 🚀 Tech Stack
- **Framework**: Next.js 14 (App Router)
- **Database**: Neon Serverless PostgreSQL
- **ORM**: Drizzle ORM
- **Styling**: Tailwind CSS (with Dark Mode)
- **Authentication**: Custom JWT with `jose` (Edge-compatible middleware)

## 🏗 OOP Principles Implemented
The application's backend logic adheres to Object-Oriented Programming (OOP) concepts, mapped into Next.js Server Actions and Services:
- **Classes**: Domain models (`User`, `Admin`, `Student`) encapsulate core logic.
- **Inheritance & Polymorphism**: `Admin` and `Student` inherit from `User`, implementing custom `getDashboardData()` logic.
- **Interfaces**: Strongly typed DB interactions (`IUser`, `IQuestion`, `IExam`, `IResult`).
- **Abstract Classes**: `BaseService<T>` and `AbstractEvaluator` provide core implementations.
- **Exception Handling**: Custom error classes (`AuthError`, `ExamNotFoundError`).

## ⚙️ Local Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Variables**
   Rename `.env.example` to `.env` and add your Neon Postgres URL:
   ```env
   DATABASE_URL="your-neon-postgres-url"
   JWT_SECRET="your-super-secret-key"
   ```

3. **Database Migrations**
   ```bash
   npm run db:generate
   npm run db:push
   ```

4. **Seed Database**
   You can manually add an admin user or create a seed script using Drizzle to quickly add:
   ```sql
   INSERT INTO users (name, email, password, role) VALUES ('Admin', 'admin@example.com', '<bcrypt_hash_of_password>', 'admin');
   INSERT INTO users (name, email, password, role) VALUES ('Student', 'student@example.com', '<bcrypt_hash_of_password>', 'student');
   ```

5. **Run Development Server**
   ```bash
   npm run dev
   ```

## ☁️ Vercel Deployment
1. Push your code to GitHub.
2. Import the project in Vercel.
3. Under Environment Variables, add `DATABASE_URL` and `JWT_SECRET`.
4. Deploy! Next.js is natively supported by Vercel.
