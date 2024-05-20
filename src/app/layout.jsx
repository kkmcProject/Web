import "./globals.css";
import { Noto_Sans_KR } from "next/font/google";

const noto = Noto_Sans_KR({ subsets: ["latin"], weight: ["400"] });

export default function RooyLayout({ children }) {
  return (
    <html lang="ko">
      <body className={noto.className}>{children}</body>
    </html>
  );
}
