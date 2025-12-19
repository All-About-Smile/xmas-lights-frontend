import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import InfoButton from "../components/InfoButton";
/**
 * 랜딩(처음) 화면:
 * - 오른쪽 위 i 버튼: hover(데스크탑) + 클릭(모바일) 모두 지원
 * - 하단 로그인하기 버튼: /login 이동
 */
export default function LandingPage() {
  const navigate = useNavigate();
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

  return (
    <div className="min-h-screen bg-[#D8D1CE]">
      <div className="mx-auto max-w-[var(--layout-max-width)] px-[var(--layout-side-padding)] pt-6 pb-10">
        {/* top bar */}
        <header className="flex items-start justify-between">
          <div className="text-sm font-medium text-neutral-800">
            밝혀줘! 내 X-mas 전구
          </div>

          {/* info button */}
          <div className="relative">
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
              <p>💌 로그인하지 않아도 편지 남길 수 있어! <span className="text-[#006F57] font-medium">(❁´◡`❁)</span></p>
              <br />

              <div className="font-semibold">🪟 창문 생성 방법 (회원가입)</div>
              <ol className="mt-2 list-decimal space-y-1 pl-5 leading-5">
                <li>메인 페이지에서 “로그인하기” 버튼 클릭!</li>
                <li>지인의 창문 페이지에서 “오른쪽 위에 사람” 버튼 클릭!</li>
              </ol>
               <p>💌 작성한 메시지는 12월 25일에 공개될 거야~! <span className="text-[#006F57] font-medium">(ღˇᴗˇ)｡o♡</span></p>
              
               <div className="mt-3 text-xs text-neutral-600">
                (모바일에서는 i 버튼을 한 번 더 누르면 닫혀요)
              </div>
            </div>
          </div>
        </header>

        {/* title center */}
        <h1 className="mt-16 text-center text-2xl font-extrabold tracking-tight text-neutral-900">
          밝혀줘! 내 X-mas 전구
        </h1>

        {/* window area (이미지/컴포넌트로 교체) */}
        <div className="mt-6 overflow-hidden rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.18)]">
          <div className="aspect-[3/4] w-full bg-black/10">
            {/* TODO: 네 창문/전구 UI 컴포넌트를 여기 넣기 */}
          </div>
        </div>

        {/* login button bottom */}
        <button
          onClick={() => navigate("/login")}
          className="mt-8 h-14 w-full rounded-xl bg-[#8E2F2F] text-lg font-semibold text-white shadow-[0_10px_20px_rgba(0,0,0,0.18)]"
        >
          로그인하기
        </button>
      </div>
    </div>
  );
}
