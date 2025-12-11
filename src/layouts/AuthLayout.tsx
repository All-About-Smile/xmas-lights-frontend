// src/layouts/AuthLayout.tsx
import type { ReactNode } from "react";
import { Link } from "react-router-dom";

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
          <span className="text-sm font-medium">
            밝혀줘! 내 X-mas 전구
          </span>

          <Link
            to="/"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-neutral-800/80"
          >
            <span className="sr-only">홈으로</span>
            {/* 아주 단순한 집 아이콘 */}
            <div className="relative h-4 w-4">
              <div className="absolute inset-0 -translate-y-[1px] rotate-45 border-2 border-neutral-900 border-b-0 border-r-0" />
              <div className="absolute bottom-0 left-1/2 h-2 w-2 -translate-x-1/2 border-x-2 border-b-2 border-neutral-900 bg-transparent" />
            </div>
          </Link>
        </header>

        {/* 본문 */}
        <main className="flex-1">
          <h1 className="mb-12 text-3xl font-semibold tracking-tight">
            {title}
          </h1>
          {children}
        </main>
      </div>
    </div>
  );
}
