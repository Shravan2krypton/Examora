import { IEvaluator, IResult } from "../models/interfaces";

export abstract class AbstractEvaluator implements IEvaluator {
  abstract evaluate(submissionId: string): Promise<IResult>;
  
  protected calculatePercentage(score: number, totalMarks: number): number {
    if (totalMarks === 0) return 0;
    return (score / totalMarks) * 100;
  }
  
  protected determinePassFail(percentage: number, passingPercentage: number = 40): boolean {
    return percentage >= passingPercentage;
  }
}
