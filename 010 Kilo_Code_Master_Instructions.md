# 010 Kilo Code Master Instructions

## Sistem Absensi Madrasah

**Versi:** 1.0  
**Status:** Master Instruction untuk Development  
**Basis:** 000 Spesifikasi Aplikasi, 001 BRD Final v1.3, 002 Functional Specification Final v2.0, 003 Data Model Specification v1.0, 004 ERD v1.0, 005 Supabase Migration v1.0, 006 Stitch UI/UX Prompt Plan, 007 Final UX Simplification & Implementation Blueprint, 008 Development Master Plan, 009 Technical Architecture  
**Target:** VS Code + Kilo Code + React + TypeScript + Vite + Tailwind + Supabase

---

# 1. Tujuan Dokumen

Dokumen ini adalah **master instruction** yang diberikan kepada Kilo Code sebelum mengerjakan task development Sistem Absensi Madrasah.

Tujuannya adalah agar Kilo Code:

- memahami konteks proyek sebelum mengubah kode;
- mengikuti requirement yang telah disetujui;
- tidak mengarang business rule;
- tidak menambahkan fitur baru;
- mengerjakan task secara kecil dan terkontrol;
- menjaga arsitektur React + TypeScript + Vite + Tailwind + Supabase;
- menjaga keamanan Auth/RLS/authorization;
- menjaga period isolation;
- menghasilkan kode yang mudah dipahami developer pemula;
- melakukan verifikasi setelah perubahan.

> **Prinsip utama:** Kilo Code adalah coding agent, bukan product decision maker.

Jika requirement belum diputuskan, Kilo Code **tidak boleh menebak**.

---

# 2. Cara Menggunakan Dokumen Ini

Dokumen ini bukan prompt untuk membangun seluruh aplikasi sekaligus.

Gunakan sebagai **aturan permanen proyek**, kemudian berikan task development satu per satu.

Urutan kerja:

```text
Master Instructions
       ↓
Development Task
       ↓
Kilo Code membaca source yang relevan
       ↓
Kilo Code membuat implementation plan singkat
       ↓
User review bila diperlukan
       ↓
Kilo Code implementasi
       ↓
Test / lint / build
       ↓
Review hasil
       ↓
Git commit
       ↓
Task berikutnya
```

Jangan memberikan prompt seperti:

```text
Build the entire Madrasah Attendance application.
```

Gunakan task kecil seperti:

```text
Implement only the login and session handling flow.
Do not modify attendance, leave, reports, or unrelated modules.
```

---

# 3. Source of Truth dan Prioritas

Kilo Code wajib menggunakan sumber berikut dengan urutan prioritas:

1. `001 BRD Final`
2. `002 Functional Specification Final`
3. `003 Data Model Specification`
4. `004 ERD`
5. `005 Supabase Migration`
6. `007 Final UX Simplification & Implementation Blueprint`
7. `006 Stitch UI/UX Prompt Plan` dan hasil Stitch
8. `009 Technical Architecture`
9. `008 Development Master Plan`
10. Dokumen/task yang diberikan user untuk keputusan implementasi terbaru

Jika terdapat konflik:

1. jangan diam-diam memilih salah satu;
2. jelaskan konflik secara singkat;
3. identifikasi requirement yang terdampak;
4. jangan mengubah business rule secara otomatis;
5. jika keputusan memang diperlukan, buat **Implementation Decision Record (IDR)** atau minta keputusan user.

> Jangan menggunakan asumsi umum dari framework atau aplikasi lain untuk menggantikan requirement proyek.

---

# 4. Aturan Utama Development

## 4.1 Selalu baca sebelum mengubah

Sebelum coding:

- baca file yang relevan;
- pahami struktur project saat ini;
- cari implementasi yang sudah ada;
- jangan membuat file baru jika fungsi yang sama sudah tersedia;
- jangan mengganti arsitektur tanpa alasan teknis yang jelas.

## 4.2 Scope harus kecil

Satu task idealnya menyelesaikan:

- satu workflow;
- satu feature kecil;
- satu service;
- satu halaman;
- satu kelompok business rule yang saling berkaitan.

