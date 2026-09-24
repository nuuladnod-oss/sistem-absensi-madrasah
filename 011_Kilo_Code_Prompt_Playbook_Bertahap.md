# 011 Kilo Code Prompt Playbook — Bertahap per Fase

## Sistem Absensi Madrasah

**Basis:** 001 BRD, 002 FS, 003 Data Model, 004 ERD, 005 Supabase Migration, 006 Stitch UI/UX, 007 UX Blueprint, 008 Development Master Plan, 009 Technical Architecture, 010 Kilo Code Master Instructions

**Cara pakai dokumen ini:**
1. Berikan `010 Kilo Code Master Instructions.md` ke Kilo Code **sekali di awal project** sebagai aturan permanen (system rule).
2. Untuk setiap sesi kerja, copy‑paste **satu task saja** dari dokumen ini (jangan gabung beberapa task).
3. Tunggu Kilo Code memberi *implementation plan* dulu sebelum menyuruh lanjut coding (sesuai workflow Read → Plan → Implement → Test → Review → Commit di 010).
4. Setelah task selesai dan sudah di-review + commit, baru lanjut ke task berikutnya secara berurutan.
5. Jangan lompat fase kecuali task sebelumnya sudah checkpoint (lihat tabel checkpoint di 008 bagian 13).

---

## Batasan Umum (WAJIB disalin ke SETIAP prompt, atau cukup rujuk "ikuti 010 + batasan umum ini")

```text
BATASAN UMUM — BERLAKU UNTUK SEMUA TASK:
- Baca dulu source of truth yang disebutkan sebelum menulis kode apa pun.
- Kerjakan HANYA file/module yang disebutkan di "SCOPE FILE". Jangan menyentuh modul lain.
- Jangan menambahkan fitur, halaman, tombol, atau library yang tidak diminta di task ini.
- Jangan menebak nilai untuk item yang berstatus TBD di 008/010. Jika task ini butuh nilai TBD, STOP dan laporkan, jangan hard-code asumsi.
- Jangan mengubah schema database di luar yang disebutkan di task ini.
- Jangan membuat tabel/entity yang dilarang: effective_schedules, daily_attendance_status, qr_codes, devices.
- Jangan menambahkan: jadwal mata pelajaran, biometrik/selfie, device tracking, notifikasi WhatsApp/email/push eksternal, student self-scan, QR reset, analitik prediktif/AI, fitur chat/social.
- Ikuti struktur folder di 009/010 (components/ui, components/layout, features/<module>, pages, routes, services, hooks, lib, types, utils). Jangan buat folder kosong yang tidak dipakai.
- UI tidak boleh menjadi tempat business rule/authorization — taruh di service layer. RLS tetap jadi lapisan keamanan utama di database, bukan UI hiding.
- Semua state wajib ditangani: idle, loading, success, empty, error (bahasa Indonesia sederhana, tanpa stack trace).
- Semua layar baru harus responsif desktop + Android (touch target ≥48px, form 1 kolom di mobile).
- Jangan commit secret/API key/service role key.
- Akhiri dengan IMPLEMENTATION SUMMARY sesuai format di 010 bagian 44 (jangan klaim test PASS jika tidak benar-benar dijalankan).
- STOP dan minta keputusan jika ada requirement bertentangan, business rule belum ditentukan, atau task butuh perubahan arsitektur besar.
```

Referensi visual (HTML Stitch) yang dipakai sebagai acuan tampilan — bukan acuan business rule — dicantumkan per task di bawah (folder di `UIUX.rar`).

---

## FASE 0 — Foundation

### Task 0.1 — Project Init
```text
TUJUAN:
Inisialisasi project React + TypeScript + Vite + Tailwind, konfigurasi lint/format, environment variable, dan Supabase client, tanpa fitur bisnis apa pun.

SOURCE OF TRUTH: 009 Technical Architecture (bagian 3, 4, 25), 010 (bagian 7, 8).

SCOPE FILE:
- Root config (package.json, vite.config, tsconfig, tailwind.config, eslint/prettier)
- .env.example (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY — kosong)
- src/lib/supabaseClient.ts
- src/routes/ (skeleton kosong, belum ada guard)
- Struktur folder dasar src/ sesuai 009 bagian 4.1 (boleh folder kosong minimum untuk foundation ini saja)

BUSINESS RULES: tidak ada (murni foundation).

ACCEPTANCE CRITERIA:
- npm install, npm run dev, npm run build berhasil tanpa error.
- Tidak ada halaman bisnis, hanya halaman placeholder "App berjalan".
- Supabase client terkonfigurasi dari env var, tidak ada key hardcode.

NON-GOALS: auth, dashboard, master data, fitur apa pun selain foundation.

TESTING: npm run lint, npm run build.

STOP CONDITION: Berhenti setelah app berjalan lokal dan build sukses (checkpoint C0).
```

