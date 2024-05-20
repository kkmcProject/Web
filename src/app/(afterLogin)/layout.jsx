import Image from "next/image";
import Headnav from "./_components/Headnav";

export default function MainLayout({ children }) {
  return (
    <div className="container mx-auto px-4">
      <header>
        <div className="max-w-96 mt-4 mb-4">
          <Image src="/kkmc_logo.png" layout="responsive" width={350} height={80} alt="kkmc 로고" />
        </div>
        <Headnav />
      </header>
      {children}
    </div>
  );
}
