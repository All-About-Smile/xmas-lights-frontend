function GlobalSettingTestPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-[440px] flex-col gap-8 px-5 py-10 text-text font-ui">
      {/* Header */}
      <header className="space-y-2 text-center">
        <p className="text-xs  font-semibold uppercase tracking-[0.14em] text-primary">
          밝혀줘! 내 X-mas 전구
        </p>

        <h1 className="text-2xl  font-bold sm:text-[2.6rem]">
          따뜻한 빛을 보내세요
        </h1>

        <p className="text-base text-muted">
          포근한 메시지를 남겨주시면 은은한 빛과 함께 전달해드립니다.
        </p>
      </header>

      {/* Card Section */}
      <section className="rounded-lg border border-black/10 bg-surface/90 p-6 shadow-lg backdrop-blur">
        <div className="space-y-6">
          {/* Recipient */}
          <div className="space-y-2">
            <span className="text-lg font-medium">받는 사람</span>
            <input
              type="text"
              placeholder="이름이나 별명을 입력하세요"
              className="
                font-letter
                w-full rounded-md border border-black/10 bg-white px-4 py-3
                text-base shadow-inner shadow-white/40 outline-none transition
                focus:border-primary focus:ring-4 focus:ring-primary/15
              "
            />
          </div>

          {/* Message */}
          <div className="space-y-2">
            <span className="text-lg font-medium">메시지</span>
            <textarea
              rows={3}
              placeholder="따뜻한 메시지를 적어주세요"
              className="
                font-letter
                min-h-[96px] w-full resize-y rounded-md border border-black/10
                bg-white px-4 py-3 text-base shadow-inner shadow-white/40
                outline-none transition focus:border-primary
                focus:ring-4 focus:ring-primary/15
              "
            />
          </div>

          {/* Button */}
          <button
            type="button"
            className="
              w-full rounded-lg bg-primary
              px-4 py-4 text-lg font-semibold text-white
              shadow-lg transition 
              hover:-translate-y-[1px] hover:brightness-105
              active:translate-y-0 active:shadow-md
            "
          >
            빛 보내기
          </button>

          <p className="text-sm text-muted">
            버튼과 입력 필드는 동일한 기본 스타일을 공유하며,
            모바일 중심의 너비 고정 방식으로 설계되었습니다.
          </p>
        </div>
      </section>

      <p className="text-center text-sm text-muted">
        Tailwind 프리셋과 글로벌 토큰을 기반으로 새로운 UI 폰트(font-ui)와
        본문 폰트(font-letter)가 페이지 전체에서 일관적으로 적용됩니다.
      </p>
    </main>
  );
}

export default GlobalSettingTestPage;
