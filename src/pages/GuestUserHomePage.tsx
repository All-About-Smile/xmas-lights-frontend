import OrnamentLayer from "@/components/rollingpaper/OrnamentLayer";
import Scene from "@/components/scene/Scene";

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { SLOTS } from "@/components/scene/sceneSlots";
import { BULB_IMAGES } from "@/components/scene/bulbImages";

import { useLetterPagination } from "@/hooks/useLetterPagination";

function ActionModal({
  open,
  onClose,
  onEdit,
  onDelete,
}: {
  open: boolean;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/40">
      <div className="w-[360px] max-w-[90vw] rounded-2xl bg-[#F3EEDB] p-6 shadow-xl relative">
        <button onClick={onClose} className="absolute right-3 top-3 text-neutral-700">
          ×
        </button>

        <div className="text-base font-extrabold text-neutral-900 text-center">
          메시지를 변경하시겠습니까?
        </div>

        <div className="mt-6 flex justify-center gap-3">
          <button
            type="button"
            onClick={onEdit}
            className="h-10 w-24 rounded bg-neutral-800 text-white text-sm font-semibold"
          >
            수정
          </button>
          <button
            type="button"
            onClick={onDelete}
            className="h-10 w-24 rounded bg-red-600 text-white text-sm font-semibold"
          >
            삭제
          </button>
        </div>
      </div>
    </div>
  );
}

function PasswordModal({
  open,
  title,
  onClose,
  onConfirm,
  errorMsg,
}: {
  open: boolean;
  title: string;
  onClose: () => void;
  onConfirm: (pw: string) => void;
  errorMsg?: string | null;
}) {
  const [pw, setPw] = useState("");

  useEffect(() => {
    if (open) setPw("");
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40">
      <div className="w-[380px] max-w-[92vw] rounded-2xl bg-[#F3EEDB] p-6 shadow-xl relative">
        <button onClick={onClose} className="absolute right-3 top-3 text-neutral-700">
          ×
        </button>

        <div className="text-base font-extrabold text-neutral-900 text-center">{title}</div>

        <div className="mt-5 flex items-center gap-3">
          <input
            className="flex-1 rounded-lg bg-white px-4 py-3 text-center tracking-widest outline-none ring-1 ring-red-300 focus:ring-2 focus:ring-[#8E2F2F]"
            placeholder="비밀번호 입력"
            inputMode="numeric"
            value={pw}
            onChange={(e) => setPw(e.target.value.replace(/\D/g, "").slice(0, 4))}
          />
          <button
            type="button"
            disabled={pw.length !== 4}
            onClick={() => onConfirm(pw)}
            className="h-11 w-16 rounded bg-neutral-200 text-sm font-semibold disabled:opacity-40"
          >
            확인
          </button>
        </div>

        {errorMsg && <div className="mt-2 text-xs text-red-600 text-center">{errorMsg}</div>}
      </div>
    </div>
  );
}



export default function GuestUserHomePage() {
  type ActionType = "edit" | "delete";

  const [openActionModal, setOpenActionModal] = useState(false);
  const [openPwModal, setOpenPwModal] = useState(false);
  const [selectedLetterNumber, setSelectedLetterNumber] = useState<string | null>(null);
  const [selectedAction, setSelectedAction] = useState<ActionType | null>(null);
  const [pwError, setPwError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { userid } = useParams<{ userid: string }>();

  const {
    bulbs,
    hasPrev,
    hasNext,
    pageIndex,
    pageCount,
    loading,
    goPrev,
    goNext,
    reset,
    refresh,
  } = useLetterPagination({ userid });

  const onPrev = () => {
    goPrev();
  };

  const onNext = () => {
    goNext();
  };

  const onOpenLetter = (letterNumber: string) => {
    setSelectedLetterNumber(letterNumber);
    setOpenActionModal(true);
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
      <ActionModal
        open={openActionModal}
        onClose={() => setOpenActionModal(false)}
        onEdit={() => {
            setSelectedAction("edit");
            setOpenActionModal(false);
            setPwError(null);
            setOpenPwModal(true);
        }}
        onDelete={() => {
            setSelectedAction("delete");
            setOpenActionModal(false);
            setPwError(null);
            setOpenPwModal(true);
        }}
        />

        <PasswordModal
        open={openPwModal}
        title={selectedAction === "delete" ? "메시지를 삭제하시겠습니까?" : "메시지를 수정하시겠습니까?"}
        errorMsg={pwError}
        onClose={() => setOpenPwModal(false)}
        onConfirm={async (pw) => {
            if (!userid || !selectedLetterNumber || !selectedAction) return;

            // ✅ 여기서 비밀번호 검증을 “서버에 맡기는 방식”이 제일 안전
            // edit: 수정 페이지로 이동 (비번은 state로 넘김)
            if (selectedAction === "edit") {
            setOpenPwModal(false);
            navigate(`/users/${userid}/letters/${selectedLetterNumber}/edit`, {
                state: { password: pw },
            });
            return;
            }

            // delete: 삭제 API 호출 (엔드포인트는 너희 BE에 맞춰 바꿔야 함)
            try {
            // await deleteLetter(userid, selectedLetterNumber, pw);
            setOpenPwModal(false);
            // 삭제 후 목록 새로고침
            reset();
            await refresh();
            } catch (e) {
            setPwError("비밀번호가 일치하지 않습니다");
            }
        }}
        />
    </div>
    
  );
  
}
