# 008 Development Master Plan

## Sistem Absensi Madrasah

**Versi:** 1.0  
**Status:** Baseline Development Plan  
**Basis:** BRD Final v1.3, Functional Specification Final v2.0, Data Model Specification v1.0, ERD v1.0, Supabase Migration v1.0, Stitch UI/UX Prompt Plan, Final UX Simplification & Implementation Blueprint  
**Tujuan:** menjadi jembatan resmi dari analisis dan desain UI/UX menuju implementasi di VS Code menggunakan Kilo Code.

---

## 1. Tujuan Dokumen

Dokumen ini menetapkan cara pengembangan aplikasi agar implementasi tetap konsisten dengan kebutuhan yang sudah disetujui.

Dokumen ini bukan pengganti BRD, Functional Specification, Data Model, ERD, atau UI/UX. Dokumen ini mengatur **urutan implementasi, pembagian pekerjaan, aturan vibe coding, checkpoint, testing, dan definition of done**.

Prinsip utama:

1. Jangan langsung meminta AI membangun seluruh aplikasi.
2. Kerjakan satu modul atau satu workflow pada satu waktu.
3. Setiap perubahan harus dapat ditelusuri ke BRD/FS/Data Model/UX.
4. Setelah satu task selesai: review → test → commit.
5. Jangan membawa fitur yang hanya muncul dari hasil improvisasi AI/Stitch jika tidak ada di scope.
6. Business rule yang belum diputuskan tetap menjadi TBD dan tidak boleh ditebak oleh AI.

---

## 2. Sumber Acuan dan Prioritas

Urutan acuan ketika terjadi pertanyaan implementasi:

1. BRD Final.
2. Functional Specification Final.
3. Data Model Specification.
4. ERD.
5. Supabase migration/schema yang telah disetujui.
6. Final UX Simplification & Implementation Blueprint.
7. Stitch UI/UX output sebagai referensi visual/interaction.
8. Technical Architecture dan dokumen development ini.

Jika dua dokumen berbeda, jangan diam-diam memilih. Tandai sebagai **implementation decision/TBD** dan selesaikan sebelum kode bergantung pada keputusan tersebut.

---

## 3. Scope MVP

### 3.1 Modul utama

- Authentication.
- User dan role management.
- Madrasah.
- Guru.
- Siswa.
- Kelas/rombel.
- Academic period.
- Jadwal datang/pulang.
- Kalender khusus/hari libur.
- Teacher schedule override.
- Presensi mandiri Guru berbasis GPS/geofence.
- Presensi Siswa melalui QR statis yang dipindai Guru.
- Perizinan Guru dan Siswa.
- Approval.
- Koreksi presensi.
- Audit trail.
- Dashboard role-based.
- Laporan.
- Import Excel Guru/Siswa.
- Export Excel/PDF.

### 3.2 Batasan yang wajib dipertahankan

Tidak membuat:

- jadwal mata pelajaran;
- subject timetable;
- biometrik;
- selfie untuk presensi;
- device tracking;
- penyimpanan device information;
- WhatsApp/email/push notification sebagai kanal eksternal;
- student self-scan;
- QR reset;
- entity `qr_codes` untuk MVP;
- entity `effective_schedules` sebagai tabel fisik;
- entity `daily_attendance_status` sebagai source of truth;
- complex analytics/predictive AI;
- chat/social feature.

---

## 4. Business Rules Kritis

Implementasi harus mempertahankan antara lain:

