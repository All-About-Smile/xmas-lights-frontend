import axios from "axios";

import OrnamentLayer from "@/components/rollingpaper/OrnamentLayer";
import Scene from "@/components/scene/Scene";

import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { SLOTS, PAGE_SIZE } from "@/components/scene/sceneSlots";
import { BULB_IMAGES } from "@/components/scene/bulbImages";
import type { BulbItem } from "@/components/scene/types";


import {
  deleteUserLetter,
  getUserLetters,
  fetchLetterForEdit,
} from "@/api/letterApi";
import { checkUserExists } from "@/api/userApi";
import { toBulbKey } from "@/utils/bulbKey";
import HomeButton from "@/components/navigation/HomeButton";
import PageIndicator from "@/components/common/PageIndicator";
import ServiceTitle from "@/components/common/ServiceTitle";
import WindowHeader from "@/components/common/WindowHeader";
import InfoButton from "../components/InfoButton";

// ✅ 추가: GateContext
import { useGate } from "@/contexts/GateContext";

type ActionMode = "edit" | "delete";

export default function GuestUserHomePage() {
  const navigate = useNavigate();
  const { userid } = useParams<{ userid: string }>();

  // ✅ 추가: serverDate 저장 + 잠금 플래그
  const { setServerDate, isWriteLocked } = useGate();

  const [offset, setOffset] = useState(0);

  const [bulbs, setBulbs] = useState<BulbItem[]>([]);
  const [hasNext, setHasNext] = useState(false);
  const [loading, setLoading] = useState(false);

  // ✅ 유저 존재 검증 상태
  const [userOk, setUserOk] = useState<boolean | null>(null);

  const hasPrev = offset > 0;

  const [selectedLetterNumber, setSelectedLetterNumber] = useState<number | null>(
    null
  );
  const [actionOpen, setActionOpen] = useState(false);
  const [confirmMode, setConfirmMode] = useState<null | ActionMode>(null);
  const [pw, setPw] = useState("");
  const [pwError, setPwError] = useState<string | null>(null);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const [openHelp, setOpenHelp] = useState(false);

  // hover로 열리게(데스크탑), 클릭으로도 토글(모바일)
  const helpHandlers = useMemo(
    () => ({
      onMouseEnter: () => setOpenHelp(true),
      onMouseLeave: () => setOpenHelp(false),
      onClick: () => setOpenHelp((v) => !v),
    }),
    []
  );

  // ✅ userid 바뀌면 초기화 + 유저 존재 확인
  useEffect(() => {
    console.log("[GuestUserHomePage] userid param =", userid);

    setOffset(0);
    setBulbs([]);
    setHasNext(false);
    setUserOk(null);

    if (!userid) {
      navigate("/404", { replace: true });
      return;
    }

    let mounted = true;

    (async () => {
      try {
        const ok = await checkUserExists(userid);
        if (!mounted) return;

        if (!ok) {
          setUserOk(false); // ✅ 추가
          navigate("/404", { replace: true });
          return;
        }
        setUserOk(true);
      } catch (e) {
        console.error("checkUserExists failed:", e);
        navigate("/error", { replace: true });
      }
    })();

    return () => {
      mounted = false;
    };
  }, [userid, navigate]);

  // ✅ 목록 로딩 함수
  const fetchPage = async (opts?: { keepLoadingState?: boolean }) => {
    if (!userid) return;
    if (userOk !== true) return;

    const keepLoadingState = opts?.keepLoadingState ?? false;

    try {
      if (!keepLoadingState) setLoading(true);

      const result = await getUserLetters({
        userid,
        limit: PAGE_SIZE,
        offset,
      });

      // ✅ 추가: serverDate를 GateContext에 저장 (안전 파싱)
      if (result.serverDate) {
        const d = new Date(result.serverDate as any);
        setServerDate(Number.isNaN(d.getTime()) ? null : d);
      } else {
        setServerDate(null);
      }

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
      if (axios.isAxiosError(e) && e.response?.status === 404) {
        navigate("/404", { replace: true });
        return;
      }
      console.error("getUserLetters failed:", e);
    } finally {
      if (!keepLoadingState) setLoading(false);
    }
  };

  // ✅ userOk가 true가 된 뒤 + offset 변경 시 목록 불러오기
  useEffect(() => {
    if (userOk !== true) return;
    fetchPage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userOk, offset, userid]);

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
    // ✅ 추가: 25일 이후 전구(오너먼트) 클릭 자체 막기
    if (isWriteLocked) return;

    const n = Number(id);
    if (!Number.isFinite(n)) return;

    setSelectedLetterNumber(n);
    setPw("");
    setPwError(null);
    setActionOpen(true);
  };

  const closeAll = () => {
    setActionOpen(false);
    setConfirmMode(null);
    setPw("");
    setPwError(null);
    setSelectedLetterNumber(null);
  };

  const openConfirm = (mode: ActionMode) => {
    setActionOpen(false);
    setConfirmMode(mode);
    setPw("");
    setPwError(null);
  };

  const goEdit = async () => {
    if (!userid || !selectedLetterNumber) return;
    if (!/^\d{4}$/.test(pw)) return;

    try {
      setConfirmLoading(true);
      setPwError(null);

      await fetchLetterForEdit({
        userid,
        letterNumber: selectedLetterNumber,
        password: pw,
      });

      navigate(`/users/${userid}/letters`, {
        state: { mode: "edit", letterNumber: selectedLetterNumber, password: pw },
      });
    } catch (e) {
      if (axios.isAxiosError(e)) {
        const status = e.response?.status;
        if (status === 401 || status === 403) {
          setPwError("비밀번호가 다릅니다.");
          return;
        }
      }
      setPwError("비밀번호 확인에 실패했어요. 잠시 후 다시 시도해주세요.");
    } finally {
      setConfirmLoading(false);
    }
  };

  const doDelete = async () => {
    if (!userid || !selectedLetterNumber) return;
    if (!/^\d{4}$/.test(pw)) return;

    try {
      setConfirmLoading(true);
      setPwError(null);

      await deleteUserLetter({
        userid,
        letterNumber: selectedLetterNumber,
        password: pw,
      });

      closeAll();
      await fetchPage({ keepLoadingState: true });
    } catch (e) {
      if (axios.isAxiosError(e)) {
        const status = e.response?.status;
        if (status === 401 || status === 403) {
          setPwError("비밀번호가 다릅니다.");
          return;
        }
      }
      setPwError("삭제에 실패했어요. 잠시 후 다시 시도해주세요.");
    } finally {
      setConfirmLoading(false);
    }
  };

  function ActionSheet({ open }: { open: boolean }) {
    if (!open) return null;

    // ✅ 추가: 25일 이후 수정/삭제 UI 자체 숨김
    if (isWriteLocked) return null;

    return (
      <div
        className="fixed inset-0 z-[90] flex items-center justify-center bg-black/40 px-4"
        onClick={closeAll}
      >
        <div
          className="w-[430px] max-w-[100vw] rounded-2xl bg-white shadow-xl"
          onClick={(e) => e.stopPropagation()}
        >
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

          <div className="px-6 pb-6 pt-4">
            <div className="mt-4 flex justify-center gap-3">
              <button
                type="button"
                onClick={() => openConfirm("edit")}
                className="text-base h-10 w-28 rounded-lg bg-neutral-800 text-white font-semibold"
              >
                수정
              </button>
              <button
                type="button"
                onClick={() => openConfirm("delete")}
                className="text-base h-10 w-28 rounded-lg bg-red-600 text-white font-semibold"
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
    // ✅ 추가: 25일 이후 모달 자체도 숨김(안전)
    if (isWriteLocked) return null;

    const title = mode === "edit" ? "정말 수정 하시겠습니까?" : "정말 삭제 하시겠습니까?";
    const btnText = mode === "edit" ? "수정" : "삭제";
    const onConfirm = mode === "edit" ? goEdit : doDelete;

    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40">
        <div className="w-[360px] max-w-[90vw] rounded-2xl bg-white p-6 shadow-xl">
          <div className="text-lg font-extrabold text-neutral-900">{title}</div>
          <div className="text-base mt-2 text-neutral-700">
            비밀번호(숫자 4자리)를 입력해주세요.
          </div>

          <input
            autoFocus
            className="mt-4 w-full rounded-xl bg-white px-3 py-3 text-center tracking-widest outline-none ring-1 ring-neutral-300 focus:ring-2 focus:ring-[#8E2F2F]"
            value={pw}
            inputMode="numeric"
            placeholder="****"
            onChange={(e) => setPw(e.target.value.replace(/\D/g, "").slice(0, 4))}
          />
          {pwError && <div className="mt-2 text-sm text-red-600">{pwError}</div>}

          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setConfirmMode(null)}
              className="text-base rounded-xl bg-neutral-200 px-4 py-2 font-semibold"
            >
              취소
            </button>
            <button
              type="button"
              onClick={onConfirm}
              disabled={!/^\d{4}$/.test(pw) || loading || confirmLoading}
              className="text-base rounded-xl bg-[#8E2F2F] px-4 py-2 font-semibold text-white disabled:opacity-40"
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

    // ✅ 추가: 25일 이후 작성 페이지 이동 막기
    if (isWriteLocked) return;

    navigate(`/users/${userid}/letters`);
  };

  if (userOk === null) {
    return (
      <div className="min-h-screen bg-[#D8D1CE] flex items-center justify-center">
        로딩중...
      </div>
    );
  }

  return (
    <div
      className="min-h-screen select-none caret-transparent bg-[#D8D1CE] bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.6),transparent_45%)]"
      onDragStart={(e) => e.preventDefault()}
    >
      <div className="mx-auto max-w-[var(--layout-max-width)] px-[var(--layout-side-padding)] pt-8 pb-6">
        <header className="flex items-center justify-between">
          <ServiceTitle className="text-neutral-900" />
          <div className="flex items-center gap-2">
          {/* info button */}
            <div className="relative z-[9999]">
              <InfoButton ariaLabel="사용법 안내" {...helpHandlers} />
  
              {/* popover */}
              <div
                  className={`absolute right-0 top-11 w-[280px] rounded-xl bg-[#F7F1E6] p-4 text-base text-neutral-900 shadow-lg transition-all
                ${openHelp ? "opacity-100 translate-y-0" : "pointer-events-none opacity-0 -translate-y-1"}`}
              >
                <div className="font-semibold">✍️ 편지 작성 방법</div>
                <ol className="mt-2 list-decimal space-y-1 pl-5 leading-5">
                  <li>편지를 남길 지인의 창문으로 이동해 줘~</li>
                  <li>창문을 밝혀줄 전구와 색상을 선택해 봐!</li>
                  <li>따뜻한 메시지로 마음을 전달해 보자~!</li>
                </ol>
                <p>💌 로그인하지 않아도 편지 남길 수 있어! <div className="text-[#006F57] font-medium">(❁´◡`❁)</div></p>
                <br />
  
                <div className="font-semibold">✨창문 생성 방법 (회원가입)</div>
                <ol className="mt-2 list-decimal space-y-1 pl-5 leading-5">
                  <li>메인 페이지에서 “로그인하기” 버튼 클릭! 또는</li>
                  <li>지인의 창문 페이지에서 “홈” 버튼 클릭!</li>
                </ol>
                  <p>💌 작성한 메시지는 12월 25일에 공개될 거야!<div className="text-[#BB010B] font-medium">(ღˇᴗˇ)｡o♡</div></p>
              </div>
            </div>
          <HomeButton to="/" ariaLabel="메인으로" />
          </div>
        </header>

        <WindowHeader className="mt-6" displayName={displayName} />

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

          <div className="mt-3 flex justify-center">
            <PageIndicator pageIndex={pageIndex} pageCount={pageCount} />
          </div>
        </div>

        <button
          type="button"
          onClick={goWriteLetter}
          disabled={isWriteLocked}
          className="mt-8 h-14 w-full rounded-xl bg-[#8E2F2F] text-lg font-semibold text-white shadow-[0_10px_20px_rgba(0,0,0,0.18)] disabled:opacity-40 disabled:cursor-not-allowed"
        >
          창문 꾸미기
        </button>
      </div>

      <ActionSheet open={actionOpen} />
      {confirmMode && <ConfirmPasswordModal mode={confirmMode} />}
    </div>
  );
}