### Task 0.2 — Shared UI Component Library
```text
TUJUAN:
Membuat 8 komponen UI reusable sesuai 007 bagian 3, tanpa business logic modul spesifik.

SOURCE OF TRUTH: 007 (bagian 3, StatusBadge contoh kode), 009 (bagian 4.2).
REFERENSI VISUAL: UIUX folder `pustaka_komponen_reusable_absensi_madrasah`.

SCOPE FILE:
- src/components/ui/Button.tsx (varian primary, secondary, danger, outline)
- src/components/ui/StatusBadge.tsx (8 status sesuai kode di 007)
- src/components/ui/GeofenceIndicator.tsx
- src/components/ui/MetricCard.tsx
- src/components/ui/PageHeader.tsx
- src/components/ui/ResponsiveTable.tsx
- src/components/ui/ModalConfirm.tsx
- src/components/ui/StateAlert.tsx

BUSINESS RULES: label status harus persis 8 status di 007 (Hadir, Terlambat, Pulang Cepat, Belum Absen Pulang, Alpa, Izin Resmi, Sakit, Menunggu Approval).

ACCEPTANCE CRITERIA:
- Setiap komponen punya props jelas, tanpa fetch data/business logic di dalamnya.
- Warna Emerald (#13795b) dicadangkan untuk primary action saja.

NON-GOALS: AppShell/navigasi (task terpisah), halaman fitur apa pun.

TESTING: lint, build, storybook/manual render check jika tersedia.

STOP CONDITION: Berhenti setelah 8 komponen selesai dan dapat di-render tanpa error.
```

### Task 0.3 — AppShell & Navigasi Responsif
```text
TUJUAN:
Membangun AppShell, TopNavBar, MobileBottomNav untuk desktop (sidebar) dan mobile (bottom nav), tanpa route bisnis nyata (gunakan placeholder route).

SOURCE OF TRUTH: 007 (bagian 3), 009 (bagian 6).
REFERENSI VISUAL: UIUX folder `app_shell_sistem_navigasi_responsif_absensi_madrasah`.

SCOPE FILE:
- src/components/layout/AppShell.tsx
- src/components/layout/TopNavBar.tsx
- src/components/layout/MobileBottomNav.tsx
- src/layouts/ (jika diperlukan komposisi)

BUSINESS RULES: badge periode akademik aktif harus punya slot tampilan di TopNavBar meski datanya masih dummy/placeholder (data asli baru ada di Fase 3).

ACCEPTANCE CRITERIA:
- Sidebar desktop persisten, bottom nav mobile satu jempol.
- Layout tidak rusak di 390x844 (Android) dan desktop.

NON-GOALS: route guard/auth (Fase 1), data periode nyata (Fase 3).

TESTING: lint, build, cek responsif manual desktop + mobile width.

STOP CONDITION: Berhenti setelah shell dan navigasi berjalan dengan placeholder content.
```

---

## FASE 1 — Authentication & Authorization

### Task 1.1 — Login & Session Handling
```text
TUJUAN:
Implementasi login/logout dan session handling menggunakan Supabase Auth. Tidak membuat pendaftaran mandiri, OAuth pihak ketiga, atau biometrik.

SOURCE OF TRUTH: 007 (bagian 2.1), 009 (bagian 7).
REFERENSI VISUAL: UIUX folder `layar_login_sistem_absensi_madrasah`.

SCOPE FILE:
- src/features/auth/ (pages, services, hooks)
- src/routes/ (tambah route /login saja)

BUSINESS RULES:
- Satu tombol aksi: "Masuk ke Sistem".
- User nonaktif tidak bisa login walau kredensial benar → pesan "Akun Anda dinonaktifkan. Hubungi Admin."
- Pesan error salah kredensial: "Email atau kata sandi tidak cocok".
- State session: loading, authenticated, unauthenticated, expired/error wajib ada.

ACCEPTANCE CRITERIA:
- Login sukses menyimpan session dan redirect ke area yang sesuai (boleh placeholder dashboard).
- Logout menghapus session.
- User nonaktif ditolak sesuai pesan di atas.

NON-GOALS: role resolution/authorization helper (task 1.2), dashboard, modul lain.

TESTING: lint, build, test login sukses/gagal/user nonaktif.

STOP CONDITION: Berhenti setelah login/logout/session berjalan dan diverifikasi manual.
```

### Task 1.2 — Role Resolution, Authorization Helper & Route Guard
```text
TUJUAN:
Setelah login, load user profile + roles (multi-role), bangun authorization context/helper terpusat, dan route guard (authentication + authorization).

SOURCE OF TRUTH: 009 (bagian 6, 8), 010 (bagian 5 - Multi-role dan Period).

SCOPE FILE:
- src/services/authService.ts
- src/services/authorizationService.ts
- src/routes/ (guard logic)
- src/hooks/ (mis. useAuth, useAuthorization)

BUSINESS RULES:
- Satu user dapat memiliki lebih dari satu role (Admin, Guru, Wali Kelas, Siswa, Kepala Madrasah).
- Guru dapat menjadi Wali Kelas (role tambahan), jangan asumsikan 1 user = 1 role.
- Authorization helper harus reusable, jangan disalin ke tiap halaman.

ACCEPTANCE CRITERIA:
- Route role-protected (admin/*, teacher/*, homeroom/*, student/*, headmaster/*) menolak akses role yang tidak berhak.
- User dengan multi-role dapat mengakses semua area sesuai role yang dimiliki.

NON-GOALS: UI dashboard per-role (Fase 10), modul lain.

TESTING: lint, build, test akses per role (positif & negatif).

STOP CONDITION: Berhenti setelah role resolution + guard teruji (checkpoint C1).
```

