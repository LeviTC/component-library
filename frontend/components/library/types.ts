/**
 * Tipos públicos de la librería (solo TypeScript; no aporta JS en runtime).
 * Uso: `import type { … } from "@/components/library/types"`
 * o seguir importando desde `@/components/library` (reexportados en index).
 */

export type { ButtonProps, ButtonSize, ButtonVariant } from "./Button";
export type { CardBorderVariant, CardProps, CardTone } from "./Card";
export type {
  InputProps,
  InputSize,
  InputType,
  InputValidationState,
} from "./Input";
export type { ModalProps, ModalSize } from "./Modal";
export type { SpinnerProps, SpinnerSize } from "./Spinner";
