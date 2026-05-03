"use server";

import { db } from "@/lib/db";
import { submissions, studentAnswers } from "@/lib/schema";
import { ExamEvaluator } from "@/lib/services/ExamEvaluator";
import { redirect } from "next/navigation";
import { eq, and } from "drizzle-orm";

export async function startExamAction(examId: string, studentId: string) {
  // Check for existing in-progress submission
  const existing = await db.select().from(submissions)
    .where(and(eq(submissions.examId, examId), eq(submissions.studentId, studentId), eq(submissions.status, "in-progress")))
    .limit(1);

  if (existing.length > 0) {
    redirect(`/student/exams/${existing[0].id}`);
  }

  const result = await db.insert(submissions).values({
    examId,
    studentId,
    status: "in-progress"
  }).returning();
  
  redirect(`/student/exams/${result[0].id}`);
}

export async function submitExamAction(submissionId: string, answers: { questionId: string, selectedOption: number, isCorrect: boolean }[]) {
  if (answers && answers.length > 0) {
    const formattedAnswers = answers.map(a => ({
      submissionId,
      questionId: a.questionId,
      selectedOption: a.selectedOption,
      isCorrect: a.isCorrect
    }));
    await db.insert(studentAnswers).values(formattedAnswers);
  }

  const evaluator = new ExamEvaluator();
  await evaluator.evaluate(submissionId);

  redirect(`/student/results`);
}
