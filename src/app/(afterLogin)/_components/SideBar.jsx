import Image from "next/image";
import clsx from "clsx";

export default function SideBar({ isOpen, setIsOpen }) {
  const onClickCloseBtn = () => {
    setIsOpen(false);
  };
  return (
    <div
      className={clsx("flex flex-col fixed duration-500 w-48 h-full bg-white border-l-3 border-gray p-3", {
        "right-0": isOpen,
        "-right-96": !isOpen,
      })}
    >
      <button className="flex justify-start">
        <Image src="/icons/close.png" width={30} height={30} alt="닫기" onClick={onClickCloseBtn} />
      </button>

      <ul>
        <ul>메뉴 1</ul>
        <ul>메뉴 2</ul>
        <ul>메뉴 3</ul>
      </ul>
    </div>
  );
}
