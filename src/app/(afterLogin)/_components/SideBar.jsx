"use client";
import clsx from "clsx";
import { useEffect, useRef } from "react";
import SideBarItem from "./SideBarItem";
import { signOut } from "next-auth/react";
import { useShallow } from "zustand/react/shallow";
import { useSideBarIsOpen } from "@/store/SideBarIsOpen";

const links = [
  { name: "Home", href: "/", text: "작업계획서 보기" },
  { name: "manage-plan", href: "/manage-plan", text: "작업계획서 관리" },
  { name: "change-info", href: "/change-info", text: "정보 수정" },
];

export default function SideBar() {
  const { isOpen, setIsOpen } = useSideBarIsOpen(
    useShallow(state => ({ isOpen: state.isOpen, setIsOpen: state.setIsOpen })),
  );

  const onLogout = () => {
    signOut();
  };
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
    <aside aria-label="채팅 참여자 목록" aria-hidden={!isOpen}>
      <div
        role="button"
        tabIndex={0}
        aria-label="모달 외부 클릭으로 참여자 목록 닫기"
        className={`absolute inset-0 bg-opacity-50 bg-gray-900 duration-500 transition-opacity ${
          !isOpen && "pointer-events-none opacity-0"
        }`}
      />

      <div
        className={clsx(
          "tablet:hidden flex flex-col absolute duration-500 w-7/12 h-full bg-white border-l-3 border-gray",
          {
            "right-0 ": isOpen,
            "-right-3/4": !isOpen,
          },
        )}
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
          <div className="flex items-end h-full">
            <div
              className="pl-2 w-full flex py-6 h-10 border-t-2 items-center hover:bg-gray-300 cursor-pointer"
              onClick={onLogout}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 -960 960 960"
                width="24px"
                fill="#5f6368"
              >
                <path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h280v80H200v560h280v80H200Zm440-160-55-58 102-102H360v-80h327L585-622l55-58 200 200-200 200Z" />
              </svg>
              <span className="ml-2 "> 로그아웃</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
