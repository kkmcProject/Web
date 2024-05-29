import Image from "next/image";
import SignUpForm from "../../_components/SignUpForm";

export default function Signup() {
  const submit = async formData => {
    "use server";
    let shouldRedirect = false;
    // 여기서 바로 db에 접근할 수 있음.
    // 아래는 msw 임시 요청 코드
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/users`, {
        method: "post",
        body: formData,
        credentials: "include",
      });
      console.log(response.status);
      console.log(await response.json());
      shouldRedirect = true;
    } catch (err) {
      console.log(err);
    }
    if (shouldRedirect) {
      redirect("/");
    }
  };

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
          alt="회원가입 페이지 로고"
          width={200}
          height={150}
          className="block mx-auto"
        />
        <div className="bg-[hsla(43,30%,95%,1)] p-5 w-full box-border">
          <SignUpForm />
        </div>
      </div>
    </div>
  );
}
