import { getApiBaseUrl } from "./api-config";

export interface ComponentsStats {
  totalEvents: number;
  byComponent: { name: string; count: number }[];
  byAction: { action: string; count: number }[];
  lastEvent: {
    at: string;
    componentName: string;
    action: string;
    variant?: string;
  } | null;
  updatedAt: string;
}

export async function fetchComponentsStats(): Promise<ComponentsStats> {
  const res = await fetch(`${getApiBaseUrl()}/api/components/stats`, {
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error(`No se pudieron cargar las estadísticas (${res.status})`);
  }
  return res.json() as Promise<ComponentsStats>;
}