## 4.3 Jangan melakukan perubahan tidak terkait

Jika task adalah login, jangan sekaligus:

- mengubah dashboard;
- membuat QR scanner;
- membuat report;
- mengubah schema attendance;
- menambahkan library yang tidak diperlukan.

## 4.4 Jangan membuat fitur baru

Jangan menambahkan fitur hanya karena dianggap berguna.

Contoh fitur yang **tidak boleh dibuat**:

- jadwal mata pelajaran;
- subject timetable;
- biometric authentication;
- selfie attendance;
- device tracking;
- device information tracking/storage;
- WhatsApp notification;
- email notification;
- push notification eksternal;
- student self-scan;
- QR reset;
- complex analytics;
- predictive AI;
- chat/social feature;
- fitur lain di luar requirement.

---

# 5. Business Rules yang Tidak Boleh Diubah

Kilo Code wajib mempertahankan business rules berikut.

### Attendance dan GPS

- radius geofence default: **200 meter**;
- batas akurasi GPS: **30 meter**;
- GPS wajib untuk absensi berbasis lokasi;
- Guru melakukan absensi mandiri;
- GPS untuk student QR attendance berasal dari perangkat Guru;
- device information tidak disimpan;
- duplicate attendance harus dicegah.

### Student QR

- QR bersifat statis;
- QR berisi NISN;
- Guru melakukan scan;
- Guru melakukan verifikasi manual identitas siswa;
- semua Guru dapat scan siswa sesuai requirement;
- siswa tidak melakukan scan sendiri;
- `scanner_teacher_id` harus tersimpan untuk student attendance.

### Schedule

Sistem hanya menggunakan:

- jadwal datang;
- jadwal pulang.

Tidak ada jadwal mata pelajaran.

Effective schedule dihitung melalui service, bukan dibuat sebagai tabel source of truth.

### Attendance Status

Status harian merupakan derived result dari data yang relevan.

Kebutuhan status meliputi:

- Hadir;
- Terlambat;
- Pulang Cepat;
- Belum Absen Pulang;
- Alpa;
- status perizinan.

`Alpa` diproses setelah periode absensi berakhir sesuai requirement.

### Correction

- Guru tidak mengubah attendance secara langsung;
- Guru dapat mengajukan koreksi;
- Admin dapat mengubah attendance;
- koreksi penting harus masuk audit trail;
- audit dapat dilihat Admin dan Kepala Madrasah.

### Leave dan Approval

- Guru dan Siswa dapat memiliki leave request sesuai scope;
- leave mendukung rentang tanggal;
- tanggal sebelumnya diperbolehkan;
- Student leave → Wali Kelas;
- Teacher leave → Kepala Madrasah;
- Admin dapat menjadi replacement approver sesuai requirement;
- approval memengaruhi status kehadiran sesuai business rule.

### Multi-role dan Period

- satu user dapat memiliki lebih dari satu role;
- Guru dapat menjadi Wali Kelas;
- data periodik harus terisolasi berdasarkan `academic_period_id`;
- satu academic period aktif per madrasah sesuai Data Model.

---

# 6. Requirement yang Masih TBD — JANGAN DITEBAK

Kilo Code tidak boleh menetapkan sendiri nilai untuk:

1. grace period/toleransi jam datang;
2. batas Pulang Cepat;
3. jam mulai/akhir scan datang;
4. jam mulai/akhir scan pulang;
5. perilaku jika hanya ada absen pulang;
6. siapa yang dapat membatalkan approval dan dampaknya;
7. format, ukuran, jumlah lampiran;
8. layout/detail export Excel/PDF;
9. detail visual/filter dashboard yang belum diputuskan;
10. kanal/aturan notifikasi.

Jika implementasi membutuhkan keputusan tersebut:

```text
STOP
→ jelaskan keputusan yang dibutuhkan
→ sebutkan file/logic yang terdampak
→ minta keputusan atau buat IDR
→ jangan hard-code asumsi
```

---

# 7. Technology Rules

Gunakan baseline:

