import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import LetterSheet from "@/components/letter/LetterSheet";
import LoadingText from "@/components/common/LoadingText";
import BackButton from "@/components/common/BackButton";
import { BULB_IMAGES } from "@/components/scene/bulbImages";
import { toBulbKey } from "@/utils/bulbKey";

import {
  createUserLetter,
  fetchLetterForEdit,
  updateUserLetter,
} from "@/api/letterApi";

// ornaments
import acorn from "@/assets/ornaments/acorn.png";
import candle from "@/assets/ornaments/candle.png";
import charlie from "@/assets/ornaments/charlie.png";
import dongle from "@/assets/ornaments/dongle.png";
import soap from "@/assets/ornaments/soap.png";

// colors
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

type EditNavState =
  | {
      mode: "edit";
      letterNumber: number;
      password: string;
    }
  | undefined;

type NavState = EditNavState | { mode: "write" } | undefined;

type ActiveDraft =
  | {
      mode: "edit";
      letterNumber: number;
      password: string;
    }
  | { mode: "write" };

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
      <div
        className="w-[360px] max-w-[90vw] rounded-2xl bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="select-none caret-transparent text-2xl font-extrabold text-neutral-900">
          전구를 밝혀주시겠어요?
        </div>
        <div className="select-none caret-transparent mt-2 text-lg text-neutral-700">
          메시지를 최종 확인해주세요!
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-xl bg-[#C9C3C3] px-4 py-2 text-xl font-semibold text-neutral-900 shadow"
          >
            잠시만요!
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={disabled}
            className="rounded-xl bg-[#4B6B12] px-4 py-2 text-xl font-semibold text-white shadow disabled:opacity-40"
          >
            네~
          </button>
        </div>
      </div>
    </div>
  );
}

