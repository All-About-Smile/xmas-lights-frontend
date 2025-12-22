// src/layouts/AuthLayout.tsx
import type { ReactNode } from "react";

interface AuthLayoutProps {
  title: string;
  children: ReactNode;
  headerSlot?: ReactNode;
}

export function AuthLayout({ title, children, headerSlot }: AuthLayoutProps) {
  return (
    <div className="min-h-[100svh] text-neutral-900">
      <div className="fixed inset-0 -z-10 bg-[#FBF4DD]" />
      <div className="mx-auto flex min-h-[100svh] max-w-[var(--layout-max-width)] flex-col px-[var(--layout-side-padding)] pb-16 pt-8">
        {/* 본문 */}
        <main className="flex-1 select-none caret-transparent">
          {headerSlot ? <div className="mb-20">{headerSlot}</div> : null}
          <div className="mx-auto w-full max-w-md">
            <h1 className="mb-12 text-3xl font-semibold tracking-tight">{title}</h1>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