- React;
- TypeScript;
- Vite;
- Tailwind CSS;
- Supabase Auth;
- Supabase PostgreSQL;
- Supabase RLS;
- Supabase Storage bila memang diperlukan;
- Git/GitHub;
- Vercel untuk deployment utama.

Jangan menambahkan framework/backend/database baru tanpa alasan yang kuat.

Jika ingin menambahkan dependency:

1. jelaskan masalah yang diselesaikan;
2. jelaskan mengapa stack yang ada tidak cukup;
3. pertimbangkan ukuran/dependency cost;
4. pertimbangkan security;
5. pertimbangkan deployment Vercel/cPanel;
6. tunggu persetujuan jika dependency tersebut bukan kebutuhan yang jelas.

---

# 8. Struktur Project yang Diutamakan

Target struktur:

```text
src/
├─ components/
│  ├─ ui/
│  └─ layout/
├─ features/
│  ├─ auth/
│  ├─ users/
│  ├─ teachers/
│  ├─ students/
│  ├─ classes/
│  ├─ periods/
│  ├─ schedules/
│  ├─ attendance/
│  ├─ leave/
│  ├─ corrections/
│  ├─ audit/
│  ├─ reports/
│  └─ imports/
├─ pages/
├─ layouts/
├─ routes/
├─ services/
├─ hooks/
├─ lib/
├─ types/
└─ utils/

supabase/
├─ migrations/
├─ functions/
└─ seed/

tests/
docs/
```

Tidak wajib membuat semua folder sejak awal.

> Jangan membuat boilerplate kosong hanya agar struktur terlihat lengkap.

---

# 9. Frontend Rules

## 9.1 UI layer

UI bertanggung jawab untuk:

- render data;
- form interaction;
- visual state;
- navigation;
- user feedback.

UI bukan tempat utama untuk:

- security authorization;
- database integrity;
- business rule kompleks;
- perhitungan yang dipakai lintas feature.

## 9.2 Service layer

Gunakan service untuk:

- business logic composition;
- data access/orchestration;
- validation coordination;
- workflow yang dipakai lebih dari satu UI.

Contoh:

```text
services/
├─ authService
├─ authorizationService
├─ academicPeriodService
├─ effectiveScheduleService
├─ geofenceService
├─ teacherAttendanceService
├─ studentAttendanceService
├─ leaveService
├─ approvalService
├─ correctionService
├─ auditService
├─ reportService
└─ importService
```

Nama dapat disesuaikan, tetapi tanggung jawab harus jelas.

---

# 10. Reusable UI Components

Utamakan komponen dari UX blueprint:

- `Button.tsx`
- `StatusBadge.tsx`
- `GeofenceIndicator.tsx`
- `MetricCard.tsx`
- `PageHeader.tsx`
- `ResponsiveTable.tsx`
- `ModalConfirm.tsx`
- `StateAlert.tsx`
- `AppShell.tsx`
- `TopNavBar.tsx`
- `MobileBottomNav.tsx`

Gunakan ulang sebelum membuat komponen baru.

Jika membuat komponen baru, tanyakan:

- apakah benar-benar diperlukan?
- apakah dapat menggunakan komponen yang ada?
- apakah komponen akan reusable?
- apakah penambahan ini berasal dari requirement atau hanya preferensi implementasi?

---

# 11. Authentication dan Authorization

Gunakan Supabase Auth untuk authentication.

Flow utama:

```text
Login
 ↓
Supabase Auth
 ↓
Session
 ↓
Load profile + roles
 ↓
Authorization context
 ↓
Protected application
```

Harus dibedakan:

- authentication = siapa pengguna;
- authorization = apa yang boleh dilakukan pengguna.

Gunakan dua lapisan route protection:

1. authenticated/session guard;
2. role/permission guard.

Jangan menganggap menyembunyikan tombol sebagai security.

---

# 12. RLS dan Security

**RLS adalah security boundary untuk data Supabase.**

Frontend tidak boleh menjadi satu-satunya mekanisme pembatasan akses.

RLS harus mempertimbangkan:

- current user;
- role;
- ownership;
- assigned class;
- academic period;
- approval responsibility.

Migration baseline yang sudah ada tidak boleh dianggap sebagai final authorization implementation.

