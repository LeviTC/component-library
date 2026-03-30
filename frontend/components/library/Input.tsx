"use client";

import {
  forwardRef,
  useId,
  useState,
  type InputHTMLAttributes,
} from "react";
import { EyeHideIcon, EyeShowIcon } from "@/components/library/icons/PasswordVisibilityIcons";
import { useComponentAnalytics } from "@/lib/component-analytics-context";

export type InputType = "text" | "email" | "password";
export type InputValidationState = "default" | "error" | "success";
export type InputSize = "sm" | "md" | "lg";

export interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size" | "type"> {
  type?: InputType;
  label: string;
  placeholder?: string;
  validationState?: InputValidationState;
  disabled?: boolean;
  size?: InputSize;
  className?: string;
  message?: string;
  showPasswordToggle?: boolean;
}

const fieldStateClass: Record<InputValidationState, string> = {
  default: "",
  error: "brutalist-field--error",
  success: "brutalist-field--success",
};

const inputStateClass: Record<InputValidationState, string> = {
  default: "",
  error: "brutalist-input--error",
  success: "brutalist-input--success",
};

const messageStateClass: Record<InputValidationState, string> = {
  default: "brutalist-message--default",
  error: "brutalist-message--error",
  success: "brutalist-message--success",
};

const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    type = "text",
    label,
    placeholder,
    validationState = "default",
    disabled = false,
    size = "md",
    className,
    message,
    showPasswordToggle = true,
    id: idProp,
    autoComplete,
    inputMode,
    onBlur,
    onFocus,
    ...rest
  },
  ref,
) {
  const analytics = useComponentAnalytics();
  const uid = useId();
  const id = idProp ?? `input-${uid}`;
  const messageId = message ? `${id}-message` : undefined;
  const toggleId = `${id}-toggle`;

  const [passwordVisible, setPasswordVisible] = useState(false);
  const isPassword = type === "password";
  const isEmail = type === "email";
  const showToggle = isPassword && showPasswordToggle && !disabled;
  const inputType =
    isPassword && !passwordVisible ? "password" : isPassword ? "text" : type;

  const sizeClass =
    size === "sm" ? "brutalist-input--sm" : size === "lg" ? "brutalist-input--lg" : "";

  const shellClass = [
    "brutalist-input-shell",
    showToggle ? "brutalist-input-shell--has-toggle" : "",
    showToggle && size === "sm" ? "brutalist-input-shell--sm" : "",
    showToggle && size === "lg" ? "brutalist-input-shell--lg" : "",
  ]
    .filter(Boolean)
    .join(" ");

  const inputClassName = [
    "brutalist-input",
    sizeClass,
    inputStateClass[validationState],
    className?.trim() ?? "",
  ]
    .filter(Boolean)
    .join(" ");

  const analyticsMeta = {
    ...(idProp != null && idProp !== ""
      ? { elementId: idProp }
      : { elementLabel: label }),
    ...(idProp != null && idProp !== "" ? { elementLabel: label } : {}),
  };

  return (
    <div
      className={`brutalist-field ${fieldStateClass[validationState]}`.trim()}
    >
      <div className={shellClass}>
        <input
          ref={ref}
          id={id}
          type={inputType}
          placeholder={placeholder}
          disabled={disabled}
          aria-invalid={validationState === "error" || undefined}
          aria-describedby={messageId}
          inputMode={inputMode ?? (isEmail ? "email" : undefined)}
          autoComplete={
            autoComplete ??
            (isPassword ? "current-password" : isEmail ? "email" : undefined)
          }
          autoCapitalize={isEmail ? "none" : undefined}
          className={inputClassName}
          onFocus={(e) => {
            onFocus?.(e);
            if (!disabled) {
              analytics?.track({
                componentName: "Input",
                variant: type,
                action: "focus",
                metadata: { ...analyticsMeta },
              });
            }
          }}
          onBlur={(e) => {
            onBlur?.(e);
            if (!disabled) {
              analytics?.track({
                componentName: "Input",
                variant: type,
                action: "blur",
                metadata: { ...analyticsMeta, validationState },
              });
            }
          }}
          {...rest}
        />
        {showToggle ? (
          <button
            id={toggleId}
            type="button"
            className="brutalist-input-toggle"
            aria-label={passwordVisible ? "Ocultar contraseña" : "Mostrar contraseña"}
            aria-pressed={passwordVisible}
            aria-controls={id}
            onClick={() => setPasswordVisible((v) => !v)}
          >
            {passwordVisible ? <EyeHideIcon /> : <EyeShowIcon />}
          </button>
        ) : null}
      </div>
      <label htmlFor={id} className="brutalist-label">
        {label}
      </label>
      {message ? (
        <p
          id={messageId}
          className={`brutalist-message ${messageStateClass[validationState]}`}
          role={validationState === "error" ? "alert" : "status"}
        >
          {message}
        </p>
      ) : null}
    </div>
  );
});

export default Input;
