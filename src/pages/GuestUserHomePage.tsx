import OrnamentLayer from "@/components/rollingpaper/OrnamentLayer";
import Scene from "@/components/scene/Scene";

import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { SLOTS, PAGE_SIZE } from "@/components/scene/sceneSlots";
import { BULB_IMAGES } from "@/components/scene/bulbImages";
import type { BulbItem } from "@/components/scene/types";

import { deleteUserLetter, getUserLetters } from "@/api/letterApi";
import { toBulbKey } from "@/utils/bulbKey";

type ActionMode = "edit" | "delete";

export default function GuestUserHomePage() {
  const navigate = useNavigate();
  const { userid } = useParams<{ userid: string }>();

  const [offset, setOffset] = useState(0);

  const [bulbs, setBulbs] = useState<BulbItem[]>([]);
  const [hasNext, setHasNext] = useState(false);
  const [loading, setLoading] = useState(false);

  const hasPrev = offset > 0;

  // ✅ 오너먼트 클릭 후 선택된 편지 번호
  const [selectedLetterNumber, setSelectedLetterNumber] = useState<number | null>(null);

  // ✅ 1) 수정/삭제 선택 바텀시트
  const [actionOpen, setActionOpen] = useState(false);

  // ✅ 2) "정말 수정/삭제?" + 비번 입력 모달
  const [confirmMode, setConfirmMode] = useState<null | ActionMode>(null);
  const [pw, setPw] = useState("");

  // userid 바뀌면 첫 페이지로
  useEffect(() => {
    setOffset(0);
  }, [userid]);

  // ✅ 목록 로딩을 함수로 빼두면 삭제 후 재조회하기 쉬움
  const fetchPage = async (opts?: { keepLoadingState?: boolean }) => {
    if (!userid) return;

    const keepLoadingState = opts?.keepLoadingState ?? false;

    try {
      if (!keepLoadingState) setLoading(true);

      const result = await getUserLetters({
        userid,
        limit: PAGE_SIZE,
        offset,
      });

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
      if (!keepLoadingState) setLoading(false);
    }
  };

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

  // 페이지 표시
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

  // ✅ 오너먼트 클릭: 무조건 수정/삭제 메뉴 띄우기 (읽기 잠금과 무관)
  const onOpenLetter = (id: string) => {
    const n = Number(id);
    if (!Number.isFinite(n)) return;

    setSelectedLetterNumber(n);
    setPw("");
    setActionOpen(true);
  };

  const closeAll = () => {
    setActionOpen(false);
    setConfirmMode(null);
    setPw("");
    setSelectedLetterNumber(null);
  };

  const openConfirm = (mode: ActionMode) => {
    setActionOpen(false);
    setConfirmMode(mode);
    setPw("");
  };

  const goEdit = () => {
    if (!userid || !selectedLetterNumber) return;
    if (!/^\d{4}$/.test(pw)) return;

    // ✅ WriteLetterPage로 이동 (수정모드)
    // 너희 goWriteLetter가 `/users/${userid}/letters`로 가니까, 수정도 동일 페이지로 보내되 state만 다르게
    navigate(`/users/${userid}/letters`, {
      state: { mode: "edit", letterNumber: selectedLetterNumber, password: pw },
    });
  };

  const doDelete = async () => {
    if (!userid || !selectedLetterNumber) return;
    if (!/^\d{4}$/.test(pw)) return;

    try {
      setLoading(true);
      await deleteUserLetter({
        userid,
        letterNumber: selectedLetterNumber,
        password: pw,
      });

      closeAll();

      // ✅ 삭제 후 현재 페이지 다시 불러오기
      await fetchPage({ keepLoadingState: true });
    } catch (e) {
      console.error("deleteUserLetter failed:", e);
      // 필요하면 여기서 "비밀번호가 틀렸어요" 같은 UX 처리 가능
    } finally {
      setLoading(false);
    }
  };

  function ActionSheet({ open }: { open: boolean }) {
    if (!open) return null;

    return (
      <div
        className="fixed inset-0 z-[90] flex items-center justify-center bg-black/40 px-4"
        onClick={closeAll} // 바깥 클릭하면 닫기
      >
        <div
          className="w-[430px] max-w-[100vw] rounded-2xl bg-white shadow-xl"
          onClick={(e) => e.stopPropagation()} // 모달 내부 클릭은 닫히지 않게
        >
          {/* header */}
          <div className="flex items-center justify-between px-6 pt-5">
            <div className="text-base font-bold text-neutral-900">
              메시지를 변경하시겠습니까?
            </div>
            <button
              type="button"
              onClick={closeAll}
              className="text-neutral-500 hover:text-neutral-800"
              aria-label="닫기"
            >
              ✕
            </button>
          </div>

          {/* body */}
          <div className="px-6 pb-6 pt-4">
            <div className="mt-4 flex justify-center gap-3">
              <button
                type="button"
                onClick={() => openConfirm("edit")}
                className="h-10 w-28 rounded-lg bg-neutral-800 text-white font-semibold"
              >
                수정
              </button>

              <button
                type="button"
                onClick={() => openConfirm("delete")}
                className="h-10 w-28 rounded-lg bg-red-600 text-white font-semibold"
              >
                삭제
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  function ConfirmPasswordModal({ mode }: { mode: ActionMode }) {
    const title = mode === "edit" ? "정말 수정 하시겠습니까?" : "정말 삭제 하시겠습니까?";
    const btnText = mode === "edit" ? "수정" : "삭제";
    const onConfirm = mode === "edit" ? goEdit : doDelete;

    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40">
        <div className="w-[360px] max-w-[90vw] rounded-2xl bg-white p-6 shadow-xl">
          <div className="text-lg font-extrabold text-neutral-900">{title}</div>
          <div className="mt-2 text-sm text-neutral-700">
            비밀번호(숫자 4자리)를 입력해주세요.
          </div>

          <input
            autoFocus
            className="mt-4 w-full rounded-xl bg-white px-3 py-3 text-center tracking-widest outline-none ring-1 ring-neutral-300 focus:ring-2 focus:ring-[#8E2F2F]"
            value={pw}
            inputMode="numeric"
            placeholder="****"
            onChange={(e) => setPw(e.target.value.replace(/\D/g, "").slice(0, 4))
              
            }
          />

          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setConfirmMode(null)}
              className="rounded-xl bg-neutral-200 px-4 py-2 text-sm font-semibold"
            >
              취소
            </button>

            <button
              type="button"
              onClick={onConfirm}
              disabled={!/^\d{4}$/.test(pw) || loading}
              className="rounded-xl bg-[#8E2F2F] px-4 py-2 text-sm font-semibold text-white disabled:opacity-40"
            >
              {btnText}
            </button>
          </div>
        </div>
      </div>
    );
  }

  const displayName = userid ?? "사용자";

  const goWriteLetter = () => {
    if (!userid) return;
    navigate(`/users/${userid}/letters`);
  };

  return (
    <div className="h-[100dvh] overflow-hidden select-none caret-transparent bg-[#D8D1CE] bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.6),transparent_45%)]">
      <div className="mx-auto max-w-[430px] h-full px-5 pt-4 pb-4 flex flex-col">
        {/* top bar */}
        <header className="flex items-start justify-between">
          <div className="text-sm font-medium text-neutral-800">밝혀줘! 내 X-mas 전구</div>

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
        <div className="mt-4">
          <h1 className="text-3xl font-extrabold tracking-tight text-neutral-900">
            {displayName} 님의 창문
          </h1>

          <div className="mt-3 text-sm text-neutral-700">🎄 올해까지 벌써 15일 남음...</div>
          <div className="mt-1 text-sm text-neutral-700">지금당장 ❤️편할지 써야겠지?😳</div>
        </div>

        {/* window area */}
        <div className="mt-4 flex-1 min-h-0 flex items-center justify-center">
          <div className="relative h-[min(54dvh,480px)] w-auto max-w-full overflow-hidden rounded-none shadow-none aspect-[430/535]">
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
                  onOpenLetter={onOpenLetter} // ✅ 여기 중요
                />
              </Scene>
            </div>
          </div>
        </div>

        {/* bottom buttons */}
        <div className="mt-4 space-y-3">
          <button
            type="button"
            onClick={goWriteLetter}
            className="h-14 w-full rounded-xl bg-[#8E2F2F] text-lg font-semibold text-white shadow-[0_10px_20px_rgba(0,0,0,0.18)]"
          >
            창문 꾸미기
          </button>
        </div>
      </div>

      {/* ✅ 모달들 */}
      <ActionSheet open={actionOpen} />
      {confirmMode && <ConfirmPasswordModal mode={confirmMode} />}
    </div>
  );
}