export default function WriteLetterPage() {
  // ✅ hooks는 항상 동일한 순서로 실행되어야 함 (early return 금지)

  const { userid } = useParams<{ userid: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const navState = location.state as NavState;

  const [editContext, setEditContext] = useState<EditNavState>(
    navState?.mode === "edit" ? navState : undefined,
  );

  const isEdit = editContext?.mode === "edit";
  const editLetterNumber = isEdit ? editContext!.letterNumber : null;
  const editPassword = isEdit ? editContext!.password : null;

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

  // edit loading guard
  const [editLoaded, setEditLoaded] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [hasDraft, setHasDraft] = useState(false);
  const [draftChecked, setDraftChecked] = useState(false);

  const activeKey = useMemo(() => {
    if (!userid) return null;
    return `writeLetterDraft:${userid}:active`;
  }, [userid]);

  const draftKey = useMemo(() => {
    if (!userid) return null;
    if (isEdit && editLetterNumber) {
      return `writeLetterDraft:${userid}:edit:${editLetterNumber}`;
    }
    return `writeLetterDraft:${userid}:create`;
  }, [userid, isEdit, editLetterNumber]);

  const prevDraftKeyRef = useRef<string | null>(null);

  // ✅ useMemo도 hook이므로 항상 실행되게 위치 고정
  const bulbSrc = useMemo(() => {
    const key = toBulbKey(ornamentShape, ornamentColor);
    if (!key) return "";
    return BULB_IMAGES[key] ?? "";
  }, [ornamentShape, ornamentColor]);

  const canGoNext = useMemo(() => {
    if (isEdit) {
      return (
        !!ornamentShape &&
        !!ornamentColor &&
        writerNickname.trim().length > 0 &&
        !!bulbSrc
      );
    }
    return (
      !!ornamentShape &&
      !!ornamentColor &&
      writerNickname.trim().length > 0 &&
      /^\d{4}$/.test(passwordForEdit) &&
      !!bulbSrc
    );
  }, [isEdit, ornamentShape, ornamentColor, writerNickname, passwordForEdit, bulbSrc]);

  useEffect(() => {
    if (!userid) return;

    if (navState?.mode === "edit") {
      setEditContext(navState);
      if (activeKey) {
        const nextActive: ActiveDraft = {
          mode: "edit",
          letterNumber: navState.letterNumber,
          password: navState.password,
        };
        localStorage.setItem(activeKey, JSON.stringify(nextActive));
      }
      return;
    }

    if (navState?.mode === "write") {
      setEditContext(undefined);
      if (activeKey) {
        localStorage.setItem(activeKey, JSON.stringify({ mode: "write" }));
      }
      return;
    }

    if (!activeKey) return;

    const activeRaw = localStorage.getItem(activeKey);
    if (!activeRaw) return;

    try {
      const active = JSON.parse(activeRaw) as ActiveDraft;
      if (active.mode === "edit" && active.letterNumber && active.password) {
        setEditContext({
          mode: "edit",
          letterNumber: active.letterNumber,
          password: active.password,
        });
      } else {
        setEditContext(undefined);
      }
    } catch {
      localStorage.removeItem(activeKey);
    }
  }, [userid, navState, activeKey]);

  useEffect(() => {
    if (!draftKey || draftKey === prevDraftKeyRef.current) return;

    prevDraftKeyRef.current = draftKey;
    setStep(1);
    setOrnamentShape("");
    setOrnamentColor("");
    setWriterNickname("");
    setPasswordForEdit("");
    setContent("");
    setHasDraft(false);
    setDraftChecked(false);
    setEditLoaded(false);
    setEditLoading(false);
  }, [draftKey]);

  useEffect(() => {
    if (!draftKey || navState?.mode !== "edit") return;

    const existingRaw = localStorage.getItem(draftKey);
    if (existingRaw) {
      try {
        const existing = JSON.parse(existingRaw) as {
          mode?: "edit";
          letterNumber?: number;
        };
        if (
          existing.mode === "edit" &&
          existing.letterNumber === navState.letterNumber
        ) {
          return;
        }
      } catch {
        localStorage.removeItem(draftKey);
      }
    }

    const editSeed = {
      mode: "edit" as const,
      letterNumber: navState.letterNumber,
      password: navState.password,
    };

    try {
      localStorage.setItem(draftKey, JSON.stringify(editSeed));
    } catch (e) {
      console.error("Failed to seed edit draft:", e);
    }
  }, [draftKey, navState]);

  useEffect(() => {
    if (!draftKey || !userid) return;

    let raw = localStorage.getItem(draftKey);
    if (!raw) {
      const legacyKeys = new Set<string>();
      const legacySingle = `writeLetterDraft:${userid}`;
      if (localStorage.getItem(legacySingle)) {
        legacyKeys.add(legacySingle);
      }

      const legacyPrefix = `writeLetterDraft:${userid}:`;
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith(legacyPrefix)) legacyKeys.add(key);
      });

      for (const legacyKey of legacyKeys) {
        const legacyRaw = localStorage.getItem(legacyKey);
        if (!legacyRaw) continue;

        let targetKey = `writeLetterDraft:${userid}:create`;
        try {
          const parsed = JSON.parse(legacyRaw) as {
            mode?: "edit";
            letterNumber?: number;
          };
          if (parsed.mode === "edit" && parsed.letterNumber) {
            targetKey = `writeLetterDraft:${userid}:edit:${parsed.letterNumber}`;
          }
        } catch {
          localStorage.removeItem(legacyKey);
          continue;
        }

        if (!localStorage.getItem(targetKey)) {
          localStorage.setItem(targetKey, legacyRaw);
        }
        localStorage.removeItem(legacyKey);

        if (targetKey === draftKey) {
          raw = legacyRaw;
          break;
        }
      }
    }

    if (!raw) {
      setDraftChecked(true);
      return;
    }

    try {
      const draft = JSON.parse(raw) as {
        mode?: "edit";
        letterNumber?: number;
        password?: string;
        step?: Step;
        ornamentShape?: string;
        ornamentColor?: string;
        writerNickname?: string;
        passwordForEdit?: string;
        content?: string;
      };

      if (draft.ornamentShape) setOrnamentShape(draft.ornamentShape);
      if (draft.ornamentColor) setOrnamentColor(draft.ornamentColor);
      if (draft.writerNickname) setWriterNickname(draft.writerNickname);
      if (draft.passwordForEdit) setPasswordForEdit(draft.passwordForEdit);
      if (draft.content) setContent(draft.content);
      if (draft.step === 1 || draft.step === 2) setStep(draft.step);

      const hasDraftData =
        !!draft.ornamentShape ||
        !!draft.ornamentColor ||
        !!draft.writerNickname ||
        !!draft.passwordForEdit ||
        !!draft.content;

      if (hasDraftData) {
        setHasDraft(true);
        setEditLoaded(true);
        setEditLoading(false);
      }
    } catch (e) {
      console.error("Failed to parse draft:", e);
      localStorage.removeItem(draftKey);
    } finally {
      setDraftChecked(true);
    }
  }, [draftKey, userid]);

  useEffect(() => {
    if (!draftKey || !editLoaded || !draftChecked) return;

    const hasData =
      isEdit ||
      !!ornamentShape ||
      !!ornamentColor ||
      !!writerNickname ||
      !!passwordForEdit ||
      !!content;

    if (!hasData) {
      localStorage.removeItem(draftKey);
      return;
    }

    const draft = {
      mode: isEdit ? "edit" : undefined,
      letterNumber: isEdit ? editLetterNumber ?? undefined : undefined,
      password: isEdit ? editPassword ?? undefined : undefined,
      step,
      ornamentShape,
      ornamentColor,
      writerNickname,
      passwordForEdit,
      content,
    };

    try {
      localStorage.setItem(draftKey, JSON.stringify(draft));
      if (activeKey) {
        if (isEdit && editLetterNumber && editPassword) {
          const nextActive: ActiveDraft = {
            mode: "edit",
            letterNumber: editLetterNumber,
            password: editPassword,
          };
          localStorage.setItem(activeKey, JSON.stringify(nextActive));
        } else if (!isEdit) {
          localStorage.setItem(activeKey, JSON.stringify({ mode: "write" }));
        }
      }
    } catch (e) {
      console.error("Failed to save draft:", e);
    }
  }, [
    draftKey,
    activeKey,
    editLoaded,
    draftChecked,
    isEdit,
    editLetterNumber,
    editPassword,
    step,
    ornamentShape,
    ornamentColor,
    writerNickname,
    passwordForEdit,
    content,
  ]);

  // ✅ edit 진입 처리
  useEffect(() => {
    if (!userid || !draftChecked) return;

    // edit 아닌 경우: 로딩 가드 해제
    if (!isEdit || !editLetterNumber) {
      setEditLoaded(true);
      setEditLoading(false);
      return;
    }

    let mounted = true;

    if (hasDraft) {
      setEditLoaded(true);
      setEditLoading(false);
      return;
    }

    if (!editPassword) {
      console.error("Missing edit password in state.");
      navigate(-1);
      return;
    }

    setEditLoading(true);
    setEditLoaded(false);

    (async () => {
      try {
        const res = await fetchLetterForEdit({
          userid,
          letterNumber: editLetterNumber,
          password: editPassword,
        });

        if (!mounted) return;

        setOrnamentShape(res.ornament_shape ?? "");
        setOrnamentColor(res.ornament_color ?? "");
        setWriterNickname(res.writer_nickname ?? "");
        setContent(res.content ?? "");

        // 비번 수정 불가: state에만 보관
        setPasswordForEdit(editPassword);

        // 수정 진입 시 step2부터
        setStep(2);

        setEditLoaded(true);
      } catch (e) {
        console.error("fetchLetterForEdit failed:", e);
        navigate(-1);
      } finally {
        if (mounted) setEditLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [userid, draftChecked, isEdit, editLetterNumber, editPassword, hasDraft, navigate]);

  const onNext = () => {
    if (!canGoNext) return;
    setStep(2);
  };

  const onBack = () => {
    if (step === 2) setStep(1);
    else navigate(-1);
  };

  const onSubmit = async () => {
    if (!userid) return;
    if (content.trim().length === 0) return;

    setSubmitting(true);
    try {
      if (!isEdit) {
        await createUserLetter(userid, {
          writer_nickname: writerNickname.trim(),
          content: content.trim().slice(0, 200),
          ornament_shape: ornamentShape,
          ornament_color: ornamentColor,
          password_for_edit: passwordForEdit,
        });
      } else {
        if (!editLetterNumber) return;

        await updateUserLetter({
          userid,
          letterNumber: editLetterNumber,
          writer_nickname: writerNickname.trim(),
          content: content.trim().slice(0, 200),
          ornament_shape: ornamentShape,
          ornament_color: ornamentColor,
          password: passwordForEdit,
        });
      }

      if (draftKey) {
        localStorage.removeItem(draftKey);
      }
      if (activeKey) {
        localStorage.removeItem(activeKey);
      }
      navigate(`/users/${userid}`);
    } catch (e) {
      console.error("save failed:", e);
    } finally {
      setSubmitting(false);
    }
  };

  // ✅ 여기서부터 return 분기 (모든 hooks 선언 이후)
  if (!editLoaded) {
    return (
      <div className="min-h-screen grid place-items-center bg-[#D8D1CE] text-neutral-900">
        {editLoading ? <LoadingText /> : "준비 중..."}
      </div>
    );
  }

  // -------- Step1 --------
  if (step === 1) {
    return (
      <div className="min-h-screen bg-[#D8D1CE]">
        <div className="mx-auto max-w-[var(--layout-max-width)] px-[var(--layout-side-padding)] pt-4 pb-10">
          <header className="flex items-start justify-between">
            <BackButton onClick={onBack} className="text-base font-medium text-neutral-900" />
            <div />
          </header>

          <h1 className="select-none caret-transparent mt-6 text-2xl font-extrabold text-neutral-900">
            전구를 선택해주세요
          </h1>

          {/* 모양 */}
          <div className="mt-6">
            <div className="select-none caret-transparent text-base font-semibold text-neutral-800">모양 선택</div>
            <div className="select-none caret-transparent mt-3 flex w-full justify-between rounded-2xl border border-neutral-700/40 bg-transparent px-6 py-4">
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

          {/* 색상 */}
          <div className="mt-6">
            <div className="select-none caret-transparent text-base font-semibold text-neutral-800">색상 선택</div>
            <div className="select-none caret-transparent mt-3 flex w-full justify-between rounded-2xl border border-neutral-700/40 bg-transparent px-6 py-4">
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

          {/* to/from */}
          <div className="mt-7 space-y-4 text-base text-neutral-900">
            <div className="select-none caret-transparent flex items-center gap-4">
              <div className="w-20 font-semibold">to.</div>
              <div className="select-none caret-transparent flex-1 border-b border-neutral-700/40 pb-1.5">
                {userid ?? "받는이"}
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="select-none caret-transparent w-20 font-semibold">from.</div>
              <input
                className="h-11 flex-1 rounded-lg bg-white/35 px-3 text-base outline-none ring-1 ring-neutral-500/30 focus:ring-2 focus:ring-[#8E2F2F]"
                placeholder="닉네임(최대 7자)"
                value={writerNickname}
                maxLength={7} 
                onChange={(e) =>{ 
                  const value = e.target.value;
                  if (value.length <= 7) {
                    setWriterNickname(value);
                }
              }}
              />
            </div>
          </div>

          {/* 비밀번호: 작성에서만 */}
          {!isEdit && (
            <div className="mt-5 flex items-center gap-4">
              <span className="w-20 text-base font-semibold text-neutral-800">비밀번호</span>
              <input
                className="h-11 w-40 rounded-lg bg-white/35 px-3 text-center text-base tracking-widest outline-none ring-1 ring-neutral-500/30 focus:ring-2 focus:ring-[#8E2F2F]"
                placeholder="****"
                inputMode="numeric"
                pattern="\d*"
                value={passwordForEdit}
                onChange={(e) =>
                  setPasswordForEdit(e.target.value.replace(/\D/g, "").slice(0, 4))
                }
              />
              <span className="select-none caret-transparent text-base text-neutral-700">숫자 4자리</span>
            </div>
          )}

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

  // -------- Step2 --------
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
        bottomSlot={
          <button
            type="button"
            onClick={() => setOpenConfirm(true)}
            disabled={submitting || content.trim().length === 0}
            className="h-14 w-full rounded-xl bg-[#8E2F2F] text-lg font-semibold text-white disabled:opacity-40"
          >
            {submitting ? "저장 중..." : isEdit ? "수정하기" : "저장하기"}
          </button>
        }
      />

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
