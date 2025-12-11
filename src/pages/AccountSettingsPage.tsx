// src/pages/AccountSettingsPage.tsx
import type { FormEvent} from "react";
import { useState } from "react";
import { AuthLayout } from "../layouts/AuthLayout";
import Input from "../components/ui/Input";
import Label from "../components/ui/Label";
import Button from "../components/ui/Button";

function AccountSettingsPage() {
  // 아이디는 고정(예: 서버에서 받아온 값)
  const fixedId = "루키야쉬해";
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [email, setEmail] = useState("example@example.com");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    console.log("계정 설정 저장:", { password, passwordConfirm, email });
  };

  return (
    <AuthLayout title="계정 설정">
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="flex items-center justify-between">
          <Label className="text-base font-medium">아이디</Label>
          <span className="text-base text-neutral-400">{fixedId}</span>
        </div>

        <div className="space-y-2">
          <Label className="text-base font-medium">비밀번호</Label>
          <Input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="h-12 rounded-xl bg-white"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-base font-medium">비밀번호 확인</Label>
          <Input
            type="password"
            placeholder="••••••••"
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
            className="h-12 rounded-xl bg-white"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-base font-medium">이메일주소</Label>
          <Input
            type="email"
            placeholder="example@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-12 rounded-xl bg-white"
          />
        </div>

        <div className="pt-4">
          <Button
            type="submit"
            className="h-12 w-full rounded-xl bg-[#8E2F2F] text-base font-semibold text-white shadow-[0_6px_0_rgba(0,0,0,0.18)] hover:bg-[#7A2424]"
          >
            저장
          </Button>
        </div>
      </form>
    </AuthLayout>
  );
}

export default AccountSettingsPage;
