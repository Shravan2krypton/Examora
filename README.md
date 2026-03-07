# Online Examination System

A full-stack online exam platform built with React, Express, Node.js, and Neon PostgreSQL. Faculty can create exams and upload question banks; students take timed tests with automatic evaluation and real-time leaderboards.

## Tech Stack

- **Frontend**: React, TailwindCSS, React Router, Axios, Socket.io-client
- **Backend**: Node.js, Express.js, JWT, bcrypt
- **Database**: Neon PostgreSQL
- **ORM**: Prisma

## Setup

### 1. Neon Database

1. Create a free account at [neon.tech](https://neon.tech)
2. Create a new project and copy the connection string
3. In `backend/.env`, set:
   ```
   DATABASE_URL="your-neon-connection-string"
   JWT_SECRET="your-secret-key"
   PORT=5000
   ```

### 2. Backend

```bash
cd backend
npm install
npx prisma generate
npx prisma db push
npm run db:seed
npm run dev
```

The seed creates a faculty account:
- **Email**: faculty@exam.com
- **Password**: faculty123

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:3000

## Demo Flow

1. **Faculty**: Login with faculty@exam.com / faculty123
2. Create an exam (title, subject, time limit, dates)
3. Add questions with correct answers
4. Upload a PDF question bank (optional)
5. **Student**: Register a new account
6. Take an exam (timer, auto-save answers, auto-submit when time ends)
7. View results and leaderboard
8. Leaderboard updates in real-time via Socket.io

## Features

- JWT authentication with role-based access (Faculty / Student)
- Timed exams with countdown and 1-minute warning
- Auto-submit when time expires
- Instant score calculation
- Real-time leaderboard (Socket.io)
- Question bank PDF upload and viewing
- Dark mode
- Mobile responsive

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/login | Login |
| POST | /api/auth/register | Student registration |
| POST | /api/exams/create | Create exam (Faculty) |
| GET | /api/exams | List exams |
| GET | /api/exams/:id | Get exam |
| GET | /api/exams/:id/attempt | Get exam for attempt (Student) |
| POST | /api/questions/add | Add question |
| POST | /api/questions/add-bulk | Add bulk questions |
| GET | /api/questions/:examId | Get questions |
| POST | /api/exam/start | Start exam |
| POST | /api/exam/save-answer | Save answer |
| POST | /api/exam/submit | Submit exam |
| GET | /api/results/student/:id | Student results |
| GET | /api/results/detail/:examId | Result detail |
| GET | /api/results/leaderboard/:examId | Leaderboard |
| POST | /api/questionbank/upload | Upload PDF |
| GET | /api/questionbank | List question banks |
