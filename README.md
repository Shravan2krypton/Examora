# 🎓 Examora - Online Examination System

<div align="center">

![Examora Logo](https://img.shields.io/badge/Examora-Online%20Exams-blue?style=for-the-badge&logo=education)

A modern, feature-rich online examination platform built with MERN stack, enhanced with beautiful UI/UX animations and responsive design.

[🚀 Live Demo](https://examora-puce.vercel.app/) • [📖 Documentation](#-readme) • [⭐ Star](https://github.com/Shravan2krypton/Examora) • [🍴 Fork](https://github.com/Shravan2krypton/Examora/fork)

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)

</div>

## 📜 License

```
MIT License

Copyright (c) 2024 Examora

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense,
and/or sell copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
DEALINGS IN THE SOFTWARE.
```

## ✨ Features

### 🎯 Core Functionality
- **Role-based Authentication** (Student/Faculty)
- **Exam Creation & Management** with rich question banks
- **Timed Exams** with auto-submit functionality
- **Real-time Results** with instant evaluation
- **Live Leaderboard** with real-time updates
- **PDF Question Bank** upload and processing
- **Comprehensive Analytics** and performance tracking

### 🎨 Modern UI/UX Enhancements
- **Glassmorphism Design** with backdrop blur effects
- **Animated Components** using Framer Motion
- **Responsive Layout** optimized for all devices
- **Dark Mode Support** with smooth transitions
- **Micro-interactions** and hover effects
- **Professional Color Scheme** with gradients
- **Loading States** and visual feedback

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

### Backend
- **Node.js** with Express.js
- **PostgreSQL** with Neon cloud database
- **JWT Authentication** with role-based access
- **Multer** for file uploads
- **PDF Processing** for question banks
- **Socket.io** for real-time communication

### Database
- **Neon PostgreSQL** for cloud database
- **Schema** for users, exams, questions, results
- **Migrations** for database structure
- **Connection Pooling** for performance

## 🚀 Live Demo

**🌐 Try Examora Now:** [https://examora-puce.vercel.app/](https://examora-puce.vercel.app/)

### Test Credentials
- **Faculty Login:** `faculty@test.com` / `test123456`
- **Student Login:** `student@test.com` / `test123456`

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- Git
- PostgreSQL (Neon recommended)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Shravan2krypton/Examora.git
   cd Examora
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

3. **Environment Setup**
   ```bash
   # Backend .env
   PORT=5000
   DATABASE_URL=postgresql://your_neon_database_url
   JWT_SECRET=online_exam_system_2024_secure_key_for_authentication
   FRONTEND_URL=http://localhost:3000
   NODE_ENV=development
   
   # Frontend .env (optional)
   VITE_API_URL=http://localhost:5000/api
   ```

4. **Run the application**
   ```bash
   # Backend (Terminal 1)
   cd backend
   npm start
   
   # Frontend (Terminal 2)
   cd frontend
   npm run dev
   ```

5. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000/api

## 🎯 Features

### Authentication
- JWT authentication with role-based access (Faculty / Student)
- Secure password hashing with bcrypt
- Session management with token expiration
- Protected routes with middleware

### Exam Management
- Create exams with title, description, duration
- Add single or bulk questions
- Multiple choice questions (A, B, C, D)
- Question bank PDF upload and parsing
- Exam scheduling and availability

### Student Experience
- View available exams with filtering
- Timed exam interface with countdown
- Real-time answer saving
- Auto-submit when timer expires
- Instant score calculation
- Detailed results and analytics

### Faculty Experience
- Exam creation wizard
- Question management interface
- Bulk question import
- PDF upload and processing
- Student results monitoring
- Performance analytics

### UI/UX Features
- Modern glassmorphism design
- Smooth animations and transitions
- Dark mode support
- Mobile responsive layout
- Loading states and feedback
- Interactive components
- Professional color scheme

## 📚 API Documentation

### Authentication Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/login | User login |
| POST | /api/auth/register | User registration |
| GET | /api/health | Health check |

### Exam Management Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/exams | List all exams |
| POST | /api/exams/create | Create exam (Faculty) |
| GET | /api/exams/:id | Get exam details |
| POST | /api/exam/start | Start exam (Student) |
| POST | /api/exam/save-answer | Save answer |
| POST | /api/exam/submit | Submit exam |

### Question Management Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/questions/:examId | Get exam questions |
| POST | /api/questions/add | Add single question |
| POST | /api/questions/add-bulk | Add bulk questions |

### Question Bank Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/questionbank/upload | Upload PDF |
| GET | /api/questionbank | List question banks |

### Results Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/results/student/:id | Student results |
| GET | /api/results/detail/:examId | Result details |

## 🗄️ Database Schema

### Users Table
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Exams Table
```sql
CREATE TABLE exams (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  duration INTEGER NOT NULL,
  start_time TIMESTAMP,
  end_time TIMESTAMP,
  created_by_id INTEGER REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Questions Table
```sql
CREATE TABLE questions (
  id SERIAL PRIMARY KEY,
  exam_id INTEGER REFERENCES exams(id),
  question_text TEXT NOT NULL,
  option_a TEXT NOT NULL,
  option_b TEXT NOT NULL,
  option_c TEXT NOT NULL,
  option_d TEXT NOT NULL,
  correct_answer VARCHAR(1) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Results Table
```sql
CREATE TABLE results (
  id SERIAL PRIMARY KEY,
  exam_id INTEGER REFERENCES exams(id),
  student_id INTEGER REFERENCES users(id),
  score INTEGER NOT NULL,
  total_questions INTEGER NOT NULL,
  percentage DECIMAL(5,2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 🧪 Testing

### Test Accounts
- **Student**: student@example.com / test123
- **Faculty**: faculty@example.com / test123

### Test Scenarios
1. User registration and login
2. Exam creation by faculty
3. Question addition (single and bulk)
4. PDF upload for question banks
5. Exam taking by students
6. Results viewing and analytics

## 📱 Mobile Compatibility

- Responsive design for all screen sizes
- Touch-friendly interactions
- Optimized animations for mobile
- Adaptive layouts for tablets
- Progressive enhancement approach

## 🔒 Security Features

- JWT token-based authentication
- Password hashing with bcrypt
- Role-based access control
- Input validation and sanitization
- CORS configuration
- SQL injection prevention

## 🎨 Customization

### Color Scheme
- Primary: Indigo (#6366F1)
- Secondary: Purple (#9333EA)
- Success: Green (#10B981)
- Warning: Red (#EF4444)
- Info: Blue (#3B82F6)

### Typography
- Inter font family
- Responsive font sizes
- Accessible color contrast
- Clear hierarchy

## 🚀 Deployment

### Vercel Deployment (Recommended)

1. **Deploy to Vercel**
   ```bash
   # Install Vercel CLI
   npm i -g vercel
   
   # Deploy
   vercel --prod
   ```

2. **Environment Variables on Vercel**
   ```bash
   DATABASE_URL=postgresql://neondb_owner:npg_dCP5xmRl8tJg@ep-winter-credit-an6ufc4n-pooler.c-6.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
   JWT_SECRET=online_exam_system_2024_secure_key_for_authentication
   FRONTEND_URL=https://your-app-name.vercel.app
   NODE_ENV=production
   ```

### Manual Deployment

#### Environment Variables
```bash
# Production
NODE_ENV=production
DATABASE_URL=your_production_neon_url
JWT_SECRET=your_production_jwt_secret
FRONTEND_URL=https://yourdomain.com

# Development
NODE_ENV=development
DATABASE_URL=your_development_neon_url
JWT_SECRET=your_development_jwt_secret
FRONTEND_URL=http://localhost:3000
```

#### Build Process
```bash
# Frontend Build
cd frontend
npm run build

# Backend Production
cd backend
npm start
```

### 🌐 Live Deployment

**🎉 Successfully deployed on Vercel:** [https://examora-puce.vercel.app/](https://examora-puce.vercel.app/)

Features available in production:
- ✅ User authentication (Faculty/Student)
- ✅ Exam creation and management
- ✅ Real-time exam taking
- ✅ PDF question bank uploads
- ✅ Results and analytics
- ✅ Responsive design
- ✅ Dark mode support

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 Support

For support, please email: support@examora.com

## 📊 Performance

- Optimized database queries
- Efficient state management
- Lazy loading for components
- Code splitting for routes
- Image optimization
- Caching strategies

## 🔮 Roadmap

### Version 2.0
- [ ] Advanced analytics dashboard
- [ ] Proctoring features
- [ ] Video integration
- [ ] Advanced question types
- [ ] Bulk operations
- [ ] API rate limiting
- [ ] Email notifications

### Version 2.1
- [ ] Mobile app
- [ ] Offline mode
- [ ] Advanced reporting
- [ ] Integration with LMS
- [ ] AI-powered features

## 📈 Analytics

- Track exam completion rates
- Monitor student performance
- Analyze question difficulty
- Measure time spent
- Success rate metrics

## 🌐 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile browsers (iOS Safari, Android Chrome)

## 📝 Changelog

### v1.0.0 (2024-04-30)
- ✅ Initial release
- ✅ Basic authentication system
- ✅ Exam creation and management
- ✅ Question bank functionality
- ✅ Real-time results
- ✅ Responsive design
- ✅ PDF upload support
- ✅ Dark mode support
- ✅ Modern UI/UX
- ✅ Vercel deployment
- ✅ Production-ready backend API
- ✅ Neon PostgreSQL integration
- ✅ Serverless functions

---

<div align="center">

**🎓 Examora - Transforming Online Education**

[🚀 Live Demo](https://examora-puce.vercel.app/) • [📖 Documentation](#-readme) • [⭐ Star](https://github.com/Shravan2krypton/Examora) • [🍴 Fork](https://github.com/Shravan2krypton/Examora/fork)

**Built with ❤️ by the Examora Team**

</div>
