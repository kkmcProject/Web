"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

const links = [
  { name: "Home", href: "/", text: "작업계획서 보기" },
  { name: "manage-plan", href: "/manage-plan", text: "작업계획서 관리" },
  { name: "change-info", href: "/change-info", text: "정보 수정" },
];

export default function Headnav() {
  const pathname = usePathname();

  return (
    <div className="w-full">
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
    </div>
  );
}
