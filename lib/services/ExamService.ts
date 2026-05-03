import { BaseService } from "./BaseService";
import { IExam } from "../models/interfaces";
import { db } from "../db";
import { exams } from "../schema";
import { eq } from "drizzle-orm";
import { ExamNotFoundError } from "../errors/CustomErrors";

export class ExamService extends BaseService<IExam> {
  async findById(id: string): Promise<IExam | null> {
    const result = await db.select().from(exams).where(eq(exams.id, id));
    return (result[0] as unknown) as IExam || null;
  }

  async findAll(): Promise<IExam[]> {
    const result = await db.select().from(exams);
    return (result as unknown) as IExam[];
  }

  async create(data: Partial<IExam>): Promise<IExam> {
    const result = await db.insert(exams).values(data as any).returning();
    return (result[0] as unknown) as IExam;
  }

  async update(id: string, data: Partial<IExam>): Promise<IExam> {
    const result = await db.update(exams).set(data as any).where(eq(exams.id, id)).returning();
    if (result.length === 0) throw new ExamNotFoundError("Exam not found");
    return (result[0] as unknown) as IExam;
  }

  async delete(id: string): Promise<void> {
    await db.delete(exams).where(eq(exams.id, id));
  }
}
