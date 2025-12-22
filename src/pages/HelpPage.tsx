import { useLocation, useNavigate } from "react-router-dom";

import BackButton from "@/components/common/BackButton";
import ServiceTitle from "@/components/common/ServiceTitle";
import candle_green from "@/assets/bulbs/candle_green.png";

export default function HelpPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleBack = () => {
    if (location.key !== "default") {
      navigate(-1);
      return;
    }

    navigate("/", { replace: true });
  };

  return (
    <div className="min-h-screen bg-[#D8D1CE]">
      <div className="mx-auto max-w-[var(--layout-max-width)] px-[var(--layout-side-padding)] pt-4 pb-10">
        <header className="flex items-center justify-between">
          <BackButton onClick={handleBack} />
          <ServiceTitle className="text-neutral-900" />
        </header>

        <div className="mt-10 relative">
          <img
            src={candle_green}
            alt=""
            className="absolute left-1/2 -translate-x-1/2 -top-10 z-10 h-16 w-16"
          />

          <div className="relative mx-auto w-full rounded-2xl border border-[#CBBFAF] bg-[#F7F1E6] shadow-[0_12px_30px_rgba(0,0,0,0.12)]">
            <div className="p-6 pt-12 text-neutral-900">
              <h1 className="text-2xl font-extrabold tracking-tight">도움말</h1>

              <div className="mt-6 space-y-8 text-lg leading-7">
                <section>
                  <div className="font-semibold">💡 편지 작성 방법</div>
                  <ol className="mt-2 list-decimal space-y-1 pl-5 leading-5">
                    <li>편지를 남길 지인의 창문으로 이동해 줘~</li>
                    <li>창문을 밝혀줄 전구와 색상을 선택해 봐!</li>
                    <li>따뜻한 메시지로 마음을 전달해 보자~!</li>
                  </ol>
                  <p className="mt-3">
                    💌 로그인하지 않아도 편지 남길 수 있어!{" "}
                    <span className="text-[#006F57] font-medium">(❁´◡`❁)</span>
                  </p>
                </section>

                <section>
                  <div className="font-semibold">✨창문 생성 방법 (회원가입)</div>
                  <ol className="mt-2 list-decimal space-y-1 pl-5 leading-5">
                    <li>메인 페이지에서 “로그인하기” 버튼 클릭! 또는</li>
                    <li>지인의 창문 페이지에서 “홈” 버튼 클릭!</li>
                  </ol>
                  <p className="mt-3">
                    💌 작성한 메시지는 12월 25일에 공개될 거야!
                    <span className="text-[#BB010B] font-medium">(ღˇᴗˇ)｡o♡</span>
                  </p>
                </section>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
