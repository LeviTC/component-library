import { getApiBaseUrl } from "./api-config";
import { clearAuthToken, setAuthToken } from "./auth-storage";

export async function loginApi(
  email: string,
  password: string,
): Promise<{ token: string }> {
  const res = await fetch(`${getApiBaseUrl()}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const data = (await res.json().catch(() => ({}))) as {
    message?: string;
    token?: string;
  };
  if (!res.ok) {
    throw new Error(data.message ?? `Error ${res.status}`);
  }
  if (!data.token) throw new Error("Respuesta sin token");
  setAuthToken(data.token);
  return { token: data.token };
}

export async function registerApi(
  email: string,
  password: string,
): Promise<{ token: string }> {
  const res = await fetch(`${getApiBaseUrl()}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const data = (await res.json().catch(() => ({}))) as {
    message?: string;
    token?: string;
  };
  if (!res.ok) {
    throw new Error(data.message ?? `Error ${res.status}`);
  }
  if (!data.token) throw new Error("Respuesta sin token");
  setAuthToken(data.token);
  return { token: data.token };
}

export async function logoutApi(): Promise<void> {
  try {
    await fetch(`${getApiBaseUrl()}/api/auth/logout`, { method: "POST" });
  } catch {
    void 0;
  }
  clearAuthToken();
}
