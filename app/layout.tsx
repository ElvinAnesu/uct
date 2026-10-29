import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Amathuba Multilingual Glossary",
  description: "Engineering Built Environment • UCT",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