---

## FASE 2 — Master Data

> Urutan wajib sesuai 008 bagian 8 Phase 2: Madrasah → User/account → Guru → Siswa → Kelas/rombel → Membership → Wali kelas.

### Task 2.1 — Dashboard Admin Foundation (shell kosong)
```text
TUJUAN:
Membuat halaman dashboard Admin sebagai kerangka (4 metric card placeholder + tabel kosong), belum ada data nyata.

REFERENSI VISUAL: UIUX folder `dashboard_operasional_admin_absensi_madrasah`.
SCOPE FILE: src/features/admin/ atau src/pages/admin/dashboard

NON-GOALS: data nyata (isi dari Fase 10), CRUD master data (task lain di fase ini).

ACCEPTANCE CRITERIA: halaman dapat diakses role Admin saja, state empty ditampilkan dengan benar.

TESTING: lint, build, cek route guard admin.
STOP CONDITION: setelah shell dashboard tampil dengan state empty.
```

### Task 2.2 — Madrasah (CRUD Tunggal)
```text
TUJUAN: CRUD data Madrasah (nama, alamat, lat/long, geofence_radius_meter default 200, max_gps_accuracy_meter default 30).

SOURCE OF TRUTH: 003 Data Model, 004 ERD (tabel madrasah), 010 bagian 5 (radius 200m, akurasi 30m).
SCOPE FILE: src/features/madrasah/

BUSINESS RULES:
- geofence_radius_meter default 200, max_gps_accuracy_meter default 30 (nilai ini adalah default konfigurasi, BUKAN nilai yang boleh diubah bebas tanpa alasan — konfirmasikan ke user jika FS/BRD punya aturan lain).

ACCEPTANCE CRITERIA: CRUD berjalan, hanya Admin yang bisa akses.
NON-GOALS: modul lain.
TESTING: lint, build, RLS check (hanya Admin).
STOP CONDITION: setelah CRUD madrasah selesai dan RLS diverifikasi.
```

### Task 2.3 — Manajemen Pengguna (User & Role Assignment)
```text
TUJUAN: CRUD user (users, user_roles), Admin dapat membuat akun dan menetapkan role (bisa lebih dari satu).

SOURCE OF TRUTH: 003, 004 (tabel users, roles, user_roles).
REFERENSI VISUAL: UIUX folder `manajemen_pengguna_sistem_absensi_madrasah`.
SCOPE FILE: src/features/users/

BUSINESS RULES: tidak ada pendaftaran mandiri publik; akun dibuat terpusat oleh Admin; multi-role didukung.

ACCEPTANCE CRITERIA: Admin dapat create/deactivate user dan assign/remove role.
NON-GOALS: profil guru/siswa detail (task terpisah 2.4/2.5).
TESTING: lint, build, RLS (Admin only write, user hanya baca profil sendiri).
STOP CONDITION: setelah user & role management selesai.
```

### Task 2.4 — Master Data Guru
```text
TUJUAN: CRUD data Guru (teachers) terkait ke users & madrasah.
SOURCE OF TRUTH: 003, 004 (tabel teachers).
REFERENSI VISUAL: UIUX folder `master_data_penugasan_sistem_absensi_madrasah` (bagian guru).
SCOPE FILE: src/features/teachers/
ACCEPTANCE CRITERIA: CRUD guru berjalan, terikat madrasah, nik unik.
NON-GOALS: kelas/wali kelas (task 2.6), siswa (task 2.5).
TESTING: lint, build, RLS.
STOP CONDITION: setelah CRUD guru selesai.
```

### Task 2.5 — Master Data Siswa
```text
TUJUAN: CRUD data Siswa (students) terkait ke users & madrasah, nisn unik (basis QR statis nanti di Fase 6).
SOURCE OF TRUTH: 003, 004 (tabel students).
REFERENSI VISUAL: UIUX folder `master_data_penugasan_sistem_absensi_madrasah` (bagian siswa).
SCOPE FILE: src/features/students/
ACCEPTANCE CRITERIA: CRUD siswa berjalan, nisn unik dan tervalidasi.
NON-GOALS: QR generation/scanning (Fase 6), kelas (task 2.6).
TESTING: lint, build, RLS.
STOP CONDITION: setelah CRUD siswa selesai.
```

