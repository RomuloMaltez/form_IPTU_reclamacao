import type { Metadata } from "next";
import { Geist, Geist_Mono, Poppins } from "next/font/google";
import "./globals.css";
import Footer from "@/components/Footer/Footer";
import Header from "@/components/Header/Header";


const poppins = Poppins({
    subsets: ["latin"],
    weight: ["300", "400", "500", "600", "700"],
    variable: "--font-poppins",
});

export const metadata: Metadata = {
    title: "SEMEC - Impugnação de Lançamento do IPTU",
    description: "Geração de PDF de Impugnação de Lançamento do IPTU",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="pt-BR">
            <body
                className={`${poppins.variable} font-sans antialiased`}
            >
                <Header />
                {children}
                <Footer />
            </body>
        </html>
    );
}
