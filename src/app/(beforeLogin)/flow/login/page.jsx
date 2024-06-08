import Image from "next/image";
import LoginForm from "../../_components/LoginForm";

export default function Login() {

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
          alt="로그인 페이지 로고"
          width={200} 
          height={150}
          style={{ display: "block", margin: "0 auto" }}
        />
        <div
          style={{ backgroundColor: "hsla(43, 30%, 95%, 1)", padding: "20px", width: "100%", boxSizing: "border-box" }}
        >
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
