import { mergeComponentsStatsOptimistic } from "../merge-components-stats";
import type { ComponentsStats } from "../components-stats-api";

describe("mergeComponentsStatsOptimistic", () => {
  const base: ComponentsStats = {
    totalEvents: 2,
    byComponent: [
      { name: "Button", count: 2 },
      { name: "Input", count: 0 },
    ].filter((x) => x.count > 0),
    byAction: [{ action: "click", count: 2 }],
    lastEvent: {
      at: "2020-01-01T00:00:00.000Z",
      componentName: "Button",
      action: "click",
      variant: "primary",
    },
    updatedAt: "2020-01-01T00:00:00.000Z",
  };

  it("devuelve null si no hay base ni pendientes", () => {
    expect(mergeComponentsStatsOptimistic(null, [])).toBeNull();
  });

  it("incrementa total, listas y último evento con un pendiente", () => {
    const merged = mergeComponentsStatsOptimistic(base, [
      {
        componentName: "Input",
        action: "focus",
        variant: "text",
      },
    ]);
    expect(merged?.totalEvents).toBe(3);
    expect(merged?.byAction.find((r) => r.action === "focus")?.count).toBe(1);
    expect(merged?.byComponent.find((r) => r.name === "Input")?.count).toBe(1);
    expect(merged?.lastEvent?.componentName).toBe("Input");
    expect(merged?.lastEvent?.action).toBe("focus");
  });

  it("sin pendientes devuelve copia del base", () => {
    const merged = mergeComponentsStatsOptimistic(base, []);
    expect(merged?.totalEvents).toBe(base.totalEvents);
    expect(merged).not.toBe(base);
  });

  it("con base null y pendientes construye solo lo optimista", () => {
    const merged = mergeComponentsStatsOptimistic(null, [
      { componentName: "Button", action: "click", variant: "danger" },
    ]);
    expect(merged?.totalEvents).toBe(1);
    expect(merged?.byComponent).toEqual([{ name: "Button", count: 1 }]);
    expect(merged?.byAction).toEqual([{ action: "click", count: 1 }]);
  });
});
