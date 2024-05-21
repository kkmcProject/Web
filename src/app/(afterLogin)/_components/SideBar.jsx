"use client";
import Image from "next/image";
import clsx from "clsx";
import { useEffect, useRef } from "react";
import SideBarItem from "./SideBarItem";
import { usePathname } from "next/navigation";

const links = [
  { name: "Home", href: "/", text: "작업계획서 보기" },
  { name: "manage-plan", href: "/manage-plan", text: "작업계획서 관리" },
  { name: "change-info", href: "/change-info", text: "정보 수정" },
  { name: "/flow/login", href: "/flow/login", text: "로그아웃" },
];

export default function SideBar({ isOpen, setIsOpen }) {
  const outside = useRef();

  const onClickCloseBtn = () => {
    setIsOpen(false);
  };
  const handleClickOutside = e => {
    if (!outside.current.contains(e.target)) {
      onClickCloseBtn();
    }
  };

  const handleResize = () => {
    if (window.innerWidth >= 768) {
      setIsOpen(false);
    }
  };
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("resize", handleResize);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("resize", handleResize);
    };
  });

  return (
    <div
      className={clsx("tablet:hidden flex flex-col fixed duration-500 w-7/12 h-full bg-white border-l-3 border-gray", {
        "right-0": isOpen,
        "-right-3/4": !isOpen,
      })}
      ref={outside}
    >
      <button className="max-w-10 inline-block p-3">
        <svg
          className="hover:bg-gray-300"
          xmlns="http://www.w3.org/2000/svg"
          height="30px"
          viewBox="0 -960 960 960"
          width="30px"
          fill="#5f6368"
          alt="닫기 버튼"
          onClick={onClickCloseBtn}
        >
          <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
        </svg>
      </button>
      <div className="flex flex-col h-full">
        {links.map(link => (
          <SideBarItem key={link.name} href={link.href} text={link.text} />
        ))}
      </div>
    </div>
  );
}
