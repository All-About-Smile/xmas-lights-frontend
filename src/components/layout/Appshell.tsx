import type { ReactNode } from "react";

export default function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen w-full flex justify-center bg-neutral-200">
      <div className="relative w-full max-w-[430px] h-[100dvh] overflow-hidden bg-neutral-100">
        {children}
      </div>
    </div>
  );
}
