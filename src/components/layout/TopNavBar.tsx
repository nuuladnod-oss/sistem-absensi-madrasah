import React from 'react'

interface TopNavBarProps {
  periodLabel?: string
  userName?: string
  userInitials?: string
  userRole?: string
  onLogout?: () => void
  onMenuClick?: () => void
}

function MenuIcon() {
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

function LogoutIcon() {
  return (
    <svg
      className="h-4 w-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
      />
    </svg>
  )
}

export default function TopNavBar({
  periodLabel = '2026/2027 Ganjil',
  userName = 'Pengguna',
  userInitials = 'PG',
  userRole = 'Peran',
  onLogout,
  onMenuClick,
}: TopNavBarProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onMenuClick}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-madrasah-600/30 lg:hidden"
            aria-label="Buka menu"
          >
            <MenuIcon />
          </button>

          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-madrasah-600 text-white">
              <span className="text-sm font-bold">AM</span>
            </div>
            <div className="hidden sm:block">
              <div className="text-sm font-bold leading-tight text-slate-900">
                MAS Al-Hikmah
              </div>
              <div className="text-[11px] leading-tight text-slate-500">
                Sistem Presensi GPS &amp; QR Code
              </div>
            </div>
          </div>

          <div className="hidden items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-800 border border-emerald-200 sm:flex">
            <span
              className="h-2 w-2 rounded-full bg-emerald-500"
              aria-hidden="true"
            />
            <span>Periode Aktif: {periodLabel}</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-1.5 rounded-lg bg-slate-50 px-2.5 py-1.5 text-xs text-slate-600 border border-slate-200 md:flex">
            <svg
              className="h-3.5 w-3.5 text-emerald-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
            </svg>
            <span>GPS Siap</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden text-right sm:block">
              <div className="text-xs font-semibold leading-tight text-slate-900">
                {userName}
              </div>
              <div className="text-[10px] uppercase tracking-wider text-slate-500">
                {userRole}
              </div>
            </div>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 border border-slate-300 text-xs font-bold text-madrasah-700">
              {userInitials}
            </div>
            {onLogout && (
              <button
                type="button"
                onClick={onLogout}
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 hover:bg-rose-50 hover:text-rose-600 focus:outline-none focus:ring-2 focus:ring-rose-600/30"
                aria-label="Keluar"
              >
                <LogoutIcon />
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}