- radius geofence default 200 meter;
- akurasi GPS harus memenuhi batas 30 meter;
- GPS wajib untuk absensi berbasis lokasi;
- Guru melakukan absensi mandiri;
- Guru memindai QR Siswa;
- QR bersifat statis dan berisi NISN;
- Guru melakukan verifikasi manual kepemilikan QR;
- GPS scan Siswa berasal dari perangkat Guru;
- scan kategori yang sama tidak boleh ganda;
- absen pulang wajib;
- `Belum Absen Pulang` berarti ada datang tetapi tidak ada pulang;
- `Alpa` berarti tidak ada datang dan tidak ada pulang pada hari aktif, setelah periode absensi berakhir;
- Guru tidak mengubah presensi langsung;
- Guru dapat mengajukan koreksi;
- Admin dapat mengubah presensi;
- koreksi dicatat dalam audit trail;
- audit hanya untuk Admin dan Kepala Madrasah;
- override datang tidak boleh lebih awal dari standar;
- override pulang tidak boleh lebih akhir dari standar;
- izin dapat menggunakan tanggal sebelumnya dan rentang tanggal;
- Admin dapat menjadi pengganti approver;
- user dapat memiliki multi-role;
- Guru dapat menjadi Wali Kelas;
- data terisolasi berdasarkan academic period;
- approval izin memengaruhi status kehadiran sesuai jenis izin.

---

## 5. Functional Requirements yang Masih TBD

Jangan mengarang nilai untuk:

1. toleransi/grace period datang;
2. batas Pulang Cepat;
3. jam buka/tutup scan datang;
4. jam buka/tutup scan pulang;
5. perilaku khusus jika hanya ada absen pulang;
6. siapa yang dapat membatalkan approval dan dampaknya;
7. detail format/ukuran/jumlah lampiran;
8. detail layout export Excel/PDF;
9. detail desain dashboard;
10. detail kanal/aturan notifikasi.

Jika suatu keputusan diperlukan agar coding dapat berjalan, buat **Implementation Decision Record (IDR)** terlebih dahulu. Jangan memilih nilai secara diam-diam.

---

## 6. Target Technology

- Frontend: React + TypeScript + Vite.
- Styling: Tailwind CSS.
- Backend platform: Supabase.
- Database: PostgreSQL melalui Supabase.
- Authentication: Supabase Auth.
- Storage: Supabase Storage bila diperlukan untuk attachment/foto sesuai scope.
- Source control: Git + GitHub.
- Development: VS Code + Kilo Code.
- Preview/production frontend: Vercel.
- Final alternatif hosting: cPanel untuk static frontend build, Supabase tetap sebagai backend.

Library tambahan harus ditambahkan hanya jika ada kebutuhan nyata dan dicatat di technical decision.

---

## 7. Struktur Repository Target

```text
sistem-absensi-madrasah/
├─ public/
├─ src/
│  ├─ components/
│  │  ├─ ui/
│  │  └─ layout/
│  ├─ features/
│  │  ├─ auth/
│  │  ├─ users/
│  │  ├─ teachers/
│  │  ├─ students/
│  │  ├─ classes/
│  │  ├─ periods/
│  │  ├─ schedules/
│  │  ├─ attendance/
│  │  ├─ leave/
│  │  ├─ corrections/
│  │  ├─ audit/
│  │  ├─ reports/
│  │  └─ imports/
│  ├─ pages/
│  ├─ layouts/
│  ├─ routes/
│  ├─ services/
│  ├─ hooks/
│  ├─ lib/
│  ├─ types/
│  └─ utils/
├─ supabase/
│  ├─ migrations/
│  ├─ functions/
│  └─ seed/
├─ tests/
├─ docs/
├─ .env.example
├─ README.md
└─ package.json
```

Struktur boleh berubah jika ada alasan teknis, tetapi perubahan struktur tidak boleh mengubah business rule.

---

## 8. Tahapan Development

### Phase 0 — Foundation

Output:

- repository GitHub;
- Vite + React + TypeScript;
- Tailwind;
- lint/format dasar;
- environment configuration;
- Supabase client;
- route foundation;
- shared UI components;
- AppShell responsive;
- error/loading/empty state foundation.

Checkpoint: aplikasi dapat berjalan lokal tanpa fitur bisnis.

### Phase 1 — Authentication & Authorization

Output:

- login/logout;
- session handling;
- protected routes;
- role resolution;
- multi-role support;
- authorization helpers;
- route visibility berdasarkan role.

Checkpoint: user aktif dapat login dan fungsi dibatasi sesuai role.

### Phase 2 — Master Data

Urutan:

1. Madrasah.
2. User/account.
3. Guru.
4. Siswa.
5. Kelas/rombel.
6. Membership siswa-kelas.
7. Wali kelas.

Checkpoint: data master dapat dibuat/diubah/nonaktif sesuai scope dan period isolation terjaga.

### Phase 3 — Academic Period

Output:

- CRUD period;
- active period;
- period context;
- validasi satu active period per madrasah;
- filter/query berbasis period.

Checkpoint: data periodik tidak bercampur.

### Phase 4 — Schedule Engine

Implementasi service terpusat:

```text
getEffectiveSchedule(date, teacherId, academicPeriodId)
```

Urutan resolusi:

```text
special calendar
    ↓
holiday?
    ├─ yes → no normal attendance
    └─ no
        ↓
special schedule / applicable override
        ↓
standard schedule
```

Schedule engine harus menjadi satu sumber aturan untuk attendance, status, dashboard, dan report.

### Phase 5 — Teacher Attendance

Output:

- GPS acquisition;
- permission handling;
- GPS accuracy validation <= 30m;
- distance calculation;
- geofence validation <= configured radius;
- arrival;
- departure;
- duplicate prevention;
- user feedback.

Jangan menyimpan device information.

### Phase 6 — Student QR Attendance

Output:

- camera/QR scanning;
- parse NISN;
- student lookup;
- manual verification;
- scan by teacher;
- GPS teacher;
- scanner teacher ID;
- duplicate prevention.

QR tetap statis berbasis NISN.

### Phase 7 — Daily Status & Auto-Alpa

Bangun derived status dari attendance + effective schedule + attendance window + leave/approval.

Jangan membuat tabel status harian sebagai source of truth.

Auto-Alpa hanya setelah periode absensi berakhir sesuai aturan yang sudah disepakati.

### Phase 8 — Leave & Approval

Output:

- leave types;
- teacher/student leave request;
- date range;
- optional attachment sesuai keputusan final;
- approval history;
- Wali Kelas untuk siswa;
- Kepala Madrasah untuk Guru;
- Admin sebagai replacement approver;
- cancellation sesuai keputusan final;
- attendance status impact.

### Phase 9 — Correction & Audit

Output:

- teacher correction request;
- admin direct edit;
- before/after audit;
- actor;
- timestamp;
- reason jika tersedia;
- audit visibility untuk Admin/Kepala Madrasah.

### Phase 10 — Dashboard & Reports

Gunakan metrik inti:

- on-time;
- late;
- leave/sick;
- absent.

Tambahkan filter dan tabel sederhana sesuai role/scope. Hindari analytics kompleks.

### Phase 11 — Import / Export

Import:

- template Excel;
- preview/validation;
- success/failure;
- row-level error;
- import batch.

Export:

- Excel;
- PDF;
- filter sesuai report.

Detail layout mengikuti keputusan implementasi yang disepakati.

### Phase 12 — Hardening

- RLS review;
- authorization tests;
- duplicate tests;
- period isolation tests;
- responsive tests;
- error handling;
- accessibility dasar;
- performance sanity check;
- security review;
- production environment review.

---

## 9. Pola Vibe Coding dengan Kilo Code

Gunakan siklus:

```text
Read source docs
      ↓
Define one task
      ↓
Prompt Kilo Code
      ↓
Review generated code
      ↓
Run app
      ↓
Run targeted tests
      ↓
Fix only the current scope
      ↓
Git commit
      ↓
Next task
```

### Aturan prompt

Setiap prompt Kilo Code harus menyebut:

- tujuan task;
- source of truth yang relevan;
- file/module yang boleh disentuh;
- business rules;
- acceptance criteria;
- non-goals;
- testing yang harus dilakukan;
- larangan membuat fitur baru.

