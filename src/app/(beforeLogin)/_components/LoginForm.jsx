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
    <form className="flex flex-col items-center w-full" onSubmit={onSubmit}>
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
        className="py-2 bg-black text-white border-none rounded cursor-pointer w-11/12 mb-2"
      >
        로그인
      </button>

      <div className="flex justify-center items-center w-11/12">
        <Link
          href="/flow/signup"
          className="text-center text-sm py-2 bg-[hsla(43,30%,95%,1)] text-black border-none rounded cursor-pointer w-6/12 block"
        >
          회원가입
        </Link>
      </div>
    </form>
  );
}
