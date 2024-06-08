"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import SideMenuBtn from "./SideMenuBtn";
import TableButton from "./TableButton";
import Image from "next/image";
import ActiveTab from "./ActiveTab";
import { signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import { checkUnsupportedBrowser } from "@/app/_component/checkUnsupportedBrowser";

const links = [
  { name: "Home", href: "/", text: "작업계획서 보기" },
  { name: "manage-plan", href: "/manage-plan", text: "작업계획서 관리" },
  { name: "change-info", href: "/change-info", text: "정보 수정" },
];

export default function Headnav() {
  const pathname = usePathname();
  const [deferredPrompt, setDeferredPrompt] = useState(undefined);

  const onLogout = () => {
    signOut();
  };

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
    <div className="w-full ">
      <div className="mt-4 mb-4 zero-to-tablet:flex">
        <div className="zero-to-tablet:hidden tablet:flex">
          <Image src="/icons/kkmc_logo.png" width={350} height={80} alt="kkmc 로고" />
          <div className="flex w-full justify-end items-end">
            <button onClick={promptAppInstall} className="flex items-start hover:bg-blue-100 mr-4">
              홈 화면에 추가
            </button>
            <button className="flex items-center hover:bg-blue-100" onClick={onLogout}>
              <svg xmlns="http://www.w3.org/2000/svg" height="30px" viewBox="0 -960 960 960" width="30px" fill="#5f6368">
                <path d="M440-440v-400h80v400h-80Zm40 320q-74 0-139.5-28.5T226-226q-49-49-77.5-114.5T120-480q0-80 33-151t93-123l56 56q-48 40-75 97t-27 121q0 116 82 198t198 82q117 0 198.5-82T760-480q0-64-26.5-121T658-698l56-56q60 52 93 123t33 151q0 74-28.5 139.5t-77 114.5q-48.5 49-114 77.5T480-120Z"/>
              </svg>
              <span className="ml-2">로그아웃</span>
            </button>
          </div>
        </div>
        <div className="tablet:hidden flex w-full justify-between items-center">
          <Image src="/icons/kkmc_logo.png" width={130} height={30} alt="kkmc 로고" />

          {/* Tablet 크기 이하일 때만 보이는 네비게이션 바 */}
          <div className="w-full h-full flex justify-end items-center">
            <SideMenuBtn className="flex justify-end " />
          </div>
        </div>
      </div>

      {/* Tablet 크기 이상일 때만 보이는 네비게이션 바 */}
      <div className="hidden tablet:block h-14 ">
        <div className="h-full flex justify-start items-center text-lg text-white">
          <div className="h-full flex justify-center items-center bg-kkmc-gray w-1/4 whitespace-nowrap">KKMC 생산 관리 시스템</div>
          <div className="h-full flex flex-1 bg-kkmc-gray bg-opacity-80">
            {links.map(link => (
              <Link key={link.name} href={link.href} className="flex flex-1 justify-center h-full items-center">
                <span
                  className={clsx(
                    { "border-b-3 pb-1 border-white": pathname === link.href },
                    { "opacity-60": pathname !== link.href },
                  )}
                >
                  {link.text}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {pathname !== "/change-info" && pathname !== "/manager" && (
  <>
    {/* 테블릿 이상일 때 보여줄 탭과 버튼 */}
    <div className="flex border-b-2 w-full border-gray-100 under-tablet:hidden mt-2 justify-between items-center mb-2">
      <ActiveTab />
      <TableButton />
    </div>

    {/* 테블릿 이하일 때 보여줄 탭과 버튼 */}
    <div className="md:hidden">
      <ActiveTab />
      <TableButton />
    </div>
  </>
)}
    </div>
  );
}
