/**
 * Placeholder de carga para el panel de estadísticas (misma rejilla que el contenido
 * final → menos CLS). Sin "use client": solo presentacional; se empaqueta con el
 * componente cliente que lo importa.
 */

function Shimmer({ className }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-md bg-neutral-200/90 ${className ?? ""}`}
      aria-hidden
    />
  );
}

export function StatsDashboardSkeleton() {
  return (
    <div
      className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
      role="status"
      aria-busy="true"
      aria-live="polite"
      aria-label="Cargando estadísticas"
    >
      <span className="sr-only">Cargando estadísticas…</span>

      <div className="rounded border-2 border-neutral-900 bg-white p-4 font-mono shadow-[3px_3px_0_0_#171717]">
        <Shimmer className="mb-3 h-3 w-36" />
        <Shimmer className="mb-2 h-10 w-20 max-w-full" />
        <Shimmer className="h-3 w-44 max-w-full" />
      </div>

      <div className="rounded border-2 border-neutral-900 bg-white p-4 font-mono shadow-[3px_3px_0_0_#171717] sm:col-span-2 lg:col-span-1">
        <Shimmer className="mb-3 h-3 w-28" />
        <div className="mt-2 space-y-2">
          <Shimmer className="h-4 w-full max-w-md" />
          <Shimmer className="h-3 w-40" />
        </div>
      </div>

      <div className="rounded border-2 border-neutral-900 bg-white p-4 font-mono shadow-[3px_3px_0_0_#171717] sm:col-span-2 lg:col-span-2">
        <Shimmer className="mb-3 h-3 w-32" />
        <ul className="m-0 mt-2 max-h-32 list-none space-y-2 overflow-hidden p-0">
          {(["a", "b", "c", "d"] as const).map((k) => (
            <li key={k} className="flex justify-between gap-2 pb-1">
              <Shimmer className="h-4 flex-1 max-w-[12rem]" />
              <Shimmer className="h-4 w-8 shrink-0" />
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded border-2 border-neutral-900 bg-white p-4 font-mono shadow-[3px_3px_0_0_#171717] lg:col-span-1">
        <Shimmer className="mb-3 h-3 w-24" />
        <ul className="m-0 mt-2 max-h-32 list-none space-y-2 overflow-hidden p-0">
          {(["e", "f", "g"] as const).map((k) => (
            <li key={k} className="flex justify-between gap-2 pb-1">
              <Shimmer className="h-4 flex-1 max-w-[10rem]" />
              <Shimmer className="h-4 w-8 shrink-0" />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
