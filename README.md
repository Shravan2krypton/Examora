# 🎓 Online Examination System

A modern, feature-rich online examination platform built with the MERN stack, enhanced with beautiful UI/UX animations and responsive design.

## ✨ Features

### 🎯 Core Functionality
- **Role-based Authentication** (Student/Faculty)
- **Exam Creation & Management** with rich question banks
- **Timed Exams** with auto-submit functionality
- **Real-time Results** with instant evaluation
- **Live Leaderboard** with Socket.io integration
- **PDF Question Bank** upload and processing
- **Comprehensive Analytics** and performance tracking

### 🎨 Modern UI/UX Enhancements
- **Glassmorphism Design** with backdrop blur effects
- **Animated Components** using Framer Motion
- **Responsive Layout** optimized for all devices
- **Dark Mode Support** with smooth transitions
- **Micro-interactions** and hover effects
- **Loading States** and visual feedback
- **Professional Color Scheme** with gradients

### 📱 Responsive Features
- **Mobile-first Design** approach
- **Touch-friendly Interactions**
- **Adaptive Layouts** for desktop/tablet/mobile
- **Optimized Animations** for performance

## 🛠️ Tech Stack

### Frontend
- **React 18** with functional components and hooks
- **React Router** for client-side routing
- **TailwindCSS** for modern styling
- **Framer Motion** for animations
- **React Icons** for iconography
- **Axios** for API communication
- **Socket.io Client** for real-time features

### Backend
- **Node.js** with Express.js
- **Prisma ORM** for database operations
- **JWT Authentication** with role-based access
- **Socket.io** for real-time communication
- **Multer** for file uploads
- **PDF Processing** for question banks

### Database
- **Neon PostgreSQL** for cloud database
- **Schema** for users, exams, questions, results

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Shravan2krypton/Online-Exam-System.git
   cd Online-Exam-System
   ```

2. **Install dependencies**
   ```bash
   # Backend
   cd backend
   npm install
   
   # Frontend
   cd frontend
   npm install
   ```

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
