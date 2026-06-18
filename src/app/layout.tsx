import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "@jaokdev — João Vitor",
  description: "Desenvolvedor web freelancer. Animações que outros fingem que não conseguem fazer.",
  keywords: ["portfolio", "freelancer", "Next.js", "animações", "web developer"],
  openGraph: {
    title: "@jaokdev — João Vitor",
    description: "Código limpo. Animações absurdas. Resultados reais.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={inter.variable}>
      <body className="bg-[#07070f] text-white overflow-x-hidden">
        <div className="noise-overlay" aria-hidden="true" />
        {children}
      </body>
    </html>
  );
}
