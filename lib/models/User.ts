import { IUser } from "./interfaces";

export abstract class User implements IUser {
  constructor(
    public id: string,
    public name: string,
    public email: string,
    public role: "admin" | "student"
  ) {}

  // Polymorphic method
  abstract getDashboardData(): Promise<any>;
}