### Task 2.6 — Kelas, Membership, dan Wali Kelas
```text
TUJUAN: CRUD classes, student_class_memberships (riwayat, tidak menimpa), class_homeroom_assignments (wali kelas, history).

SOURCE OF TRUTH: 003, 004 (bagian relationship rules classes/memberships/homeroom).
REFERENSI VISUAL: UIUX folder `master_data_penugasan_sistem_absensi_madrasah`.
SCOPE FILE: src/features/classes/

BUSINESS RULES:
- Riwayat kelas siswa TIDAK ditimpa (insert record baru dengan start_date/end_date, bukan update in place).
- Guru dapat ditugaskan sebagai wali kelas (role tambahan, bukan role baru).
- Semua entity ini period-scoped, wajib academic_period_id (meski Fase 3 belum selesai, gunakan kolom FK yang sudah ada di schema — data periode nyata baru diisi begitu Fase 3 ready).

ACCEPTANCE CRITERIA: kelas dapat dibuat, siswa dapat dipindah kelas tanpa menghapus histori, wali kelas dapat ditetapkan/diganti dengan histori tercatat.

NON-GOALS: academic period CRUD (Fase 3), schedule (Fase 4).
TESTING: lint, build, RLS, test period isolation dasar.
STOP CONDITION: setelah checkpoint C2 (data master + period isolation dasar terjaga).
```

---

## FASE 3 — Academic Period

### Task 3.1 — Academic Period CRUD & Active Period
```text
TUJUAN: CRUD academic_periods, mekanisme "satu periode aktif per madrasah", dan period context yang dipakai modul lain.

SOURCE OF TRUTH: 003, 004 (constraint 1 active period per madrasah).
REFERENSI VISUAL: UIUX folder `manajemen_periode_akademik_sistem_absensi_madrasah`.
SCOPE FILE: src/features/periods/, src/services/academicPeriodService.ts

BUSINESS RULES: hanya boleh ada satu is_active=true per madrasah; badge periode aktif tampil di TopNavBar (slot sudah dibuat di Task 0.3).

ACCEPTANCE CRITERIA: switch periode aktif berjalan, validasi mencegah dua periode aktif sekaligus, badge TopNavBar menampilkan data asli.

NON-GOALS: schedule (Fase 4), modul lain.
TESTING: lint, build, test validasi satu periode aktif.
STOP CONDITION: checkpoint C3 (data periodik tidak bercampur).
```

---

## FASE 4 — Schedule Engine

### Task 4.1 — CRUD Jadwal (Standard, Special Calendar, Teacher Override)
```text
TUJUAN: CRUD standard_schedules, special_calendar_dates, teacher_schedule_overrides — hanya jam datang & jam pulang, TIDAK ADA jadwal mata pelajaran.

SOURCE OF TRUTH: 003, 004 (bagian 4 Effective Schedule).
REFERENSI VISUAL: UIUX folder `manajemen_jadwal_kehadiran_sistem_absensi_madrasah`.
SCOPE FILE: src/features/schedules/

BUSINESS RULES:
- Override datang tidak boleh lebih awal dari standar; override pulang tidak boleh lebih akhir dari standar.
- Tidak membuat tabel effective_schedules — ini murni master data mentah.

ACCEPTANCE CRITERIA: CRUD 3 tabel berjalan dengan validasi override di atas.
NON-GOALS: service resolusi effective schedule (task 4.2).
TESTING: lint, build, test validasi batas override.
STOP CONDITION: setelah CRUD jadwal selesai.
```

### Task 4.2 — Effective Schedule Service (Pure Logic)
```text
TUJUAN: Implementasi service getEffectiveSchedule(date, teacherId, academicPeriodId) sebagai SATU sumber aturan jadwal efektif, tanpa UI baru.

SOURCE OF TRUTH: 004 bagian 4 (alur resolusi), 009 bagian 13.
SCOPE FILE: src/services/effectiveScheduleService.ts, unit test terkait.

BUSINESS RULES — urutan resolusi wajib:
```
special_calendar_dates → holiday? → yes: no attendance
                                   → no: special schedule / teacher override → standard schedule
```
Tidak boleh disimpan sebagai tabel fisik, harus dihitung setiap kali dipanggil (boleh cache in-memory per request jika perlu, tanpa tabel baru).

ACCEPTANCE CRITERIA: service mengembalikan jadwal efektif yang benar untuk semua kombinasi kasus (hari libur, kalender khusus, override guru, jadwal standar).

NON-GOALS: UI, attendance flow (Fase 5/6).
TESTING: unit test untuk tiap cabang resolusi (wajib, karena ini logic berisiko tinggi).
STOP CONDITION: checkpoint C4 (effective schedule teruji).
```

---

## FASE 5 — Teacher Attendance (Presensi Mandiri Guru)

