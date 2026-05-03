export class ApiResponse<T> {
  constructor(
    public success: boolean,
    public message: string,
    public data?: T,
    public error?: string
  ) {}

  static success<T>(data: T, message: string = "Success"): ApiResponse<T> {
    return new ApiResponse<T>(true, message, data);
  }

  static error(message: string, error?: string): ApiResponse<any> {
    return new ApiResponse<any>(false, message, undefined, error);
  }
}
