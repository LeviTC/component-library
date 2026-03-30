"use client";

import {
  useEffect,
  useId,
  useRef,
  type PointerEvent,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { CloseIcon } from "@/components/library/icons/CloseIcon";
import { useComponentAnalytics } from "@/lib/component-analytics-context";

export type ModalSize = "sm" | "md" | "lg";

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: ReactNode;
  header?: ReactNode;
  footer?: ReactNode;
  size?: ModalSize;
  className?: string;
  closeOnOverlayClick?: boolean;
  hideCloseButton?: boolean;
  closeButtonLabel?: string;
  ariaLabel?: string;
}

export default function Modal({
  open,
  onClose,
  children,
  title,
  header,
  footer,
  size = "md",
  className,
  closeOnOverlayClick = true,
  hideCloseButton = false,
  closeButtonLabel = "Cerrar modal",
  ariaLabel = "Ventana de diálogo",
}: ModalProps) {
  const analytics = useComponentAnalytics();
  const panelRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const headerMain = header ?? title;
  const hasLabel =
    headerMain != null &&
    headerMain !== false &&
    headerMain !== "";


  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  const prevOpenRef = useRef(false);
  useEffect(() => {
    if (open && !prevOpenRef.current) {
      analytics?.track({
        componentName: "Modal",
        variant: size,
        action: "open",
      });
    }
    if (!open && prevOpenRef.current) {
      analytics?.track({
        componentName: "Modal",
        variant: size,
        action: "close",
      });
    }
    prevOpenRef.current = open;
  }, [open, size, analytics]);

  useEffect(() => {
    if (!open || !panelRef.current) return;
    const root = panelRef.current;
    const focusable = root.querySelector<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    );
    (focusable ?? root).focus();
  }, [open]);

  if (!open) return null;

  const panelClass = [
    "brutalist-modal-panel",
    `brutalist-modal-panel--${size}`,
    className?.trim() ?? "",
  ]
    .filter(Boolean)
    .join(" ");

  const onBackdropPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (!closeOnOverlayClick) return;
    if (e.target === e.currentTarget) onClose();
  };

  return createPortal(
    <div className="brutalist-modal-root" role="presentation">
      <div
        className="brutalist-modal-backdrop"
        aria-hidden
        onPointerDown={onBackdropPointerDown}
      />
      <div className="brutalist-modal-center">
        <div
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby={hasLabel ? titleId : undefined}
          aria-label={hasLabel ? undefined : ariaLabel}
          tabIndex={-1}
          className={panelClass}
        >
          <header className="brutalist-modal-header">
            <div
              className="brutalist-modal-header-main"
              id={hasLabel ? titleId : undefined}
            >
              {headerMain != null && headerMain !== false ? (
                typeof headerMain === "string" ? (
                  <h2 className="brutalist-modal-title">{headerMain}</h2>
                ) : (
                  headerMain
                )
              ) : null}
            </div>
            {!hideCloseButton ? (
              <button
                type="button"
                className="brutalist-modal-close"
                aria-label={closeButtonLabel}
                onClick={onClose}
              >
                <CloseIcon />
              </button>
            ) : null}
          </header>
          <div className="brutalist-modal-body">{children}</div>
          {footer != null ? (
            <footer className="brutalist-modal-footer">{footer}</footer>
          ) : null}
        </div>
      </div>
    </div>,
    document.body,
  );
}
