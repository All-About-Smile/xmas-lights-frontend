// src/pages/FindAccountPage.tsx
import { useSearchParams } from "react-router-dom";
import type {FormEvent} from "react";
import { useState, useEffect } from "react";
import { AuthLayout } from "../layouts/AuthLayout";
import Input from "../components/ui/Input";
import Label from "../components/ui/Label";
import Button from "../components/ui/Button";

type Mode = "id" | "password";

function FindAccountPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialMode = (searchParams.get("mode") as Mode) || "id";
  const [mode, setMode] = useState<Mode>(initialMode);

  useEffect(() => {
    setSearchParams({ mode });
  }, [mode, setSearchParams]);

  const [id, setId] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    console.log("계정 찾기:", { mode, id, email });
  };

  const isIdMode = mode === "id";

  return (
    <AuthLayout title="계정 찾기">
      {/* 탭 */}
      <div className="mb-10 flex rounded-full bg-[#D9D9D9] p-1">
        <button
          type="button"
          onClick={() => setMode("id")}
          className={`flex-1 rounded-full py-2 text-sm font-medium ${
            isIdMode ? "bg-white" : "text-neutral-700"
          }`}
        >
          아이디 찾기
        </button>
        <button
          type="button"
          onClick={() => setMode("password")}
          className={`flex-1 rounded-full py-2 text-sm font-medium ${
            !isIdMode ? "bg-white" : "text-neutral-700"
          }`}
        >
          비밀번호 찾기
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {mode === "password" && (
          <div className="space-y-2">
            <Label className="text-base font-medium">아이디</Label>
            <Input
              value={id}
              onChange={(e) => setId(e.target.value)}
              className="h-14 rounded-xl border-none bg-[#F8EFD4] shadow-[0_4px_10px_rgba(0,0,0,0.08)]"
            />
          </div>
        )}

        <div className="space-y-2">
          <Label className="text-base font-medium">이메일</Label>
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
          >
            {isIdMode ? "확인" : "비밀번호 초기화"}
          </Button>
        </div>
      </form>
    </AuthLayout>
  );
}

export default FindAccountPage;
