import React, { ReactNode } from 'react'

interface NavItem {
  id: string
  label: string
  icon: ReactNode
  badge?: string
}

interface MobileBottomNavProps {
  navItems: NavItem[]
  activeNavId?: string
  onNavClick?: (id: string) => void
}

function DrawerIcon() {
  return (
    <svg
      className="h-5 w-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4 6h16M4 12h16M4 18h16"
      />
    </svg>
  )
}

export default function MobileBottomNav({
  navItems,
  activeNavId,
  onNavClick,
}: MobileBottomNavProps) {
  const primaryItems = navItems.slice(0, 3)
  const drawerItem = {
    id: '__drawer__',
    label: 'Menu',
    icon: <DrawerIcon />,
  }

  const items = [...primaryItems, drawerItem]

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-30 flex h-16 items-center justify-around border-t border-slate-200 bg-white lg:hidden"
      aria-label="Navigasi bawah mobile"
    >
      {items.map((item) => {
        const isDrawer = item.id === '__drawer__'
        const isActive = item.id === activeNavId

        return (
          <button
            key={item.id}
            type="button"
            onClick={() => {
              if (isDrawer) {
                // Trigger drawer via window event
                window.dispatchEvent(new CustomEvent('toggle-mobile-drawer'))
                return
              }
              onNavClick?.(item.id)
            }}
            className={`
              flex flex-1 flex-col items-center justify-center gap-0.5 py-1
              text-center min-w-[60px] min-h-[48px]
              transition focus:outline-none focus:ring-2 focus:ring-madrasah-600/30
              ${isActive ? 'text-madrasah-600' : 'text-slate-500 hover:text-slate-800'}
            `.trim()}
          >
            <span className="flex h-5 w-5 items-center justify-center" aria-hidden="true">
              {item.icon}
            </span>
            <span className="text-[10px] font-medium leading-none">
              {item.label}
            </span>
          </button>
        )
      })}
    </nav>
  )
}