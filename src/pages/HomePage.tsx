import OrnamentLayer from "@/components/rollingpaper/OrnamentLayer";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import Scene from "../components/scene/Scene";
import SideDrawer from "../components/SideDrawer";

import { SLOTS, PAGE_SIZE } from "../components/scene/sceneSlots";
import { BULB_IMAGES } from "../components/scene/bulbImages";
import type { BulbItem, BulbKey } from "../components/scene/types";

import { useAuth } from "../contexts/AuthContext";
import { getUserLetters } from "../api/letterApi";
import { isUnlockedByServerDate } from "../utils/time";



function LockedPopup({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40">
      <div className="w-[320px] rounded-2xl bg-white p-5 shadow">
        <div className="text-lg font-semibold">기다려주세요 🎄</div>
        <div className="mt-2 text-sm text-gray-600">
          편지는 12/25 00:00에 열려요.
        </div>
        <button
          onClick={onClose}
          className="mt-4 w-full rounded-xl bg-black px-4 py-2 text-white"
        >
          확인
        </button>
      </div>
    </div>
  );
}

function toBulbKey(shape: string, color: string): BulbKey | null {
  if (shape === "admin") return "admin_bulb";

  const key = `${shape}_${color}` as BulbKey;

  const VALID_KEYS: BulbKey[] = [
    "acorn_yellow",
    "acorn_purple",
    "acorn_pink",
    "acorn_green",
    "acorn_blue",
    "dongle_yellow",
    "dongle_purple",
    "dongle_pink",
    "dongle_green",
    "dongle_blue",
    "soap_yellow",
    "soap_purple",
    "soap_pink",
    "soap_green",
    "soap_blue",
    "charlie_yellow",
    "charlie_purple",
    "charlie_pink",
    "charlie_green",
    "charlie_blue",
    "candle_yellow",
    "candle_purple",
    "candle_pink",
    "candle_green",
    "candle_blue",
    "admin_bulb",
  ];

  return VALID_KEYS.includes(key) ? key : null;
}

export default function HomePage() {
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading } = useAuth();

  // ✅ 문자열 userid 사용 (백엔드가 문자열로 받는다고 했으니)
  const userid = (user as any)?.userid as string | undefined;

  const [drawerOpen, setDrawerOpen] = useState(false);

  // 8개 단위 페이지: offset = 0, 8, 16...
  const [offset, setOffset] = useState(0);

  // 현재 페이지의 전구 0~8개
  const [bulbs, setBulbs] = useState<BulbItem[]>([]);
  const [hasNext, setHasNext] = useState(false);

  // 서버 Date 헤더(잠금 판정용)
  const [serverDate, setServerDate] = useState<Date | null>(null);

  const [loading, setLoading] = useState(false);
  const [showLockedPopup, setShowLockedPopup] = useState(false);

  const hasPrev = offset > 0;

  const displayName = useMemo(() => {
    // user에 닉네임이 있으면 우선 사용, 없으면 userid로 대체
    return (user as any)?.nickname ?? (user as any)?.userid ?? "사용자";
  }, [user]);

  // 유저가 바뀌면 첫 페이지로
  useEffect(() => {
    setOffset(0);
  }, [userid]);

  // 현재 페이지(8개) 불러오기
  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated) return;
    if (!userid) return;

    let mounted = true;

    (async () => {
      try {
        setLoading(true);

        const result = await getUserLetters({
          userid,
          limit: PAGE_SIZE,
          offset,
        });
        
        

        if (!mounted) return;

        const mapped: BulbItem[] = result.items
          .map((it) => {
            const bulbKey = toBulbKey(it.ornament_shape, it.ornament_color);
            
            if (!bulbKey) return null;
          

            return {
              id: String(it.letter_number),
              bulbKey,
              nickname: it.writer_nickname ?? "",
            };
          })
          .filter(Boolean) as BulbItem[];

        setBulbs(mapped);
        setHasNext(result.hasNext);
        // console.log("bulbs mapped:", mapped);

        if (result.serverDate) setServerDate(result.serverDate);
      } catch (e) {
        console.error("getUserLetters failed:", e);
      } finally {
        if (mounted) setLoading(false);
      }
      
    })();

    return () => {
      mounted = false;
    };
  }, [isLoading, isAuthenticated, userid, offset]);

  // 서버 시간 기준으로 열림 여부
  const unlocked = useMemo(() => {
    if (!serverDate) return false;
    return isUnlockedByServerDate(serverDate);


  }, [serverDate]);
  

  // 페이지 표시는 총 개수 없으니 최소 추정 (hasNext면 +1)
  const pageIndex = Math.floor(offset / PAGE_SIZE) + 1;
  const pageCount = useMemo(
    () => (hasNext ? pageIndex + 1 : pageIndex),
    [hasNext, pageIndex]
  );

  const onPrev = () => {
    if (!hasPrev || loading) return;
    setOffset((v) => Math.max(0, v - PAGE_SIZE));
  };

  const onNext = () => {
    if (!hasNext || loading) return;
    setOffset((v) => v + PAGE_SIZE);
  };

  const onOpenLetter = (id: string) => {
    if (!unlocked) {
      setShowLockedPopup(true);
      return;
    }
    navigate(`/letters/${id}`);
  };

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
            className="relative w-full overflow-hidden rounded-none shadow-none"
            style={{
              height: "min(62dvh, 720px)",
            }}
          >
            <div className="relative h-full w-full">
              <Scene>
                <OrnamentLayer
                  bulbs={bulbs}
                  SLOTS={SLOTS}
                  BULB_IMAGES={BULB_IMAGES}
                  hasPrev={hasPrev}
                  hasNext={hasNext}
                  loading={loading}
                  pageIndex={pageIndex}
                  pageCount={pageCount}
                  onPrev={onPrev}
                  onNext={onNext}
                  onOpenLetter={onOpenLetter}
                />
              </Scene>
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

      {showLockedPopup && <LockedPopup onClose={() => setShowLockedPopup(false)} />}
    </div>
  );
}
