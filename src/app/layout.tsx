import type { Metadata } from "next";

import '@/globals.css'
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "B2B",
  description: "B2B",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
        <Toaster richColors />
      </body>
    </html>
  );
}
