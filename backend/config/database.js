import pkg from 'pg';
import dotenv from 'dotenv';
dotenv.config();
const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// Test database connection
const connectDB = async () => {
  try {
    const res = await pool.query('SELECT NOW()');
    console.log('Database connected successfully:', res.rows[0].now);
    
    // Create tables if they don't exist
    await createTables();
  } catch (error) {
    console.error('Database connection error:', error);
    throw error;
  }
};

// Create database tables
const createTables = async () => {
  try {
    // Users table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(20) NOT NULL CHECK (role IN ('student', 'faculty')),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Exams table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS exams (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        duration INTEGER NOT NULL,
        start_time TIMESTAMP,
        end_time TIMESTAMP,
        is_live BOOLEAN DEFAULT FALSE,
        created_by_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Check if questions table exists and what schema it has
    const questionsTableCheck = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'questions'
      ORDER BY ordinal_position
    `);

    // If questions table doesn't exist, create it with new schema
    if (questionsTableCheck.rows.length === 0) {
      await pool.query(`
        CREATE TABLE questions (
          id SERIAL PRIMARY KEY,
          exam_id INTEGER REFERENCES exams(id) ON DELETE CASCADE,
          question_text TEXT NOT NULL,
          option_a VARCHAR(255) NOT NULL,
          option_b VARCHAR(255) NOT NULL,
          option_c VARCHAR(255) NOT NULL,
          option_d VARCHAR(255) NOT NULL,
          correct_answer VARCHAR(1) NOT NULL CHECK (correct_answer IN ('A', 'B', 'C', 'D')),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);
    } else {
      // Check if we need to migrate from old schema to new schema
      const hasExamId = questionsTableCheck.rows.some(col => col.column_name === 'exam_id');
      const hasQuestionBankId = questionsTableCheck.rows.some(col => col.column_name === 'question_bank_id');
      
      if (hasExamId && !hasQuestionBankId) {
        console.log('Migrating questions table from old schema to new schema...');
        
        // Add new columns for question bank support
        await pool.query(`
          ALTER TABLE questions 
          ADD COLUMN IF NOT EXISTS question_bank_id INTEGER,
          ADD COLUMN IF NOT EXISTS subject VARCHAR(100),
          ADD COLUMN IF NOT EXISTS difficulty VARCHAR(20) DEFAULT 'medium',
          ADD COLUMN IF NOT EXISTS created_by INTEGER REFERENCES users(id) ON DELETE CASCADE
        `);
        
        // Create exam_questions table if it doesn't exist
        await pool.query(`
          CREATE TABLE IF NOT EXISTS exam_questions (
            id SERIAL PRIMARY KEY,
            exam_id INTEGER REFERENCES exams(id) ON DELETE CASCADE,
            question_id INTEGER REFERENCES questions(id) ON DELETE CASCADE,
            question_number INTEGER NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            UNIQUE(exam_id, question_id)
          )
        `);
        
        // Migrate existing exam-question relationships
        const existingQuestions = await pool.query('SELECT * FROM questions WHERE exam_id IS NOT NULL');
        
        for (const question of existingQuestions.rows) {
          await pool.query(`
            INSERT INTO exam_questions (exam_id, question_id, question_number)
            VALUES ($1, $2, $3)
            ON CONFLICT (exam_id, question_id) DO NOTHING
          `, [question.exam_id, question.id, 1]);
        }
        
        console.log('Migration completed successfully');
      }
    }

    // Exam attempts table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS exam_attempts (
        id SERIAL PRIMARY KEY,
        exam_id INTEGER REFERENCES exams(id) ON DELETE CASCADE,
        student_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        submitted_at TIMESTAMP,
        status VARCHAR(20) DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'submitted', 'expired')),
        UNIQUE(exam_id, student_id)
      )
    `);

    // Answers table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS answers (
        id SERIAL PRIMARY KEY,
        attempt_id INTEGER REFERENCES exam_attempts(id) ON DELETE CASCADE,
        question_id INTEGER REFERENCES questions(id) ON DELETE CASCADE,
        selected_option VARCHAR(1) CHECK (selected_option IN ('A', 'B', 'C', 'D')),
        answered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(attempt_id, question_id)
      )
    `);

    // Results table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS results (
        id SERIAL PRIMARY KEY,
        exam_id INTEGER REFERENCES exams(id) ON DELETE CASCADE,
        student_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        attempt_id INTEGER REFERENCES exam_attempts(id) ON DELETE CASCADE,
        total_questions INTEGER NOT NULL,
        correct_answers INTEGER NOT NULL,
        score DECIMAL(5,2) NOT NULL,
        percentage DECIMAL(5,2) NOT NULL,
        time_taken INTEGER, -- in seconds
        submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(exam_id, student_id)
      )
    `);

    // Question banks table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS question_banks (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        subject VARCHAR(100),
        uploaded_by INTEGER REFERENCES users(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Exam questions table - links exams with questions from question banks
    await pool.query(`
      CREATE TABLE IF NOT EXISTS exam_questions (
        id SERIAL PRIMARY KEY,
        exam_id INTEGER REFERENCES exams(id) ON DELETE CASCADE,
        question_id INTEGER REFERENCES questions(id) ON DELETE CASCADE,
        question_number INTEGER NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(exam_id, question_id)
      )
    `);

    // Create indexes for better performance
    await pool.query('CREATE INDEX IF NOT EXISTS idx_exams_created_by ON exams(created_by_id)');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_questions_question_bank ON questions(question_bank_id)');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_questions_subject ON questions(subject)');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_exam_attempts_exam_student ON exam_attempts(exam_id, student_id)');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_answers_attempt ON answers(attempt_id)');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_results_exam_student ON results(exam_id, student_id)');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_results_exam_score ON results(exam_id, score DESC)');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_exam_questions_exam ON exam_questions(exam_id)');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_exam_questions_question ON exam_questions(question_id)');

    console.log('Database tables created/verified successfully');
  } catch (error) {
    console.error('Error creating tables:', error);
    throw error;
  }
};

export { pool, connectDB };
