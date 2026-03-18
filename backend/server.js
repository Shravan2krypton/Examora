import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pg from 'pg';
import multer from 'multer';
import * as pdfParse from 'pdf-parse';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

console.log('Environment variables loaded:');
console.log('DATABASE_URL:', process.env.DATABASE_URL);
console.log('PORT:', process.env.PORT);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// PostgreSQL database setup
const dbUrl = process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_C7zDAOxN2chp@ep-ancient-sea-adb6ttsb-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require';
console.log('DATABASE_URL:', dbUrl);
const pool = new pg.Pool({
  connectionString: dbUrl,
  ssl: {
    rejectUnauthorized: false
  }
});

// Test database connection
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('❌ Database connection error:', err);
  } else {
    console.log('✅ Connected to PostgreSQL database');
  }
});

// Initialize database tables
async function initializeDatabase() {
  try {
    // Create users table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create exams table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS exams (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        duration INTEGER NOT NULL,
        start_time TIMESTAMP,
        end_time TIMESTAMP,
        created_by_id INTEGER REFERENCES users(id),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create questions table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS questions (
        id SERIAL PRIMARY KEY,
        exam_id INTEGER REFERENCES exams(id),
        question_text TEXT NOT NULL,
        option_a TEXT NOT NULL,
        option_b TEXT NOT NULL,
        option_c TEXT NOT NULL,
        option_d TEXT NOT NULL,
        correct_answer VARCHAR(1) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create exam_attempts table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS exam_attempts (
        id SERIAL PRIMARY KEY,
        exam_id INTEGER REFERENCES exams(id),
        student_id INTEGER REFERENCES users(id),
        start_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        end_time TIMESTAMP,
        score INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create results table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS results (
        id SERIAL PRIMARY KEY,
        exam_id INTEGER REFERENCES exams(id),
        student_id INTEGER REFERENCES users(id),
        score INTEGER NOT NULL,
        total_questions INTEGER NOT NULL,
        percentage DECIMAL(5,2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create question_banks table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS question_banks (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        file_path VARCHAR(255),
        uploaded_by INTEGER REFERENCES users(id),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Insert test users if they don't exist
    const existingUsers = await pool.query('SELECT COUNT(*) as count FROM users');
    console.log('🔍 Existing users count:', existingUsers.rows[0].count);
    
    if (existingUsers.rows[0].count === 0) {
      console.log('🔍 Creating test users...');
      const hashedPassword = await bcrypt.hash('test123', 10);
      console.log('🔍 Password hashed successfully');
      
      await pool.query(`
        INSERT INTO users (name, email, password, role) VALUES 
        ($1, $2, $3, $4),
        ($5, $6, $7, $8)
      `, [
        'Test Student', 'student@example.com', hashedPassword, 'student',
        'Test Faculty', 'faculty@example.com', hashedPassword, 'faculty'
      ]);
      
      console.log('✅ Test users created:');
      console.log('  Student: student@example.com / test123');
      console.log('  Faculty: faculty@example.com / test123');
    } else {
      console.log('✅ Test users already exist in database');
    }

    console.log('✅ Database initialized successfully');
  } catch (error) {
    console.error('❌ Database initialization error:', error);
  }
}

// Database interface
const database = {
  user: {
    findUnique: async ({ where }) => {
      const result = await pool.query('SELECT * FROM users WHERE email = $1', [where.email]);
      return result.rows[0];
    },
    findMany: async () => {
      const result = await pool.query('SELECT * FROM users');
      return result.rows;
    },
    create: async ({ data }) => {
      const result = await pool.query(
        'INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING *',
        [data.name, data.email, data.password, data.role]
      );
      return result.rows[0];
    }
  },
  exam: {
    findMany: async () => {
      const result = await pool.query('SELECT * FROM exams ORDER BY created_at DESC');
      return result.rows;
    },
    findUnique: async ({ where }) => {
      const result = await pool.query('SELECT * FROM exams WHERE id = $1', [where.id]);
      return result.rows[0];
    },
    create: async ({ data }) => {
      const result = await pool.query(
        'INSERT INTO exams (title, description, duration, created_by_id) VALUES ($1, $2, $3, $4) RETURNING *',
        [data.title, data.description, data.duration, data.createdById]
      );
      return result.rows[0];
    }
  },
  question: {
    findMany: async ({ where }) => {
      if (where.examId) {
        const result = await pool.query('SELECT * FROM questions WHERE exam_id = $1', [where.examId]);
        return result.rows;
      }
      const result = await pool.query('SELECT * FROM questions');
      return result.rows;
    },
    create: async ({ data }) => {
      const result = await pool.query(
        'INSERT INTO questions (exam_id, question_text, option_a, option_b, option_c, option_d, correct_answer) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
        [data.examId, data.questionText, data.optionA, data.optionB, data.optionC, data.optionD, data.correctAnswer]
      );
      return result.rows[0];
    },
    createMany: async ({ data }) => {
      const client = await pool.connect();
      try {
        await client.query('BEGIN');
        for (const question of data) {
          await client.query(
            'INSERT INTO questions (exam_id, question_text, option_a, option_b, option_c, option_d, correct_answer) VALUES ($1, $2, $3, $4, $5, $6, $7)',
            [question.examId, question.questionText, question.optionA, question.optionB, question.optionC, question.optionD, question.correctAnswer]
          );
        }
        await client.query('COMMIT');
        return { count: data.length };
      } catch (error) {
        await client.query('ROLLBACK');
        throw error;
      } finally {
        client.release();
      }
    }
  },
  examAttempt: {
    create: async ({ data }) => {
      const result = await pool.query(
        'INSERT INTO exam_attempts (exam_id, student_id) VALUES ($1, $2) RETURNING *',
        [data.examId, data.studentId]
      );
      return result.rows[0];
    },
    update: async ({ where, data }) => {
      const result = await pool.query(
        'UPDATE exam_attempts SET end_time = $1, score = $2 WHERE id = $3 RETURNING *',
        [data.endTime, data.score, where.id]
      );
      return result.rows[0];
    },
    findUnique: async ({ where }) => {
      const result = await pool.query('SELECT * FROM exam_attempts WHERE id = $1', [where.id]);
      return result.rows[0];
    }
  },
  result: {
    create: async ({ data }) => {
      const result = await pool.query(
        'INSERT INTO results (exam_id, student_id, score, total_questions, percentage) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [data.examId, data.studentId, data.score, data.totalQuestions, data.percentage]
      );
      return result.rows[0];
    },
    findMany: async ({ where }) => {
      if (where.studentId) {
        const result = await pool.query('SELECT * FROM results WHERE student_id = $1 ORDER BY created_at DESC', [where.studentId]);
        return result.rows;
      }
      const result = await pool.query('SELECT * FROM results ORDER BY created_at DESC');
      return result.rows;
    },
    findUnique: async ({ where }) => {
      const result = await pool.query('SELECT * FROM results WHERE id = $1', [where.id]);
      return result.rows[0];
    }
  },
  questionBank: {
    create: async ({ data }) => {
      const result = await pool.query(
        'INSERT INTO question_banks (title, description, file_path, uploaded_by) VALUES ($1, $2, $3, $4) RETURNING *',
        [data.title, data.description, data.filePath, data.uploadedBy]
      );
      return result.rows[0];
    },
    findMany: async () => {
      const result = await pool.query('SELECT * FROM question_banks ORDER BY created_at DESC');
      return result.rows;
    },
    findUnique: async ({ where }) => {
      const result = await pool.query('SELECT * FROM question_banks WHERE id = $1', [where.id]);
      return result.rows[0];
    }
  }
};

// Initialize database
await initializeDatabase();

const app = express();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + '.pdf');
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'), false);
    }
  }
});

