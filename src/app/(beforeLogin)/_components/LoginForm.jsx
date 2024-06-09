"use client";

import { authenticate } from "@/lib/actions";
import { useFormState } from "react-dom";

import { useState, useEffect } from "react";
import InputBox from "./InputBox";
import Link from "next/link";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const [errorMsg, dispatch] = useFormState(authenticate, undefined);
  const router = useRouter();

  const [formData, setFormData] = useState({
    id: "",
    password: "",
  });

  const [message, setMessage] = useState("");

  const onSubmit = async e => {
    e.preventDefault();

    try {
      /*const res = */
      await signIn("credentials", formData);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get("error")) {
      setMessage("아이디와 비밀번호가 일치하지 않습니다.");
    }
  }, []);
  return (
    <form style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }} onSubmit={onSubmit}>
      <InputBox type="text" id="id" name="id" placeholder="아이디" formData={formData} setFormData={setFormData} />
      <InputBox
        type="password"
        id="password"
        name="password"
        placeholder="비밀번호"
        formData={formData}
        setFormData={setFormData}
      />
      <div className="text-red-600 mb-4">{message}</div>
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
        로그인
      </button>

      <div className="flex justify-center items-center w-11/12">
        <Link
          href="/flow/signup"
          style={{
            textAlign: "center",
            fontSize: "12px",
            padding: "10px",
            backgroundColor: "hsla(43, 30%, 95%, 1)",
            color: "black",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            width: "48%",
            display: "block",
            textDecoration: "none",
          }}
        >
          회원가입
        </Link>
      </div>
    </form>
  );
}
