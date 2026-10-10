import { useState } from 'react'
import { ForecastChart } from './dashboard/ForecastChart'
import { Icon } from './dashboard/Icon'
import { getProjectedValue, markets, type Horizon, type Market } from './dashboard/marketData'

type Section = 'overview' | 'predictions' | 'markets' | 'methodology'

function Sidebar({
  activeSection,
  menuOpen,
  onNavigate,
}: {
  activeSection: Section
  menuOpen: boolean
  onNavigate: (section: string) => void
}) {
  const links: { id: Section; label: string; icon: 'grid' | 'chart' | 'pin' | 'book' }[] = [
    { id: 'overview', label: 'Overview', icon: 'grid' },
    { id: 'predictions', label: 'Predictions', icon: 'chart' },
    { id: 'markets', label: 'Markets', icon: 'pin' },
    { id: 'methodology', label: 'Methodology', icon: 'book' },
  ]

  return (
    <>
      <button
        className="fixed left-3 top-3 z-[80] hidden size-10 place-items-center rounded border border-white/20 bg-[#044353] text-white max-[720px]:grid"
        type="button"
        onClick={() => onNavigate(menuOpen ? 'close-menu' : 'open-menu')}
        aria-label={menuOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={menuOpen}
      >
        <Icon name={menuOpen ? 'close' : 'menu'} />
      </button>

      {menuOpen && (
        <button
          className="fixed inset-0 z-[60] border-0 bg-black/40"
          type="button"
          aria-label="Close menu"
          onClick={() => onNavigate('close-menu')}
        />
      )}

      <aside className={`fixed inset-y-0 left-0 z-[70] flex w-[244px] flex-col bg-[#044353] px-[18px] pb-5 pt-7 text-[#f6f8f2] transition-transform duration-200 max-[1050px]:w-[210px] max-[720px]:w-[255px] max-[720px]:-translate-x-full max-[720px]:pt-[65px] ${menuOpen ? 'max-[720px]:translate-x-0' : ''}`}>
        <button
          className="mb-[21px] flex items-center gap-[11px] border-0 bg-transparent px-[7px] py-1 text-left text-white cursor-pointer hover:text-[#d4dfae] focus-visible:text-[#d4dfae]"
          type="button"
          onClick={() => onNavigate('overview')}
          aria-label="North Eastern Group dashboard overview"
        >
          <img className="size-[29px] shrink-0 object-contain brightness-0 invert" src="/NorthEastLogo.png" alt="" />
          <span className="text-[11px] font-bold leading-[1.5] tracking-[.13em]">NORTH EASTERN <span className="block text-[9px] tracking-[.28em] text-[#d4dfae]">GROUP</span></span>
        </button>

        <div className="mb-[25px] h-px bg-white/15" />
        <div className="px-[11px] pb-[10px] text-[10px] font-bold tracking-[.15em] text-[#a8b9ad]">WORKSPACE</div>

        <nav className="grid gap-[5px]" aria-label="Dashboard navigation">
          {links.map(link => (
            <button
              key={link.id}
              className={`flex min-h-[42px] items-center gap-3 rounded px-[11px] text-left text-[13px] text-[#c2d0c7] hover:bg-white/10 hover:text-white ${activeSection === link.id ? 'border-l-2 border-[#d4dfae] bg-white/10 text-white' : 'border-l-2 border-transparent cursor-pointer'}`}
              type="button"
              onClick={() => onNavigate(link.id)}
            >
              <Icon name={link.icon} size={18} /> {link.label}
              {link.id === 'predictions' && <span className="ml-auto size-1.5 rounded-full bg-[#d4dfae]" />}
            </button>
          ))}
        </nav>

        <div className="mt-auto">
          <div className="flex gap-[11px] rounded border border-white/15 p-[13px_10px]">
            <span className="text-[#d4dfae]"><Icon name="layers" size={18} /></span>
            <div><strong className="text-xs">Built for what's next.</strong><p className="mt-1 text-[11px] leading-relaxed text-[#b7c7bd]">More market indicators are on the way.</p></div>
          </div>
          <div className="mt-[21px] flex items-center gap-2.5 px-1 text-[11px] leading-relaxed text-[#e2e9e3]">
            <span className="grid size-[30px] shrink-0 place-items-center p-1.5">
              <img className="size-full object-contain brightness-0 invert" src="/NorthEastLogo.png" alt="" />
            </span>
            <span>North Eastern Group<br /><small className="text-[#aabbb0]">Real estate intelligence</small></span>
          </div>
        </div>
      </aside>
    </>
  )
}

function TopBar({ onExport, hasImportedData }: { onExport: () => void; hasImportedData: boolean }) {
  return (
    <header className="sticky top-0 z-30 flex h-[66px] items-center justify-between border-b border-[#e5eae4] bg-[#fbfcf9]/95 px-[42px] backdrop-blur max-[1050px]:px-[26px] max-[720px]:h-16 max-[720px]:pl-[62px] max-[720px]:pr-[14px]">
      <div className="flex items-center gap-3 text-xs">
        <a
          className="text-[#77847d] no-underline hover:text-[#044353]"
          href="#top"
          onClick={event => {
            event.preventDefault()
            window.location.hash = 'top'
          }}
        >Home</a>
        <span className="text-[#bdc6bf]">/</span>
        <strong>Overview</strong>
      </div>
      <div className="flex items-center gap-3">
        <span className="flex items-center gap-2 text-[11px] text-[#718078] max-[720px]:hidden"><i className="size-[7px] rounded-full bg-[#77977c]" />{hasImportedData ? 'CSV-backed market' : 'Sample workspace'}</span>
        <button className="flex min-h-[35px] items-center gap-2 rounded border border-[#dce3dc] bg-white px-3 text-[11px] text-[#19352e] hover:bg-[#f4f7f2] cursor-pointer" type="button" onClick={onExport}>
          <Icon name="download" size={16} /> Export CSV
        </button>
      </div>
    </header>
  )
}

function MarketIntro({ market, onMarketChange }: { market: Market; onMarketChange: (name: string) => void }) {
  return (
    <>
      <section className="mb-6 flex items-end justify-between gap-6 max-[720px]:flex-col max-[720px]:items-stretch">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-bold tracking-[.16em] text-[#044353]">MARKET INTELLIGENCE</div>
          <h1 className="my-2 font-['Georgia','Times_New_Roman'] text-[39px] font-normal leading-[1.15] max-[720px]:text-[34px] cursor-arrow">See what’s <em className="text-[#044353]">ahead.</em></h1>
          <p className="text-[13px] text-[#75837c]">Understand where the market is headed, one county at a time.</p>
        </div>

        <div className="min-w-[220px] max-[720px]:w-full">
          <label className="mb-[7px] block text-[9px] font-bold tracking-[.14em] text-[#75847b]" htmlFor="market-select">VIEWING MARKET</label>
          <div className="flex h-[39px] items-center gap-2 rounded border border-[#dce3dc] bg-white px-[10px] text-[#587267]">
            <Icon name="pin" size={17} />
            <select className="min-w-0 flex-1 appearance-none border-0 bg-transparent text-xs text-[#19352e] outline-none cursor-pointer hover:bg-[#f2f5ef]" id="market-select" value={market.name} onChange={event => onMarketChange(event.target.value)}>
              {markets.map(market => <option key={market.name} value={market.name}>{market.name}</option>)}
            </select>
            <Icon name="chevron" size={16} />
          </div>
        </div>
      </section>

      <div className="mb-[27px] flex items-center gap-2.5 rounded border border-[#e6e8d6] bg-[#044353] px-[14px] py-[11px] text-[11px] text-[#626e5d] max-[720px]:items-start">
        <span className="text-white"><Icon name="book" size={17} /></span>
        <p className="text-white">
          <strong className="text-white">{market.dataSource ? 'Imported CSV Data (Updated 10/5/26 4:42 PM EST)' : 'Illustrative sample data'}</strong>
          {' - '}
          {market.dataSource
            ? `${market.name} data is from ${market.dataSource}. Model-test results cover Feb-Aug 2026. Forecasts are shown for Sep 2026-Feb 2027; September actuals are expected Oct 8, 2026, so there is not yet an actual to compare. Periods between plotted points are illustrative.`
            : 'This market is still using illustrative values, not live market predictions.'}
        </p>
      </div>
    </>
  )
}

function ForecastSection({ market, horizon, onHorizonChange }: { market: Market; horizon: Horizon; onHorizonChange: (horizon: Horizon) => void }) {
  const projected = getProjectedValue(market, horizon)
  const rawDifference = projected - market.current
  const difference = rawDifference.toFixed(market.dataSource ? 2 : 1)
  const signedDifference = `${rawDifference > 0 ? '+' : ''}${difference}`
  const valueFormat = (value: number) => value.toFixed(market.dataSource ? 2 : 1)
  const horizonLabel = `${horizon} ${horizon === 1 ? 'month' : 'months'}`

  return (
    <section id="predictions">
      <div className="mb-[15px] flex items-end justify-between gap-[22px] max-[720px]:flex-col max-[720px]:items-start">
        <div>
          <div className="text-[10px] font-bold tracking-[.15em] text-[#788a7e]">01 / THE FORECAST</div>
          <h2 className="my-1 font-['Georgia','Times_New_Roman',serif] text-2xl font-normal">Months of supply</h2>
          <p className="text-xs text-[#75837c]">A look at the balance between available homes and buyer demand.</p>
        </div>
        <div className="flex items-center gap-2.5 text-[9px] font-bold tracking-[.11em] text-[#77847c] max-[720px]:w-full max-[720px]:justify-between" aria-label="Forecast horizon">
          <span>FORECAST</span>
          <div className="flex gap-[3px] rounded border border-[#e0e5df] bg-white p-[3px]">
            {market.horizons.map(value => (
              <button className={`h-[27px] min-w-[47px] rounded-sm text-[10px] ${horizon === value ? 'bg-[#044353] text-white cursor-pointer' : 'text-[#718078] hover:bg-[#f2f5ef] cursor-pointer'}`} type="button" key={value} onClick={() => onHorizonChange(value)} aria-pressed={horizon === value}>
                {value} mo
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded border border-[#e3e8e1] bg-white p-5 max-[720px]:p-3">
        <div className="flex justify-between gap-4 max-[720px]:flex-col">
          <div>
            <div className="text-[9px] font-bold tracking-[.12em] text-[#6d8276]"><i className="mr-1 inline-block size-1.5 rounded-full bg-[#77977c]" />{market.name.toUpperCase()} <span className="px-1 text-[#bdc7bf]">/</span> {market.region.toUpperCase()}</div>
            <h3 className="mb-1 mt-2 font-['Georgia','Times_New_Roman',serif] text-xl font-normal">{market.dataSource ? `Supply is projected to ${rawDifference >= 0 ? 'rise' : 'ease'}.` : 'Gradual Upwards Trend.'}</h3>
             <p className="text-[11px] text-[#7d8981]">{horizonLabel} projection.</p>
          </div>
          <span className="flex h-[29px] items-center gap-1.5 self-start rounded-sm border border-[#dce7d5] bg-[#f5f8f0] px-[9px] text-[10px] text-[#56714e]">
            <Icon name="trend" size={15} /> {signedDifference} market projection
          </span>
        </div>

        <div className="mt-[18px] flex items-center justify-between border-t border-[#edf0eb] pt-[13px] max-[720px]:flex-col max-[720px]:items-start max-[720px]:gap-2">
          <div className="text-[11px] font-bold">Months of supply <span className="font-normal text-[#9aa49d]">· {market.observations ? 'CSV data' : 'illustrative'}</span></div>
          <div className="flex gap-[15px] text-[9px] text-[#758078]">
            {market.observations ? <>
              <span className="flex items-center gap-1.5"><i className="w-[17px] border-t-2 border-[#537b76]" /> Actual Supply</span>
              <span className="flex items-center gap-1.5"><i className="w-[17px] border-t-2 border-dotted border-[#9c8750]" /> Supply Prediction</span>
              <span className="flex items-center gap-1.5"><i className="w-[17px] border-t-2 border-dashed border-[#044353]" /> Supply Forecast</span>
            </> : <>
              <span className="flex items-center gap-1.5"><i className="w-[17px] border-t-2 border-[#537b76]" /> Historical sample</span>
              <span className="flex items-center gap-1.5"><i className="w-[17px] border-t-2 border-dashed border-[#044353]" /> Projection</span>
            </>}
          </div>
        </div>

        <ForecastChart market={market} horizon={horizon} />

        <div className="flex justify-between gap-2 border-t border-[#edf0eb] pt-[9px] text-[10px] text-[#849088]">
          <span className="flex items-center gap-1.5"><Icon name="clock" size={15} /> Forecast horizon: {horizonLabel}</span>
           <span>Measured in months of supply</span>
        </div>
      </div>

      <div className="mt-[13px] grid grid-cols-3 gap-3 max-[720px]:grid-cols-1">
        <StatCard icon="layers" tone="sage" label="CURRENT SUPPLY" value={valueFormat(market.current)} detail={market.observations ? 'Latest months of supply, Aug 2026.' : 'Starting point for this illustrative forecast.'} />
        <StatCard icon="trend" tone="gold" label="PROJECTED SUPPLY" value={valueFormat(projected)} detail={`Estimated months supply ${horizonLabel} from now.`} />
        <article className="min-h-[145px] rounded border border-[#e3e8e1] bg-white p-4 max-[720px]:min-h-0">
          <div className="mb-2.5 grid size-[31px] place-items-center rounded bg-[#edf0e7] text-[#738260]"><Icon name="arrow" size={19} /></div>
          <div className="text-[9px] font-bold tracking-[.12em] text-[#7d8a81]">THE TAKEAWAY</div>
          <div className="mt-2 font-['Georgia','Times_New_Roman',serif] text-[19px]">{market.dataSource ? `Supply ${rawDifference >= 0 ? 'rises' : 'eases'}.` : 'More room to move.'}</div>
          <p className="mt-1 text-[10px] leading-relaxed text-[#828e86]">{market.dataSource ? `Months of supply forecast is ${Math.abs(rawDifference).toFixed(2)} months ${rawDifference >= 0 ? 'above' : 'below'} the latest MOS value.` : `In this sample scenario, inventory rises by ${difference} months over the forecast period.`}</p>
        </article>
      </div>
    </section>
  )
}

function StatCard({ icon, tone, label, value, detail }: { icon: 'layers' | 'trend'; tone: 'sage' | 'gold'; label: string; value: string; detail: string }) {
  const iconStyle = tone === 'sage' ? 'bg-[#eaf0e8] text-[#54715e]' : 'bg-[#f4f0df] text-[#9c8750]'
  return (
    <article className="min-h-[145px] rounded border border-[#e3e8e1] bg-white p-4 max-[720px]:min-h-0">
      <div className={`mb-2.5 grid size-[31px] place-items-center rounded ${iconStyle}`}><Icon name={icon} size={19} /></div>
      <div className="text-[9px] font-bold tracking-[.12em] text-[#7d8a81]">{label}</div>
      <div className="mt-1 font-['Georgia','Times_New_Roman',serif] text-[26px]">{value} <span className="font-sans text-[11px] text-[#8b968f]">months</span></div>
      <p className="mt-1 text-[10px] leading-relaxed text-[#828e86]">{detail}</p>
    </article>
  )
}

function MarketSnapshot({ marketName, horizon, onSelect }: { marketName: string; horizon: Horizon; onSelect: (name: string) => void }) {
  return (
    <div className="min-w-0 rounded border border-[#e3e8e1] bg-white p-[18px]">
      <div className="mb-2.5 flex items-end justify-between gap-2">
        <div><div className="text-[10px] font-bold tracking-[.15em] text-[#788a7e]">02 / EXPLORE MARKETS</div><h2 className="mt-1 font-['Georgia','Times_New_Roman',serif] text-[21px] font-normal">Market snapshot</h2></div>
        <span className="text-[10px] text-[#829087]">{horizon}-month projection</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left text-[10px] [white-space:nowrap]">
          <thead><tr className="text-[8px] tracking-[.1em] text-[#829087]">
            <th className="border-b border-[#e8ece7] p-2">MARKET</th><th className="border-b border-[#e8ece7] p-2">CURRENT</th><th className="border-b border-[#e8ece7] p-2">PROJECTED</th><th className="border-b border-[#e8ece7] p-2">CHANGE</th><th className="border-b border-[#e8ece7] p-2" aria-label="Select market" />
          </tr></thead>
          <tbody>
            {markets.map(market => {
              const marketHorizon = market.horizons.includes(horizon) ? horizon : market.horizons[0]
              const projected = getProjectedValue(market, marketHorizon)
              const rawChange = projected - market.current
              const change = `${rawChange > 0 ? '+' : ''}${rawChange.toFixed(market.dataSource ? 2 : 1)}`
              return (
                <tr key={market.name} className={`cursor-pointer hover:bg-[#f6f8f3] ${marketName === market.name ? 'bg-[#f6f8f3]' : ''}`} onClick={() => onSelect(market.name)}>
                  <td className="border-b border-[#edf0ec] p-2"><strong className="block text-[11px] text-[#29453a]">{market.name}</strong><span className="mt-1 block text-[9px] text-[#87928b]">{market.region}</span></td>
                  <td className="border-b border-[#edf0ec] p-2 text-[#58685f]">{market.current.toFixed(market.observations ? 2 : 1)} mo</td>
                  <td className="border-b border-[#edf0ec] p-2 text-[#58685f]">{projected.toFixed(market.observations ? 2 : 1)} mo <span className="text-[#87928b]">({marketHorizon} mo)</span></td>
                  <td className={`border-b border-[#edf0ec] p-2 ${rawChange < 0 ? 'text-[#9c6258]' : 'text-[#587958]'}`}>{change}</td>
                  <td className="border-b border-[#edf0ec] p-2">
                    <button className="grid size-[27px] place-items-center rounded-sm border border-[#e5eae4] bg-white text-[#557266] cursor-pointer hover:bg-[#f0f0f0] focus-visible:bg-[#f0f0f0]" type="button" aria-label={`View ${market.name} forecast`} onClick={event => { event.stopPropagation(); onSelect(market.name) }}><Icon name="arrow" size={17} /></button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function MoreInsights() {
  return (
    <div className="rounded border border-[#e3e8e1] bg-[#edf1e9] p-[18px] max-[1050px]:grid max-[1050px]:grid-cols-[1fr_2fr] max-[1050px]:items-center max-[1050px]:gap-x-3 max-[720px]:block">
      <div className="text-[10px] font-bold tracking-[.15em] text-[#788a7e] max-[1050px]:col-span-2">GROWING WITH MORE DATA</div>
      <div className="mt-[17px] grid size-10 place-items-center rounded border border-[#d3ddce] text-[#607b62] max-[1050px]:row-span-2 max-[1050px]:mt-2 max-[720px]:mt-[14px]"><Icon name="plus" size={24} strokeWidth={1.5} /></div>
      <h2 className="mb-2 mt-3 font-['Georgia','Times_New_Roman',serif] text-[22px] font-normal leading-[1.15] max-[1050px]:mt-2">More insights<br />on the horizon.</h2>
      <p className="max-w-[300px] text-[10px] leading-relaxed text-[#718076] max-[1050px]:col-start-2">Months of supply is only the beginning. This space is ready for new insights as more metrics become available.</p>
      <div className="mt-3.5 grid gap-2 text-[9px] text-[#627465] max-[1050px]:col-start-2">
        <span className="flex items-center gap-1.5"><Icon name="check" size={14} /> Months of supply</span>
        <span>More metrics coming soon</span>
      </div>
    </div>
  )
}

function Methodology({ market, onBackToTop }: { market: Market; onBackToTop: () => void }) {
  return (
    <section id="methodology" className="mt-[22px] flex items-start gap-[13px] border-y border-[#e1e7df] py-4 max-[720px]:pr-0 max-[720px]:pl-0">
      <span className="text-[#718776]"><Icon name="book" size={20} /></span>
      <div>
        <h2 className="mb-1 font-['Georgia','Times_New_Roman',serif] text-[15px] font-normal">Methodology</h2>
        <p className="max-w-[900px] text-[10px] leading-relaxed text-[#78857d]">{market.dataSource ? `${market.name} values are imported from ${market.dataSource}. prediction vs actual months of supply comparisons cover Feb-Aug 2026; forecast values are shown at their supplied 1-, 3-, and 6-month horizons (Sep 2026, Nov 2026, and Feb 2027). The Sep forecast target has passed, and the CSV contains no Sep actual. Months of supply represents how long available inventory would last at the current sales pace *aspects were coded with artifical intelligence, prediction model authentically coded*.` : 'This market still uses illustrative placeholder values, not verified market data. Months of supply represents how long available inventory would last at the current sales pace.'}</p>
      </div>
      <button className="ml-auto grid size-[30px] shrink-0 -rotate-90 place-items-center rounded-sm border border-[#dfe5de] bg-white text-[#557266] cursor-pointer hover:bg-[#f0f0f0] focus-visible:bg-[#f0f0f0]" type="button" onClick={onBackToTop} aria-label="Back to top"><Icon name="arrow" size={18} /></button>
    </section>
  )
}

function findInitialMarket() {
  // Search links can look like #markets?search=Allen%20County.
  const search = new URLSearchParams(window.location.hash.split('?')[1] || '').get('search')
  return markets.find(market => `${market.name} ${market.region}`.toLowerCase().includes(search?.toLowerCase() || '\u0000'))?.name ?? markets[0].name
}

function MarketDashboard() {
  const [marketName, setMarketName] = useState(findInitialMarket)
  const [horizon, setHorizon] = useState<Horizon>(12)
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState<Section>('overview')
  const market = markets.find(item => item.name === marketName) ?? markets[0]
  const selectedHorizon = market.horizons.includes(horizon) ? horizon : market.horizons[0]

  function navigate(section: string) {
    if (section === 'open-menu' || section === 'close-menu') {
      setMenuOpen(section === 'open-menu')
      return
    }
    setMenuOpen(false)
    if (section !== 'top') setActiveSection(section as Section)
    document.getElementById(section)?.scrollIntoView({ behavior: 'smooth' })
  }

  function downloadReport() {
    const rows = market.observations && market.datedForecasts
      ? [
          [`North Eastern Group - ${market.name} months of supply`],
          ['Market', market.name],
          ['Data source', market.dataSource ?? ''],
          ['Selected horizon', `${selectedHorizon} months`],
          ['Date', 'Actual MOS', 'Model test prediction MOS', 'Forecast MOS', 'Forecast horizon months'],
          ...market.observations.map(point => [point.date, String(point.actual), String(point.predicted), '', '']),
          ...market.datedForecasts.map(point => [point.date, '', '', String(point.predicted), String(point.horizon)]),
        ]
      : [
          ['North Eastern Group - Illustrative months of supply forecast'],
          ['Market', market.name],
          ['Forecast horizon', `${selectedHorizon} months`],
          ['Data note', 'Illustrative sample data only; not a real market prediction'],
          ['Period', 'Months of supply'],
          ...market.history.map((value, index) => [`Historical sample ${index + 1}`, value.toFixed(1)]),
          ...(market.forecasts[selectedHorizon] ?? []).map((value, index) => [`Forecast sample ${index + 1}`, value.toFixed(1)]),
        ]
    const csv = rows.map(row => row.map(cell => `"${String(cell).replaceAll('"', '""')}"`).join(',')).join('\n')
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }))
    const link = document.createElement('a')
    link.href = url
    link.download = `supply-forecast-${market.name.toLowerCase().replaceAll(' ', '-')}-${selectedHorizon}mo.csv`
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div id="top" className="min-h-screen bg-[#f7f8f5] font-['Trebuchet_MS','Segoe_UI',sans-serif] text-sm text-[#19352e]">
      <Sidebar activeSection={activeSection} menuOpen={menuOpen} onNavigate={navigate} />

      <main id="overview" className="ml-[244px] min-h-screen max-[1050px]:ml-[210px] max-[720px]:ml-0">
        <TopBar onExport={downloadReport} hasImportedData={Boolean(market.dataSource)} />
        <div className="mx-auto w-full max-w-[1390px] px-[42px] pb-5 pt-[35px] max-[1050px]:px-[26px] max-[720px]:px-[15px] max-[720px]:pt-[26px]">
          <MarketIntro market={market} onMarketChange={setMarketName} />
          <ForecastSection market={market} horizon={selectedHorizon} onHorizonChange={setHorizon} />

          <section id="markets" className="mt-[25px] grid grid-cols-[minmax(0,1.8fr)_minmax(225px,.85fr)] gap-[13px] max-[1050px]:grid-cols-1">
            <MarketSnapshot marketName={marketName} horizon={selectedHorizon} onSelect={name => { setMarketName(name); navigate('predictions') }} />
            <MoreInsights />
          </section>

          <Methodology market={market} onBackToTop={() => navigate('top')} />
          <footer className="flex justify-between gap-3 px-0.5 pt-[15px] text-[9px] text-[#8a958e] max-[720px]:text-[8px]">
            <span>© North Eastern Group</span>
            <span>Independent property market analysis</span>
          </footer>
        </div>
      </main>
    </div>
  )
}

export default MarketDashboard