import { db } from "../db";
import { users } from "../schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { AuthError } from "../errors/CustomErrors";
import { IUser } from "../models/interfaces";

export class AuthService {
  async login(email: string, password: string): Promise<IUser> {
    const result = await db.select().from(users).where(eq(users.email, email)).limit(1);
    if (result.length === 0) throw new AuthError("Invalid credentials");
    
    const user = result[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new AuthError("Invalid credentials");

    return user as IUser;
  }

  async register(name: string, email: string, password: string, role: "admin" | "student"): Promise<IUser> {
    const existingUser = await db.select().from(users).where(eq(users.email, email)).limit(1);
    if (existingUser.length > 0) {
      throw new AuthError("Email is already registered");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await db.insert(users).values({
      name,
      email,
      password: hashedPassword,
      role
    }).returning();

    return result[0] as IUser;
  }
}
