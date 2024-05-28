import Image from "next/image";
import Headnav from "./Headnav";
import SideMenuBtn from "./SideMenuBtn";

export default function Container({ children }) {
  return (
    <div className="px-4 w-full">
      <header className="flex flex-row tablet:flex-col">
        <div className="tablet:max-w-96 mt-4 mb-4">
          <Image src="/icons/kkmc_logo.png" width={350} height={80} alt="kkmc 로고" />
        </div>
        <Headnav />
        <SideMenuBtn className="flex justify-end h-full items-center" />
      </header>
      {children}
    </div>
  );
}
