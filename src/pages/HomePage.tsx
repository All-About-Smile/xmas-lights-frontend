import { useMemo, useState } from "react";
import SideDrawer from "../components/SideDrawer";
import { useAuth } from "../contexts/AuthContext";

export default function HomePage() {
  const { user } = useAuth();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const displayName = useMemo(() => {
    // userid가 me 응답에 없으면 email로 대체
    return user?.email ?? "사용자";
  }, [user]);

  return (
    <div className="min-h-screen bg-[#D8D1CE]">
      <div className="mx-auto max-w-[430px] px-5 pt-6 pb-10">
        {/* top bar */}
        <header className="flex items-start justify-between">
          <div className="text-sm font-medium text-neutral-800">
            밝혀줘! 내 X-mas 전구
          </div>

          {/* hamburger */}
          <button
            onClick={() => setDrawerOpen(true)}
            className="p-2"
            aria-label="메뉴 열기"
          >
            <div className="flex flex-col gap-1">
              <span className="block h-[3px] w-7 rounded bg-neutral-900" />
              <span className="block h-[3px] w-7 rounded bg-neutral-900" />
              <span className="block h-[3px] w-7 rounded bg-neutral-900" />
            </div>
          </button>
        </header>

        {/* title section (이미지처럼 좌측 정렬 크게) */}
        <div className="mt-6">
          <h1 className="text-4xl font-extrabold tracking-tight text-neutral-900">
            {displayName} 님의 창문
          </h1>

          <div className="mt-3 text-sm text-neutral-700">
            🎄 올해까지 벌써 15일 남음...
          </div>
          <div className="mt-1 text-sm text-neutral-700">
            지금당장 ❤️편할지 써야겠지?😳
          </div>
        </div>

        {/* window area */}
        <div className="mt-6 overflow-hidden rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.18)]">
          <div className="aspect-[3/4] w-full bg-black/10">
            {/* TODO: 실제 창문/전구 UI 컴포넌트 */}
          </div>
        </div>

        {/* bottom share button */}
        <button
          onClick={() => alert("공유 기능은 다음 단계에서 연결할게!")}
          className="mt-8 h-14 w-full rounded-xl bg-[#8E2F2F] text-lg font-semibold text-white shadow-[0_10px_20px_rgba(0,0,0,0.18)]"
        >
          창문 링크 공유하기
        </button>
      </div>

      <SideDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </div>
  );
}
