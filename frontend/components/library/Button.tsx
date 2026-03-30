"use client";

import { useId, type ReactNode } from "react";
import { Spinner } from "@/components/library/Spinner";
import { useComponentAnalytics } from "@/lib/component-analytics-context";

export type ButtonVariant = "primary" | "secondary" | "danger";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps {
  children?: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
  loading?: boolean;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  type?: "button" | "submit" | "reset";
  id?: string;
  trackingLabel?: string;
}

const iconSvgSize: Record<ButtonSize, string> = {
  sm: "[&_svg]:h-3.5 [&_svg]:w-3.5 sm:[&_svg]:h-3 sm:[&_svg]:w-3",
  md: "[&_svg]:h-4 [&_svg]:w-4 sm:[&_svg]:h-[18px] sm:[&_svg]:w-[18px]",
  lg: "[&_svg]:h-5 [&_svg]:w-5 sm:[&_svg]:h-[22px] sm:[&_svg]:w-[22px]",
};

function ButtonInner({
  loading,
  size,
  startIcon,
  endIcon,
  children,
}: {
  loading: boolean;
  size: ButtonSize;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  children?: ReactNode;
}) {
  const iconWrap = iconSvgSize[size];

  const row = (
    <>
      {startIcon != null ? (
        <span className={`inline-flex shrink-0 items-center justify-center ${iconWrap}`}>
          {startIcon}
        </span>
      ) : null}
      {children != null && children !== false ? (
        <span className="min-w-0">{children}</span>
      ) : null}
      {endIcon != null ? (
        <span className={`inline-flex shrink-0 items-center justify-center ${iconWrap}`}>
          {endIcon}
        </span>
      ) : null}
    </>
  );

  if (!loading) {
    return (
      <span className="inline-flex items-center justify-center gap-2">{row}</span>
    );
  }

  return (
    <>
      <span className="pointer-events-none invisible inline-flex items-center justify-center gap-2">
        {row}
      </span>
      <span
        className="pointer-events-none absolute inset-0 flex items-center justify-center"
        aria-hidden
      >
        <Spinner size={size} />
      </span>
    </>
  );
}

export default function Button({
  children,
  onClick,
  disabled = false,
  variant = "primary",
  size = "md",
  className,
  loading = false,
  startIcon,
  endIcon,
  type = "button",
  id: idProp,
  trackingLabel,
}: ButtonProps) {
  const analytics = useComponentAnalytics();
  const uid = useId();
  const domId =
    idProp != null && String(idProp).trim() !== ""
      ? String(idProp).trim()
      : `btn-${uid.replace(/:/g, "")}`;

  const stringChild =
    typeof children === "string" ? children.trim() || undefined : undefined;
  const resolvedLabel = trackingLabel ?? stringChild;
  const hasExplicitId = idProp != null && String(idProp).trim() !== "";
  const analyticsMeta: Record<string, string> = {};
  if (hasExplicitId) {
    analyticsMeta.elementId = String(idProp).trim();
  }
  if (hasExplicitId && resolvedLabel) {
    analyticsMeta.elementLabel = resolvedLabel;
  }
  if (!hasExplicitId && resolvedLabel) {
    analyticsMeta.elementLabel = resolvedLabel;
  }

  const finalClassName = [
    "brutalist-btn",
    `brutalist-btn--${size}`,
    `brutalist-btn--${variant}`,
    loading ? "brutalist-btn--loading" : "",
    className?.trim() ?? "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      id={domId}
      type={type}
      onClick={() => {
        onClick?.();
        if (!disabled && !loading) {
          analytics?.track({
            componentName: "Button",
            variant,
            action: "click",
            ...(Object.keys(analyticsMeta).length > 0
              ? { metadata: analyticsMeta }
              : {}),
          });
        }
      }}
      disabled={disabled || loading}
      className={finalClassName}
      aria-busy={loading || undefined}
    >
      <ButtonInner
        loading={loading}
        size={size}
        startIcon={startIcon}
        endIcon={endIcon}
      >
        {children}
      </ButtonInner>
    </button>
  );
}
