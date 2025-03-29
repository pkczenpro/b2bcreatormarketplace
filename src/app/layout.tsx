import type { Metadata } from "next";
import '@/globals.css'

import { Toaster } from "sonner";
import { GoogleOAuthProvider } from "@react-oauth/google";

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
    <html lang="en" 
      style={{
        maxWidth: "1800px",
        margin: "0 auto",
      }}
    >
      <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ""}>
        <body>
          {children}
          <Toaster richColors />
        </body>
      </GoogleOAuthProvider>
    </html>
  );
}