Sebelum menyatakan feature security-complete:

- review policy;
- uji dengan session role terkait;
- uji akses yang seharusnya ditolak;
- uji period isolation.

Jangan menaruh:

- service role key;
- secret key;
- password;
- private token

di frontend atau repository.

`.env` tidak boleh di-commit jika berisi secret.

Gunakan `.env.example` untuk nama variable saja.

---

# 13. Database Rules

PostgreSQL/Supabase adalah source of truth.

Pertahankan entity dari Data Model/ERD.

Tidak membuat tabel MVP untuk:

```text
effective_schedules
daily_attendance_status
qr_codes
devices
```

## Attendance owner XOR

```text
teacher_id IS NOT NULL AND student_id IS NULL
OR
teacher_id IS NULL AND student_id IS NOT NULL
```

## Student scanner

Student attendance wajib memiliki:

```text
scanner_teacher_id IS NOT NULL
```

Teacher attendance tidak menggunakan scanner teacher.

## Leave owner XOR

Satu leave request harus memiliki tepat satu owner:

```text
student_id XOR teacher_id
```

## Period isolation

Entity period-scoped wajib mempertahankan `academic_period_id` sesuai Data Model/ERD.

Database constraint/index harus digunakan untuk integritas penting. Jangan mengandalkan validasi frontend saja.

---

# 14. Effective Schedule Rule

Gunakan satu service terpusat, misalnya:

```ts
getEffectiveSchedule({
  date,
  teacherId,
  academicPeriodId,
})
```

Resolusi konseptual:

```text
special_calendar_dates
        ↓
     holiday?
     /      \
   yes       no
    ↓         ↓
NO ATTENDANCE  applicable special schedule
                    ↓
              teacher override
                    ↓
              standard schedule
```

Service ini harus menjadi sumber aturan bersama untuk:

- attendance;
- status;
- dashboard;
- report.

Jangan membuat empat implementasi schedule logic yang berbeda di empat halaman.

---

# 15. Geofence Rule

Flow:

```text
Request location
 ↓
Permission check
 ↓
GPS available?
 ↓
Accuracy <= 30m?
 ↓
Calculate distance
 ↓
Distance <= configured radius?
 ↓
Allow / reject
```

Default radius: **200 meter**.

Pisahkan logic yang dapat diuji:

```text
calculateDistance(...)
validateAccuracy(...)
validateRadius(...)
```

Jika GPS tidak tersedia, permission ditolak, akurasi tidak memenuhi, atau lokasi di luar radius, transaksi harus ditolak sesuai requirement dan UI memberikan panduan yang jelas.

---

# 16. Teacher Attendance Rule

Flow:

```text
Load active period
 ↓
Resolve effective schedule
 ↓
Determine arrival/departure
 ↓
Get GPS
 ↓
Validate accuracy
 ↓
Validate geofence
 ↓
Check duplicate
 ↓
Insert attendance
```

Guru tidak dapat mengubah attendance record secara langsung.

Jangan hard-code grace period, attendance window, atau Pulang Cepat sebelum TBD diputuskan.

---

# 17. Student QR Attendance Rule

Flow:

```text
Teacher opens scanner
 ↓
Scan QR
 ↓
Read NISN
 ↓
Find student
 ↓
Manual verification
 ↓
Get teacher GPS
 ↓
Validate location
 ↓
Check duplicate
 ↓
Insert attendance
 ↓
Store scanner_teacher_id
```

Tidak ada student self-scan.

Tidak ada QR reset.

Tidak membuat tabel `qr_codes` untuk MVP.

---

# 18. Daily Status Rule

Daily status harus dihitung dari:

```text
attendance_records
+
effective schedule
+
attendance window/finalization rule
+
leave request + approval
```

Jangan membuat `daily_attendance_status` sebagai duplicate source of truth.

Jika status membutuhkan parameter yang masih TBD, jangan hard-code.

---

# 19. Leave dan Approval Rule

Leave mendukung:

- Guru/Siswa sebagai owner;
- category/type;
- tanggal mulai;
- tanggal selesai;
- status;
- attachment jika keputusan final mengaktifkannya.

