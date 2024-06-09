"use client";
import clsx from "clsx";
import { useEffect, useRef, useState } from "react";
import SideBarItem from "./SideBarItem";
import { signOut } from "next-auth/react";
import { useShallow } from "zustand/react/shallow";
import { useSideBarIsOpen } from "@/store/SideBarIsOpen";
import { checkUnsupportedBrowser } from "@/app/_component/checkUnsupportedBrowser";
import { useSession } from 'next-auth/react';

export default function SideBar() {
  
const links = [
  { name: "Home", href: "/", text: "작업계획서 보기" },
  { name: "manage-plan", href: "/manage-plan", text: "작업계획서 관리" },
  { name: "change-info", href: "/change-info", text: "정보 수정" },
];
  const { data : me } = useSession();
  const role = me?.user?.result?.role;

  if(role === "admin"){
    links.push({ name: "manager", href: "/manager", text: "권한 수정" });
  }


  useEffect(()=> {
  }, [links])


  const { isOpen, setIsOpen } = useSideBarIsOpen(
    useShallow(state => ({ isOpen: state.isOpen, setIsOpen: state.setIsOpen })),
  );
  const [deferredPrompt, setDeferredPrompt] = useState(null);
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


  useEffect(()=>{
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault()
      setDeferredPrompt(e)
    }
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    if(typeof window !== 'undefined' && "serviceWorker" in navigator){
      navigator.serviceWorker
      .register("/sw.js")
      .then((reg)=> console.log("sw worker registered", reg))
      .catch(() => console.log("failed"))
    }
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    }
  }, [])

  const promptAppInstall = async () => {
    const isUnsupportedBrowser = checkUnsupportedBrowser();
    if(isUnsupportedBrowser){
      alert("공유 아이콘 -> 홈 화면에 추가를 클릭해 앱으로 편리하게 이용해보세요!");
    }
    if(!isUnsupportedBrowser){
      if(deferredPrompt){
        deferredPrompt.prompt();
        await deferredPrompt.userChoice
        setDeferredPrompt(undefined)
      } else {
        alert('이미 저희 서비스를 설치해주셨어요!');
      }
    }
  }


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
          "tablet:hidden flex flex-col fixed duration-500 w-7/12 h-full bg-white border-l-3 border-gray",
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
            <SideBarItem key={link.name} href={link.href} text={link.text} role={role} />
          ))}
          
          <div className="flex flex-col justify-end items-end h-full">
          <div
              className="pl-2 w-full flex py-6 h-10 border-t-2 items-center hover:bg-gray-300 cursor-pointer"
              onClick={promptAppInstall}
            >
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368">
              <path d="m780-60-60-60 120-120-120-120 60-60 180 180L780-60Zm-460-60v-80H160q-33 0-56.5-23.5T80-280v-480q0-33 23.5-56.5T160-840h640q33 0 56.5 23.5T880-760v280h-80v-280H160v480h520v80h-80v80H320Zm120-240h80v-120h120v-80H520v-120h-80v120H320v80h120v120Zm-280 80v-480 480Z"/>
            </svg>
              <span className="ml-2 "> 홈 화면에 추가</span>
            </div>
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
