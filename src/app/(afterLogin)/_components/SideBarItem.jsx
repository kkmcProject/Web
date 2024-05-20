import Link from "next/link";
export default function SideBarItem({ href, text }) {
  return (
    <Link className="mt-4 h-10 border items-center" href={href}>
      <span className="flex ml-2">{text}</span>
    </Link>
  );
}
