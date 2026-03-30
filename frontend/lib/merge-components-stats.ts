import type { ComponentTrackPayload } from "./component-analytics-context";
import type { ComponentsStats } from "./components-stats-api";

/**
 * Mezcla estadísticas del servidor con eventos de tracking aún no reflejados
 * en el siguiente poll (actualización optimista).
 */
export function mergeComponentsStatsOptimistic(
  base: ComponentsStats | null,
  pending: readonly ComponentTrackPayload[],
): ComponentsStats | null {
  if (!base && pending.length === 0) return null;

  const b: ComponentsStats =
    base ??
    ({
      totalEvents: 0,
      byComponent: [],
      byAction: [],
      lastEvent: null,
      updatedAt: new Date().toISOString(),
    } satisfies ComponentsStats);

  if (pending.length === 0) {
    return { ...b };
  }

  let total = b.totalEvents;
  const comp = new Map(b.byComponent.map((x) => [x.name, x.count]));
  const act = new Map(b.byAction.map((x) => [x.action, x.count]));
  let lastEvent = b.lastEvent;
  let updatedAt = b.updatedAt;

  for (const p of pending) {
    const at = new Date().toISOString();
    total += 1;
    comp.set(p.componentName, (comp.get(p.componentName) ?? 0) + 1);
    act.set(p.action, (act.get(p.action) ?? 0) + 1);
    lastEvent = {
      at,
      componentName: p.componentName,
      action: p.action,
      variant: p.variant,
    };
    updatedAt = at;
  }

  const byComponent = Array.from(comp.entries())
    .map(([name, count]) => ({ name, count }))
    .sort(
      (a, b) => b.count - a.count || a.name.localeCompare(b.name, "es"),
    );
  const byAction = Array.from(act.entries())
    .map(([action, count]) => ({ action, count }))
    .sort(
      (a, b) => b.count - a.count || a.action.localeCompare(b.action, "es"),
    );

  return {
    totalEvents: total,
    byComponent,
    byAction,
    lastEvent,
    updatedAt,
  };
}