// Middleware
app.use(cors({
  origin: ['http://localhost:3000'],
  credentials: true
}));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Auth routes
app.post('/api/auth/login', async (req, res) => {
  try {
    console.log('🔍 Login request received:', req.body);
    const { email, password } = req.body;

    if (!email || !password) {
      console.log('❌ Missing email or password');
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    console.log('🔍 Looking for user with email:', email);
    const user = await database.user.findUnique({ where: { email } });
    console.log('🔍 User found:', user ? 'YES' : 'NO');

    if (!user) {
      console.log('❌ User not found');
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    console.log('🔍 Comparing password...');
    const isValidPassword = await bcrypt.compare(password, user.password);
    console.log('🔍 Password valid:', isValidPassword ? 'YES' : 'NO');

    if (!isValidPassword) {
      console.log('❌ Invalid password');
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'online_exam_system_2024_secure_key_for_authentication',
      { expiresIn: '24h' }
    );

    console.log('✅ Login successful for:', email);
    res.json({
      message: 'Login successful.',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('❌ Login error:', error);
    res.status(500).json({ error: 'Server error.' });
  }
});

app.post('/api/auth/register', async (req, res) => {
  try {
    console.log('🔍 Registration request received:', req.body);
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      console.log('❌ Missing required fields');
      return res.status(400).json({ error: 'All fields are required.' });
    }

    console.log('🔍 Checking if user exists:', email);
    const existingUser = await database.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      console.log('❌ User already exists:', email);
      return res.status(400).json({ error: 'User already exists.' });
    }

    console.log('🔍 Hashing password for new user');
    const hashedPassword = await bcrypt.hash(password, 10);

    console.log('🔍 Creating new user in database');
    const newUser = await database.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role
      }
    });

    console.log('✅ New user created successfully:', newUser);

    const token = jwt.sign(
      { userId: newUser.id, email: newUser.email, role: newUser.role },
      process.env.JWT_SECRET || 'online_exam_system_2024_secure_key_for_authentication',
      { expiresIn: '24h' }
    );

    console.log('✅ Registration successful for:', email);
    res.status(201).json({
      message: 'User registered successfully.',
      token,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
      }
    });
  } catch (error) {
    console.error('❌ Register error:', error);
    res.status(500).json({ error: 'Server error: ' + error.message });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok',
    database: 'PostgreSQL Database',
    environment: 'development'
  });
});

