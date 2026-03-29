import type { Metadata } from "next";
import { IBM_Plex_Mono } from "next/font/google";
import SiteHeader from "@/components/SiteHeader";
import { ComponentAnalyticsProvider } from "@/lib/component-analytics-context";
import "./globals.css";

export const metadata: Metadata = {
  title: "Component Library — Demo y analíticas",
  description:
    "Librería de componentes con tracking integrado y panel de estadísticas.",
};

const IBM_PLEX_MONO = IBM_Plex_Mono({
  weight: [ "100", "200", "300", "400", "500", "600", "700"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={IBM_PLEX_MONO.className}>
      <body className="flex min-h-full flex-col">
        <ComponentAnalyticsProvider>
          <SiteHeader />
          {children}
        </ComponentAnalyticsProvider>
      </body>
    </html>
  );
}
