/**
 * Tokens de diseño: colores, espaciado, tipografía, radios y primitivos de layout.
 * `buildDesignTokensRootCss()` genera el bloque `:root` inyectado en el layout para
 * que CSS y JS compartan los mismos valores.
 */

export const designTokens = {
  color: {
    black: "#000000",
    white: "#ffffff",
    primary: "#4a90e2",
    primaryShadow: "#2563eb",
    secondary: "#facc15",
    secondaryShadow: "#ca8a04",
    placeholder: "#888888",
    danger: "#991b1b",
    dangerShadow: "#7a0a16",
    /** Sombra / hover danger (botones) */
    dangerHoverShadow: "#450a0a",
    dangerFocusRing: "#7f1d1d",
    success: "#15803d",
    successFocusRing: "#166534",
    neutralMediaBg: "#f5f5f5",
    overlayScrim: "rgba(0, 0, 0, 0.45)",
  },
  /** Longitudes en px usadas en sombras, bordes y espaciado fijo brutalista */
  spacePx: {
    1: "1px",
    2: "2px",
    3: "3px",
    4: "4px",
    5: "5px",
    6: "6px",
    7: "7px",
    8: "8px",
    10: "10px",
    12: "12px",
    13: "13px",
    14: "14px",
    15: "15px",
    16: "16px",
    18: "18px",
    20: "20px",
    22: "22px",
  },
  borderWidth: {
    sm: "3px",
    md: "4px",
    lg: "6px",
    /** Foco / outline (distinto del borde de 3px) */
    outline: "2px",
  },
  /** Tamaños en `rem` para tipografía fluida */
  fontSizeRem: {
    cardBody: "0.875rem",
    cardBodyUp: "0.9375rem",
    cardHeaderUp: "1.0625rem",
    modalTitle: "1.125rem",
    modalTitleUp: "1.25rem",
    modalBody: "0.9375rem",
    modalBodyUp: "1rem",
  },
  scale: {
    cardMediaHover: 1.06,
  },
  fontFamily: {
    mono:
      "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
  },
  fontSize: {
    xs: "12px",
    sm: "14px",
    base: "16px",
    md: "18px",
    lg: "20px",
  },
  fontWeight: {
    bold: 700,
  },
  lineHeight: {
    body: 1.5,
    relaxed: 1.55,
  },
  radius: {
    none: "0",
  },
  zIndex: {
    modal: 200,
  },
  motion: {
    durationFast: "0.2s",
    durationMd: "0.3s",
    durationSlow: "0.35s",
    durationImage: "0.45s",
    easingStandard: "cubic-bezier(0.25, 0.8, 0.25, 1)",
    spinnerRotate: "0.75s",
  },
  opacity: {
    disabled: 0.55,
    muted: 0.65,
  },
  component: {
    spinner: {
      sm: 14,
      md: 18,
      lg: 22,
      borderSm: 2,
    },
  },
} as const;

/** Referencias `var(--…)` para estilos en línea o lógica en TS */
export const cssVars = {
  black: "var(--brutalist-black)",
  white: "var(--brutalist-white)",
  primary: "var(--brutalist-primary)",
  danger: "var(--brutalist-danger)",
  success: "var(--brutalist-success)",
  accent: "var(--brutalist-accent)",
} as const;

function pxVars(): string {
  return Object.entries(designTokens.spacePx)
    .map(([k, v]) => `  --ds-px-${k}: ${v};`)
    .join("\n");
}

/**
 * Bloque CSS completo para `<style>` en el documento (antes de `brutalist.css`).
 */
export function buildDesignTokensRootCss(): string {
  const c = designTokens.color;
  const b = designTokens.borderWidth;
  const fsr = designTokens.fontSizeRem;
  const f = designTokens.fontFamily;
  const fs = designTokens.fontSize;
  const sc = designTokens.scale;
  const fw = designTokens.fontWeight;
  const lh = designTokens.lineHeight;
  const r = designTokens.radius;
  const z = designTokens.zIndex;
  const m = designTokens.motion;
  const o = designTokens.opacity;
  const sp = designTokens.component.spinner;

  return `:root {
  --brutalist-black: ${c.black};
  --brutalist-white: ${c.white};
  --brutalist-primary: ${c.primary};
  --brutalist-primary-shadow: ${c.primaryShadow};
  --brutalist-secondary: ${c.secondary};
  --brutalist-secondary-shadow: ${c.secondaryShadow};
  --brutalist-accent: ${c.primary};
  --brutalist-placeholder: ${c.placeholder};
  --brutalist-danger: ${c.danger};
  --brutalist-danger-shadow: ${c.dangerShadow};
  --brutalist-danger-hover-shadow: ${c.dangerHoverShadow};
  --brutalist-danger-focus-ring: ${c.dangerFocusRing};
  --brutalist-success: ${c.success};
  --brutalist-success-focus-ring: ${c.successFocusRing};
  --brutalist-neutral-media-bg: ${c.neutralMediaBg};
  --brutalist-overlay-scrim: ${c.overlayScrim};

  --ds-border-width-sm: ${b.sm};
  --ds-border-width-md: ${b.md};
  --ds-border-width-lg: ${b.lg};
  --ds-outline-width: ${b.outline};

  --ds-font-size-rem-card-body: ${fsr.cardBody};
  --ds-font-size-rem-card-body-up: ${fsr.cardBodyUp};
  --ds-font-size-rem-card-header-up: ${fsr.cardHeaderUp};
  --ds-font-size-rem-modal-title: ${fsr.modalTitle};
  --ds-font-size-rem-modal-title-up: ${fsr.modalTitleUp};
  --ds-font-size-rem-modal-body: ${fsr.modalBody};
  --ds-font-size-rem-modal-body-up: ${fsr.modalBodyUp};

  --ds-scale-card-media-hover: ${sc.cardMediaHover};

${pxVars()}

  --ds-font-mono: ${f.mono};
  --ds-font-size-xs: ${fs.xs};
  --ds-font-size-sm: ${fs.sm};
  --ds-font-size-base: ${fs.base};
  --ds-font-size-md: ${fs.md};
  --ds-font-size-lg: ${fs.lg};
  --ds-font-weight-bold: ${fw.bold};
  --ds-line-height-body: ${lh.body};
  --ds-line-height-relaxed: ${lh.relaxed};

  --ds-radius-none: ${r.none};

  --ds-z-modal: ${z.modal};

  --ds-duration-fast: ${m.durationFast};
  --ds-duration-md: ${m.durationMd};
  --ds-duration-slow: ${m.durationSlow};
  --ds-duration-image: ${m.durationImage};
  --ds-easing-standard: ${m.easingStandard};
  --ds-spinner-duration: ${m.spinnerRotate};

  --ds-opacity-disabled: ${o.disabled};
  --ds-opacity-muted: ${o.muted};

  --ds-spinner-sm: ${sp.sm}px;
  --ds-spinner-md: ${sp.md}px;
  --ds-spinner-lg: ${sp.lg}px;
  --ds-spinner-border-sm: ${sp.borderSm}px;
}`.trim();
}

/** CSS listo para inyectar en `<head>` (valores alineados con `designTokens`). */
export const designTokensRootCss = buildDesignTokensRootCss();
