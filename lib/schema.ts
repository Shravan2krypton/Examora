import { pgTable, text, timestamp, integer, boolean, uuid, jsonb, primaryKey } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  role: text("role", { enum: ["admin", "student"] }).notNull().default("student"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const questions = pgTable("questions", {
  id: uuid("id").primaryKey().defaultRandom(),
  text: text("text").notNull(),
  options: jsonb("options").$type<string[]>().notNull(),
  correctAnswer: integer("correct_answer").notNull(), // index of options
  marks: integer("marks").notNull().default(1),
  difficulty: text("difficulty", { enum: ["easy", "medium", "hard"] }).notNull().default("medium"),
  subject: text("subject").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const exams = pgTable("exams", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  subject: text("subject").notNull(),
  duration: integer("duration").notNull(), // in minutes
  totalMarks: integer("total_marks").notNull(),
  startTime: timestamp("start_time"),
  endTime: timestamp("end_time"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const examQuestions = pgTable("exam_questions", {
  examId: uuid("exam_id").notNull().references(() => exams.id, { onDelete: "cascade" }),
  questionId: uuid("question_id").notNull().references(() => questions.id, { onDelete: "cascade" }),
}, (t) => ({
  pk: primaryKey({ columns: [t.examId, t.questionId] }),
}));

export const submissions = pgTable("submissions", {
  id: uuid("id").primaryKey().defaultRandom(),
  examId: uuid("exam_id").notNull().references(() => exams.id, { onDelete: "cascade" }),
  studentId: uuid("student_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  startTime: timestamp("start_time").defaultNow().notNull(),
  endTime: timestamp("end_time"),
  status: text("status", { enum: ["in-progress", "completed"] }).notNull().default("in-progress"),
});

export const studentAnswers = pgTable("student_answers", {
  id: uuid("id").primaryKey().defaultRandom(),
  submissionId: uuid("submission_id").notNull().references(() => submissions.id, { onDelete: "cascade" }),
  questionId: uuid("question_id").notNull().references(() => questions.id, { onDelete: "cascade" }),
  selectedOption: integer("selected_option").notNull(),
  isCorrect: boolean("is_correct").notNull(),
});

export const results = pgTable("results", {
  id: uuid("id").primaryKey().defaultRandom(),
  submissionId: uuid("submission_id").notNull().references(() => submissions.id, { onDelete: "cascade" }),
  studentId: uuid("student_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  examId: uuid("exam_id").notNull().references(() => exams.id, { onDelete: "cascade" }),
  score: integer("score").notNull(),
  totalMarks: integer("total_marks").notNull(),
  passed: boolean("passed").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const questionBanks = pgTable("question_banks", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  description: text("description"),
  fileName: text("file_name").notNull(),
  fileSize: integer("file_size").notNull(), // in bytes
  filePath: text("file_path").notNull(), // path to stored file
  uploadedBy: uuid("uploaded_by").notNull().references(() => users.id, { onDelete: "cascade" }),
  subject: text("subject"),
  pages: integer("pages"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  submissions: many(submissions),
  results: many(results),
  questionBanks: many(questionBanks),
}));

export const questionBanksRelations = relations(questionBanks, ({ one }) => ({
  uploader: one(users, {
    fields: [questionBanks.uploadedBy],
    references: [users.id],
  }),
}));

export const examsRelations = relations(exams, ({ many }) => ({
  questions: many(examQuestions),
  submissions: many(submissions),
}));

export const questionsRelations = relations(questions, ({ many }) => ({
  exams: many(examQuestions),
}));

export const examQuestionsRelations = relations(examQuestions, ({ one }) => ({
  exam: one(exams, {
    fields: [examQuestions.examId],
    references: [exams.id],
  }),
  question: one(questions, {
    fields: [examQuestions.questionId],
    references: [questions.id],
  }),
}));

export const submissionsRelations = relations(submissions, ({ one, many }) => ({
  exam: one(exams, {
    fields: [submissions.examId],
    references: [exams.id],
  }),
  student: one(users, {
    fields: [submissions.studentId],
    references: [users.id],
  }),
  answers: many(studentAnswers),
  result: one(results, {
    fields: [submissions.id],
    references: [results.submissionId],
  }),
}));

export const studentAnswersRelations = relations(studentAnswers, ({ one }) => ({
  submission: one(submissions, {
    fields: [studentAnswers.submissionId],
    references: [submissions.id],
  }),
  question: one(questions, {
    fields: [studentAnswers.questionId],
    references: [questions.id],
  }),
}));
