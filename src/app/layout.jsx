import AuthSession from "./_component/AuthSession";
import "./globals.css";
import { Noto_Sans_KR } from "next/font/google";
const noto = Noto_Sans_KR({ subsets: ["latin"], weight: ["400"] });

export const viewport = {
  themeColor: "#3A3A3B",
  width: "device-width",
  initialScale: 1,
  minimumScale: 1,
  viewportFit: "cover",
};

export const metadata = {
  title: "KKMC_MES",
  description: "KKMC_MES",
  manifest: "/manifest.json",
  icons: [
    { rel: "icon", url: "/icons/pwa-icons/icon-192x192.png", sizes: "192x192" },
    { rel: "icon", url: "/icons/pwa-icons/icon-256x256.png", sizes: "256x256" },
    { rel: "icon", url: "/icons/pwa-icons/icon-384x384.png", sizes: "384x384" },
    { rel: "icon", url: "/icons/pwa-icons/icon-512x512.png", sizes: "512x512" },
  ],
};

export default function RooyLayout({ children }) {
  return (
    <html lang="ko">
      <link rel="/manifest" href="/manifest.json"></link>
      <body className={noto.className}>
        <AuthSession>{children}</AuthSession>
      </body>
    </html>
  );
}
