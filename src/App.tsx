import { useEffect, useState } from 'react'
import './App.css'
import { fetchPublicPing } from './api/public'
import type { PublicPingResponse } from './api/types'

function App() {
  const [ping, setPing] = useState<PublicPingResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const callPing = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const data = await fetchPublicPing()
      setPing(data)
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to reach /public/ping'
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    void callPing()
  }, [])

  return (
    <main className="page">
      <header className="hero">
        <div>
          <p className="eyebrow">FastAPI demo</p>
          <h1>Public ping endpoint</h1>
          <p className="lead">
            Calls <code>GET /public/ping</code> from <code>public.py</code> using
            axios with the base URL in <code>.env</code> (
            {import.meta.env.VITE_API_BASE_URL}).
          </p>
          <div className="actions">
            <button onClick={callPing} disabled={isLoading}>
              {isLoading ? 'Calling…' : 'Call /public/ping'}
            </button>
          </div>
        </div>
      </header>

      <section className="panel">
        <h2>Result</h2>
        <div className="result">
          {error && <p className="error">{error}</p>}
          {!error && ping && (
            <pre>{JSON.stringify(ping, null, 2)}</pre>
          )}
          {!error && !ping && !isLoading && <p>Waiting for response…</p>}
        </div>
      </section>
    </main>
  )
}

export default App
