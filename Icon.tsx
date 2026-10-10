import type { ReactNode } from 'react'

export type IconName =
  | 'grid' | 'chart' | 'pin' | 'book' | 'chevron' | 'download' | 'arrow'
  | 'trend' | 'clock' | 'layers' | 'plus' | 'check' | 'menu' | 'close'

type IconProps = { name: IconName; size?: number; strokeWidth?: number }

// Small inline SVG icons used by the dashboard's buttons and labels.
export function Icon({ name, size = 20, strokeWidth = 1.8 }: IconProps) {
  const paths: Record<IconName, ReactNode> = {
    grid: <><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></>,
    chart: <><path d="M3 19.5h18" /><path d="m4 15 5-5 4 3 7-8" /><path d="M16 5h4v4" /></>,
    pin: <><path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="2.5" /></>,
    book: <><path d="M12 6c-2.5-2-5.6-2.2-9-1v14c3.4-1.2 6.5-1 9 1 2.5-2 5.6-2.2 9-1V5c-3.4-1.2-6.5-1-9 1Z" /><path d="M12 6v14" /></>,
    chevron: <path d="m7 10 5 5 5-5" />,
    download: <><path d="M12 3v12m0 0 4-4m-4 4-4-4" /><path d="M4 17v3h16v-3" /></>,
    arrow: <path d="M5 12h14m0 0-6-6m6 6-6 6" />,
    trend: <><path d="m3 17 6-6 4 3 8-9" /><path d="M16 5h5v5" /></>,
    clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
    layers: <><path d="m12 3 9 5-9 5-9-5 9-5Z" /><path d="m3 12 9 5 9-5M3 16l9 5 9-5" /></>,
    plus: <path d="M12 5v14M5 12h14" />,
    check: <path d="m5 12 4 4L19 6" />,
    menu: <path d="M4 7h16M4 12h16M4 17h16" />,
    close: <path d="M5 5l14 14M19 5 5 19" />,
  }

  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {paths[name]}
    </svg>
  )
}