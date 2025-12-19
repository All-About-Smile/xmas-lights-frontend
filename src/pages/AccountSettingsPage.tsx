// src/pages/AccountSettingsPage.tsx
import type { FormEvent } from "react";
import { useEffect, useState } from "react";
import { AuthLayout } from "../layouts/AuthLayout";
import Input from "../components/ui/Input";
import Label from "../components/ui/Label";
import Button from "../components/ui/Button";
import { useAuth } from "../contexts/AuthContext";
import LoadingText from "../components/common/LoadingText";

function AccountSettingsPage() {
  const { user, isLoading } = useAuth();

  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [email, setEmail] = useState("");

  // ✅ user 로딩 후 email 1회 동기화
  useEffect(() => {
    if (user?.email) {
      setEmail(user.email);
    }
  }, [user?.email]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (password && password !== passwordConfirm) {
      alert("비밀번호가 일치하지 않아.");
      return;
    }

    const payload = {
      ...(email && email !== user?.email ? { email } : {}),
      ...(password ? { password } : {}),
    };

    console.log("계정 설정 변경 요청:", payload);
    // TODO: PATCH /users/me or /account
  };

  if (isLoading || !user) {
    return (
      <AuthLayout title="계정 설정">
        <div className="p-6 text-center text-sm text-neutral-700">
          <LoadingText />
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout title="계정 설정">
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* 아이디 (고정) */}
        <div className="flex items-center justify-between">
          <Label className="text-base font-medium">아이디</Label>
          <span className="text-base text-neutral-400">{user.userid}</span>
        </div>

        {/* 비밀번호 변경 */}
        <div className="space-y-2">
          <Label className="text-base font-medium">새 비밀번호</Label>
          <Input
            type="password"
            placeholder="변경할 비밀번호 입력"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="h-12 rounded-xl bg-white"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-base font-medium">새 비밀번호 확인</Label>
          <Input
            type="password"
            placeholder="비밀번호 다시 입력"
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
            className="h-12 rounded-xl bg-white"
          />
        </div>

        {/* 이메일 */}
        <div className="space-y-2">
          <Label className="text-base font-medium">이메일 주소</Label>
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
          >
            저장
          </Button>
        </div>
      </form>
    </AuthLayout>
  );
}

export default AccountSettingsPage;
