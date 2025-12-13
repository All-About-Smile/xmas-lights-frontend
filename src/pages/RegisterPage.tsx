// src/pages/RegisterPage.tsx
import type { FormEvent } from "react";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import { AuthLayout } from "../layouts/AuthLayout";
import Input from "../components/ui/Input";
import Label from "../components/ui/Label";
import Button from "../components/ui/Button";

import { authApi } from "../api/authApi";

function RegisterPage() {
  const navigate = useNavigate();

  const [id, setId] = useState(""); // userid로 보낼 값
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [email, setEmail] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!id || !email || !password) {
      setErrorMsg("아이디, 이메일, 비밀번호를 모두 입력해줘.");
      return;
    }
    if (password !== passwordConfirm) {
      setErrorMsg("비밀번호가 일치하지 않습니다.");
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

      // ✅ 가입 성공 → 로그인 페이지로 이동
      // 너 프로젝트는 /login2가 진짜 로그인 페이지였지? 아니면 /login으로 통일해도 됨.
      navigate("/login", { replace: true });
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
    <AuthLayout title="회원가입">
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="space-y-2">
          <Label className="text-base font-medium">아이디</Label>
          <Input
            value={id}
            onChange={(e) => setId(e.target.value)}
            className="h-14 rounded-xl border-none bg-[#F8EFD4] shadow-[0_4px_10px_rgba(0,0,0,0.08)]"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-base font-medium">비밀번호</Label>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="h-14 rounded-xl border-none bg-[#F8EFD4] shadow-[0_4px_10px_rgba(0,0,0,0.08)]"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-base font-medium">비밀번호 확인</Label>
          <Input
            type="password"
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
            className="h-14 rounded-xl border-none bg-[#F8EFD4] shadow-[0_4px_10px_rgba(0,0,0,0.08)]"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-base font-medium">이메일주소</Label>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-14 rounded-xl border-none bg-[#F8EFD4] shadow-[0_4px_10px_rgba(0,0,0,0.08)]"
          />
        </div>

        {errorMsg && <p className="text-sm text-red-600">{errorMsg}</p>}

        <div className="pt-4">
          <Button
            type="submit"
            disabled={isLoading}
            className="h-14 w-full rounded-xl bg-[#8E2F2F] text-lg font-semibold text-white shadow-[0_6px_0_rgba(0,0,0,0.18)] hover:bg-[#7A2424] disabled:opacity-60"
          >
            {isLoading ? "가입 중..." : "회원가입 하기"}
          </Button>
        </div>

        <div className="text-center text-sm text-neutral-900">
          이미 계정이 있어? <Link to="/login">로그인</Link>
        </div>
      </form>
    </AuthLayout>
  );
}

export default RegisterPage;