Approval history disimpan terpisah dari request.

Authority:

```text
Student leave → Wali Kelas
Teacher leave → Kepala Madrasah
Admin → replacement/operational control sesuai requirement
```

Jangan menebak aturan cancellation approval yang masih TBD.

---

# 20. Correction dan Audit Rule

Flow:

```text
Attendance
 ↓
Teacher correction request
 ↓
Admin review/edit
 ↓
Attendance update
 ↓
Audit before/after
```

Admin juga dapat melakukan direct edit sesuai requirement.

Audit minimal mencatat:

- actor;
- timestamp;
- target/entity;
- before value;
- after value;
- context yang relevan.

Audit visibility: Admin dan Kepala Madrasah.

---

# 21. Dashboard dan Report Rule

Dashboard tidak boleh menghitung business rule sendiri jika rule sudah tersedia di service/query bersama.

Metrik inti:

- on-time;
- late;
- leave/sick;
- absent.

Report mendukung:

- harian;
- mingguan;
- bulanan;
- individu;
- kelas;
- Madrasah;
- export Excel;
- export PDF.

Hindari analytics kompleks.

---

# 22. Import Rule

Import Excel:

```text
Upload
 ↓
Parse
 ↓
Validate schema
 ↓
Validate rows
 ↓
Preview/result
 ↓
Persist valid data
 ↓
Store batch
 ↓
Store row errors
```

Gunakan:

- `import_batches`;
- `import_errors`.

Jangan membuat import diam-diam tanpa informasi hasil.

---

# 23. UI/UX Rules

UI harus mengikuti arah desain yang sudah disetujui Stitch/UX blueprint:

- sederhana;
- minimal;
- beginner-friendly;
- responsive desktop + Android;
- primary action jelas;
- sedikit tombol;
- form pendek;
- status mudah dipahami;
- loading state bila relevan;
- empty state bila relevan;
- error state bila relevan;
- success state bila relevan.

Jangan menambahkan:

- card berlebihan;
- chart berlebihan;
- decorative widget;
- complex animation;
- navigasi terlalu banyak;
- enterprise-style complexity.

Bahasa user-facing harus sederhana dan bahasa Indonesia.

---

# 24. Error Handling

Setiap workflow yang relevan harus memiliki:

```text
idle
loading
success
empty
error
```

Pesan error:

- bahasa Indonesia sederhana;
- menjelaskan masalah;
- bila memungkinkan memberi langkah berikutnya;
- tidak menampilkan stack trace;
- tidak membocorkan credential/secret/detail internal.

Contoh pola:

```text
Lokasi belum tersedia.
Aktifkan izin lokasi browser lalu coba lagi.
```

Bukan:

```text
GeolocationPositionError code 1.
```

---

# 25. Testing Rules

Setiap task harus memiliki verifikasi yang sesuai.

Minimal pertimbangkan:

### Unit test

Untuk logic berisiko tinggi seperti:

- geofence calculation;
- accuracy validation;
- effective schedule;
- status calculation;
- validation helper.

### Integration/security test

Untuk:

- Supabase query;
- RLS;
- authorization;
- attendance transaction;
- approval flow.

### Workflow/E2E

Untuk workflow penting:

- login;
- teacher attendance;
- student QR;
- leave;
- correction;
- report.

Tidak perlu membuat seluruh test suite sekaligus jika belum relevan.

---

# 26. Definition of Done untuk Setiap Task

Sebelum menyatakan task selesai, cek:

```text
[ ] Requirement yang relevan sudah dibaca
[ ] Scope task tetap kecil
[ ] Tidak ada fitur baru
[ ] Business rule dipenuhi
[ ] Tidak ada TBD yang ditebak
[ ] TypeScript tidak error
[ ] Lint berhasil
[ ] Build berhasil
[ ] Test relevan berhasil
[ ] Loading/empty/error/success tersedia bila relevan
[ ] Authorization diperiksa
[ ] RLS diperiksa jika menyentuh data
[ ] Period isolation diperiksa jika relevan
[ ] Desktop diperiksa
[ ] Android/mobile diperiksa
[ ] Tidak ada secret di repository
[ ] Tidak ada perubahan unrelated
[ ] Perubahan siap direview
```

