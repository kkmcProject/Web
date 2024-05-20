import Image from "next/image";
import SideBar from "./SideBar";
import { useState } from "react";

export default function SideMenuBtn({ isOpen, setIsOpen }) {
  const onClickSideBtn = () => {
    setIsOpen(true);
  };
  return (
    <button className="tablet:hidden pr-1" onClick={onClickSideBtn}>
      {/* Mobile 크기, 테블릿 크기 이하일 때만 보이는 네비게이션 바 */}
      <Image src="/icons/menu.png" className="" width={60} height={60} alt="메뉴" />
    </button>
  );
}
