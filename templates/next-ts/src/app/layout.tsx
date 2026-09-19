import type { Metadata } from "next";
import "../../theme.css";

export const metadata: Metadata = {
  title: "__PROJECT_NAME__",
  description: "__PROJECT_NAME__",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
