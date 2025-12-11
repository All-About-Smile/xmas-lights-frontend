// src/pages/RegisterPage.tsx
import type { FormEvent } from "react";
import { useState } from "react";
import { AuthLayout } from "../layouts/AuthLayout";
import Input from "../components/ui/Input";
import Label from "../components/ui/Label";
import Button from "../components/ui/Button";

function RegisterPage() {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (password !== passwordConfirm) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }
    console.log("회원가입 시도:", { id, password, email });
    // 나중에 axios로 /auth/register 호출 예정
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

        <div className="pt-4">
          <Button
            type="submit"
            className="h-14 w-full rounded-xl bg-[#8E2F2F] text-lg font-semibold text-white shadow-[0_6px_0_rgba(0,0,0,0.18)] hover:bg-[#7A2424]"
          >
            회원가입 하기
          </Button>
        </div>
      </form>
    </AuthLayout>
  );
}

export default RegisterPage;
