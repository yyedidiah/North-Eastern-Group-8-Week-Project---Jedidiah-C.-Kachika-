import { useEffect, useState, type FormEvent } from 'react'
import MarketDashboard from './MarketDashboard'

function HomePage() {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    // Keep the search in the URL so the dashboard can open the requested market.
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const marketValue = form.get('market')
    const market = typeof marketValue === 'string' ? marketValue.trim() : ''

    if (market) {
      window.location.hash = `markets?search=${encodeURIComponent(market)}`
    }
  }

  return (
    <main className="home-page">
      <section className="home-hero" id="top">
        <img className="home-hero__image" src="/NERGHERO.jfif" alt="" aria-hidden="true" />
        <div className="home-hero__shade" aria-hidden="true" />

        <div className="home-hero__inner">
          <header className="home-header">
            <a className="home-brand" href="#top" aria-label="North Eastern Group home">
              <span className="home-brand__mark"><img src="/NorthEastLogo.png" alt="" /></span>
              <span className="home-brand__wordmark">North Eastern<small>Group</small></span>
            </a>

            <nav className="home-nav" aria-label="Main navigation">
              <a href="#how-it-works">Our approach</a>
              <a className="home-nav__cta" href="#markets">Explore markets <span aria-hidden="true">&#8599;</span></a>
            </nav>
          </header>

          <div className="home-hero__content">
            <p className="home-eyebrow"><span /> Independent property market insights</p>
            <h1>See Market Momentum With <em>Clarity</em></h1>
            <p className="home-hero__summary">Local housing trends and forecasts in one place.</p>

            <form className="market-search" onSubmit={handleSubmit}>
              <label htmlFor="market-search">Search a market</label>
              <div className="market-search__row">
                <input id="market-search" name="market" type="search" placeholder="County or region" />
                <button type="submit">Find a market <span aria-hidden="true">&#8594;</span></button>
              </div>
            </form>

            <div className="quick-markets" aria-label="Popular markets">
              <span>Popular Markets:</span>
              <a href="#markets?search=Northeast%20Indiana">Northeast Indiana</a>
              <a href="#markets?search=Allen%20County">Allen County</a>
            </div>
          </div>
        </div>
      </section>

      {/* A three-step overview makes the dashboard's core workflow clear at a glance. */}
      <section className="workflow" id="how-it-works" aria-labelledby="workflow-title">
        <div className="workflow__inner">
          <div className="workflow__intro">
            <p className="workflow__eyebrow">The North Eastern approach</p>
            <h2 id="workflow-title">Market insight,<br />made actionable.</h2>
          </div>
          <ol className="workflow__steps">
            <li><span>01</span><div><h3>Find your market</h3><p>Start with a county or the regional view.</p></div></li>
            <li><span>02</span><div><h3>Read the trend</h3><p>Compare housing supply history and forecasts.</p></div></li>
            <li><span>03</span><div><h3>Export your view</h3><p>Take market data with you as a CSV.</p></div></li>
          </ol>
        </div>
      </section>
    </main>
  )
}

function App() {
  const [hash, setHash] = useState(() => window.location.hash)

  useEffect(() => {
    const updateHash = () => setHash(window.location.hash)
    window.addEventListener('hashchange', updateHash)
    return () => window.removeEventListener('hashchange', updateHash)
  }, [])

  const isDashboard = hash.startsWith('#markets')

  return (
    <div
      key={isDashboard ? 'dashboard' : 'home'}
      className="motion-safe:animate-[page-enter_240ms_ease-out_both]"
    >
      {isDashboard ? <MarketDashboard /> : <HomePage />}
    </div>
  )
}

export default App
