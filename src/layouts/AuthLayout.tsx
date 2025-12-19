// src/layouts/AuthLayout.tsx
import type { ReactNode } from "react";
import HomeButton from "@/components/navigation/HomeButton";

interface AuthLayoutProps {
  title: string;
  children: ReactNode;
}

export function AuthLayout({ title, children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-[#FBF4DD] text-neutral-900">
      <div className="mx-auto flex min-h-screen max-w-md flex-col px-6 pb-16 pt-8">
        {/* 상단 로고 + 홈 버튼 */}
        <header className="mb-20 flex items-center justify-between">
          <span className="text-sm font-medium">반짝이는 X-mas 전구</span>

          <HomeButton
            to="/"
            ariaLabel="홈으로"
          />
        </header>

        {/* 본문 */}
        <main className="flex-1">
          <h1 className="mb-12 text-3xl font-semibold tracking-tight">{title}</h1>
          {children}
        </main>
      </div>
    </div>
  );
}