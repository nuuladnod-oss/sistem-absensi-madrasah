import React from 'react'

interface AppShellProps {
  children: React.ReactNode
}

export default function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-600 text-white">
              <span className="text-sm font-bold">A</span>
            </div>
            <span className="text-lg font-semibold text-slate-800">Absensi Madrasah</span>
          </div>
          <nav className="hidden gap-4 text-sm text-slate-600 sm:flex">
            <span>Dashboard</span>
            <span>Absensi</span>
            <span>Laporan</span>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-6">{children}</main>
      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-3 text-center text-xs text-slate-400">
          Sistem Absensi Madrasah — Foundation
        </div>
      </footer>
    </div>
  )
}