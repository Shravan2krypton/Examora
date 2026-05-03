export interface IUser {
  id: string;
  name: string;
  email: string;
  role: "admin" | "student";
}

export interface IQuestion {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number;
  marks: number;
  difficulty: "easy" | "medium" | "hard";
  subject: string;
}

export interface IExam {
  id: string;
  title: string;
  subject: string;
  duration: number;
  totalMarks: number;
  startTime: Date | null;
  endTime: Date | null;
}

export interface IResult {
  id: string;
  submissionId: string;
  studentId: string;
  examId: string;
  score: number;
  totalMarks: number;
  passed: boolean;
}

export interface IEvaluator {
  evaluate(submissionId: string): Promise<IResult>;
}

export interface ILeaderboard {
  rank: number;
  studentName: string;
  score: number;
  submissionTime: Date;
}
