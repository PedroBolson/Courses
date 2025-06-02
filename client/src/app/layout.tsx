import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Cursos ENEM",
  description: "Passe com tranquilidade no ENEM",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`antialiased`}>
        {children}
      </body>
    </html>
  );
}
