
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SecureSphere",
  description: "Cybersecurity learning and security testing platform",
};

export default function RootLayout({
  children,
}: {
  children: import("react").ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
