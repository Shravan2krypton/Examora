import { db } from "../db";
import { results, users } from "../schema";
import { desc, eq } from "drizzle-orm";
import { ILeaderboard } from "../models/interfaces";

export class LeaderboardService {
  async generateLeaderboard(examId?: string): Promise<ILeaderboard[]> {
    // Generate overall leaderboard or specific exam leaderboard
    let query = db
      .select({
        score: results.score,
        studentName: users.name,
        submissionTime: results.createdAt,
      })
      .from(results)
      .innerJoin(users, eq(results.studentId, users.id))
      .orderBy(desc(results.score), desc(results.createdAt));

    if (examId) {
      query = query.where(eq(results.examId, examId)) as any;
    }

    const data = await query;
    return data.map((item, index) => ({
      rank: index + 1,
      studentName: item.studentName,
      score: item.score,
      submissionTime: item.submissionTime,
    }));
  }
}
