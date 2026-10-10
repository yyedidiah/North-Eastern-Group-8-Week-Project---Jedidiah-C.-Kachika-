import { useState } from 'react'
import type { Horizon, Market } from './marketData'
import { getProjectedValue } from './marketData'

type Point = { x: number; y: number }
type ChartTooltipData = {
  marketName: string
  horizon: Horizon
  x: number
  y: number
  label: string
  value: number
}

function ChartTooltip({ tooltip, formatValue }: { tooltip: ChartTooltipData | null; formatValue: (value: number) => string }) {
  if (!tooltip) return null

  const width = 164
  const x = Math.max(8, Math.min(800 - width - 8, tooltip.x - width / 2))
  const y = tooltip.y < 66 ? tooltip.y + 14 : tooltip.y - 58

  return (
    <g pointerEvents="none" aria-hidden="true">
      <rect x={x} y={y} width={width} height="50" rx="4" fill="#19352e" />
      <text x={x + 10} y={y + 19} fill="#d4dfae" fontFamily="sans-serif" fontSize="10" fontWeight="700">{tooltip.label}</text>
      <text x={x + 10} y={y + 38} fill="#ffffff" fontFamily="sans-serif" fontSize="12">{formatValue(tooltip.value)} months of supply</text>
    </g>
  )
}

// Turns chart coordinates into the SVG instructions that connect the points.
function linePath(points: Point[]) {
  return points.reduce(
    (path, point, index) => index === 0
      ? `M ${point.x} ${point.y}`
      : `${path} L ${point.x} ${point.y}`,
    '',
  )
}

type ForecastChartProps = { market: Market; horizon: Horizon }

