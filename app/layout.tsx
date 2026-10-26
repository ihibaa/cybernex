
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SecureSphere",
  description: "Cybersecurity learning and security testing platform",
};

const themeScript = `
  try {
    const theme = localStorage.getItem("securesphere_theme");
    document.documentElement.dataset.theme =
      theme === "light" ? "light" : "dark";
  } catch {
    document.documentElement.dataset.theme = "dark";
  }
`;

export default function RootLayout({
  children,
}: {
  children: import("react").ReactNode;
}) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
