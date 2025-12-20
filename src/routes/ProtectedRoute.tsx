import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isLoading, isAuthenticated } = useAuth();
  const location = useLocation();

  // ✅ 새로고침 직후 me 복원 중이면 잠깐 대기
  if (isLoading) {
    return (
      <div className="p-6 text-center text-sm text-neutral-700">
        로그인 확인 중...
      </div>
    );
  }

  // ✅ 로그인 안 되어있으면 로그인 페이지로 이동
  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  // ✅ 로그인 되어있으면 접근 허용
  return <>{children}</>;
}