// Current illustrative SVG graph. This component can be swapped out when the
// user's Python graph output is ready, without changing the rest of the page.
export function ForecastChart({ market, horizon }: ForecastChartProps) {
  const [tooltip, setTooltip] = useState<ChartTooltipData | null>(null)
  const activeTooltip = tooltip?.marketName === market.name && tooltip.horizon === horizon ? tooltip : null
  const formatValue = (value: number) => value.toFixed(market.dataSource ? 2 : 1)
  const showTooltip = (point: Omit<ChartTooltipData, 'marketName' | 'horizon'>) => {
    setTooltip({ ...point, marketName: market.name, horizon })
  }

  if (market.observations && market.datedForecasts) {
    const observationX = (index: number) => 56 + index * 65
    const forecastX = [516, 626, 770]
    const y = (value: number) => 245 - ((value - 1.5) / 1) * 185
    const observations = market.observations
    const actualPoints = observations.map((point, index) => ({ x: observationX(index), y: y(point.actual) }))
    const testPoints = observations.map((point, index) => ({ x: observationX(index), y: y(point.predicted) }))
    const forecastPoints = [
      { x: observationX(observations.length - 1), y: y(market.current) },
      ...market.datedForecasts.map((point, index) => ({ x: forecastX[index], y: y(point.predicted) })),
    ]
    const selectedIndex = market.datedForecasts.findIndex(point => point.horizon === horizon)
    const selectedForecast = market.datedForecasts[selectedIndex]
    const monthLabel = (date: string) => {
      const [year, month] = date.split('-')
      return `${new Date(Number(year), Number(month) - 1).toLocaleString('en-US', { month: 'short' })} ${year.slice(2)}`
    }
    const projected = getProjectedValue(market, horizon)

    return (
      <div className="w-full overflow-x-auto" role="group" aria-label={`Months of supply chart for ${market.name}. Actual observations and model test predictions from February through August 2026; ${horizon}-month forecast is ${projected.toFixed(2)} months for ${monthLabel(selectedForecast.date)}.`}>
        <svg className="mt-1 block h-auto max-h-[260px] w-full max-[720px]:min-w-[760px]" viewBox="0 0 800 310" preserveAspectRatio="xMidYMid meet">
          <rect x="480" y="26" width="290" height="219" fill="#f7f9f3" rx="7" />
          {[1.5, 2, 2.5].map(value => (
            <g key={value}>
              <line x1="56" x2="770" y1={y(value)} y2={y(value)} stroke="#e8ece8" strokeDasharray="4 5" />
              <text x="13" y={y(value) + 4} className="fill-[#87938b] font-sans text-[11px]">{value.toFixed(1)}</text>
            </g>
          ))}
          <line x1="480" x2="480" y1="26" y2="245" stroke="#b8c8bd" strokeDasharray="4 5" />
          <path d={`${linePath(forecastPoints)} L 770 245 L 480 245 Z`} fill="#d4dfae" fillOpacity=".25" />
          <path d={linePath(actualPoints)} fill="none" stroke="#537b76" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          <path d={linePath(testPoints)} fill="none" stroke="#9c8750" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="3 5" />
          <path d={linePath(forecastPoints)} fill="none" stroke="#044353" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="7 7" />
          {observations.map((point, index) => {
            const position = { x: observationX(index), y: y(point.actual) }
            const label = `Actual · ${monthLabel(point.date)}`
            return <circle key={`actual-${point.date}`} cx={position.x} cy={position.y} r="4" fill="#537b76" tabIndex={0} role="img" aria-label={`${label}: ${formatValue(point.actual)} months of supply`} onMouseEnter={() => showTooltip({ ...position, label, value: point.actual })} onMouseLeave={() => setTooltip(null)} onFocus={() => showTooltip({ ...position, label, value: point.actual })} onBlur={() => setTooltip(null)} />
          })}
          {observations.map((point, index) => {
            const position = { x: observationX(index), y: y(point.predicted) }
            const label = `Model test · ${monthLabel(point.date)}`
            return <circle key={`test-${point.date}`} cx={position.x} cy={position.y} r="3" fill="#9c8750" tabIndex={0} role="img" aria-label={`${label}: ${formatValue(point.predicted)} months of supply`} onMouseEnter={() => showTooltip({ ...position, label, value: point.predicted })} onMouseLeave={() => setTooltip(null)} onFocus={() => showTooltip({ ...position, label, value: point.predicted })} onBlur={() => setTooltip(null)} />
          })}
          {market.datedForecasts.map((point, index) => (
            <circle key={point.date} cx={forecastX[index]} cy={y(point.predicted)} r={index === selectedIndex ? 8 : 5} fill="#044353" stroke="#fff" strokeWidth="2" tabIndex={0} role="img" aria-label={`Forecast · ${monthLabel(point.date)}: ${formatValue(point.predicted)} months of supply`} onMouseEnter={() => showTooltip({ x: forecastX[index], y: y(point.predicted), label: `Forecast · ${monthLabel(point.date)}`, value: point.predicted })} onMouseLeave={() => setTooltip(null)} onFocus={() => showTooltip({ x: forecastX[index], y: y(point.predicted), label: `Forecast · ${monthLabel(point.date)}`, value: point.predicted })} onBlur={() => setTooltip(null)} />
          ))}
          {observations.map((point, index) => <text key={point.date} x={observationX(index)} y="274" textAnchor="middle" className="fill-[#87938b] font-sans text-[9px]">{monthLabel(point.date)}</text>)}
          {market.datedForecasts.map((point, index) => <text key={point.date} x={forecastX[index]} y="274" textAnchor="middle" className="fill-[#87938b] font-sans text-[9px]">{monthLabel(point.date)}</text>)}
          <text x="56" y="300" className="fill-[#87938b] font-sans text-[9px] font-bold tracking-[.1em]">HISTORICAL</text>
          <text x="666" y="300" className="fill-[#87938b] font-sans text-[9px] font-bold tracking-[.1em]">FORECAST</text>
          <ChartTooltip tooltip={activeTooltip} formatValue={formatValue} />
        </svg>
      </div>
    )
  }

  // The SVG uses fixed 800 by 310 coordinates; Tailwind scales it to fit the page.
  const x = (index: number) => 56 + index * 64
  const y = (value: number) => 250 - value * 43
  const historyPoints = market.history.map((value, index) => ({ x: x(index), y: y(value) }))

  // Start the dashed forecast at today's value to join it to the history line.
  const forecastPoints = [
    { x: x(5), y: y(market.current) },
    ...(market.forecasts[horizon] ?? []).map((value, index) => ({ x: x(index + 6), y: y(value) })),
  ]
  const finalPoint = forecastPoints[forecastPoints.length - 1]
  const projected = getProjectedValue(market, horizon)

  return (
    <div
      className="w-full overflow-x-auto"
      role="group"
      aria-label={`Months of supply chart for ${market.name}. Current ${market.current.toFixed(1)} months, projected ${projected.toFixed(1)} months in ${horizon} months. Illustrative data.`}
    >
      <svg className="mt-1 block h-auto max-h-[260px] w-full max-[720px]:min-w-[560px]" viewBox="0 0 800 310" preserveAspectRatio="xMidYMid meet">
        <defs>
          <linearGradient id="forecastArea" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#d4dfae" stopOpacity=".42" />
            <stop offset="100%" stopColor="#d4dfae" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* The shaded block separates the forecast period from the past. */}
        <rect x="376" y="26" width="394" height="224" fill="#f7f9f3" rx="7" />
        {[2, 3, 4, 5].map(value => (
          <g key={value}>
            <line x1="56" x2="770" y1={y(value)} y2={y(value)} stroke="#e8ece8" strokeDasharray="4 5" />
            <text x="19" y={y(value) + 4} className="fill-[#87938b] font-sans text-[11px]">{value}</text>
          </g>
        ))}
        <line x1="376" x2="376" y1="26" y2="250" stroke="#b8c8bd" strokeDasharray="4 5" />
        <path d={`${linePath(forecastPoints)} L ${finalPoint.x} 250 L 376 250 Z`} fill="url(#forecastArea)" />
        <path d={linePath(historyPoints)} fill="none" stroke="#537b76" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        <path d={linePath(forecastPoints)} fill="none" stroke="#044353" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="7 7" />
        {historyPoints.map((point, index) => <circle key={`history-${index}`} cx={point.x} cy={point.y} r="4" fill="#537b76" tabIndex={0} role="img" aria-label={`Historical sample ${index + 1}: ${formatValue(market.history[index])} months of supply`} onMouseEnter={() => showTooltip({ ...point, label: `Historical sample ${index + 1}`, value: market.history[index] })} onMouseLeave={() => setTooltip(null)} onFocus={() => showTooltip({ ...point, label: `Historical sample ${index + 1}`, value: market.history[index] })} onBlur={() => setTooltip(null)} />)}
        <circle cx="376" cy={y(market.current)} r="7" fill="#fff" stroke="#044353" strokeWidth="3" tabIndex={0} role="img" aria-label={`Current: ${formatValue(market.current)} months of supply`} onMouseEnter={() => showTooltip({ x: 376, y: y(market.current), label: 'Current', value: market.current })} onMouseLeave={() => setTooltip(null)} onFocus={() => showTooltip({ x: 376, y: y(market.current), label: 'Current', value: market.current })} onBlur={() => setTooltip(null)} />
        {market.forecasts[horizon]?.map((value, index) => {
          const position = { x: x(index + 6), y: y(value) }
          const label = `Forecast sample ${index + 1}`
          return <circle key={`forecast-${index}`} cx={position.x} cy={position.y} r={index === 5 ? 8 : 4} fill="#044353" stroke={index === 5 ? '#fff' : 'none'} strokeWidth="3" tabIndex={0} role="img" aria-label={`${label}: ${formatValue(value)} months of supply`} onMouseEnter={() => showTooltip({ ...position, label, value })} onMouseLeave={() => setTooltip(null)} onFocus={() => showTooltip({ ...position, label, value })} onBlur={() => setTooltip(null)} />
        })}
        <text x="56" y="290" className="fill-[#87938b] font-sans text-[10px] font-bold tracking-[.1em]">PAST</text>
        <text x="332" y="290" className="fill-[#87938b] font-sans text-[10px] font-bold tracking-[.1em]">TODAY</text>
        <text x="666" y="290" className="fill-[#87938b] font-sans text-[10px] font-bold tracking-[.1em]">+{horizon} MONTHS</text>
        <ChartTooltip tooltip={activeTooltip} formatValue={formatValue} />
      </svg>
    </div>
  )
}