import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import SideDrawer from "../components/SideDrawer";
import { useAuth } from "../contexts/AuthContext";

import Scene from "../components/scene/Scene";
import type { BulbItem } from "../components/scene/types";

export default function HomePage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const displayName = useMemo(() => {
    return user?.email ?? "사용자";
  }, [user]);

  // ✅ 더미 전구 데이터 (8개 넘기면 페이지 이동 확인 가능)
  const bulbs: BulbItem[] = [
    { id: "1", bulbKey: "acorn_yellow" },
    { id: "2", bulbKey: "dongle_pink" },
    { id: "3", bulbKey: "soap_blue" },
    { id: "4", bulbKey: "charlie_green" },
    { id: "5", bulbKey: "candle_purple" },
    { id: "6", bulbKey: "acorn_blue" },
    { id: "7", bulbKey: "dongle_yellow" },
    { id: "8", bulbKey: "soap_pink" },
    { id: "9", bulbKey: "admin_bulb" }, // 다음 페이지 첫 슬롯
  ];

  return (
    <div className="min-h-screen bg-[#D8D1CE] bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.6),transparent_45%)]">
      <div className="mx-auto max-w-[430px] px-5 pt-4 pb-6">
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

        {/* title section */}
        <div className="mt-6">
          <h1 className="text-3xl font-extrabold tracking-tight text-neutral-900">
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
        <div className="mt-5">
          <div
            className="
              relative w-full overflow-hidden
              rounded-none shadow-none
            "
            style={{
              // 화면 높이에 맞춰 창문 영역을 자동으로 줄여서 "한 화면"에 들어오게
              height: "min(62dvh, 720px)",
            }}
          >
            <div className="relative h-full w-full">
              <Scene
                bulbs={bulbs}
                onOpenLetter={(id) => navigate(`/letters/${id}`)}
              />
            </div>
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
