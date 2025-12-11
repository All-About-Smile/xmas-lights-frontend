// src/pages/LoginPage.tsx
import type { FormEvent } from "react";
import  { useState } from "react";
import { Link } from "react-router-dom";
import { AuthLayout } from "../layouts/AuthLayout";
import Input from "../components/ui/Input";
import Label from "../components/ui/Label";
import Button from "../components/ui/Button";

function LoginPage() {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    console.log("로그인 시도:", { id, password });
    // 나중에 여기서 axios로 /auth/login 호출 + 토큰 저장
  };

  return (
    <AuthLayout title="로그인">
      <form
        onSubmit={handleSubmit}
        className="space-y-8"
      >
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

        <div className="pt-4">
          <Button
            type="submit"
            className="h-14 w-full rounded-xl bg-[#8E2F2F] text-lg font-semibold text-white shadow-[0_6px_0_rgba(0,0,0,0.18)] hover:bg-[#7A2424]"
          >
            로그인 하기
          </Button>
        </div>
      </form>

      {/* 하단 링크들 */}
      <div className="mt-10 space-y-2 text-center text-sm text-neutral-900">
        <div className="space-x-2">
          <Link to="/account/find?mode=id">아이디 찾기</Link>
          <span>|</span>
          <Link to="/account/find?mode=password">비밀번호 찾기</Link>
        </div>
        <div>
          <Link to="/register">회원가입</Link>
        </div>
      </div>
    </AuthLayout>
  );
}

export default LoginPage;
