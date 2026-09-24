---
name: Sistem Absensi Madrasah Visual Identity
colors:
  surface: '#f8f9ff'
  surface-dim: '#d0dbed'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e6eeff'
  surface-container-high: '#dee9fc'
  surface-container-highest: '#d9e3f6'
  on-surface: '#121c2a'
  on-surface-variant: '#3e4944'
  inverse-surface: '#27313f'
  inverse-on-surface: '#eaf1ff'
  outline: '#6e7a73'
  outline-variant: '#bec9c2'
  surface-tint: '#006c50'
  primary: '#005e45'
  on-primary: '#ffffff'
  primary-container: '#13795b'
  on-primary-container: '#a4fed9'
  inverse-primary: '#7ed8b4'
  secondary: '#0e658c'
  on-secondary: '#ffffff'
  secondary-container: '#8ed1fe'
  on-secondary-container: '#005a80'
  tertiary: '#893c00'
  on-tertiary: '#ffffff'
  tertiary-container: '#ae4f03'
  on-tertiary-container: '#ffe8dd'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#9af4cf'
  primary-fixed-dim: '#7ed8b4'
  on-primary-fixed: '#002116'
  on-primary-fixed-variant: '#00513b'
  secondary-fixed: '#c7e7ff'
  secondary-fixed-dim: '#8bcefb'
  on-secondary-fixed: '#001e2e'
  on-secondary-fixed-variant: '#004c6c'
  tertiary-fixed: '#ffdbca'
  tertiary-fixed-dim: '#ffb68e'
  on-tertiary-fixed: '#331200'
  on-tertiary-fixed-variant: '#763300'
  background: '#f8f9ff'
  on-background: '#121c2a'
  surface-variant: '#d9e3f6'
typography:
  display-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 30px
    fontWeight: '700'
    lineHeight: 38px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
    letterSpacing: -0.015em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.015em
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 26px
    letterSpacing: -0.005em
  title-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 24px
    letterSpacing: 0em
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
    letterSpacing: 0em
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 22px
    letterSpacing: 0em
  body-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 20px
    letterSpacing: 0.005em
  label-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 13px
    fontWeight: '500'
    lineHeight: 18px
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.02em
  caption-tabular:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.02em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-desktop: 1.5rem
  margin: 1rem
  margin-desktop: 2rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
---

## Brand & Style

The visual identity is anchored in institutional dignity, civic responsibility, and religious solemnity fitting for Islamic educational institutions (Madrasah Ibtidaiyah, Tsanawiyah, and Aliyah under the Ministry of Religious Affairs). The interface design prioritizes calm, deliberate clarity over tech-novelty, ensuring instant comfort for users spanning diverse age groups and digital literacy levels: senior tenured teachers, administrative clerks, homeroom mentors (Wali Kelas), school leaders (Kepala Madrasah), and parents checking attendance on affordable Android smartphones.

The aesthetic fuses **Corporate / Modern Institutional** discipline with pragmatic SaaS operational speed:
- **Calm, High-Contrast Presence:** Bright, paper-inspired neutral canvases contrasted against deep Islamic green accents reinforce structure, punctuality, and trust without cognitive fatigue during extended administrative shifts.
- **Dignified Restraint:** Gratuitous decorations, translucent glass surfaces, neon gradients, and playful micro-animations are rejected in favor of solid surfaces, reliable 1px boundaries, tactile button feedback, and explicit textual signifiers.
- **Accessible Legibility First:** Visual hierarchy is straightforward. Content respects administrative realities: tabular student identifiers (NISN), national teacher numbers (NIP/NUPTK), exact time-stamped attendance logs, and high-contrast status tags designed for direct sunlight legibility on school grounds.

## Colors

The system uses a tailored light-mode palette constructed to exceed WCAG AAA standards for normal body text and status readability. 

### Color Architecture

1. **Primary: Institutional Madrasah Emerald (`#13795B`)**
   - Represents growth, integrity, discipline, and educational stewardship.
   - Core interactive actions (Primary CTAs, active navigation items, confirmed check-ins): `#13795B`.
   - Hover / Active Pressed State: `#0B3D26` (Deep Pine).
   - Light Background Fill / Selected Row Tint: `#E8F5E9` and `#F0FDF4`.
   - Structural Focus Outline: `#13795B` at 20% alpha spread.

2. **Secondary: Dignified Slate Teal (`#1B6B93`)**
   - Applied to institutional metadata, academic calendar indicators, secondary filters, and operational summaries.
   - Secondary Interactive Borders: `#1B6B93`.
   - Subtle Badge Background: `#E0F2FE`.

