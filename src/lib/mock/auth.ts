import { NextRequest } from "next/server";

const COOKIE_NAME = "admin_session";
const ADMIN_EMAIL = "admin@admin.com";
const ADMIN_PASS = "thisisadmin";

// ── Client helpers ──

function setCookie(name: string, value: string, days = 7) {
  if (typeof document === "undefined") return;
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
}

function deleteCookie(name: string) {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; SameSite=Lax`;
}

function getCookie(name: string): string | undefined {
  if (typeof document === "undefined") return undefined;
  return document.cookie
    .split(";")
    .map((c) => c.trim())
    .find((c) => c.startsWith(name + "="))
    ?.split("=")[1];
}

// ── Auth functions (client) ──

export async function signIn(email: string, password: string): Promise<{ user: { id: string; email: string } | null; error: string | null }> {
  await new Promise((r) => setTimeout(r, 400)); // simulate network
  if (email === ADMIN_EMAIL && password === ADMIN_PASS) {
    setCookie(COOKIE_NAME, "mock-admin-token-12345");
    return { user: { id: "admin-1", email: ADMIN_EMAIL }, error: null };
  }
  return { user: null, error: "Credenciales inválidas" };
}

export async function signOut(): Promise<void> {
  deleteCookie(COOKIE_NAME);
}

export function getSession(): { user: { id: string; email: string; role: string } | null } {
  const token = getCookie(COOKIE_NAME);
  if (token === "mock-admin-token-12345") {
    return { user: { id: "admin-1", email: ADMIN_EMAIL, role: "admin" } };
  }
  return { user: null };
}

// ── Middleware helper ──

export function isAdminRequest(request: NextRequest): boolean {
  const token = request.cookies.get(COOKIE_NAME)?.value;
  return token === "mock-admin-token-12345";
}
