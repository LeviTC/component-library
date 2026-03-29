"use client";

export type SpinnerSize = "sm" | "md" | "lg";

const sizeClasses: Record<SpinnerSize, string> = {
  sm: "h-3.5 w-3.5 border-[2px]",
  md: "h-[18px] w-[18px] border-2",
  lg: "h-[22px] w-[22px] border-2",
};

export interface SpinnerProps {
  size?: SpinnerSize;
  className?: string;
}

export function Spinner({ size = "md", className = "" }: SpinnerProps) {
  return (
    <span
      aria-hidden
      className={
        "box-border inline-block shrink-0 rounded-full border-solid border-current " +
        "border-t-transparent animate-spin [animation-duration:0.75s] " +
        `${sizeClasses[size]} ${className}`.trim()
      }
    />
  );
}