### Task 5.1 — Geofence Service (Pure Logic)
```text
TUJUAN: Implementasi geofenceService — hitung jarak GPS ke titik madrasah dan validasi radius + akurasi, tanpa UI.

SOURCE OF TRUTH: 010 bagian 5 (radius 200m, akurasi ≤30m).
SCOPE FILE: src/services/geofenceService.ts + unit test.

BUSINESS RULES: default radius 200m, akurasi GPS wajib ≤30m; jangan menyimpan device info apa pun (hanya lat/long/accuracy/distance).

ACCEPTANCE CRITERIA: fungsi distance calculation & validasi radius/akurasi teruji dengan berbagai kasus (dalam radius, luar radius, akurasi buruk).
NON-GOALS: UI presensi (task 5.2).
TESTING: unit test wajib (business-critical).
STOP CONDITION: setelah geofenceService lulus unit test.
```

### Task 5.2 — Presensi Mandiri Guru (UI & Flow)
```text
TUJUAN: Implementasi flow presensi datang & pulang mandiri guru menggunakan geofenceService dan effectiveScheduleService yang sudah ada.

SOURCE OF TRUTH: 007 bagian 2.2, 008 Phase 5.
REFERENSI VISUAL: UIUX folder `presensi_mandiri_guru_sistem_absensi_madrasah`.
SCOPE FILE: src/features/attendance/ (bagian teacher self-attendance), src/services/teacherAttendanceService.ts

BUSINESS RULES:
- Satu tombol aksi utama "Catat Presensi Datang Sekarang" (tinggi 56px).
- Setelah presensi datang sukses, tombol berubah nonaktif menampilkan jam buka presensi pulang (gunakan jam server, JANGAN hardcode jam — ambil dari effective schedule; jika jam buka/tutup scan belum diputuskan di TBD, STOP dan laporkan).
- Duplicate attendance (guru + tanggal + kategori) harus dicegah di database.
- Tidak ada kolom selfie/biometrik/device info.

ACCEPTANCE CRITERIA: guru dapat presensi datang & pulang sesuai kondisi geofence/akurasi, duplicate ditolak dengan pesan jelas.

NON-GOALS: QR siswa (Fase 6), status harian/Alpa (Fase 7).
TESTING: lint, build, test duplicate prevention, test radius/akurasi gagal & sukses.
STOP CONDITION: checkpoint C5.
```

---

## FASE 6 — Student QR Attendance

### Task 6.1 — QR Scan & Verifikasi Manual (UI)
```text
TUJUAN: Kamera scan QR statis (NISN), tampilkan kartu verifikasi (foto, NISN, nama, rombel), tombol konfirmasi manual oleh Guru.

SOURCE OF TRUTH: 007 bagian 2.3, 010 bagian 5 (Student QR).
REFERENSI VISUAL: UIUX folder `pemindai_qr_siswa_sistem_absensi_madrasah`.
SCOPE FILE: src/features/attendance/ (bagian student QR), komponen scanner.

BUSINESS RULES:
- QR statis berbasis NISN, tidak ada reset QR.
- Siswa TIDAK boleh scan mandiri — hanya guru yang mengoperasikan scanner.
- Tidak ada filter kelas yang memperlambat antrean, tidak ada ganti kamera depan/belakang.

ACCEPTANCE CRITERIA: scan berhasil menampilkan kartu verifikasi ≤300ms (best effort), tombol "Verifikasi Cocok & Simpan" mengirim data ke service.

NON-GOALS: logic penyimpanan/duplicate (task 6.2).
TESTING: lint, build, test parsing QR valid/invalid.
STOP CONDITION: setelah UI scan & verifikasi berjalan.
```

### Task 6.2 — Student Attendance Service
```text
TUJUAN: Implementasi studentAttendanceService — simpan attendance siswa dengan GPS milik guru pemindai, scanner_teacher_id wajib terisi, cegah duplicate.

SOURCE OF TRUTH: 004 bagian 3.2 (scanner wajib untuk siswa), 010 bagian 5.

SCOPE FILE: src/services/studentAttendanceService.ts

BUSINESS RULES:
- scanner_teacher_id wajib terisi untuk attendance siswa.
- GPS yang dicatat adalah GPS perangkat guru, bukan siswa.
- Duplicate (student_id + attendance_date + category) dicegah di database.
- Banner "Presensi datang [Nama] sudah tercatat pukul HH:MM" jika duplicate.

ACCEPTANCE CRITERIA: penyimpanan attendance siswa lengkap dengan scanner_teacher_id, duplicate ditolak dengan pesan sesuai.

NON-GOALS: daily status/Alpa (Fase 7).
TESTING: lint, build, test duplicate & test scanner_teacher_id wajib ada.
STOP CONDITION: checkpoint C6.
```

---

## FASE 7 — Daily Status & Auto-Alpa

