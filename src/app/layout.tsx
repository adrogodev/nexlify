import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";
import { AuthGuard } from "@/src/shared/guard/auth-guard";
import { Providers } from "@/src/shared/stores/provider";


const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
});


export const metadata: Metadata = {
  title: "Nexlify",
  icons: {
    icon: "/assets/svgs/icon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${nunito.variable} antialiased`}>
      <body>
        <Providers>
          <AuthGuard>
            <main>{children}</main>
          </AuthGuard>
        </Providers>
      </body>
    </html>
  );
}
