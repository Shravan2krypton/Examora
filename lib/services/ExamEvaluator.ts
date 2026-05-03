import { AbstractEvaluator } from "./AbstractEvaluator";
import { db } from "../db";
import { submissions, studentAnswers, questions, results, exams } from "../schema";
import { eq } from "drizzle-orm";
import { IResult } from "../models/interfaces";
import { ExamNotFoundError } from "../errors/CustomErrors";

export class ExamEvaluator extends AbstractEvaluator {
  async evaluate(submissionId: string): Promise<IResult> {
    const submissionRecord = await db.select().from(submissions).where(eq(submissions.id, submissionId)).limit(1);
    if (submissionRecord.length === 0) throw new ExamNotFoundError("Submission not found");
    const submission = submissionRecord[0];

    const examRecord = await db.select().from(exams).where(eq(exams.id, submission.examId)).limit(1);
    const exam = examRecord[0];

    const answers = await db.select({
      selectedOption: studentAnswers.selectedOption,
      isCorrect: studentAnswers.isCorrect,
      marks: questions.marks
    })
    .from(studentAnswers)
    .innerJoin(questions, eq(studentAnswers.questionId, questions.id))
    .where(eq(studentAnswers.submissionId, submissionId));

    let score = 0;
    answers.forEach((ans) => {
      if (ans.isCorrect) {
        score += ans.marks;
      }
    });

    const percentage = this.calculatePercentage(score, exam.totalMarks);
    const passed = this.determinePassFail(percentage, 40);

    const newResult = await db.insert(results).values({
      submissionId: submission.id,
      studentId: submission.studentId,
      examId: exam.id,
      score,
      totalMarks: exam.totalMarks,
      passed,
    }).returning();

    await db.update(submissions).set({ status: "completed", endTime: new Date() }).where(eq(submissions.id, submissionId));

    return (newResult[0] as unknown) as IResult;
  }
}
