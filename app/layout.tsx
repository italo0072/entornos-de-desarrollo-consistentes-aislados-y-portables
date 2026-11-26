import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Muelle | Bitácora de carga",
  description:
    "Panel de verificación de una aplicación Next.js contenerizada con Docker.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