// Debug endpoint to check users
app.get('/api/debug/users', async (req, res) => {
  try {
    const result = await pool.query('SELECT id, name, email, role FROM users');
    console.log('🔍 All users in database:', result.rows);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Exam routes
app.get('/api/exams', async (req, res) => {
  try {
    const exams = await database.exam.findMany();
    res.json(exams);
  } catch (error) {
    console.error('Error fetching exams:', error);
    res.status(500).json({ error: 'Failed to fetch exams' });
  }
});

app.post('/api/exams/create', async (req, res) => {
  try {
    console.log('🔍 Exam creation request received:', req.body);
    const exam = await database.exam.create({ data: req.body });
    console.log('✅ Exam created successfully:', exam);
    res.json({
      message: 'Exam created successfully',
      exam
    });
  } catch (error) {
    console.error('❌ Error creating exam:', error);
    res.status(500).json({ error: 'Failed to create exam: ' + error.message });
  }
});

app.get('/api/exams/:id', async (req, res) => {
  try {
    const exam = await database.exam.findUnique({ where: { id: req.params.id } });
    res.json(exam);
  } catch (error) {
    console.error('Error fetching exam:', error);
    res.status(500).json({ error: 'Failed to fetch exam' });
  }
});

// Question routes
app.get('/api/questions/:examId', async (req, res) => {
  try {
    const questions = await database.question.findMany({ where: { examId: req.params.examId } });
    res.json(questions);
  } catch (error) {
    console.error('Error fetching questions:', error);
    res.status(500).json({ error: 'Failed to fetch questions' });
  }
});

app.post('/api/questions/add', async (req, res) => {
  try {
    console.log('🔍 Question creation request received:', req.body);
    
    // Map frontend field names to database field names
    const questionData = {
      examId: req.body.examId,
      questionText: req.body.questionText,
      optionA: req.body.optionA,
      optionB: req.body.optionB,
      optionC: req.body.optionC,
      optionD: req.body.optionD,
      correctAnswer: req.body.correctAnswer
    };
    
    console.log('🔍 Mapped question data:', questionData);
    const question = await database.question.create({ data: questionData });
    console.log('✅ Question created successfully:', question);
    res.json(question);
  } catch (error) {
    console.error('❌ Error creating question:', error);
    res.status(500).json({ error: 'Failed to create question: ' + error.message });
  }
});

app.post('/api/questions/add-bulk', async (req, res) => {
  try {
    const result = await database.question.createMany({ data: req.body });
    res.json(result);
  } catch (error) {
    console.error('Error creating bulk questions:', error);
    res.status(500).json({ error: 'Failed to create bulk questions' });
  }
});

// Exam start endpoint
app.post('/api/exam/start', async (req, res) => {
  try {
    console.log('🔍 Exam start request received:', req.body);
    const { examId } = req.body;
    
    // Get exam details with questions
    const exam = await database.exam.findUnique({ where: { id: examId } });
    const questions = await database.question.findMany({ where: { examId } });
    
    if (!exam) {
      return res.status(404).json({ error: 'Exam not found' });
    }
    
    if (!questions || questions.length === 0) {
      return res.status(400).json({ error: 'No questions available for this exam' });
    }
    
    // Create exam attempt
    const attempt = await database.examAttempt.create({
      data: {
        examId,
        studentId: 1 // Will be updated with actual student ID from auth
      }
    });
    
    console.log('✅ Exam attempt created:', attempt);
    res.json({
      message: 'Exam started successfully',
      attempt,
      exam,
      questions
    });
  } catch (error) {
    console.error('❌ Error starting exam:', error);
    res.status(500).json({ error: 'Failed to start exam: ' + error.message });
  }
});

// Exam save answer endpoint
app.post('/api/exam/save-answer', async (req, res) => {
  try {
    const { examId, questionId, selectedOption } = req.body;
    // For now, just acknowledge the answer
    // In a real implementation, you'd save this to a temporary answers table
    res.json({ message: 'Answer saved successfully' });
  } catch (error) {
    console.error('Error saving answer:', error);
    res.status(500).json({ error: 'Failed to save answer' });
  }
});

// Exam submit endpoint
app.post('/api/exam/submit', async (req, res) => {
  try {
    const { examId } = req.body;
    const studentId = 1; // Will be updated with actual student ID
    
    // Calculate score (mock calculation for now)
    const score = Math.floor(Math.random() * 100); // Mock score
    
    // Update exam attempt
    const attempt = await database.examAttempt.update({
      where: { id: 1 }, // Mock attempt ID
      data: {
        endTime: new Date(),
        score
      }
    });
    
    // Create result
    const result = await database.result.create({
      data: {
        examId,
        studentId,
        score,
        totalQuestions: 10, // Mock total
        percentage: (score / 10) * 100
      }
    });
    
    console.log('✅ Exam submitted successfully:', result);
    res.json({
      message: 'Exam submitted successfully',
      result
    });
  } catch (error) {
    console.error('❌ Error submitting exam:', error);
    res.status(500).json({ error: 'Failed to submit exam: ' + error.message });
  }
});

// Question Bank routes
app.post('/api/questionbank/upload', upload.single('pdf'), async (req, res) => {
  try {
    console.log('🔍 PDF upload request received');
    console.log('File:', req.file);
    console.log('Body:', req.body);
    
    if (!req.file) {
      console.log('❌ No PDF file uploaded');
      return res.status(400).json({ error: 'No PDF file uploaded.' });
    }

    const { title, description } = req.body;
    
    if (!title) {
      console.log('❌ No title provided');
      return res.status(400).json({ error: 'Title is required.' });
    }

    const filePath = req.file.path;
    console.log('✅ File saved to:', filePath);

    // Parse PDF content
    const pdfBuffer = fs.readFileSync(filePath);
    const pdfData = await pdfParse(pdfBuffer);
    console.log('✅ PDF parsed, pages:', pdfData.numpages);

    // Get user ID from token (for now, default to 1)
    const userId = 1; // Will be updated with actual auth later

    const questionBank = await database.questionBank.create({
      data: {
        title,
        description,
        filePath,
        uploadedBy: userId
      }
    });

    console.log('✅ Question bank created:', questionBank);
    res.json({
      message: 'PDF uploaded successfully',
      questionBank,
      pageCount: pdfData.numpages,
      text: pdfData.text.substring(0, 500) + '...' // First 500 characters
    });
  } catch (error) {
    console.error('❌ Error uploading PDF:', error);
    res.status(500).json({ error: 'Failed to upload PDF: ' + error.message });
  }
});

app.get('/api/questionbank', async (req, res) => {
  try {
    const questionBanks = await database.questionBank.findMany();
    res.json(questionBanks);
  } catch (error) {
    console.error('Error fetching question banks:', error);
    res.status(500).json({ error: 'Failed to fetch question banks' });
  }
});

// Result routes
app.get('/api/results/student/:studentId', async (req, res) => {
  try {
    const results = await database.result.findMany({ where: { studentId: req.params.studentId } });
    res.json(results);
  } catch (error) {
    console.error('Error fetching results:', error);
    res.status(500).json({ error: 'Failed to fetch results' });
  }
});

app.get('/api/results/detail/:examId', async (req, res) => {
  try {
    const result = await database.result.findUnique({ where: { examId: req.params.examId } });
    res.json(result);
  } catch (error) {
    console.error('Error fetching result detail:', error);
    res.status(500).json({ error: 'Failed to fetch result detail' });
  }
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Server error.' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📁 Database: PostgreSQL Database`);
  console.log(`🌐 Environment: development`);
  console.log(`🔗 Frontend URL: http://localhost:3000`);
  console.log(`🔧 Backend URL: http://localhost:5000`);
  console.log('');
  console.log('👤 Test Accounts:');
  console.log('  🎓 Student: student@example.com / test123');
  console.log('  👨‍🏫 Faculty: faculty@example.com / test123');
  console.log('');
  console.log('✅ Online Examination System is ready!');
});
