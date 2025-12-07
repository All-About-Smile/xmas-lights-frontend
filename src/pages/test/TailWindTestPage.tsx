import { useMemo, useState } from 'react'

type Scene = {
  name: string;
  gradient: string;
  description: string;
};

const scenes = [
  {
    name: 'Aurora Glow',
    gradient: 'from-emerald-300 via-cyan-300 to-sky-400',
    description: 'Soft green and blue sweep for a calming winter glow.',
  },
  {
    name: 'Candy Cane',
    gradient: 'from-rose-400 via-amber-200 to-red-500',
    description: 'Playful red and amber with subtle shimmer pulses.',
  },
  {
    name: 'Frost',
    gradient: 'from-slate-200 via-blue-200 to-indigo-300',
    description: 'Cool whites with icy blue accents for crisp nights.',
  },
]

function TailWindTestPage() {
  const [isOn, setIsOn] = useState(true)
  const [brightness, setBrightness] = useState(70)
  const [activeScene, setActiveScene] = useState(scenes[0].name)

  const lights = useMemo(() => Array.from({ length: 12 }), [])

  // 현재 활성화된 scene 정보 가져오기
  const currentScene : Scene | undefined = scenes.find((s) => s.name === activeScene) ?? scenes[0]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-50">
      <div className="mx-auto max-w-5xl px-6 py-12">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-emerald-300">
              Tailwind CSS
            </p>
            <h1 className="mt-2 text-3xl font-bold sm:text-4xl">Christmas Lights Controller</h1>
            <p className="mt-2 text-sm text-slate-400">
              Vite + React project now styled with Tailwind utility classes.
            </p>
          </div>
          <button
            type="button"
            className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-black/20 transition hover:-translate-y-0.5 hover:border-emerald-300 hover:text-emerald-100 hover:shadow-emerald-500/20"
            onClick={() => window.open('https://tailwindcss.com/docs', '_blank')}
          >
            View Tailwind Docs
          </button>
        </header>

        <main className="mt-10 grid gap-6 lg:grid-cols-3">
          <section className="lg:col-span-2 rounded-2xl border border-white/10 bg-white/5 p-6 shadow-xl shadow-black/40 backdrop-blur">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-emerald-300">Live Scene</p>
                <h2 className="text-2xl font-semibold">Outdoor string preview</h2>
                <p className="text-sm text-slate-400">Brightness and effects respond instantly.</p>
              </div>
              <span className="rounded-full border border-white/15 bg-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-100">
                {activeScene}
              </span>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="space-y-2 rounded-xl border border-white/10 bg-black/20 p-4">
                <p className="text-sm font-semibold text-slate-200">Power</p>
                <button
                  type="button"
                  className={`flex w-full items-center justify-between rounded-lg border px-4 py-3 text-sm font-semibold transition ${
                    isOn
                      ? 'border-emerald-400/60 bg-emerald-400/10 text-emerald-50 shadow-inner shadow-emerald-500/20'
                      : 'border-white/15 bg-white/5 text-slate-200 hover:border-white/30'
                  }`}
                  onClick={() => setIsOn((prev) => !prev)}
                >
                  <span>{isOn ? 'Lights are ON' : 'Lights are OFF'}</span>
                  <span
                    className={`h-3 w-3 rounded-full ${
                      isOn ? 'bg-emerald-300 shadow shadow-emerald-400/70' : 'bg-slate-500'
                    }`}
                  />
                </button>
              </div>

              <div className="space-y-2 rounded-xl border border-white/10 bg-black/20 p-4">
                <label className="flex items-center justify-between text-sm font-semibold text-slate-200">
                  Brightness
                  <span className="text-emerald-200">{brightness}%</span>
                </label>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={brightness}
                  onChange={(event) => setBrightness(Number(event.target.value))}
                  className="h-2 w-full cursor-pointer appearance-none rounded-full bg-white/10 accent-emerald-400"
                />
                <p className="text-xs text-slate-400">Slide to dim or brighten the string.</p>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3">
              {scenes.map((scene) => (
                <button
                  key={scene.name}
                  type="button"
                  onClick={() => setActiveScene(scene.name)}
                  className={`group relative overflow-hidden rounded-xl border p-4 text-left transition hover:-translate-y-0.5 hover:border-emerald-300/50 ${
                    activeScene === scene.name
                      ? 'border-emerald-400/60 bg-white/10 shadow-lg shadow-emerald-500/20'
                      : 'border-white/10 bg-white/5'
                  }`}
                >
                  <div
                    className={`absolute inset-0 opacity-70 blur group-hover:opacity-90 bg-gradient-to-r ${scene.gradient}`}
                  />
                  <div className="relative space-y-1">
                    <p className="text-sm font-semibold text-white">{scene.name}</p>
                    <p className="text-xs text-slate-200">{scene.description}</p>
                  </div>
                </button>
              ))}
            </div>

            {/* 선택한 scene 색이 적용되는 전구 preview */}
            <div className="mt-8 rounded-2xl border border-white/10 bg-black/30 p-4 shadow-inner shadow-black/40">
              <p className="text-sm font-semibold text-slate-200">String preview</p>

              <div className="mt-3 grid grid-cols-6 gap-3 sm:grid-cols-8 md:grid-cols-12">
                {lights.map((_, index) => (
                  <div
                    key={index}
                    className={`h-12 rounded-full border border-white/10 shadow-lg shadow-black/40 transition duration-500 ${
                      isOn ? `bg-gradient-to-b ${currentScene.gradient}` : 'bg-slate-800'
                    }`}
                    style={{
                      opacity: isOn ? brightness / 100 : 0.2,
                      transform: `scale(${1 + (isOn ? brightness / 300 : 0)})`,
                    }}
                  />
                ))}
              </div>
            </div>
          </section>

          <aside className="space-y-4 rounded-2xl border border-white/10 bg-white/5 p-6 shadow-xl shadow-black/30">
            <div>
              <h3 className="text-lg font-semibold text-white">Quick start</h3>
              <p className="text-sm text-slate-300">
                Tailwind CSS is already wired up. Use any utility classes in your components and the build
                will tree-shake unused styles automatically.
              </p>
            </div>
            <ul className="space-y-3 text-sm text-slate-200">
              <li className="flex items-start gap-2 rounded-lg border border-white/10 bg-black/20 p-3">
                <span className="mt-0.5 h-2 w-2 rounded-full bg-emerald-300" />
                <div>
                  <p className="font-semibold">Utility-first styling</p>
                  <p className="text-slate-400">Compose UIs with className strings—no extra CSS files.</p>
                </div>
              </li>
              <li className="flex items-start gap-2 rounded-lg border border-white/10 bg-black/20 p-3">
                <span className="mt-0.5 h-2 w-2 rounded-full bg-cyan-300" />
                <div>
                  <p className="font-semibold">Vite plugin enabled</p>
                  <p className="text-slate-400">`@tailwindcss/vite` runs automatically in dev and build.</p>
                </div>
              </li>
              <li className="flex items-start gap-2 rounded-lg border border-white/10 bg-black/20 p-3">
                <span className="mt-0.5 h-2 w-2 rounded-full bg-indigo-300" />
                <div>
                  <p className="font-semibold">Ready to deploy</p>
                  <p className="text-slate-400">Use `npm run dev` to preview changes while you build.</p>
                </div>
              </li>
            </ul>
          </aside>
        </main>
      </div>
    </div>
  )
}

export default TailWindTestPage
