import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import LetterSheet from "@/components/letter/LetterSheet";
import { BULB_IMAGES } from "@/components/scene/bulbImages";
import { toBulbKey } from "@/utils/bulbKey";
import { createUserLetter } from "@/api/letterApi";

// ✅ 전구(모양) 5개 이미지
import acorn from "@/assets/ornaments/acorn.png";
import candle from "@/assets/ornaments/candle.png";
import charlie from "@/assets/ornaments/charlie.png";
import dongle from "@/assets/ornaments/dongle.png";
import soap from "@/assets/ornaments/soap.png";

// ✅ 색상칩 이미지들 (예: pink, yellow, green, blue, purple)
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

export default function WriteLetterPage() {
  const { userid } = useParams<{ userid: string }>();
  const navigate = useNavigate();

  const [step, setStep] = useState<Step>(1);

  // Step1
  const [ornamentShape, setOrnamentShape] = useState<string>("");
  const [ornamentColor, setOrnamentColor] = useState<string>("");
  const [writerNickname, setWriterNickname] = useState<string>("");
  const [passwordForEdit, setPasswordForEdit] = useState<string>("");

  // Step2
  const [content, setContent] = useState<string>("");

  const [submitting, setSubmitting] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);

  const bulbSrc = useMemo(() => {
    const key = toBulbKey(ornamentShape, ornamentColor);
    if (!key) return "";
    return BULB_IMAGES[key] ?? "";
  }, [ornamentShape, ornamentColor]);

  const canGoNext =
    !!ornamentShape &&
    !!ornamentColor &&
    writerNickname.trim().length > 0 &&
    /^\d{4}$/.test(passwordForEdit) &&
    !!bulbSrc;

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


  const onSubmit = async () => {
    if (!userid) return;
    if (content.trim().length === 0) return;

    setSubmitting(true);
    try {
      await createUserLetter(userid, {
        writer_nickname: writerNickname.trim(),
        content: content.trim().slice(0, 200),
        ornament_shape: ornamentShape,
        ornament_color: ornamentColor,
        password_for_edit: passwordForEdit,
      });

      // 저장 성공 → guestuerHome 복귀
      navigate(`/users/${userid}`);
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
            <button type="button" onClick={onBack} className="text-sm font-medium text-neutral-900">
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
                    <img src={opt.src} alt={opt.label} className="h-10 w-10 object-contain" />
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
                {userid  ?? "받는이"}
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

            {/* ✅ 비밀번호 */}
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
  // -------- Step2: LetterSheet (쓰기) --------
  return (
    <div className="relative">
        <LetterSheet
            mode="write"
            toName={userid ?? "받는이"}
            fromName={writerNickname || "익명"}
            bulbSrc={bulbSrc}
            content={content}
            onChangeContent={setContent}
            onBack={onBack}
        />

        {/* 하단 버튼 */}
        <div className="mx-auto max-w-[430px] px-5 pb-4 -mt-3">
            <button
            type="button"
            onClick={() => setOpenConfirm(true)}  // ✅ 변경
            disabled={submitting || content.trim().length === 0}
            className="h-14 w-full rounded-xl bg-[#8E2F2F] text-lg font-semibold text-white disabled:opacity-40"
            >
            {submitting ? "저장 중..." : "저장하기"}
            </button>
        </div>

        {/* ✅ 확인 팝업 */}
        <ConfirmSaveModal
            open={openConfirm}
            onCancel={() => setOpenConfirm(false)} // 잠시만요! → 다시 작성
            onConfirm={async () => {
            setOpenConfirm(false);
            await onSubmit();                    // 네~ → 실제 저장
            }}
            disabled={submitting}
        />
        </div>

  );
}
