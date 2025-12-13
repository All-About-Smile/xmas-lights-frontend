// src/pages/LoginPage.tsx
import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";

import { AuthLayout } from "../layouts/AuthLayout";
import Input from "../components/ui/Input";
import Label from "../components/ui/Label";
import Button from "../components/ui/Button";

import { authApi } from "../api/authApi";
import { tokenStorage } from "../lib/tokenStorage";

export default function LoginPage() {
  const navigate = useNavigate();

  const [id, setId] = useState("");
  const [password, setPassword] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!id || !password) {
      setErrorMsg("아이디와 비밀번호를 입력해줘.");
      return;
    }

    try {
      setIsLoading(true);

      // 1) 로그인 → access_token 발급(서버)
      const loginRes = await authApi.login({
        userid: id,
        password,
      });

      // 2) 저장(프론트)
      tokenStorage.setAccessToken(loginRes.data.access_token);

      // 3) /auth/me로 검증
      const meRes = await authApi.me();
      console.log("ME OK:", meRes.data);

      // 4) 이동
      navigate("/", { replace: true });
    } catch (err: any) {
      console.error("LOGIN ERROR:", err);

      const status = err?.response?.status;
      if (status === 401) setErrorMsg("아이디/비밀번호가 올바르지 않아.");
      else if (status === 422) setErrorMsg("로그인 요청 형식이 서버와 맞지 않아(422).");
      else setErrorMsg("로그인에 실패했어. 네트워크/서버 상태를 확인해줘.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout title="로그인">
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

        {errorMsg && <p className="text-sm text-red-600">{errorMsg}</p>}

        <div className="pt-4">
          <Button
            type="submit"
            disabled={isLoading}
            className="h-14 w-full rounded-xl bg-[#8E2F2F] text-lg font-semibold text-white shadow-[0_6px_0_rgba(0,0,0,0.18)] hover:bg-[#7A2424] disabled:opacity-60"
          >
            {isLoading ? "로그인 중..." : "로그인 하기"}
          </Button>
        </div>
      </form>

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
