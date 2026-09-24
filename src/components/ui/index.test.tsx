import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Button from './Button'
import StatusBadge from './StatusBadge'
import GeofenceIndicator from './GeofenceIndicator'
import MetricCard from './MetricCard'
import PageHeader from './PageHeader'
import ResponsiveTable from './ResponsiveTable'
import ModalConfirm from './ModalConfirm'
import StateAlert from './StateAlert'

describe('Button', () => {
  it('renders primary variant', () => {
    render(<Button variant="primary">Simpan</Button>)
    expect(screen.getByRole('button', { name: 'Simpan' })).toBeInTheDocument()
  })

  it('renders secondary variant', () => {
    render(<Button variant="secondary">Batal</Button>)
    expect(screen.getByRole('button', { name: 'Batal' })).toBeInTheDocument()
  })

  it('renders danger variant', () => {
    render(<Button variant="danger">Hapus</Button>)
    expect(screen.getByRole('button', { name: 'Hapus' })).toBeInTheDocument()
  })

  it('renders outline variant', () => {
    render(<Button variant="outline">Filter</Button>)
    expect(screen.getByRole('button', { name: 'Filter' })).toBeInTheDocument()
  })

  it('shows loading state', () => {
    render(<Button loading>Muatom</Button>)
    expect(screen.getByRole('button')).toBeDisabled()
  })
})

describe('StatusBadge', () => {
  it('renders Hadir status', () => {
    render(<StatusBadge status="HADIR" />)
    expect(screen.getByText('Hadir')).toBeInTheDocument()
  })

  it('renders Terlambat status', () => {
    render(<StatusBadge status="TERLAMBAT" />)
    expect(screen.getByText('Terlambat')).toBeInTheDocument()
  })

  it('renders Pulang Cepat status', () => {
    render(<StatusBadge status="PULANG_CEPAT" />)
    expect(screen.getByText('Pulang Cepat')).toBeInTheDocument()
  })

  it('renders Belum Absen Pulang status', () => {
    render(<StatusBadge status="BELUM_ABSEN_PULANG" />)
    expect(screen.getByText('Belum Absen Pulang')).toBeInTheDocument()
  })

  it('renders Alpa status', () => {
    render(<StatusBadge status="ALPA" />)
    expect(screen.getByText('Alpa')).toBeInTheDocument()
  })

  it('renders Izin Resmi status', () => {
    render(<StatusBadge status="IZIN" />)
    expect(screen.getByText('Izin Resmi')).toBeInTheDocument()
  })

  it('renders Sakit status', () => {
    render(<StatusBadge status="SAKIT" />)
    expect(screen.getByText('Sakit')).toBeInTheDocument()
  })

  it('renders Menunggu Approval status', () => {
    render(<StatusBadge status="IZIN_MENUNGGU_APPROVAL" />)
    expect(screen.getByText('Menunggu Approval')).toBeInTheDocument()
  })
})

describe('GeofenceIndicator', () => {
  it('shows within radius when distance is valid', () => {
    render(
      <GeofenceIndicator
        distanceMeter={42}
        accuracyMeter={12}
        radiusMeter={200}
        accuracyLimit={30}
      />,
    )
    expect(screen.getByText(/Dalam Radius/)).toBeInTheDocument()
  })

  it('shows outside radius when distance exceeds limit', () => {
    render(
      <GeofenceIndicator
        distanceMeter={250}
        accuracyMeter={12}
        radiusMeter={200}
        accuracyLimit={30}
      />,
    )
    expect(screen.getByText(/Di Luar Radius/)).toBeInTheDocument()
  })
})

describe('MetricCard', () => {
  it('renders label and value', () => {
    render(<MetricCard label="Kehadiran" value={98} helper="+2% dari minggu lalu" />)
    expect(screen.getByText('Kehadiran')).toBeInTheDocument()
    expect(screen.getByText('98')).toBeInTheDocument()
  })
})

describe('PageHeader', () => {
  it('renders title and subtitle', () => {
    render(
      <PageHeader
        title="Presensi Mandiri"
        subtitle="Jadwal hari ini: 07:00 - 14:00 WIB"
        periodBadge="2026/2027 Ganjil"
      />,
    )
    expect(screen.getByText('Presensi Mandiri')).toBeInTheDocument()
    expect(
      screen.getByText('Jadwal hari ini: 07:00 - 14:00 WIB'),
    ).toBeInTheDocument()
  })
})

describe('ResponsiveTable', () => {
  const data = [
    { id: '1', name: 'Ahmad', status: 'Hadir' },
    { id: '2', name: 'Nurul', status: 'Terlambat' },
  ]

  it('renders rows', () => {
    render(
      <ResponsiveTable
        columns={[
          { key: 'name', header: 'Nama' },
          { key: 'status', header: 'Status' },
        ]}
        data={data}
        keyExtractor={(r) => r.id}
      />,
    )
    expect(screen.getByText('Ahmad')).toBeInTheDocument()
    expect(screen.getByText('Nurul')).toBeInTheDocument()
  })

  it('shows empty message', () => {
    render(
      <ResponsiveTable
        columns={[{ key: 'name', header: 'Nama' }]}
        data={[]}
        keyExtractor={() => 'x'}
        emptyMessage="Tidak ada data"
      />,
    )
    expect(screen.getByText('Tidak ada data')).toBeInTheDocument()
  })
})

describe('ModalConfirm', () => {
  it('renders when open', () => {
    render(
      <ModalConfirm
        open={true}
        title="Konfirmasi"
        description="Yakin?"
        onConfirm={() => {}}
        onClose={() => {}}
      />,
    )
    expect(screen.getByText('Konfirmasi')).toBeInTheDocument()
    expect(screen.getByText('Yakin?')).toBeInTheDocument()
  })

  it('does not render when closed', () => {
    const { container } = render(
      <ModalConfirm
        open={false}
        title="Konfirmasi"
        onConfirm={() => {}}
        onClose={() => {}}
      />,
    )
    expect(container.firstChild).toBeNull()
  })
})

describe('StateAlert', () => {
  it('renders success alert', () => {
    render(
      <StateAlert variant="success" title="Berhasil">
        Presensi tersimpan.
      </StateAlert>
    )
    expect(screen.getByText('Berhasil')).toBeInTheDocument()
    expect(screen.getByText('Presensi tersimpan.')).toBeInTheDocument()
  })

  it('renders error alert', () => {
    render(
      <StateAlert variant="error" title="Gagal">
        Koneksi terputus.
      </StateAlert>
    )
    expect(screen.getByText('Gagal')).toBeInTheDocument()
  })
})