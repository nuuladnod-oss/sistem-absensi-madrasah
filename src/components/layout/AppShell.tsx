import React, { ReactNode, useState } from 'react'
import TopNavBar from './TopNavBar'
import MobileBottomNav from './MobileBottomNav'

interface NavItem {
  id: string
  label: string
  icon: ReactNode
  badge?: string
}

interface AppShellProps {
  children: ReactNode
  navItems?: NavItem[]
  activeNavId?: string
  onNavClick?: (id: string) => void
  periodLabel?: string
  userName?: string
  userInitials?: string
  userRole?: string
  onLogout?: () => void
}

function BurgerIcon() {
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

function CloseIcon() {
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
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  )
}

export default function AppShell({
  children,
  navItems = [],
  activeNavId,
  onNavClick,
  periodLabel = '2026/2027 Ganjil',
  userName = 'Pengguna',
  userInitials = 'PG',
  userRole = 'Peran',
  onLogout,
}: AppShellProps) {
  const [drawerOpen, setDrawerOpen] = useState(false)

  const handleNavClick = (id: string) => {
    onNavClick?.(id)
    setDrawerOpen(false)
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <TopNavBar
        periodLabel={periodLabel}
        userName={userName}
        userInitials={userInitials}
        userRole={userRole}
        onLogout={onLogout}
        onMenuClick={() => setDrawerOpen((prev) => !prev)}
      />

      <div className="flex">
        {/* Desktop Sidebar */}
        <aside className="hidden w-64 flex-shrink-0 flex-col border-r border-slate-200 bg-slate-50/70 lg:flex">
          <nav className="flex-1 space-y-1 p-4">
            <p className="mb-2 px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Menu Utama
            </p>
            {navItems.map((item) => {
              const isActive = item.id === activeNavId
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onNavClick?.(item.id)}
                  className={`
                    flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium
                    transition focus:outline-none focus:ring-2 focus:ring-madrasah-600/30
                    ${isActive
                      ? 'bg-madrasah-600 text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-200 hover:text-slate-900'}
                  `.trim()}
                >
                  <span className="flex h-5 w-5 flex-shrink-0" aria-hidden="true">
                    {item.icon}
                  </span>
                  <span className="truncate">{item.label}</span>
                  {item.badge && (
                    <span className="ml-auto rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                      {item.badge}
                    </span>
                  )}
                </button>
              )
            })}
          </nav>

          <div className="border-t border-slate-200 p-4">
            <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-xs">
              <div className="flex items-center justify-between text-[11px] font-semibold text-slate-700">
                <span>Tahun Ajaran</span>
                <span className="font-mono text-madrasah-600">26/27</span>
              </div>
              <div className="mt-1 truncate text-[11px] text-slate-500">
                Semester Ganjil (Aktif)
              </div>
              <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400">
                <span>Versi Sistem</span>
                <span className="font-mono">v2.0</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>

        {/* Mobile Drawer Overlay */}
        {drawerOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/50 lg:hidden"
            onClick={() => setDrawerOpen(false)}
            aria-hidden="true"
          />
        )}

        {/* Mobile Drawer */}
        <aside
          className={`
            fixed inset-y-0 left-0 z-50 w-64 flex-shrink-0 flex-col
            border-r border-slate-200 bg-slate-50 transition-transform duration-200
            lg:hidden ${drawerOpen ? 'translate-x-0' : '-translate-x-full'}
          `.trim()}
        >
          <div className="flex items-center justify-between border-b border-slate-200 p-4">
            <span className="text-sm font-bold text-slate-900">Menu</span>
            <button
              type="button"
              onClick={() => setDrawerOpen(false)}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 focus:outline-none"
              aria-label="Tutup menu"
            >
              <CloseIcon />
            </button>
          </div>
          <nav className="flex-1 space-y-1 p-4">
            {navItems.map((item) => {
              const isActive = item.id === activeNavId
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleNavClick(item.id)}
                  className={`
                    flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium
                    transition focus:outline-none focus:ring-2 focus:ring-madrasah-600/30
                    min-h-[48px]
                    ${isActive
                      ? 'bg-madrasah-600 text-white'
                      : 'text-slate-600 hover:bg-slate-200 hover:text-slate-900'}
                  `.trim()}
                >
                  <span className="flex h-5 w-5 flex-shrink-0" aria-hidden="true">
                    {item.icon}
                  </span>
                  <span className="truncate">{item.label}</span>
                  {item.badge && (
                    <span className="ml-auto rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                      {item.badge}
                    </span>
                  )}
                </button>
              )
            })}
          </nav>
        </aside>

        <MobileBottomNav
          navItems={navItems}
          activeNavId={activeNavId}
          onNavClick={handleNavClick}
        />
      </div>
    </div>
  )
}