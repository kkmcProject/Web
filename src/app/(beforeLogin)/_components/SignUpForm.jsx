"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import InputBox from "./InputBox";
import { z } from "zod";


const SignUpSchema = z.object({
  id: z.string().min(1, "아이디를 입력해주세요."),
  name: z.string().min(1, "이름을 입력해주세요."),
  password: z.string().min(12, "비밀번호는 최소 12자 이상이어야 합니다."),
  position: z.string().optional(),
  class: z.string().optional(),
}).refine(data => data.password === data.confirmPassword, {
  message: "비밀번호가 일치하지 않습니다.",
  path: ["confirmPassword"],
});

export default function SignUpForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    password: "",
    confirmPassword: "",
    position: "",
    class: "",
  });

  const onSubmit = async e => {
    e.preventDefault();


    const validation = SignUpSchema.safeParse(formData);
    if (!validation.success) {
      alert(validation.error.errors[0].message);
      return;
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/signup`, {
      method: "post",
      body: JSON.stringify(formData),
      credentials: "include",
    });
    console.log(response.status);
    if (response.status === 500) {
      alert("이미 존재하는 아이디입니다.");
      return;
    }
    if (!response.ok) {
      return null;
    }
    let user = await response.json();
    router.replace("/flow/login");
  };

  useEffect(() => {}, []);

  return (
    <form style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }} onSubmit={onSubmit}>
      <InputBox type="text" id="id" name="id" placeholder="아이디" formData={formData} setFormData={setFormData} />
      <InputBox type="text" id="name" name="name" placeholder="이름" formData={formData} setFormData={setFormData} />
      <InputBox
        type="password"
        id="password"
        name="password"
        placeholder="비밀번호"
        formData={formData}
        setFormData={setFormData}
      />
      <InputBox
        type="password"
        id="confirmPassword"
        name="confirmPassword"
        placeholder="비밀번호 확인"
        formData={formData}
        setFormData={setFormData}
      />
      <InputBox
        type="text"
        id="position"
        name="position"
        placeholder="직급"
        formData={formData}
        setFormData={setFormData}
      />
      <InputBox
        type="text"
        id="class"
        name="class"
        placeholder="작업반 "
        formData={formData}
        setFormData={setFormData}
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
  );
}