---

# 27. Git Rules

Gunakan branch sederhana:

```text
main
└── feature/<module-name>
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

Jangan membuat satu commit raksasa yang mencampur banyak modul.

---

# 28. Perintah Verifikasi

Sesuaikan dengan `package.json`, tetapi project harus memiliki equivalent checks untuk:

```bash
npm run lint
npm run build
npm run test
```

Jika command belum tersedia:

1. jangan berpura-pura sudah dijalankan;
2. jelaskan command yang belum tersedia;
3. usulkan perubahan hanya jika memang diperlukan.

---

# 29. Aturan Saat Menemukan Bug

Jika menemukan bug di luar scope task:

1. catat bug;
2. jangan otomatis memperluas task;
3. perbaiki hanya jika bug menghalangi task saat ini atau menyebabkan security/data-integrity issue;
4. jika diperbaiki, jelaskan perubahan tambahan tersebut.

Prioritas khusus:

```text
Security issue
   ↓
Data integrity issue
   ↓
Blocking functional bug
   ↓
Current task
   ↓
Non-blocking improvement
```

Jangan menghabiskan task untuk refactor kosmetik yang tidak diperlukan.

---

# 30. Aturan Saat Kode Existing Berbeda dari Dokumen

Jika kode existing bertentangan dengan requirement:

```text
Jangan langsung overwrite.

1. Identifikasi perbedaan.
2. Jelaskan file yang terdampak.
3. Jelaskan business rule yang benar.
4. Tentukan perubahan minimal.
5. Implementasikan hanya perubahan yang diperlukan.
```

Jika perubahan membutuhkan keputusan requirement baru, gunakan IDR.

---

# 31. Implementation Decision Record (IDR)

Gunakan IDR ketika:

- requirement masih TBD;
- ada konflik antar dokumen;
- library baru diperlukan;
- arsitektur harus berubah;
- keputusan database baru diperlukan;
- keputusan security belum tersedia.

Format sederhana:

```markdown
# IDR-XXX — Judul Keputusan

## Masalah

Apa yang belum jelas?

## Dokumen yang terdampak

- BRD:
- Functional Specification:
- Data Model:
- Technical Architecture:

## Opsi

1. Opsi A
2. Opsi B

## Dampak

Apa yang berubah jika opsi dipilih?

## Keputusan

Keputusan final.

## Status

Approved / Pending
```

Jangan membuat keputusan penting tanpa jejak dokumentasi.

---

# 32. Format Prompt Task yang Direkomendasikan

Setiap task baru sebaiknya diberikan dengan format berikut:

```text
TASK: <nama task>

GOAL:
<tujuan task>

READ FIRST:
- <dokumen/file>
- <dokumen/file>

FILES/MODULES IN SCOPE:
- <file/module>

BUSINESS RULES:
- <rule 1>
- <rule 2>

ACCEPTANCE CRITERIA:
- <criteria 1>
- <criteria 2>

NON-GOALS:
- Jangan mengubah <module>
- Jangan menambahkan <feature>

TESTING:
- <test yang harus dijalankan>

STOP CONDITION:
Stop after the acceptance criteria are satisfied.
Do not continue into unrelated modules.
```

---

# 33. Contoh Task yang Baik

```text
TASK: Implement Supabase authentication foundation

GOAL:
Implement login, logout, session restoration, and protected application access.

READ FIRST:
- 001 BRD Final
- 002 Functional Specification Final
- 008 Development Master Plan
- 009 Technical Architecture

FILES/MODULES IN SCOPE:
- src/features/auth/
- src/routes/
- src/lib/supabase*

BUSINESS RULES:
- Active user can login.
- Inactive user cannot use application functions.
- Multi-role must be supported.

ACCEPTANCE CRITERIA:
- Login works.
- Logout works.
- Session is restored after refresh.
- Unauthenticated user cannot access protected routes.
- Auth loading/error states exist.

NON-GOALS:
- Do not implement attendance.
- Do not implement dashboard.
- Do not implement leave.
- Do not add new authentication provider.

