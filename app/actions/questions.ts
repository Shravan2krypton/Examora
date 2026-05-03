"use server";

import { QuestionBankService } from "@/lib/services/QuestionBankService";
import { revalidatePath } from "next/cache";

const qService = new QuestionBankService();

export async function createQuestionAction(prevState: any, formData: FormData) {
  try {
    const text = formData.get("text") as string;
    const optionsRaw = formData.get("options") as string;
    const correctAnswer = parseInt(formData.get("correctAnswer") as string, 10);
    const marks = parseInt(formData.get("marks") as string, 10);
    const difficulty = formData.get("difficulty") as "easy"|"medium"|"hard";
    const subject = formData.get("subject") as string;

    const options = JSON.parse(optionsRaw);

    await qService.create({
      text, options, correctAnswer, marks, difficulty, subject
    });

    revalidatePath("/admin/questions");
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function deleteQuestionAction(id: string) {
  await qService.delete(id);
  revalidatePath("/admin/questions");
}
