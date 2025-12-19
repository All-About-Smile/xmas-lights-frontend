import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";

import LetterSheet from "@/components/letter/LetterSheet";
import { BULB_IMAGES } from "@/components/scene/bulbImages";
import { toBulbKey } from "@/utils/bulbKey";
import {
  createUserLetter,
  requestEditSession,
  updateUserLetter,
} from "@/api/letterApi";

// ✅ 전구(모양) 5개 이미지
import acorn from "@/assets/ornaments/acorn.png";
import candle from "@/assets/ornaments/candle.png";
import charlie from "@/assets/ornaments/charlie.png";
import dongle from "@/assets/ornaments/dongle.png";
import soap from "@/assets/ornaments/soap.png";

// ✅ 색상칩 이미지들
import colorPink from "@/assets/colors/pink.png";
import colorYellow from "@/assets/colors/yellow.png";
import colorGreen from "@/assets/colors/green.png";
import colorBlue from "@/assets/colors/blue.png";
import colorPurple from "@/assets/colors/purple.png";

const ORNAMENT_OPTIONS = [
  { shape: "acorn", label: "도토리", src: acorn },
  { shape: "dongle", label: "동글", src: dongle },
  { shape: "soap", label: "비누", src: soap },
  { shape: "charlie", label: "찰리", src: charlie },
  { shape: "candle", label: "촛불", src: candle },
] as const;

const COLOR_OPTIONS = [
  { color: "pink", label: "분홍", src: colorPink },
  { color: "yellow", label: "노랑", src: colorYellow },
  { color: "green", label: "초록", src: colorGreen },
  { color: "blue", label: "파랑", src: colorBlue },
  { color: "purple", label: "보라", src: colorPurple },
] as const;

type Step = 1 | 2;

type NavState = {
  password?: string;
};

