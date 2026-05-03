"use server";

import { ExamService } from "@/lib/services/ExamService";
import { db } from "@/lib/db";
import { examQuestions } from "@/lib/schema";
import { revalidatePath } from "next/cache";

const examService = new ExamService();

export async function createExamAction(prevState: any, formData: FormData) {
  try {
    const title = formData.get("title") as string;
    const subject = formData.get("subject") as string;
    const duration = parseInt(formData.get("duration") as string, 10);
    const totalMarks = parseInt(formData.get("totalMarks") as string, 10);
    const selectedQuestions = JSON.parse(formData.get("questions") as string) as string[];

    const exam = await examService.create({
      title, subject, duration, totalMarks
    });

    if (selectedQuestions && selectedQuestions.length > 0) {
      const inserts = selectedQuestions.map(qId => ({
        examId: exam.id,
        questionId: qId
      }));
      await db.insert(examQuestions).values(inserts);
    }

    revalidatePath("/admin/exams");
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}
