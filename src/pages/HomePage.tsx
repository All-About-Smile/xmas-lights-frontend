import { toBulbKey } from "@/utils/bulbKey";
import OrnamentLayer from "@/components/rollingpaper/OrnamentLayer";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import Scene from "../components/scene/Scene";
import SideDrawer from "../components/SideDrawer";

import { SLOTS, PAGE_SIZE } from "../components/scene/sceneSlots";
import { BULB_IMAGES } from "../components/scene/bulbImages";
import type { BulbItem } from "../components/scene/types";
import PageIndicator from "@/components/common/PageIndicator";

import { useAuth } from "../contexts/AuthContext";
import { getUserLetters } from "../api/letterApi";
import { isUnlockedByServerDate } from "../utils/time";
import MenuButton from "@/components/navigation/MenuButton";
import ServiceTitle from "@/components/common/ServiceTitle";
import HomeWindowHeader from "@/components/common/HomeWindowHeader";

// ✅ 추가: GateContext
import { useGate } from "@/contexts/GateContext";

function LockedPopup({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40">
      <div className="w-[320px] rounded-2xl bg-white p-5 shadow">
        <div className="text-lg font-semibold">기다려주세요 🎄</div>
        <div className="mt-2 text-base text-gray-600">
          편지는 12/25 00:00에 열려요.
        </div>
        <button
          onClick={onClose}
          className="text-base mt-4 w-full rounded-xl bg-black px-4 py-2 text-white"
        >
          확인
        </button>
      </div>
    </div>
  );
}

export default function HomePage() {
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading } = useAuth();

  // ✅ GateContext에서 serverDate 읽고/저장
  const { serverDate, setServerDate } = useGate();

  // ✅ 문자열 userid 사용 (백엔드가 문자열로 받는다고 했으니)
  const userid = (user as any)?.userid as string | undefined;

  const [drawerOpen, setDrawerOpen] = useState(false);

  // 8개 단위 페이지: offset = 0, 8, 16...
  const [offset, setOffset] = useState(0);

  // 현재 페이지의 전구 0~8개
  const [bulbs, setBulbs] = useState<BulbItem[]>([]);
  const [hasNext, setHasNext] = useState(false);

  const [loading, setLoading] = useState(false);
  const [showLockedPopup, setShowLockedPopup] = useState(false);

  const hasPrev = offset > 0;

  const [openShare, setOpenShare] = useState(false);
  const [copied, setCopied] = useState(false);

  const shareUrl = useMemo(() => {
    if (!userid) return "";
    return `${window.location.origin}/users/${encodeURIComponent(userid)}`;
  }, [userid]);

  const copyShareUrl = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {
      // fallback (구형 브라우저)
      const ta = document.createElement("textarea");
      ta.value = shareUrl;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    }
  };

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

        // ✅ serverDate는 GateContext에 저장 (안전 파싱)
        if (result.serverDate) {
          const d = new Date(result.serverDate as any);
          setServerDate(Number.isNaN(d.getTime()) ? null : d);
        } else {
          setServerDate(null);
        }
      } catch (e) {
        console.error("getUserLetters failed:", e);
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [isLoading, isAuthenticated, userid, offset, setServerDate]);

  // 서버 시간 기준으로 "편지 열림" 여부 (12/25 00:00 이후 true)
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
    navigate(`/users/${userid}/letters/${id}`);
  };

  return (
    <div
      className="min-h-[100svh] select-none caret-transparent"
      onDragStart={(e) => e.preventDefault()}
    >
      <div className="fixed inset-0 -z-10 bg-[#D8D1CE] bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.6),transparent_45%)]" />
      <div className="mx-auto max-w-[var(--layout-max-width)] px-[var(--layout-side-padding)] pt-8 pb-6">
        {/* top bar */}
        <header className="flex items-center justify-between">
          <ServiceTitle className="text-neutral-900" />
          <MenuButton onClick={() => setDrawerOpen(true)} ariaLabel="메뉴 열기" />
        </header>

        {/* title section */}
        <HomeWindowHeader className="mt-6" displayName={displayName} />

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
          <div className="mt-3 flex justify-center">
            <PageIndicator pageIndex={pageIndex} pageCount={pageCount} />
          </div>
        </div>

        {/* bottom share button */}
        <button
          onClick={() => setOpenShare(true)}
          className="mt-8 h-14 w-full rounded-xl bg-[#8E2F2F] text-lg font-semibold text-white shadow-[0_10px_20px_rgba(0,0,0,0.18)]"
        >
          창문 링크 공유하기
        </button>
      </div>

      <SideDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />

      {showLockedPopup && <LockedPopup onClose={() => setShowLockedPopup(false)} />}

      {openShare && (
        <div
          className="fixed inset-0 z-[120] flex items-center justify-center bg-black/40 px-4"
          onClick={() => setOpenShare(false)}
        >
          <div
            className="w-[430px] max-w-[100vw] rounded-2xl bg-white shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* header */}
            <div className="flex items-center justify-between px-6 pt-5">
              <div className="text-base font-bold text-neutral-900">공유 링크</div>
              <button
                type="button"
                onClick={() => setOpenShare(false)}
                className="text-neutral-500 hover:text-neutral-800"
              >
                ✕
              </button>
            </div>

            {/* body */}
            <div className="px-6 pb-6 pt-4">
              <div className="flex items-center gap-2 rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-3">
                <input
                  readOnly
                  value={shareUrl}
                  className="w-full bg-transparent text-sm text-neutral-800 outline-none"
                />
                <button
                  type="button"
                  onClick={copyShareUrl}
                  className="shrink-0 rounded-lg px-2 py-1 text-lg"
                  aria-label="복사"
                  title="복사"
                >
                  📋
                </button>
              </div>

              {copied && (
                <div className="mt-2 text-sm text-green-700">
                  링크가 복사되었어요!
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
