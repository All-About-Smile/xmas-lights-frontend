import OrnamentLayer from "@/components/rollingpaper/OrnamentLayer";
import Scene from "@/components/scene/Scene";

import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { SLOTS, PAGE_SIZE } from "@/components/scene/sceneSlots";
import { BULB_IMAGES } from "@/components/scene/bulbImages";
import type { BulbItem } from "@/components/scene/types";

import { getUserLetters } from "@/api/letterApi";
import { toBulbKey } from "@/utils/bulbKey";


export default function GuestUserHomePage() {
  const navigate = useNavigate();
  const { userid } = useParams<{ userid: string }>();

  // 8개 단위 페이지: offset = 0, 8, 16...
  const [offset, setOffset] = useState(0);

  // 현재 페이지의 전구 0~8개
  const [bulbs, setBulbs] = useState<BulbItem[]>([]);
  const [hasNext, setHasNext] = useState(false);

  const [loading, setLoading] = useState(false);

  const hasPrev = offset > 0;

  // userid 바뀌면 첫 페이지로
  useEffect(() => {
    setOffset(0);
  }, [userid]);

  // 현재 페이지(8개) 불러오기
    useEffect(() => {
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
        } catch (e) {
        console.error("getUserLetters failed:", e);
        } finally {
        if (mounted) setLoading(false);
        }
    })();

    return () => {
        mounted = false;
    };
    }, [userid, offset]);


  // 페이지 표시(총 개수 없으니 최소 추정)
  const pageIndex = Math.floor(offset / PAGE_SIZE) + 1;
  const pageCount = useMemo(() => (hasNext ? pageIndex + 1 : pageIndex), [hasNext, pageIndex]);

  const onPrev = () => {
    if (!hasPrev || loading) return;
    setOffset((v) => Math.max(0, v - PAGE_SIZE));
  };

  const onNext = () => {
    if (!hasNext || loading) return;
    setOffset((v) => v + PAGE_SIZE);
  };

  const onOpenLetter = () => {
    return;
  };

  const displayName = userid ?? "사용자";

  const goWriteLetter = () => {
    if (!userid) return;
    navigate(`/users/${userid}/letters`);
  };

  return (
    <div className="min-h-screen bg-[#D8D1CE] bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.6),transparent_45%)]">
      <div className="mx-auto max-w-[430px] px-5 pt-4 pb-6">
        {/* top bar */}
        <header className="flex items-start justify-between">
          <div className="text-sm font-medium text-neutral-800">밝혀줘! 내 X-mas 전구</div>

          {/* ✅ 햄버거 대신 홈 버튼: LandingPage로 */}
          <button
            type="button"
            onClick={() => navigate("/")}
            className="p-2"
            aria-label="메인으로"
          >
            <span className="text-xl">🏠</span>
          </button>
        </header>

        {/* title section */}
        <div className="mt-6">
          <h1 className="text-3xl font-extrabold tracking-tight text-neutral-900">
            {displayName} 님의 창문
          </h1>

          <div className="mt-3 text-sm text-neutral-700">🎄 올해까지 벌써 15일 남음...</div>
          <div className="mt-1 text-sm text-neutral-700">지금당장 ❤️편할지 써야겠지?😳</div>
        </div>

        {/* window area */}
        <div className="mt-5">
          <div
            className="relative w-full overflow-hidden rounded-none shadow-none"
            style={{ height: "min(62dvh, 720px)" }}
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

        {/* bottom buttons */}
        <div className="mt-8 space-y-3">
          {/* ✅ 요구사항: 창문 꾸미기 버튼을 누르면 편지 작성 */}
          <button
            type="button"
            onClick={goWriteLetter}
            className="h-14 w-full rounded-xl bg-[#8E2F2F] text-lg font-semibold text-white shadow-[0_10px_20px_rgba(0,0,0,0.18)]"
          >
            창문 꾸미기
          </button>
        </div>
      </div>
    </div>
  );
}
