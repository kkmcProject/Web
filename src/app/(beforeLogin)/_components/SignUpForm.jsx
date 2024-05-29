"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import InputBox from "./InputBox";

export default function SignUpForm() {
  const [message, setMessage] = useState("");
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

    if (formData.password !== formData.confirmPassword) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/signup`, {
      method: "post",
      body: JSON.stringify(formData),
      credentials: "include",
    });
    console.log(response.status);
    if (response.status === 500) {
      setMessage("이미 존재하는 아이디입니다.");
    }
    if (!response.ok) {
      return null;
    }
    let user = await response.json();
    router.replace("/flow/login");
  };
  useEffect(() => {}, [message]);
  return (
    <form className="flex flex-col items-center w-full" onSubmit={onSubmit}>
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
        placeholder="작업반"
        formData={formData}
        setFormData={setFormData}
      />
      <div className="text-red-600 mb-4">{message}</div>
      <button
        type="submit"
        className="py-2 bg-black text-white border-none rounded cursor-pointer w-11/12 mb-2"
      >
        회원가입
      </button>
      <Link
        href="/flow/login"
        className="text-center text-sm text-black no-underline mt-2"
      >
        로그인 페이지로 돌아가기
      </Link>
    </form>
  );
}
