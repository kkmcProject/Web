"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import SideMenuBtn from "./SideMenuBtn";
import TableButton from "./TableButton";
import Image from "next/image";
import ActiveTab from "./ActiveTab";

const links = [
  { name: "Home", href: "/", text: "작업계획서 보기" },
  { name: "manage-plan", href: "/manage-plan", text: "작업계획서 관리" },
  { name: "change-info", href: "/change-info", text: "정보 수정" },
];

export default function Headnav() {
  const pathname = usePathname();

  return (
    <div className="w-full ">
      <div className="tablet:max-w-screen-mobile mt-4 mb-4 zero-to-tablet:flex">
        <div className="zero-to-tablet:hidden">
          <Image src="/icons/kkmc_logo.png" width={350} height={80} alt="kkmc 로고" />
        </div>
        <div className="tablet:hidden flex w-full ju tify-between items-center">
          <Image src="/icons/kkmc_logo.png" width={175} height={40} alt="kkmc 로고" />

          {/* Tablet 크기 이하일 때만 보이는 네비게이션 바 */}
          <div className="w-full h-full flex justify-end items-center">
            <SideMenuBtn className="flex justify-end " />
          </div>
        </div>
      </div>

      {/* Tablet 크기 이상일 때만 보이는 네비게이션 바 */}
      <div className="hidden tablet:block h-14 ">
        <div className="h-full flex justify-start items-center text-lg text-white">
          <div className="h-full flex justify-center items-center bg-kkmc-gray w-1/4">KKMC 생산 관리 시스템</div>
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
    <div className="flex border-b-2 w-full border-gray-100 zero-to-tablet:hidden mt-2 justify-between items-center mb-2">
      <ActiveTab />
      <TableButton />
    </div>

    {/* 테블릿 이하일 때 보여줄 탭과 버튼 */}
    <div className="border-b-2 border-gray-100 tablet:hidden w-full">
      <ActiveTab />
      <div className="mt-2 mb-2 w-full">
        <TableButton />
      </div>
    </div>
  </>
)}
    </div>
  );
}