3. **Tertiary: Institutional Amber (`#B45309`)**
   - Dedicated exclusively to warnings, pending states, and time-sensitive alerts (e.g., student late arrival, attendance approval needed).

4. **Neutral Palette**
   - **Canvas Background:** `#F8F9FA` (Soft Paper White) — prevents eye strain caused by pure `#FFFFFF` backdrops.
   - **Surface & Cards:** `#FFFFFF` (Solid Crisp White) for all functional containers.
   - **Primary Text:** `#111827` (Deep Ink Charcoal) — gives absolute contrast on white surfaces.
   - **Secondary & Helper Text:** `#4B5563` (Muted Slate) — compliant contrast for metadata and labels.
   - **Borders & Dividers:** `#E2E8F0` (Accessible hairline borders).

### Standardized Attendance Status Semantic Tokens

Attendance statuses must be immediately identifiable at a glance on small screens:
- **Hadir (Present):** Background `#ECFDF5`, Text `#065F46`, Border `#A7F3D0`.
- **Terlambat (Late):** Background `#FFFBEB`, Text `#92400E`, Border `#FDE68A`.
- **Pulang Cepat (Early Departure):** Background `#FFF7ED`, Text `#9A3412`, Border `#FED7AA`.
- **Belum Absen Pulang (Pending Checkout):** Background `#EFF6FF`, Text `#1E40AF`, Border `#BFDBFE`.
- **Izin / Sakit (Permitted Leave / Sick):** Background `#FAF5FF`, Text `#6B21A8`, Border `#E9D5FF`.
- **Alpa (Absent Unexcused):** Background `#FEF2F2`, Text `#991B1B`, Border `#FECACA`.
- **Menunggu Verifikasi (Pending Review):** Background `#F1F5F9`, Text `#334155`, Border `#CBD5E1` with an amber indicator dot (`#D97706`).

## Typography

Typography centers around **Plus Jakarta Sans**, chosen for its tall x-height, open counterforms, and legibility on lower-density Android screens. 

### Implementation Rules

- **Indonesian Naming Conventions & Identifiers:** Long Indonesian personal names must never be truncated prematurely. Cards and table cells allow multi-line wraps where appropriate.
- **Tabular Numerals Enforcement:** All identifiers—such as NIK (16 digits), NISN (10 digits), NIP, GPS check-in coordinates, and timestamps (`07:14:02 WIB`)—must use `font-feature-settings: "tnum" 1` or an explicit monospaced variant to ensure alignment across data rows.
- **Line Length and Readability:** Paragraph bodies default to `14px` with a generous `1.57` leading (`22px`) to accommodate middle-aged educators using devices with default system font scaling turned up.

## Layout & Spacing

The layout is built upon a rigid 4px/8px geometric grid rhythm to guarantee predictable rendering across disparate screen sizes.

### Grid & Breakpoints

- **Mobile Viewports (< 768px):** Single column fluid layout. Screen margin is strictly `1rem` (16px) with `0.75rem` (12px) to `1rem` (16px) vertical gaps between cards. Preserves density while preventing edge clipping on entry-level Android browsers.
- **Tablet Viewports (768px – 1024px):** 8-column layout. Margin expands to `1.5rem` (24px) with gutters fixed at `1rem` (16px). Form fields and summary widgets group into two-column arrangements.
- **Desktop Viewports (> 1024px):** 12-column layout. Max container constraint capped at `1440px`. Margin expands to `2rem` (32px), gutters at `1.5rem` (24px). Sidebar navigation occupies a fixed `260px` rail, allowing administrative data tables to stretch smoothly across the remaining width.

### Navigation Hierarchy

- **Mobile:** A persistent utility top bar containing the school brand, user role, and active academic year (`TA 2024/2025 - Ganjil`), complemented by a fixed bottom bar providing 3 primary touch actions: **Presensi (Scan/GPS)**, **Riwayat**, and **Profil**.
- **Desktop:** Left-hand vertical sidebar containing hierarchical administrative functions (Dashboard, Presensi Harian, Rekap Bulanan, Master Siswa & Guru, Surat Izin, Laporan Emis/Simpatika Export).

## Elevation & Depth

Visual hierarchy avoids heavy drop shadows, frosted glass blurs, and floating neomorphic layers. Instead, depth is structured through **crisp 1px borders and gentle ambient separation**.

1. **Base Layer (Elevation 0 - Canvas):**
   - `#F8F9FA` background tone.
2. **Surface Layer (Elevation 1 - Cards, Tables, Modules):**
   - `#FFFFFF` solid background.
   - Border: `1px solid #E2E8F0`.
   - Shadow: `0 1px 2px 0 rgba(15, 23, 42, 0.04)`.
