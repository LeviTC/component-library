import type { ReactNode } from "react";

const headerTones = {
  lime: "bg-lime-100",
  sky: "bg-sky-100",
  violet: "bg-violet-100",
  orange: "bg-orange-100",
} as const;

export type DemoSectionTone = keyof typeof headerTones;

export type DemoSectionProps = {
  id: string;
  eyebrow: string;
  title: string;
  description?: string;
  tone?: DemoSectionTone;
  children: ReactNode;
  className?: string;
};

export function DemoSection({
  id,
  eyebrow,
  title,
  description,
  tone = "lime",
  children,
  className = "",
}: DemoSectionProps) {
  const headerBg = headerTones[tone];

  return (
    <section
      className={`mx-auto w-full max-w-6xl ${className}`.trim()}
      aria-labelledby={id}
    >
      <div className="overflow-hidden rounded border-4 border-neutral-900 bg-white shadow-[8px_8px_0_0_#171717]">
        <header
          className={`flex flex-col gap-3 border-b-4 border-neutral-900 px-5 py-5 sm:flex-row sm:items-end sm:justify-between sm:px-6 ${headerBg}`}
        >
          <div className="min-w-0">
            <p className="m-0 font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-neutral-700">
              {eyebrow}
            </p>
            <h2
              id={id}
              className="m-0 mt-1 font-mono text-xl font-bold tracking-tight text-neutral-900 sm:text-2xl"
            >
              {title}
            </h2>
          </div>
          {description ? (
            <p className="m-0 max-w-xl font-mono text-sm leading-relaxed text-neutral-700">
              {description}
            </p>
          ) : null}
        </header>
        <div className="bg-[linear-gradient(180deg,#fafafa_0%,#f5f5f5_100%)] p-5 sm:p-8">
          {children}
        </div>
      </div>
    </section>
  );
}

export function DemoSubBlock({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <h3 className="m-0 font-mono text-xs font-bold uppercase tracking-wide text-neutral-800">
          {label}
        </h3>
        {hint ? (
          <span className="font-mono text-xs text-neutral-500">{hint}</span>
        ) : null}
      </div>
      <div className="rounded border-2 border-neutral-900 bg-white p-4 shadow-[4px_4px_0_0_#171717] sm:p-5">
        {children}
      </div>
    </div>
  );
}
