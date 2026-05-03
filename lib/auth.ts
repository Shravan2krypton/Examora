import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { AuthError } from "./errors/CustomErrors";

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "super-secret-key-examora-fallback-change-me-in-prod");

export async function signToken(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(SECRET);
}

export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, SECRET);
    return payload;
  } catch (error) {
    throw new AuthError("Invalid or expired token");
  }
}

export async function getSession() {
  const token = cookies().get("session")?.value;
  if (!token) return null;
  try {
    return await verifyToken(token);
  } catch {
    return null;
  }
}

export async function setSession(user: { id: string, email: string, role: string, name: string }) {
  const token = await signToken(user);
  cookies().set("session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24, // 1 day
  });
}

export function clearSession() {
  cookies().delete("session");
}