export default function WriteLetterPage() {
  // ✅ 여기 중요: edit 라우트 param 이름을 letter_number로 통일 추천
  const { userid, letter_number } = useParams<{
    userid: string;
    letter_number?: string;
  }>();

  const location = useLocation();
  const navigate = useNavigate();

  const isEdit = !!letter_number; // ✅ 편지번호 있으면 수정 모드
  const editPassword = (location.state as NavState | null)?.password; // ✅ 홈에서 입력받은 비번

  const [step, setStep] = useState<Step>(isEdit ? 2 : 1);

  // Step1
  const [ornamentShape, setOrnamentShape] = useState<string>("");
  const [ornamentColor, setOrnamentColor] = useState<string>("");
  const [writerNickname, setWriterNickname] = useState<string>("");
  const [passwordForEdit, setPasswordForEdit] = useState<string>(""); // create에서만 사용

  // Step2
  const [content, setContent] = useState<string>("");

  const [submitting, setSubmitting] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [loadingEditData, setLoadingEditData] = useState(false);

  const bulbSrc = useMemo(() => {
    const key = toBulbKey(ornamentShape, ornamentColor);
    if (!key) return "";
    return BULB_IMAGES[key] ?? "";
  }, [ornamentShape, ornamentColor]);

  // ✅ Step1에서 "다음으로" 활성 조건
  // - create: 비번 4자리 필요
  // - edit: 비번 입력란 자체가 없으니 비번 조건 제거
  const canGoNext =
    !!ornamentShape &&
    !!ornamentColor &&
    writerNickname.trim().length > 0 &&
    !!bulbSrc &&
    (isEdit ? true : /^\d{4}$/.test(passwordForEdit));

  const onNext = () => {
    if (!canGoNext) return;
    setStep(2);
  };

  const onBack = () => {
    if (step === 2) setStep(1);
    else navigate(-1);
  };

  function ConfirmSaveModal({
    open,
    onCancel,
    onConfirm,
    disabled,
  }: {
    open: boolean;
    onCancel: () => void;
    onConfirm: () => void;
    disabled?: boolean;
  }) {
    if (!open) return null;

    return (
      <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/40">
        <div className="w-[360px] max-w-[90vw] rounded-2xl bg-white p-6 shadow-xl">
          <div className="text-lg font-extrabold text-neutral-900">
            전구를 밝혀주시겠어요?
          </div>
          <div className="mt-2 text-sm text-neutral-700">
            메시지를 최종 확인해주세요!
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="rounded-xl bg-[#C9C3C3] px-4 py-2 text-sm font-semibold text-neutral-900 shadow"
            >
              잠시만요!
            </button>

            <button
              type="button"
              onClick={onConfirm}
              disabled={disabled}
              className="rounded-xl bg-[#4B6B12] px-4 py-2 text-sm font-semibold text-white shadow disabled:opacity-40"
            >
              네~
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ✅ edit 모드 진입 시: password 검증 + 기존 데이터 로드
  useEffect(() => {
    if (!isEdit) return;
    if (!userid) return;

    const num = Number(letter_number);
    if (!Number.isFinite(num)) return;

    // 새로고침 등으로 state가 날아가면 → 홈으로 돌려보내고 재입력 유도
    if (!editPassword) {
      navigate(`/users/${encodeURIComponent(userid)}`, { replace: true });
      return;
    }

    setLoadingEditData(true);
    requestEditSession({
      userid,
      letter_number: num,
      body: { password: editPassword },
    })
      .then((data) => {
        setWriterNickname(data.writer_nickname ?? "");
        setContent(data.content ?? "");
        setOrnamentShape(data.ornament_shape ?? "");
        setOrnamentColor(data.ornament_color ?? "");
        // edit에서는 passwordForEdit를 쓰지 않음
      })
      .finally(() => setLoadingEditData(false));
  }, [isEdit, userid, letter_number, editPassword, navigate]);

  const onSubmit = async () => {
    if (!userid) return;
    if (content.trim().length === 0) return;

    setSubmitting(true);
    try {
      if (!isEdit) {
        // ✅ create
        await createUserLetter(userid, {
          writer_nickname: writerNickname.trim(),
          content: content.trim().slice(0, 200),
          ornament_shape: ornamentShape,
          ornament_color: ornamentColor,
          password_for_edit: passwordForEdit,
        });
      } else {
        // ✅ update (비밀번호는 state로 받은 editPassword 사용)
        const num = Number(letter_number);
        if (!Number.isFinite(num)) return;
        if (!editPassword) {
          // 혹시 모를 안전장치
          navigate(`/users/${encodeURIComponent(userid)}`, { replace: true });
          return;
        }

        await updateUserLetter({
          userid,
          letter_number: num,
          body: {
            writer_nickname: writerNickname.trim(),
            content: content.trim().slice(0, 200),
            ornament_shape: ornamentShape,
            ornament_color: ornamentColor,
            password: editPassword,
          },
        });
      }

      // 저장 성공 → guest home 복귀
      navigate(`/users/${encodeURIComponent(userid)}`, { replace: true });
    } finally {
      setSubmitting(false);
    }
  };

  // -------- Step1 UI --------
  if (step === 1) {
    return (
      <div className="min-h-screen bg-[#D8D1CE]">
        <div className="mx-auto max-w-[430px] px-5 pt-4 pb-10">
          {/* top bar */}
          <header className="flex items-start justify-between">
            <button
              type="button"
              onClick={onBack}
              className="text-sm font-medium text-neutral-900"
            >
              ← 이전
            </button>
            <div />
          </header>

          <h1 className="mt-6 text-xl font-extrabold text-neutral-900">
            전구를 선택해주세요
          </h1>

          {/* ✅ 전구 모양 선택 박스 */}
          <div className="mt-5 rounded-2xl border border-neutral-700/40 bg-transparent px-4 py-4">
            <div className="flex items-center justify-between gap-2">
              {ORNAMENT_OPTIONS.map((opt) => {
                const selected = ornamentShape === opt.shape;

                return (
                  <button
                    key={opt.shape}
                    type="button"
                    onClick={() => setOrnamentShape(opt.shape)}
                    className={[
                      "relative grid place-items-center rounded-xl transition",
                      "h-14 w-14",
                      selected ? "ring-2 ring-[#8E2F2F]" : "ring-1 ring-neutral-500/40",
                      "bg-white/20",
                    ].join(" ")}
                    aria-pressed={selected}
                  >
                    <img
                      src={opt.src}
                      alt={opt.label}
                      className="h-10 w-10 object-contain"
                    />
                    {selected && (
                      <span className="absolute -right-1 -top-1 grid h-5 w-5 place-items-center rounded-full bg-[#8E2F2F] text-[12px] text-white">
                        ✓
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* ✅ 색상 선택 */}
          <div className="mt-6">
            <div className="text-sm font-semibold text-neutral-800">색상 선택</div>
            <div className="mt-3 flex items-center gap-3">
              {COLOR_OPTIONS.map((opt) => {
                const selected = ornamentColor === opt.color;

                return (
                  <button
                    key={opt.color}
                    type="button"
                    onClick={() => setOrnamentColor(opt.color)}
                    className={[
                      "relative grid place-items-center rounded-xl transition",
                      "h-12 w-12",
                      selected ? "ring-2 ring-[#8E2F2F]" : "ring-1 ring-neutral-500/40",
                      "bg-white/20",
                    ].join(" ")}
                    aria-pressed={selected}
                  >
                    <img src={opt.src} alt={opt.label} className="h-8 w-8 object-contain" />
                    {selected && (
                      <span className="absolute -right-1 -top-1 grid h-5 w-5 place-items-center rounded-full bg-[#8E2F2F] text-[12px] text-white">
                        ✓
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* ✅ to / from */}
          <div className="mt-7 space-y-3 text-sm text-neutral-900">
            <div className="flex items-center gap-3">
              <div className="w-10 font-semibold">to.</div>
              <div className="flex-1 border-b border-neutral-700/40 pb-1">
                {userid ?? "받는이"}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 font-semibold">from.</div>
              <input
                className="flex-1 rounded-lg bg-white/35 px-3 py-2 outline-none ring-1 ring-neutral-500/30 focus:ring-2 focus:ring-[#8E2F2F]"
                placeholder="닉네임"
                value={writerNickname}
                onChange={(e) => setWriterNickname(e.target.value)}
              />
            </div>
          </div>

          {/* ✅ 비밀번호: create에서만 노출 */}
          {!isEdit && (
            <div className="mt-5">
              <div className="text-sm font-semibold text-neutral-800">비밀번호</div>
              <input
                className="mt-2 w-36 rounded-lg bg-white/35 px-3 py-2 text-center tracking-widest outline-none ring-1 ring-neutral-500/30 focus:ring-2 focus:ring-[#8E2F2F]"
                placeholder="****"
                inputMode="numeric"
                value={passwordForEdit}
                onChange={(e) =>
                  setPasswordForEdit(e.target.value.replace(/\D/g, "").slice(0, 4))
                }
              />
              <div className="mt-1 text-xs text-neutral-700">숫자 4자리</div>
            </div>
          )}

          {/* ✅ 다음으로 */}
          <button
            type="button"
            onClick={onNext}
            disabled={!canGoNext}
            className="mt-8 h-14 w-full rounded-xl bg-[#8E2F2F] text-lg font-semibold text-white shadow-[0_10px_20px_rgba(0,0,0,0.18)] disabled:opacity-40"
          >
            다음으로
          </button>
        </div>
      </div>
    );
  }

  // -------- Step2: LetterSheet (쓰기/수정 공용) --------
  return (
    <div className="relative">
      {loadingEditData ? (
        <div className="mx-auto max-w-[430px] px-5 py-10">불러오는 중...</div>
      ) : (
        <LetterSheet
          mode="write"
          toName={userid ?? "받는이"}
          fromName={writerNickname || "익명"}
          bulbSrc={bulbSrc}
          content={content}
          onChangeContent={setContent}
          onBack={onBack}
        />
      )}

      {/* 하단 버튼 */}
      <div className="mx-auto max-w-[430px] px-5 pb-4 -mt-3">
        <button
          type="button"
          onClick={() => setOpenConfirm(true)}
          disabled={submitting || content.trim().length === 0 || loadingEditData}
          className="h-14 w-full rounded-xl bg-[#8E2F2F] text-lg font-semibold text-white disabled:opacity-40"
        >
          {submitting ? "저장 중..." : isEdit ? "수정하기" : "저장하기"}
        </button>
      </div>

      {/* ✅ 확인 팝업 */}
      <ConfirmSaveModal
        open={openConfirm}
        onCancel={() => setOpenConfirm(false)}
        onConfirm={async () => {
          setOpenConfirm(false);
          await onSubmit();
        }}
        disabled={submitting}
      />
    </div>
  );
}