3. **Elevated Surfaces (Elevation 2 - Dropdowns, Popovers, Filter Menus):**
   - `#FFFFFF` solid background.
   - Border: `1px solid #CBD5E1`.
   - Shadow: `0 4px 6px -1px rgba(15, 23, 42, 0.07), 0 2px 4px -2px rgba(15, 23, 42, 0.05)`.
4. **Modal & Floating Panels (Elevation 3 - Attendance Confirmation, Camera QR Modal):**
   - `#FFFFFF` surface with a subtle 1px border.
   - Backdrop: `rgba(15, 23, 42, 0.45)` with `backdrop-filter: blur(2px)`.
   - Shadow: `0 20px 25px -5px rgba(15, 23, 42, 0.12), 0 8px 10px -6px rgba(15, 23, 42, 0.08)`.

## Shapes

The design uses **Rounded (`2`)** geometry, standardizing components around an accessible 8px (`0.5rem`) corner radius.

- **Buttons, Form Inputs, Standard Alerts:** `8px` (`rounded-lg`). Provides approachable warmth while retaining governmental formality.
- **Cards, Table Wrappers, Modals:** `12px` to `16px` (`rounded-xl`). Creates clean visual grouping without appearing cartoonish.
- **Status Pills and Badges:** `6px` (`rounded-md`). Pill-shaped (`rounded-full`) geometry is prohibited for status indicators to prevent confusion with consumer tags or playful chips.
- **Avatar & Icon Containers:** Squared with `8px` roundedness for institutional seals, and standard circular for personal staff portraits.

## Components

### Buttons
- **Primary Button (e.g., "Simpan Kehadiran", "Kirim Rekap"):** Solid `#13795B` background, `#FFFFFF` text, `font-semibold`, height `44px` minimum on touch devices. Hover: `#0B3D26`. Active tap: transforms down by 0.5px. Border radius `8px`. Focus: `outline: 2px solid #13795B; outline-offset: 2px`.
- **Secondary Button (e.g., "Unduh Rekap Excel", "Batal"):** Surface `#FFFFFF`, border `1px solid #CBD5E1`, text `#334155`. Hover: `#F8FAFC` background with border `#94A3B8`.
- **Destructive Button (e.g., "Hapus Catatan"):** Surface `#FEF2F2`, border `1px solid #FCA5A5`, text `#991B1B`.

### Input Fields & Selects
- **Form Groups:** Label is **always explicitly anchored above** the input in `#1F2937` font weight `600` (`13px`). Floating labels or placeholder-only labels are prohibited.
- **Input Field:** Height `42px` (desktop) / `46px` (mobile). Background `#FFFFFF`, border `1px solid #CBD5E1`. Placeholder `#94A3B8`.
- **Focus State:** Border `#13795B`, box-shadow `0 0 0 3px rgba(19, 121, 91, 0.15)`.
- **Validation Message:** Placed directly beneath input in `#991B1B` with an accompanying warning glyph.

### Status Badges
- Defined as compact rectangular chips (`rounded-md`, horizontal padding `8px`, vertical padding `3px`, text `12px`, `font-semibold`).
- Uses the semantic palette defined in Section 2 with 1px explicit border matching its tone (e.g., Hadir: `border: 1px solid #A7F3D0`).

### Tables
- **Container:** Wrapped in a single `1px solid #E2E8F0` border with rounded corners (`12px`) and `overflow-x: auto`.
- **Header:** Background `#F8FAFC`, text `#475569`, `text-transform: uppercase`, `font-semibold`, `12px`, padding `12px 16px`, sticky on scroll.
- **Rows:** Border bottom `1px solid #F1F5F9`. Alternating row zebra stripe: `even:bg-[#FAFBFB]`. Hover state: `#F0FDF4`.
- **Numeric Data:** Tabular font alignment, right-aligned for totals, centered for attendance badges.

### Attendance Check-in Card (Mobile Dedicated Component)
- High-priority operational card featuring live current time with blinking seconds indicator, GPS geofence radius confirmation badge (e.g., "Dalam Radius Madrasah - 42m"), and a full-width high-contrast action button: **"Rekam Kehadiran Masuk"** or **"Rekam Kehadiran Pulang"**.

### Academic Breadcrumb & Filter Bar
- Institutional banner anchoring the top of each view, explicitly indicating: `Nama Madrasah` > `Tahun Ajaran Aktif` > `Semester` > `Kelas / Rombel`. Keeps teachers oriented when managing parallel classes.