### Task 7.1 — Attendance Status Service (Derived, Pure Logic)
```text
TUJUAN: Service untuk menghitung status harian (Hadir, Terlambat, Pulang Cepat, Belum Absen Pulang, Alpa, status izin) dari attendance_records + effective schedule + leave_requests. TIDAK membuat tabel status.

SOURCE OF TRUTH: 004 bagian 5.5, 010 bagian 5 (Attendance Status).
SCOPE FILE: src/services/attendanceStatusService.ts + unit test.

BUSINESS RULES:
- Status adalah hasil hitung, bukan disimpan sebagai source of truth baru.
- "Belum Absen Pulang" = ada datang, tidak ada pulang.
- Jika grace period/batas Pulang Cepat/jam buka-tutup scan BELUM ada di keputusan final (lihat 010 bagian 6), STOP dan minta keputusan sebelum hard-code angka.

ACCEPTANCE CRITERIA: fungsi status teruji untuk semua kombinasi data attendance + jadwal + izin, tanpa menebak nilai TBD.

NON-GOALS: Auto-Alpa trigger (task 7.2), UI.
TESTING: unit test wajib untuk tiap kombinasi status.
STOP CONDITION: berhenti dan laporkan jika ada TBD yang belum diputuskan; jika semua sudah jelas, lanjut sampai unit test lulus.
```

### Task 7.2 — Auto-Alpa (setelah periode absensi berakhir)
```text
TUJUAN: Mekanisme penetapan Alpa otomatis setelah periode absensi harian berakhir, memakai attendanceStatusService dari task 7.1.

SOURCE OF TRUTH: 010 bagian 5 (Alpa diproses setelah periode absensi berakhir).
SCOPE FILE: bergantung keputusan (bisa scheduled job/edge function ATAU dihitung on-read; JANGAN pilih sendiri arsitektur job tanpa konfirmasi jika 009 belum menetapkan mekanisme cron).

BUSINESS RULES: Alpa = tidak ada datang & tidak ada pulang pada hari aktif setelah window absensi berakhir.

ACCEPTANCE CRITERIA: status Alpa muncul konsisten setelah window berakhir, tanpa duplicate table status.

NON-GOALS: dashboard/report (Fase 10).
TESTING: test skenario tidak ada attendance sama sekali dan hanya ada datang tanpa pulang.
STOP CONDITION: checkpoint C7. STOP lebih awal jika jam/window belum final (rujuk TBD #3/#4/#5 di 010).
```

---

## FASE 8 — Leave & Approval

### Task 8.1 — Pengajuan Izin (Guru & Siswa)
```text
TUJUAN: Form pengajuan izin 4 input (Jenis Izin, Tanggal Mulai, Tanggal Selesai, Alasan) + 1 lampiran opsional.

SOURCE OF TRUTH: 007 bagian 2.4, 010 bagian 5 (Leave dan Approval).
REFERENSI VISUAL: UIUX folder `alur_perizinan_approval_sistem_absensi_madrasah`.
SCOPE FILE: src/features/leave/ (submission), src/services/leaveService.ts

BUSINESS RULES:
- Mendukung tanggal lampau dan rentang tanggal, tanpa batas deadline.
- Lampiran maksimal sesuai keputusan final (jika ukuran/format/jumlah belum diputuskan — TBD #7 — STOP dan tanya, jangan asumsikan 2MB/PDF/JPG dari 007 sebagai final tanpa konfirmasi eksplisit user).

ACCEPTANCE CRITERIA: leave_requests tersimpan dengan owner XOR (student_id atau teacher_id, tidak keduanya).

NON-GOALS: approval flow (task 8.2).
TESTING: lint, build, test owner XOR, test tanggal lampau.
STOP CONDITION: setelah form submission selesai.
```

### Task 8.2 — Approval Flow (Wali Kelas / Kepala Madrasah / Admin)
```text
TUJUAN: Implementasi approval: Wali Kelas untuk izin siswa, Kepala Madrasah untuk izin guru, Admin sebagai replacement approver.

SOURCE OF TRUTH: 007 bagian 2.4, 010 bagian 5.
REFERENSI VISUAL: UIUX folder `alur_perizinan_approval_sistem_absensi_madrasah`.
SCOPE FILE: src/features/leave/ (approval), src/services/approvalService.ts

BUSINESS RULES:
- Dua tombol: Setujui (hijau) dan Tolak (outline).
- Approval memengaruhi status kehadiran sesuai jenis izin (gunakan attendanceStatusService dari Fase 7, jangan duplikasi logic status di sini).
- Pembatalan approval oleh Admin: jika "siapa yang dapat membatalkan approval dan dampaknya" (TBD #6) belum diputuskan final, STOP dan konfirmasi sebelum implementasi tombol batal — 007 menyebut kembali ke "Izin Menunggu Approval" tapi ini perlu dikonfirmasi sebagai keputusan final, bukan asumsi.

ACCEPTANCE CRITERIA: approval history tercatat di leave_approvals, status kehadiran ter-update sesuai hasil approval.

NON-GOALS: correction/audit (Fase 9).
TESTING: lint, build, test approval per role, test replacement approver oleh Admin.
STOP CONDITION: checkpoint C8.
```

---

## FASE 9 — Correction & Audit

