import { User } from "./User";
import { db } from "../db";
import { exams, submissions } from "../schema";
import { count, eq } from "drizzle-orm";

export class Student extends User {
  constructor(id: string, name: string, email: string) {
    super(id, name, email, "student");
  }

  // Implementation of polymorphic method
  async getDashboardData() {
    const [totalExams, completedExams] = await Promise.all([
      db.select({ value: count() }).from(exams),
      db.select({ value: count() }).from(submissions).where(eq(submissions.studentId, this.id)),
    ]);
    
    return {
      totalExamsAvailable: totalExams[0].value,
      examsAttempted: completedExams[0].value,
    };
  }
}
