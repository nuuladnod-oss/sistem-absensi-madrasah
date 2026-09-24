import { Navigate, Outlet, createBrowserRouter } from 'react-router-dom'

import AppShell from '../components/layout/AppShell'

const PlaceholderPage = () => (
  <div className="flex min-h-screen items-center justify-center">
    <div className="text-center">
      <h1 className="text-2xl font-bold text-slate-800">App berjalan</h1>
      <p className="mt-2 text-sm text-slate-500">Halaman placeholder — foundation saja.</p>
    </div>
  </div>
)

const router = createBrowserRouter([
  {
    path: '/',
    element: <PlaceholderPage />,
  },
  {
    path: '/app',
    element: (
      <AppShell>
        <PlaceholderPage />
      </AppShell>
    ),
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
])

export default router