import Image from "next/image";
import Link from "next/link";

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
          src={process.env.NEXT_PUBLIC_PUBLIC_URL + "/icons/kkmc_logo.png"}
          alt="회원가입 페이지 로고"
          width={200}
          height={150}
          style={{ display: "block", margin: "0 auto" }}
        />
        <div
          style={{ backgroundColor: "hsla(43, 30%, 95%, 1)", padding: "20px", width: "100%", boxSizing: "border-box" }}
        >
          <form style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="이름"
              required
              style={{
                marginBottom: "12px",
                padding: "8px",
                backgroundColor: "hsla(0, 0%, 90%, 1)",
                width: "80%",
                border: "1px solid #d3d3d3",
                color: "black",
              }}
            />
            <input
              type="text"
              id="position"
              name="position"
              placeholder="직급"
              required
              style={{
                marginBottom: "12px",
                padding: "8px",
                backgroundColor: "hsla(0, 0%, 90%, 1)",
                width: "80%",
                border: "1px solid #d3d3d3",
                color: "black",
              }}
            />
            <input
              type="text"
              id="id"
              name="id"
              placeholder="아이디"
              required
              style={{
                marginBottom: "12px",
                padding: "8px",
                backgroundColor: "hsla(0, 0%, 90%, 1)",
                width: "80%",
                border: "1px solid #d3d3d3",
                color: "black",
              }}
            />
            <input
              type="password"
              id="password"
              name="password"
              placeholder="비밀번호"
              required
              style={{
                marginBottom: "12px",
                padding: "8px",
                backgroundColor: "hsla(0, 0%, 90%, 1)",
                width: "80%",
                border: "1px solid #d3d3d3",
                color: "black",
              }}
            />
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              placeholder="비밀번호 확인"
              required
              style={{
                marginBottom: "20px",
                padding: "8px",
                backgroundColor: "hsla(0, 0%, 90%, 1)",
                width: "80%",
                border: "1px solid #d3d3d3",
                color: "black",
              }}
            />
            <button
              type="submit"
              style={{
                padding: "10px",
                backgroundColor: "#000000",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                width: "90%",
                marginBottom: "10px",
              }}
            >
              회원가입
            </button>
            <Link
              href="/flow/login"
              style={{
                textAlign: "center",
                fontSize: "12px",
                color: "black",
                textDecoration: "none",
                marginTop: "10px",
              }}
            >
              로그인 페이지로 돌아가기
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
}
