import type { Metadata } from "next";
import "@/globals.css";

import { Toaster } from "sonner";
import { GoogleOAuthProvider } from "@react-oauth/google";

export const metadata: Metadata = {
  title: "DemandNest | Trusted Voice for your Brand content",
  description: "DemandNest | Trusted Voice for your Brand content",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <GoogleOAuthProvider
        clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ""}
      >
        <body>
          {children}
          <Toaster richColors />
        </body>
      </GoogleOAuthProvider>
    </html>
  );
}
