import { User } from "./User";
import { db } from "../db";
import { exams, questions, users } from "../schema";
import { count, eq } from "drizzle-orm";

export class Admin extends User {
  constructor(id: string, name: string, email: string) {
    super(id, name, email, "admin");
  }

  // Implementation of polymorphic method
  async getDashboardData() {
    const [totalStudents, totalExams, totalQuestions] = await Promise.all([
      db.select({ value: count() }).from(users).where(eq(users.role, "student")),
      db.select({ value: count() }).from(exams),
      db.select({ value: count() }).from(questions),
    ]);

    return {
      studentsCount: totalStudents[0].value,
      examsCount: totalExams[0].value,
      questionsCount: totalQuestions[0].value,
    };
  }
}