### Task 9.1 — Correction Request (Guru) & Review (Admin)
```text
TUJUAN: Guru mengajukan koreksi jam/status presensi (2 kolom: jam usulan, alasan opsional); Admin review dan apply perubahan.

SOURCE OF TRUTH: 007 bagian 2.5, 010 bagian 5 (Correction).
REFERENSI VISUAL: UIUX folder `koreksi_audit_presensi_sistem_absensi_madrasah`.
SCOPE FILE: src/features/corrections/, src/services/correctionService.ts

BUSINESS RULES:
- Guru TIDAK boleh mengubah attendance langsung, hanya request.
- Admin dapat langsung edit attendance (direct edit) selain dari alur correction request.
- Tampilan Before vs After 2 kolom (merah/hijau).

ACCEPTANCE CRITERIA: attendance_correction_requests tersimpan, Admin dapat approve & apply, status attendance ter-update.

NON-GOALS: audit log viewer (task 9.2).
TESTING: lint, build, test guru tidak bisa edit langsung (authorization negatif).
STOP CONDITION: setelah correction request & apply berjalan.
```

### Task 9.2 — Audit Trail
```text
TUJUAN: Mencatat audit_logs untuk perubahan penting (correction, direct edit attendance, approval) dan viewer audit untuk Admin/Kepala Madrasah.

SOURCE OF TRUTH: 004, 009 bagian 19.
SCOPE FILE: src/services/auditService.ts, src/features/audit/

BUSINESS RULES: audit minimal mencatat actor, timestamp, entity, before, after; visibility hanya Admin & Kepala Madrasah; tidak boleh log IP/user-agent/stack trace teknis ke tampilan user.

ACCEPTANCE CRITERIA: setiap correction/edit/approval penting tercatat di audit_logs dan tampil di viewer sesuai role.

NON-GOALS: reports (Fase 10).
TESTING: lint, build, test visibility role (negatif untuk role selain Admin/Kepala Madrasah).
STOP CONDITION: checkpoint C9.
```

---

## FASE 10 — Dashboard & Reports

### Task 10.1 — Shared Report/Dashboard Query Service
```text
TUJUAN: Bangun reportService sebagai satu sumber query metrik (on-time, late, leave/sick, absent) yang dipakai semua dashboard — dashboard tidak boleh menghitung sendiri.

SOURCE OF TRUTH: 009 bagian 20-21.
SCOPE FILE: src/services/reportService.ts

ACCEPTANCE CRITERIA: query dapat difilter by role/kelas/tanggal/madrasah dan mengembalikan 4 metrik inti secara konsisten.
NON-GOALS: UI dashboard (task 10.2), export (Fase 11).
TESTING: unit/integration test query dengan berbagai filter.
STOP CONDITION: setelah service query lulus test dasar.
```

### Task 10.2 — Dashboard per Role (satu task per role, jangan digabung)
```text
TUJUAN: Implementasi 1 dashboard role per task, menggunakan reportService dari task 10.1 + komponen MetricCard/ResponsiveTable/StatusBadge yang sudah ada.

Lakukan sebagai 5 task terpisah:
- Task 10.2a Dashboard Guru — UIUX `dashboard_guru_sistem_absensi_madrasah`
- Task 10.2b Dashboard Wali Kelas — UIUX `dashboard_wali_kelas_sistem_absensi_madrasah`
- Task 10.2c Dashboard Admin — UIUX `dashboard_admin_sistem_absensi_madrasah`
- Task 10.2d Dashboard Kepala Madrasah — UIUX `dashboard_kepala_madrasah_sistem_absensi_madrasah`
- Task 10.2e Dashboard Siswa — UIUX `dashboard_siswa_sistem_absensi_madrasah`

SOURCE OF TRUTH: 007 bagian 2.6.
SCOPE FILE per task: src/features/dashboard/<role>/ (hanya folder role yang sedang dikerjakan)

BUSINESS RULES: 4 Metric Card utama (Hadir Tepat Waktu, Terlambat, Izin/Sakit, Alpa); tanpa grafik 3D/radar/statistik dekoratif.

ACCEPTANCE CRITERIA: dashboard menampilkan data nyata sesuai scope role (bukan dummy).
NON-GOALS: modul dashboard role lain dalam task yang sama; pusat laporan (task 10.3).
TESTING: lint, build, RLS/scope check per role.
STOP CONDITION: setelah 1 dashboard role selesai — lanjut task berikutnya secara terpisah.
```

### Task 10.3 — Pusat Laporan (Report Center)
```text
TUJUAN: Halaman laporan dengan filter Rombel/Tanggal dan tabel data harian, menggunakan reportService.

SOURCE OF TRUTH: 007 bagian 2.6.
REFERENSI VISUAL: UIUX folder `pusat_laporan_presensi_sistem_absensi_madrasah`.
SCOPE FILE: src/features/reports/

ACCEPTANCE CRITERIA: filter berjalan, tabel dapat pagination, tidak ada tombol export di task ini (Fase 11).
NON-GOALS: export Excel/PDF (Fase 11).
TESTING: lint, build.
STOP CONDITION: checkpoint C10 (bersama task import/export selesai sebagian, lanjut Fase 11).
```

