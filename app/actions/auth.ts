"use server";

import { AuthService } from "@/lib/services/AuthService";
import { setSession, clearSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { ApiResponse } from "@/lib/services/ApiResponse";

const authService = new AuthService();

export async function loginAction(prevState: any, formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Email and password are required" };
  }

  try {
    const user = await authService.login(email, password);
    await setSession({ id: user.id, email: user.email, role: user.role, name: user.name });
  } catch (error: any) {
    return { error: error.message };
  }
  
  // Need to redirect after try-catch to avoid swallowing NEXT_REDIRECT error
  redirect("/");
}

export async function registerAction(prevState: any, formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const role = formData.get("role") as "admin" | "student";

  if (!name || !email || !password || !role) {
    return { error: "All fields are required" };
  }

  try {
    const user = await authService.register(name, email, password, role);
    await setSession({ id: user.id, email: user.email, role: user.role, name: user.name });
  } catch (error: any) {
    return { error: error.message };
  }
  
  redirect("/");
}

export async function logoutAction() {
  clearSession();
  redirect("/login");
}
