import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import sqlite3 from 'sqlite3';

// SQLite database setup
const db = new sqlite3.Database('./online-exam.db', (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('✅ Connected to SQLite database.');
  }
});

// Promisify database operations
const dbRun = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function(err) {
      if (err) reject(err);
      else resolve(this);
    });
  });
};

const dbGet = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.get(sql, params, function(err, row) {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

const dbAll = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, function(err, rows) {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

// Initialize database tables
async function initializeDatabase() {
  try {
    // Create users table
    await dbRun(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create exams table
    await dbRun(`
      CREATE TABLE IF NOT EXISTS exams (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        duration INTEGER NOT NULL,
        start_time DATETIME,
        end_time DATETIME,
        created_by_id INTEGER,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (created_by_id) REFERENCES users (id)
      )
    `);

    // Create questions table
    await dbRun(`
      CREATE TABLE IF NOT EXISTS questions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        exam_id INTEGER NOT NULL,
        question_text TEXT NOT NULL,
        option_a TEXT NOT NULL,
        option_b TEXT NOT NULL,
        option_c TEXT NOT NULL,
        option_d TEXT NOT NULL,
        correct_answer TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (exam_id) REFERENCES exams (id)
      )
    `);

    // Create exam_attempts table
    await dbRun(`
      CREATE TABLE IF NOT EXISTS exam_attempts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        exam_id INTEGER NOT NULL,
        student_id INTEGER NOT NULL,
        start_time DATETIME DEFAULT CURRENT_TIMESTAMP,
        end_time DATETIME,
        score INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (exam_id) REFERENCES exams (id),
        FOREIGN KEY (student_id) REFERENCES users (id)
      )
    `);

    // Create results table
    await dbRun(`
      CREATE TABLE IF NOT EXISTS results (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        exam_id INTEGER NOT NULL,
        student_id INTEGER NOT NULL,
        score INTEGER NOT NULL,
        total_questions INTEGER NOT NULL,
        percentage REAL NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (exam_id) REFERENCES exams (id),
        FOREIGN KEY (student_id) REFERENCES users (id)
      )
    `);

    // Insert test users if they don't exist
    const existingUsers = await dbGet('SELECT COUNT(*) as count FROM users');
    if (existingUsers.count === 0) {
      const hashedPassword = await bcrypt.hash('test123', 10);
      
      await dbRun(`
        INSERT INTO users (name, email, password, role) VALUES 
        ('Test Student', 'student@example.com', ?, 'student'),
        ('Test Faculty', 'faculty@example.com', ?, 'faculty')
      `, [hashedPassword, hashedPassword]);
      
      console.log('✅ Test users created:');
      console.log('  Student: student@example.com / test123');
      console.log('  Faculty: faculty@example.com / test123');
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
      const user = await dbGet('SELECT * FROM users WHERE email = ?', [where.email]);
      return user;
    },
    findMany: async () => {
      const users = await dbAll('SELECT * FROM users');
      return users;
    },
    create: async ({ data }) => {
      const result = await dbRun(
        'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
        [data.name, data.email, data.password, data.role]
      );
      return { id: result.lastID, ...data };
    }
  },
  exam: {
    findMany: async () => {
      const exams = await dbAll('SELECT * FROM exams');
      return exams;
    },
    findUnique: async ({ where }) => {
      const exam = await dbGet('SELECT * FROM exams WHERE id = ?', [where.id]);
      return exam;
    },
    create: async ({ data }) => {
      const result = await dbRun(
        'INSERT INTO exams (title, description, duration, created_by_id) VALUES (?, ?, ?, ?)',
        [data.title, data.description, data.duration, data.createdById]
      );
      return { id: result.lastID, ...data };
    }
  },
  question: {
    findMany: async ({ where }) => {
      if (where.examId) {
        const questions = await dbAll('SELECT * FROM questions WHERE exam_id = ?', [where.examId]);
        return questions;
      }
      return await dbAll('SELECT * FROM questions');
    },
    create: async ({ data }) => {
      const result = await dbRun(
        'INSERT INTO questions (exam_id, question_text, option_a, option_b, option_c, option_d, correct_answer) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [data.examId, data.questionText, data.optionA, data.optionB, data.optionC, data.optionD, data.correctAnswer]
      );
      return { id: result.lastID, ...data };
    },
    createMany: async ({ data }) => {
      for (const question of data) {
        await dbRun(
          'INSERT INTO questions (exam_id, question_text, option_a, option_b, option_c, option_d, correct_answer) VALUES (?, ?, ?, ?, ?, ?, ?)',
          [question.examId, question.questionText, question.optionA, question.optionB, question.optionC, question.optionD, question.correctAnswer]
        );
      }
      return { count: data.length };
    }
  },
  examAttempt: {
    create: async ({ data }) => {
      const result = await dbRun(
        'INSERT INTO exam_attempts (exam_id, student_id) VALUES (?, ?)',
        [data.examId, data.studentId]
      );
      return { id: result.lastID, ...data };
    },
    update: async ({ where, data }) => {
      await dbRun(
        'UPDATE exam_attempts SET end_time = ?, score = ? WHERE id = ?',
        [data.endTime, data.score, where.id]
      );
      const attempt = await dbGet('SELECT * FROM exam_attempts WHERE id = ?', [where.id]);
      return attempt;
    },
    findUnique: async ({ where }) => {
      const attempt = await dbGet('SELECT * FROM exam_attempts WHERE id = ?', [where.id]);
      return attempt;
    }
  },
  result: {
    create: async ({ data }) => {
      const result = await dbRun(
        'INSERT INTO results (exam_id, student_id, score, total_questions, percentage) VALUES (?, ?, ?, ?, ?)',
        [data.examId, data.studentId, data.score, data.totalQuestions, data.percentage]
      );
      return { id: result.lastID, ...data };
    },
    findMany: async ({ where }) => {
      if (where.studentId) {
        const results = await dbAll('SELECT * FROM results WHERE student_id = ?', [where.studentId]);
        return results;
      }
      return await dbAll('SELECT * FROM results');
    },
    findUnique: async ({ where }) => {
      const result = await dbGet('SELECT * FROM results WHERE id = ?', [where.id]);
      return result;
    }
  }
};

// Initialize database
await initializeDatabase();

const app = express();

// Middleware
app.use(cors({
  origin: ['http://localhost:3000'],
  credentials: true
}));
app.use(express.json());

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
      'online_exam_system_2024_secure_key_for_authentication',
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
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    const existingUser = await database.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return res.status(400).json({ error: 'User already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await database.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role
      }
    });

    const token = jwt.sign(
      { userId: newUser.id, email: newUser.email, role: newUser.role },
      'online_exam_system_2024_secure_key_for_authentication',
      { expiresIn: '24h' }
    );

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
    console.error('Register error:', error);
    res.status(500).json({ error: 'Server error.' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok',
    database: 'SQLite Database',
    environment: 'development'
  });
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
    const exam = await database.exam.create({ data: req.body });
    res.json(exam);
  } catch (error) {
    console.error('Error creating exam:', error);
    res.status(500).json({ error: 'Failed to create exam' });
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
    const question = await database.question.create({ data: req.body });
    res.json(question);
  } catch (error) {
    console.error('Error creating question:', error);
    res.status(500).json({ error: 'Failed to create question' });
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
  console.log(`📁 Database: SQLite Database`);
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
