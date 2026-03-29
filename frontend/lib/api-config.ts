/**
 * URL base del API Express (sin barra final).
 */
export function getApiBaseUrl(): string {
  const raw = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";
  return raw.replace(/\/$/, "");
}
