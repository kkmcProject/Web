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
      <svg
        className=" hover:bg-gray-300"
        xmlns="http://www.w3.org/2000/svg"
        height="35px"
        viewBox="0 -960 960 960"
        width="35px"
        fill="#5f6368"
        alt="메뉴"
      >
        <path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z" />
      </svg>
    </button>
  );
}
