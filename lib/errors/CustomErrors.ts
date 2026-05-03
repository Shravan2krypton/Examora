export class AuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AuthError";
  }
}

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }
}

export class ExamNotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ExamNotFoundError";
  }
}

export class DuplicateSubmissionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "DuplicateSubmissionError";
  }
}

export class QuestionBankError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "QuestionBankError";
  }
}
