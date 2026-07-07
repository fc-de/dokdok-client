import type { ComponentType, SVGProps } from 'react'

export type MobileLayoutVariant = 'none' | 'main' | 'content' | 'independent'

export type MobileHeaderAction = {
  label: string
  onClick: () => void
  disabled?: boolean
  ariaLabel?: string
}

export type MobileBottomCTAConfig = {
  label: string
  onClick: () => void
  disabled?: boolean
  loading?: boolean
  loadingLabel?: string
}

export type MobileBottomNavigationItem = {
  label: string
  path: string
  icon: ComponentType<SVGProps<SVGSVGElement>>
  end?: boolean
}
