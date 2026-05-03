import { BaseService } from "./BaseService";
import { IQuestion } from "../models/interfaces";
import { db } from "../db";
import { questions } from "../schema";
import { eq } from "drizzle-orm";
import { QuestionBankError } from "../errors/CustomErrors";

export class QuestionBankService extends BaseService<IQuestion> {
  async findById(id: string): Promise<IQuestion | null> {
    const result = await db.select().from(questions).where(eq(questions.id, id));
    return (result[0] as unknown) as IQuestion || null;
  }

  async findAll(): Promise<IQuestion[]> {
    const result = await db.select().from(questions);
    return (result as unknown) as IQuestion[];
  }

  async create(data: Partial<IQuestion>): Promise<IQuestion> {
    if (!data.text || !data.options || data.correctAnswer === undefined) {
      throw new QuestionBankError("Missing required fields for question");
    }
    const result = await db.insert(questions).values(data as any).returning();
    return (result[0] as unknown) as IQuestion;
  }

  async update(id: string, data: Partial<IQuestion>): Promise<IQuestion> {
    const result = await db.update(questions).set(data as any).where(eq(questions.id, id)).returning();
    if (result.length === 0) throw new QuestionBankError("Question not found");
    return (result[0] as unknown) as IQuestion;
  }

  async delete(id: string): Promise<void> {
    await db.delete(questions).where(eq(questions.id, id));
  }
}