TESTING:
- Run lint.
- Run build.
- Run relevant tests.

STOP CONDITION:
Stop when the acceptance criteria are satisfied.
```

---

# 34. Contoh Task yang Buruk

Jangan gunakan:

```text
Build the entire system.
Make it production ready.
Add anything you think is useful.
Use the best libraries.
Fix everything you find.
```

Alasannya:

- scope terlalu besar;
- business decision diserahkan ke AI;
- mudah menghasilkan fitur di luar requirement;
- sulit direview;
- sulit mengetahui penyebab bug;
- berisiko merusak arsitektur.

---

# 35. Workflow Kilo Code yang Wajib

Untuk setiap task:

### Step 1 — Inspect

Kilo Code membaca:

- requirement yang relevan;
- file existing;
- dependency;
- schema/query terkait;
- component/service yang sudah ada.

### Step 2 — Plan

Berikan implementation plan singkat sebelum perubahan besar.

Plan harus menjelaskan:

- file yang akan dibuat/diubah;
- logic utama;
- test yang akan ditambahkan;
- risiko/TBD jika ada.

### Step 3 — Implement

Implementasi hanya dalam scope task.

### Step 4 — Verify

Jalankan check yang relevan:

```text
TypeScript
Lint
Build
Tests
```

### Step 5 — Review

Pastikan:

- no unrelated changes;
- no new feature;
- no broken business rule;
- no security regression;
- no secret.

### Step 6 — Commit

Setelah user menyetujui hasil atau workflow proyek mengizinkan commit otomatis, buat commit kecil dan jelas.

---

# 36. Aturan untuk Database Migration

Saat mengubah database:

1. jangan mengedit migration lama secara sembarangan jika migration tersebut sudah diterapkan;
2. buat migration baru untuk perubahan schema;
3. sertakan constraint/index yang diperlukan;
4. review RLS terkait;
5. uji migration;
6. uji period isolation;
7. uji negative authorization;
8. jangan menghapus data production tanpa instruksi eksplisit.

Migration harus dapat dilacak dari requirement atau technical decision.

---

# 37. Aturan untuk Supabase RLS

Setiap feature database baru harus menjawab:

```text
Siapa yang boleh SELECT?
Siapa yang boleh INSERT?
Siapa yang boleh UPDATE?
Siapa yang boleh DELETE?
Data mana yang boleh dilihat?
Bagaimana period scope diterapkan?
Bagaimana ownership diterapkan?
```

Jangan menambahkan policy:

```text
allow all authenticated users
```

hanya untuk membuat feature cepat selesai.

Temporary permissive policy harus dianggap sebagai blocker sebelum production.

---

# 38. Aturan File Upload

Untuk attachment/foto yang memang disetujui:

- validasi ukuran;
- validasi MIME/type;
- gunakan storage access control;
- jangan membuat bucket public tanpa alasan;
- jangan menganggap nama file sebagai authorization;
- simpan metadata yang dibutuhkan;
- ikuti keputusan TBD attachment.

Jika detail attachment belum diputuskan, jangan menebak batas ukuran/format.

---

# 39. Responsive Rules

Semua halaman baru harus dipikirkan untuk:

- desktop;
- Android/mobile.

Prioritas mobile:

- touch target nyaman;
- form mudah digunakan;
- primary action jelas;
- tabel tidak menyebabkan layout rusak;
- navigation tetap mudah digunakan.

Gunakan `ResponsiveTable` atau pola mobile yang telah disetujui jika relevan.

---

# 40. Accessibility Dasar

Untuk UI baru:

- label form jelas;
- button memiliki nama yang jelas;
- focus state tidak dihilangkan;
- error form terkait dengan field;
- warna bukan satu-satunya penanda status;
- keyboard interaction diperhatikan untuk desktop.

Accessibility tidak boleh dicapai dengan menambah kompleksitas UI yang tidak diperlukan.

---

# 41. Performance Rules

Jangan melakukan premature optimization.

Tetapi hindari:

- query berulang yang tidak perlu;
- fetch data yang tidak digunakan;
- rendering besar tanpa alasan;
- duplicate business calculations;
- loading seluruh tabel ketika hanya membutuhkan ringkasan.

Untuk dashboard/report, gunakan query/service yang sesuai scope dan filter.

---

# 42. Logging dan Debugging

Saat debugging:

- gunakan log sementara seperlunya;
- jangan log password/token/secret;
- jangan menyimpan debug code permanen tanpa alasan;
- hapus console debug yang tidak diperlukan sebelum commit.

User-facing error dan developer debugging harus dipisahkan.

---

# 43. Stop Rules

Kilo Code **HARUS BERHENTI dan meminta keputusan** jika:

1. requirement bertentangan;
2. business rule belum ditentukan;
3. perubahan database berisiko merusak data existing;
4. perubahan security/RLS tidak dapat dipastikan;
5. dependency baru dibutuhkan tetapi tidak jelas;
6. task membutuhkan perubahan arsitektur besar;
7. solusi yang tersedia memerlukan fitur di luar scope;
8. acceptance criteria tidak jelas.

Kilo Code boleh melanjutkan tanpa bertanya jika keputusan sudah jelas dari source of truth.

---

# 44. Output yang Diharapkan dari Kilo Code Setelah Task

Setelah task selesai, berikan ringkasan:

```text
IMPLEMENTATION SUMMARY

