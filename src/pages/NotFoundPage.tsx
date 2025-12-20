// src/pages/NotFoundPage.tsx
import { useNavigate } from "react-router-dom";

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#D8D1CE] text-neutral-800">
      <h1 className="text-5xl font-bold">존재하지 않는 페이지입니다</h1>
      <p className="mt-2 text-lg text-neutral-600">
        주소가 잘못되었거나 삭제된 페이지예요.
      </p>

      <button
        className="text-base mt-6 rounded-xl bg-[#8E2F2F] px-6 py-3 text-white font-semibold"
        onClick={() => navigate("/")}
      >
        홈으로 돌아가기
      </button>
    </div>
  );
}
