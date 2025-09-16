import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./index.css";
import { Providers } from "./providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Burhanudin Nuban Portfolio",
  description: "Hi, my name is Burhanudin Nuban, a 27-year-old Fullstack Developer and DevSecOps Engineer with over 6 years of professional experience in software engineering. I am passionate about building secure, scalable, and efficient systems that align development, security, and operations. I specialize in end-to-end development using modern technologies such as ReactJS, React Native, Laravel, .NET, and Spring Boot, and I work fluently in Linux environments. On the DevSecOps side, I implement Wazuh for threat detection, and use Grafana, Prometheus, and alert monitoring servers to maintain real-time system health and security awareness. Known for being highly adaptive, I thrive in dynamic environments and quickly learn new tools and technologies. I consistently deliver robust and secure systems by combining software development expertise with strong DevSecOps principles, secure CI/CD automation, and proactive infrastructure monitoring.",
  applicationName: "Burhanudin Nuban Portfolio",
  authors: [{name: "Burhanudin Nuban", url: "https://www.linkedin.com/in/burhanudin-nuban-264b2a97/"}]
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