Task:
<name>

Changed:
- file 1
- file 2

Implemented:
- item 1
- item 2

Tests:
- lint: PASS/FAIL
- build: PASS/FAIL
- test: PASS/FAIL/NOT AVAILABLE

Security/RLS:
- checked/not applicable

Responsive:
- checked/not applicable

TBD/Decision:
- none
atau
- <decision needed>

Next recommended task:
<small next task>
```

Jangan mengklaim test berhasil jika test tidak benar-benar dijalankan.

---

# 45. Prioritas Implementasi

Ikuti urutan besar berikut dari `008 Development Master Plan`:

```text
Phase 0  Foundation
   ↓
Phase 1  Authentication & Authorization
   ↓
Phase 2  Master Data
   ↓
Phase 3  Academic Period
   ↓
Phase 4  Schedule Engine
   ↓
Phase 5  Teacher Attendance
   ↓
Phase 6  Student QR Attendance
   ↓
Phase 7  Daily Status & Auto-Alpa
   ↓
Phase 8  Leave & Approval
   ↓
Phase 9  Correction & Audit
   ↓
Phase 10 Dashboard & Reports
   ↓
Phase 11 Import / Export
   ↓
Phase 12 Hardening
```

Jangan melompati dependency penting hanya karena UI terlihat sudah siap.

---

# 46. Prinsip untuk Developer Pemula

Kilo Code harus memilih implementasi yang:

- sederhana;
- eksplisit;
- mudah dibaca;
- mudah diuji;
- mudah di-debug;
- tidak over-engineered.

Hindari:

- abstraction berlapis tanpa kebutuhan;
- generic framework internal yang terlalu kompleks;
- design pattern hanya untuk terlihat profesional;
- dependency berlebihan;
- magic behavior yang sulit dilacak.

> Kode yang mudah dipahami lebih diutamakan daripada kode yang terlihat canggih.

---

# 47. Final Master Rule

Selalu ikuti aturan berikut:

```text
READ → PLAN → IMPLEMENT → TEST → REVIEW → COMMIT
```

Dan selalu ingat:

```text
Requirement > Assumption
Business Rule > AI Preference
Security > Convenience
Small Task > Huge Prompt
Tested Code > Generated Code
Traceable Change > Clever Change
```

Jika requirement belum diputuskan:

```text
JANGAN MENEBak.
BUAT KEPUTUSAN.
DOKUMENTASIKAN.
BARU IMPLEMENTASIKAN.
```

---

# 48. Status Dokumen

**010 Kilo Code Master Instructions v1.0 — READY FOR USE**

Dokumen ini menjadi aturan operasional utama untuk Kilo Code selama implementasi Sistem Absensi Madrasah.

Dokumen ini tidak menggantikan BRD, Functional Specification, Data Model, ERD, Supabase Migration, UX Blueprint, Development Master Plan, atau Technical Architecture.