### Larangan

Jangan memberikan prompt seperti:

> "Build the entire attendance application."

Lebih aman:

> "Implement only teacher attendance arrival flow. Read BRD/FS/Data Model first. Do not modify leave, QR, reports, or unrelated modules. Add targeted tests and stop after acceptance criteria are satisfied."

---

## 10. Definition of Done

Sebuah task dianggap selesai jika:

- [ ] requirement source sudah dibaca;
- [ ] tidak ada fitur di luar scope;
- [ ] business rule dipenuhi;
- [ ] TypeScript tidak menghasilkan error;
- [ ] lint/build berhasil;
- [ ] test relevan berhasil;
- [ ] loading/empty/error/success state tersedia bila relevan;
- [ ] desktop dan Android diperiksa;
- [ ] authorization diperiksa;
- [ ] RLS diperiksa bila menyentuh data;
- [ ] tidak ada secret di repository;
- [ ] perubahan direview;
- [ ] commit Git dibuat dengan pesan yang jelas.

---

## 11. Strategi Testing

### Functional

Menguji workflow normal setiap modul.

### Business Rule

Menguji batas seperti radius, GPS accuracy, duplicate, schedule override, Alpa, approval, dan period isolation.

### Authorization

Untuk setiap role uji:

- boleh melihat apa;
- boleh membuat apa;
- boleh mengubah apa;
- tidak boleh mengubah apa.

### Database/RLS

Uji akses langsung terhadap tabel melalui session user yang berbeda. Jangan menganggap UI hiding sebagai security.

### Responsive

Minimal:

- desktop;
- Android/mobile width.

### Regression

Setiap perubahan modul penting menjalankan test suite yang relevan terhadap modul sebelumnya.

---

## 12. Git Strategy

Branch sederhana untuk pemula:

```text
main
  └─ feature/<module-name>
```

Contoh:

```text
feature/auth-login
feature/master-students
feature/teacher-attendance
```

Commit kecil dan bermakna:

```text
feat: add teacher arrival attendance flow
fix: reject duplicate student scan
feat: add academic period context
```

Jangan melakukan commit besar yang mencampur banyak modul tanpa alasan.

---

## 13. Development Checkpoint

| Checkpoint | Syarat lanjut |
|---|---|
| C0 Foundation | App berjalan + build berhasil |
| C1 Auth | Login/session/role berjalan |
| C2 Master Data | CRUD inti + period scope |
| C3 Period | Active period dan isolation |
| C4 Schedule | Effective schedule teruji |
| C5 Teacher Attendance | GPS/geofence/duplicate teruji |
| C6 Student QR | Scan/manual verification/duplicate teruji |
| C7 Status | Derived status + Alpa teruji |
| C8 Leave | Request + approval teruji |
| C9 Correction | Correction + audit teruji |
| C10 Reports | Dashboard/report/export teruji |
| C11 Hardening | RLS/security/responsive/regression |
| C12 Release | Production build dan deployment |

---

## 14. Dokumen Development Lanjutan

Setelah dokumen ini, dokumen yang disarankan:

- `010 Kilo Code Master Instructions.md`
- `011 Development Task Breakdown.md`
- `012 Test Plan.md`
- `013 UAT Checklist.md`
- `014 Deployment Guide.md`
- `015 Master Project Guide.md`

Dokumen `009 Technical Architecture` menjadi pasangan teknis utama dokumen ini.

---

## 15. Final Development Principle

> **Implementasikan requirement yang sudah disetujui, bukan asumsi AI.**

> **Satu task kecil → review → test → commit.**

> **Jika requirement belum diputuskan, jangan ditebak.**

> **UI Stitch adalah referensi implementasi visual, sedangkan business rule tetap berasal dari dokumen requirement.**

---

## 16. Status

**Development Master Plan v1.0 — READY FOR TECHNICAL IMPLEMENTATION PREPARATION**
