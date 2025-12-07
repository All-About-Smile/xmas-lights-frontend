function GlobalSettingTestPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-[440px] flex-col gap-8 px-5 py-10">
      <header className="space-y-2 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">
          Holiday lights
        </p>
        <h1 className="text-2xl font-bold sm:text-[2.6rem]">Send a warm light</h1>
        <p className="text-base text-muted">
          Leave a cozy note and we will ship it with a gentle glow.
        </p>
      </header>

      <section className="rounded-[var(--radius-lg)] border border-black/10 bg-surface/90 p-6 shadow-lg shadow-primary/20 backdrop-blur">
        <div className="space-y-6">
          <div className="space-y-2 text-[1.5rem]">
            <span className="font-medium">Recipient</span>
            <input
              className="w-full rounded-[var(--radius-md)] border border-black/10 bg-white px-4 py-3 text-base shadow-inner shadow-white/40 outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/15"
              type="text"
              placeholder="Add a name or nickname"
            />
          </div>
          <div className="space-y-2 text-[1.5rem]">
            <span className="font-medium">Message</span>
            <textarea
              className="min-h-[96px] w-full resize-y rounded-[var(--radius-md)] border border-black/10 bg-white px-4 py-3 text-base shadow-inner shadow-white/40 outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/15"
              rows={3}
              placeholder="Write a warm message"
            />
          </div>
          <button
            className="w-full rounded-[var(--radius-lg)] bg-gradient-to-br from-primary to-[var(--color-primary-strong)] px-4 py-4 text-[1.8rem] font-semibold text-white shadow-lg shadow-primary/20 transition hover:-translate-y-[1px] hover:brightness-105 active:translate-y-0 active:shadow-md"
            type="button"
          >
            Send the light
          </button>
          <p className="text-sm text-muted">
            Width is locked to a mobile-friendly max and buttons/inputs share the same base styling.
          </p>
        </div>
      </section>

      <p className="text-center text-sm text-muted">
        REM base, Tailwind preflight, and custom tokens keep things steady across devices with the new
        xmasFont.
      </p>
    </main>
  )
}

export default GlobalSettingTestPage
