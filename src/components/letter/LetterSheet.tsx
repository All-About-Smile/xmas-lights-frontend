import type { ReactNode } from "react";

type Mode = "write" | "view";

type Props = {
  mode: Mode;

  // 상단/하단 텍스트
  toName: string;
  fromName: string;

  // 전구 이미지(앞에서 선택한 전구 or 홈에서 클릭한 전구)
  bulbSrc: string;

  // 내용
  content: string;
  onChangeContent?: (v: string) => void;

  // UI 이벤트
  onBack?: () => void;
  rightTopSlot?: ReactNode; // 햄버거 같은 거 끼우고 싶으면
};

export default function LetterSheet({
  mode,
  toName,
  fromName,
  bulbSrc,
  content,
  onChangeContent,
  onBack,
  rightTopSlot,
}: Props) {
  const isWrite = mode === "write";

  return (
    <div className="min-h-screen bg-[#D8D1CE]">
      <div className="mx-auto max-w-[430px] px-5 pt-4 pb-6">
        {/* top bar */}
        <header className="flex items-start justify-between">
        <button type="button" onClick={onBack}>← 이전</button>
        {rightTopSlot ? <div className="p-2">{rightTopSlot}</div> : <div />}
        </header>

        {/* letter card area */}
        <div className="mt-8 relative">
          {/* bulb */}
          <img
            src={bulbSrc}
            alt=""
            className="absolute left-1/2 -translate-x-1/2 -top-10 w-16 h-auto"
          />

          {/* paper */}
          <div className="relative mx-auto w-full rounded-2xl border border-neutral-700/40 bg-transparent">
            <div className="p-6 pt-10">
              <div className="text-sm text-neutral-900">to. {toName}</div>

              {/* content */}
              <div className="mt-4">
                {isWrite ? (
                  <>
                    <textarea
                      value={content}
                      onChange={(e) => onChangeContent?.(e.target.value.slice(0, 200))}
                      maxLength={200}
                      className="w-full min-h-[320px] resize-none bg-transparent outline-none text-neutral-900 leading-6"
                      placeholder="메세지를 적어주세요"
                    />
                    <div className="mt-2 text-right text-xs text-neutral-700">
                      {content.length}/200
                    </div>
                  </>
                ) : (
                  <div className="min-h-[320px] whitespace-pre-wrap text-neutral-900 leading-6">
                    {content}
                  </div>
                )}
              </div>

              <div className="mt-6 text-right text-sm text-neutral-900">
                from. {fromName}
              </div>
            </div>
          </div>
        </div>

        {/* bottom button slot (페이지에서 넣어도 됨) */}
      </div>
    </div>
  );
}