---

## FASE 11 — Import / Export

### Task 11.1 — Import Excel (Guru/Siswa)
```text
TUJUAN: Upload template Excel, parse, validasi schema & row data, preview hasil, simpan sebagai import_batches + import_errors.

SOURCE OF TRUTH: 009 bagian 22.
REFERENSI VISUAL: UIUX folder `import_excel_data_master_sistem_absensi_madrasah`.
SCOPE FILE: src/features/imports/, src/services/importService.ts

BUSINESS RULES: import tidak boleh membuat database setengah valid tanpa laporan hasil; error per baris dicatat di import_errors.

ACCEPTANCE CRITERIA: import batch sukses/gagal sebagian ditampilkan dengan rincian error per baris.
NON-GOALS: export (task 11.2).
TESTING: lint, build, test file valid, file invalid, file campuran valid/invalid.
STOP CONDITION: setelah import guru & siswa berjalan.
```

### Task 11.2 — Export Excel/PDF
```text
TUJUAN: Tombol export dari Pusat Laporan (task 10.3) ke Excel (10 kolom baku) dan PDF A4 Landscape.

SOURCE OF TRUTH: 007 bagian 2.6, 010 TBD #8 (layout export).
REFERENSI VISUAL: UIUX folder `ekspor_laporan_presensi_sistem_absensi_madrasah`.
SCOPE FILE: src/features/reports/ (export handler)

BUSINESS RULES: business filtering dilakukan sebelum formatting export; JANGAN mengarang layout kolom PDF/Excel jika belum ada keputusan final — konfirmasikan 10 kolom baku yang dimaksud ke user dulu.

ACCEPTANCE CRITERIA: export menghasilkan file sesuai filter yang aktif di Pusat Laporan.
NON-GOALS: scheduled/automated export via email (dilarang di scope).
TESTING: lint, build, test export dengan filter berbeda.
STOP CONDITION: checkpoint C10 selesai penuh (report + export).
```

---

## FASE 12 — Hardening

### Task 12.1 — RLS Review & Negative Authorization Test
```text
TUJUAN: Review seluruh RLS policy terhadap authorization helper, period scope, dan ownership; tambahkan test negatif per role.

SOURCE OF TRUTH: 009 bagian 11, 010 bagian 37.
SCOPE FILE: supabase/migrations/ (policy baru bila perlu), tests/

BUSINESS RULES: tidak boleh ada policy "allow all authenticated users"; temporary permissive policy dianggap blocker produksi.

ACCEPTANCE CRITERIA: setiap tabel sensitif punya jawaban jelas untuk SELECT/INSERT/UPDATE/DELETE per role; test negatif lulus.
NON-GOALS: fitur baru.
TESTING: integration test RLS per role, termasuk percobaan akses yang seharusnya ditolak.
STOP CONDITION: setelah semua tabel utama tervalidasi RLS-nya.
```

### Task 12.2 — Responsive & Edge State Pass
```text
TUJUAN: Audit seluruh layar terhadap 18 status sistem (loading, empty, error, GPS denied/akurasi, duplicate, invalid QR, holiday, dll) dan responsivitas desktop/Android.

REFERENSI VISUAL: UIUX folder `katalog_standarisasi_status_responsivitas_absensi_madrasah`.
SCOPE FILE: perbaikan kecil per komponen/halaman yang kurang (jangan restrukturisasi besar).

ACCEPTANCE CRITERIA: semua state di katalog memiliki tampilan yang sesuai standar.
NON-GOALS: fitur baru.
TESTING: manual pass per state + regression test modul terkait.
STOP CONDITION: setelah katalog status terpenuhi.
```

### Task 12.3 — Final Build, Security & Regression Gate
```text
TUJUAN: Jalankan gate rilis sebelum deployment: build, lint, test, functional smoke test, auth test, role test, RLS/security test, critical attendance test, responsive check.

SOURCE OF TRUTH: 009 bagian 30.
ACCEPTANCE CRITERIA: semua gate PASS, tidak ada secret di repo, tidak ada TBD yang diam-diam diasumsikan.
NON-GOALS: fitur baru.
TESTING: full regression suite.
STOP CONDITION: checkpoint C11 → siap lanjut ROADMAP Tahap 9 (Deployment ke Vercel).
```

---

## Catatan Penting

- Daftar TBD (grace period, batas pulang cepat, jam buka/tutup scan, aturan pembatalan approval, detail lampiran, layout export, detail dashboard, aturan notifikasi) di 008/010 **harus diputuskan lebih dulu** (buat Implementation Decision Record) sebelum task yang bergantung padanya dijalankan sampai selesai — task terkait di atas sudah ditandai dengan peringatan STOP.
- Setiap task di atas sebaiknya = 1 commit/1 branch feature (`feature/<module-name>`), sesuai 008 bagian 12.
- Jika Kilo Code mengusulkan library baru di task mana pun, jawab dulu 6 pertanyaan di 009 bagian 31 sebelum menyetujui.
