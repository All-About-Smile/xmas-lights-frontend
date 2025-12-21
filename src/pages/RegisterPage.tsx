// src/pages/RegisterPage.tsx
import type { FormEvent } from "react";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import { AuthLayout } from "../layouts/AuthLayout";
import Input from "../components/ui/Input";
import Label from "../components/ui/Label";
import Button from "../components/ui/Button";
import HomeButton from "../components/navigation/HomeButton";
import ServiceTitle from "../components/common/ServiceTitle";

import { authApi } from "../api/authApi";

function RegisterSuccessModal({
  open,
  onConfirm,
}: {
  open: boolean;
  onConfirm: () => void;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/40">
      <div
        className="w-[360px] max-w-[90vw] rounded-2xl bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-2xl font-extrabold text-neutral-900">
          회원가입 완료
        </div>
        <div className="mt-2 text-lg text-neutral-700">
          회원가입이 완료되었습니다!
        </div>
        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={onConfirm}
            className="rounded-xl bg-[#4B6B12] px-4 py-2 text-xl font-semibold text-white shadow"
          >
            로그인 하러가기
          </button>
        </div>
      </div>
    </div>
  );
}

function RegisterPage() {
  const navigate = useNavigate();

  const [id, setId] = useState(""); // 닉네임(한글 5글자 제한) -> 백엔드로 userid로 보냄
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [email, setEmail] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // ✅ 유효성 검사 정규식

  // 아이디: 한글/영문 1~10자 (숫자/특수문자/공백 불가)
  // - 한글: 가-힣
  // - 영문: a-zA-Z
  const nicknameRegex = /^[가-힣a-zA-Z]{1,10}$/;

  // 비밀번호: 최소 4자 + 영문 + 숫자 포함(특수문자/대문자 필수 X)
  // - (?=.*[A-Za-z]) 영문 최소 1개
  // - (?=.*\d) 숫자 최소 1개
  // - .{4,} 4자 이상
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{4,}$/;

  // 이메일: 기본 형식 체크(너무 빡세게 검증하지 않는 버전)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // 1) 빈 값 체크
    if (!id || !email || !password || !passwordConfirm) {
      setErrorMsg("아이디, 이메일, 비밀번호를 모두 입력해줘.");
      return;
    }

    // 2) 닉네임 체크
    if (!nicknameRegex.test(id)) {
      setErrorMsg("아이디는 한글/영문 1~10글자로 입력해줘.");
      return;
    }

    // 3) 비밀번호 규칙 체크
    if (!passwordRegex.test(password)) {
      setErrorMsg("비밀번호는 4자리 이상이며 영문과 숫자를 모두 포함해야 해.");
      return;
    }

    // 4) 비밀번호 확인
    if (password !== passwordConfirm) {
      setErrorMsg("비밀번호가 일치하지 않습니다.");
      return;
    }

    // 5) 이메일 형식 체크 (요구사항: 팝업)
    if (!emailRegex.test(email)) {
      alert("이메일 형식이 올바르지 않습니다.");
      return;
    }

    try {
      setIsLoading(true);

      // ✅ JSON으로 회원가입 요청 (백엔드 스펙: userid/email/password)
      await authApi.register({
        userid: id,
        email,
        password,
      });
      setShowSuccessModal(true);

      // ✅ 가입 성공 → 로그인 페이지로 이동
      // 로그인 이동은 모달 확인 후 진행
    } catch (err: any) {
      console.error("REGISTER ERROR:", err);

      const status = err?.response?.status;
      if (status === 409) setErrorMsg("이미 존재하는 아이디/이메일이야.");
      else if (status === 422) setErrorMsg("입력값 형식이 올바르지 않아(422).");
      else setErrorMsg("회원가입에 실패했어. 서버/네트워크를 확인해줘.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="회원가입"
      headerSlot={
        <header className="flex items-center justify-between">
          <ServiceTitle className="text-neutral-900" />
          <HomeButton to="/" ariaLabel="홈으로" />
        </header>
      }
    >
      <RegisterSuccessModal
        open={showSuccessModal}
        onConfirm={() => navigate("/login", { replace: true })}
      />
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="space-y-2">
          <Label className="text-base font-medium">아이디</Label>
          <Input
            value={id}
            onChange={(e) => setId(e.target.value)}
            placeholder="한글/영문 1~10글자"
            autoComplete="nickname"
            className="h-14 rounded-xl border-none bg-[#F8EFD4] shadow-[0_4px_10px_rgba(0,0,0,0.08)]"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-base font-medium">비밀번호</Label>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="4자 이상+영문+숫자"
            autoComplete="new-password"
            className="h-14 rounded-xl border-none bg-[#F8EFD4] shadow-[0_4px_10px_rgba(0,0,0,0.08)]"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-base font-medium">비밀번호 확인</Label>
          <Input
            type="password"
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
            autoComplete="new-password"
            className="h-14 rounded-xl border-none bg-[#F8EFD4] shadow-[0_4px_10px_rgba(0,0,0,0.08)]"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-base font-medium">이메일주소</Label>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="example@email.com"
            autoComplete="email"
            className="h-14 rounded-xl border-none bg-[#F8EFD4] shadow-[0_4px_10px_rgba(0,0,0,0.08)]"
          />
        </div>

        {errorMsg && <p className="text-base text-red-600">{errorMsg}</p>}

        <div className="pt-4">
          <Button
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? "가입 중..." : "회원가입 하기"}
          </Button>
        </div>

        <div className="text-center text-base text-neutral-900">
          이미 계정이 있어? <Link to="/login">로그인</Link>
        </div>
      </form>
    </AuthLayout>
  );
}

export default RegisterPage;
