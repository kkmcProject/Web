"use client";

import Image from "next/image";
import Headnav from "./_components/Headnav";
import SideMenuBtn from "./_components/SideMenuBtn";
import SideBar from "./_components/SideBar";
import { useState } from "react";
import clsx from "clsx";

export default function MainLayout({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="flex flex-row h-full">
      <div
        className={clsx("px-4 w-full", {
          "opacity-40 bg-gray-900": isOpen,
        })}
      >
        <header className="flex flex-row tablet:flex-col">
          <div className="tablet:max-w-96 mt-4 mb-4">
            <Image src="/icons/KKMC_logo.png" width={350} height={80} alt="kkmc 로고" />
          </div>
          <Headnav />
          <SideMenuBtn className="flex justify-end h-full items-center" isOpen={isOpen} setIsOpen={setIsOpen} />
        </header>
        {children}
      </div>
      <SideBar isOpen={isOpen} setIsOpen={setIsOpen} />
    </div>
  );
}
