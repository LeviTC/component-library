"use client";

import Image from "next/image";
import type { ReactNode } from "react";

export type CardBorderVariant = "solid" | "thick" | "double" ;

export type CardTone = "primary" | "secondary" | "danger";

export interface CardProps {
  children: ReactNode;
  header?: ReactNode;
  footer?: ReactNode;
  image?: ReactNode;
  imageSrc?: string;
  imageAlt?: string;
  borderVariant?: CardBorderVariant;
  tone?: CardTone;
  className?: string;
  as?: "article" | "div" | "section";
}

export default function Card({
  children,
  header,
  footer,
  image,
  imageSrc,
  imageAlt = "",
  borderVariant = "solid",
  tone = "primary",
  className,
  as: Tag = "article",
}: CardProps) {
  const rootClass = [
    "brutalist-card",
    `brutalist-card--${borderVariant}`,
    `brutalist-card--tone-${tone}`,
    className?.trim() ?? "",
  ]
    .filter(Boolean)
    .join(" ");

  const media =
    image ??
    (imageSrc ? (
      <Image
        src={imageSrc}
        alt={imageAlt}
        fill
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 360px"
        className="object-cover"
      />
    ) : null);

  return (
    <Tag className={rootClass}>
      {media != null ? (
        <div className="brutalist-card-media">{media}</div>
      ) : null}
      {header != null && header !== false ? (
        <header className="brutalist-card-header">
          {typeof header === "string" ? (
            <h3 className="brutalist-card-title">{header}</h3>
          ) : (
            header
          )}
        </header>
      ) : null}
      <div className="brutalist-card-body">{children}</div>
      {footer != null && footer !== false ? (
        <footer className="brutalist-card-footer">{footer}</footer>
      ) : null}
    </Tag>
  );
}
