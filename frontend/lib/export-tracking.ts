import { getApiBaseUrl } from "./api-config";
import { getAuthToken } from "./auth-storage";

export async function downloadTrackingExport(
  format: "csv" | "json",
): Promise<void> {
  const token = getAuthToken();
  if (!token) {
    throw new Error("Inicia sesión para exportar los datos de tracking.");
  }

  const res = await fetch(
    `${getApiBaseUrl()}/api/components/export?format=${format}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );

  if (!res.ok) {
    const data = (await res.json().catch(() => ({}))) as { message?: string };
    throw new Error(data.message ?? `Error al exportar (${res.status})`);
  }

  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download =
    format === "csv" ? "component-tracking.csv" : "component-tracking.json";
  a.rel = "noopener";
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
