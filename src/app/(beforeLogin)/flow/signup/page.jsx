import Image from "next/image";

import SignUpForm from "../../_components/SignUpForm";

export default function Signup() {
  const submit = async formData => {
    "use server";
    let shouldRedirect = false;
    // 여기서 바로 db에 접근할 수 있음.
    // 아래는 msw 임시 요청 코드
    try {
      const response = await (fetch`${process.env.NEXT_PUBLIC_BASE_URL}/api/users`,
      {
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
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
      }}
    >
      <div style={{ border: "2px solid #a7a7a7", borderRadius: "10px", overflow: "hidden", width: "350px" }}>
        <div style={{ padding: "20px", textAlign: "center", fontSize: "20px", color: "#000000" }}>
          KKMC
          <br />
          생산관리 시스템
        </div>
        <Image
          src="/icons/kkmc_logo.png"
          alt="회원가입 페이지 로고"
          width={200}
          height={150}
          style={{ display: "block", margin: "0 auto" }}
        />
        <div
          style={{ backgroundColor: "hsla(43, 30%, 95%, 1)", padding: "20px", width: "100%", boxSizing: "border-box" }}
        >
          <SignUpForm />
        </div>
      </div>
    </div>
  );
}
