import Image from "next/image";
import LoginForm from "../../_components/LoginForm";

export default function Login() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="border-2 border-gray-200 rounded-lg overflow-hidden w-80">
        <div className="p-5 text-center text-xl text-black">
          KKMC
          <br />
          생산관리 시스템
        </div>
        <Image
          src="/icons/kkmc_logo.png"
          alt="로그인 페이지 로고"
          width={200}
          height={150}
          className="block mx-auto"
        />
        <div className="bg-[hsla(43,30%,95%,1)] p-5 w-full box-border">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
