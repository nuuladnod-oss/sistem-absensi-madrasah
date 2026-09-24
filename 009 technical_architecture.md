# 009 Technical Architecture

## Sistem Absensi Madrasah

**Versi:** 1.0  
**Status:** Baseline Technical Architecture  
**Basis:** BRD Final v1.3, Functional Specification Final v2.0, Data Model Specification v1.0, ERD v1.0, Supabase Migration v1.0, Final UX Simplification & Implementation Blueprint, Stitch UI/UX Plan  
**Tujuan:** mendefinisikan struktur teknis yang akan digunakan di VS Code + Kilo Code tanpa mengubah requirement bisnis.

---

## 1. Architectural Goals

Arsitektur harus:

- sederhana untuk developer pemula;
- cocok untuk full vibe coding;
- mudah dipahami AI coding agent;
- memisahkan UI, business logic, data access, dan authorization;
- menjaga period isolation;
- menjaga RLS dan role authorization;
- menggunakan satu sumber aturan untuk effective schedule;
- tidak membuat entity database turunan yang tidak diperlukan;
- responsif desktop + Android;
- mudah diuji dan dideploy ke Vercel/cPanel.

---

## 2. Architecture Style

Gunakan **modular frontend + Supabase backend-as-a-service**.

```text
Browser
  │
  ▼
React + TypeScript + Vite
  │
  ├── UI Components
  ├── Pages / Routes
  ├── Feature Modules
  ├── Services
  ├── Hooks
  └── Supabase Client
          │
          ▼
      Supabase
          ├── Auth
          ├── PostgreSQL
          ├── RLS
          ├── Storage
          └── Edge Functions (only when justified)
```

Frontend tidak boleh melewati authorization hanya karena sebuah tombol disembunyikan. Database RLS adalah lapisan security utama untuk data.

---

## 3. Technology Stack

| Layer | Technology | Purpose |
|---|---|---|
| UI | React | Application UI |
| Language | TypeScript | Type safety |
| Build | Vite | Development/build |
| CSS | Tailwind CSS | Responsive styling |
| Backend | Supabase | Backend platform |
| Auth | Supabase Auth | Authentication |
| DB | PostgreSQL | Persistent data |
| Storage | Supabase Storage | Approved file attachments/photos |
| Source control | Git/GitHub | Versioning |
| IDE | VS Code | Development |
| AI coding | Kilo Code | Vibe coding agent |
| Hosting | Vercel | Web deployment |
| Alternative hosting | cPanel | Static frontend deployment |

Jangan menambahkan framework backend terpisah kecuali ada kebutuhan yang tidak dapat dipenuhi secara aman oleh arsitektur ini.

---

## 4. Frontend Architecture

### 4.1 Folder responsibility

```text
src/
├─ components/
│  ├─ ui/       # reusable visual primitives
│  └─ layout/   # AppShell/navigation/layout
├─ features/    # business modules
├─ pages/       # route-level pages
├─ layouts/     # page/layout composition
├─ routes/      # route definitions + guards
├─ services/    # business/data orchestration
├─ hooks/       # reusable React hooks
├─ lib/         # clients/config/helpers
├─ types/       # shared types
└─ utils/       # pure utility functions
```

### 4.2 Reusable UI components

Gunakan komponen hasil UX blueprint:

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

Komponen ini tidak boleh berisi business logic spesifik satu modul jika logic tersebut dapat ditempatkan di feature/service.

---

## 5. Feature Module Architecture

Setiap feature dapat menggunakan pola:

```text
features/attendance/
├─ components/
├─ pages/
├─ hooks/
├─ services/
├─ schemas/
├─ types.ts
└─ index.ts
```

Tidak semua folder harus dibuat jika belum dibutuhkan. Hindari boilerplate kosong.

Contoh pembagian:

```text
auth/
users/
teachers/
students/
classes/
periods/
schedules/
attendance/
leave/
corrections/
audit/
reports/
imports/
```

---

## 6. Routing and Access Control

Route harus memiliki dua lapisan:

1. **Authentication guard** — apakah session valid?
2. **Authorization guard** — apakah user memiliki role/permission yang diperlukan?

Contoh konseptual:

```text
/public/login

/authenticated
  ├─ dashboard
  ├─ profile
  └─ role-protected routes
       ├─ admin/*
       ├─ teacher/*
       ├─ homeroom/*
       ├─ student/*
       └─ headmaster/*
```

Jika user memiliki multi-role, sistem tidak boleh menganggap satu user hanya memiliki satu role.

Authorization logic harus terpusat pada helper/service yang dapat digunakan ulang, bukan disalin ke setiap halaman.

---

## 7. Authentication

Gunakan Supabase Auth untuk session.

Flow:

```text
Login form
   ↓
Supabase Auth
   ↓
Authenticated session
   ↓
Load user profile + roles
   ↓
Build authorization context
   ↓
Redirect to permitted application area
```

User nonaktif tidak boleh menggunakan fungsi aplikasi walaupun kredensial berhasil melewati authentication layer.

Session state harus ditangani secara eksplisit untuk:

- loading;
- authenticated;
- unauthenticated;
- expired/error.

---

## 8. Authorization Model

Role yang digunakan:

- Admin;
- Guru;
- Wali Kelas;
- Siswa;
- Kepala Madrasah.

Authorization harus memperhatikan:

- role;
- ownership;
- class assignment;
- academic period;
- approval responsibility.

### Scope konseptual

| Role | Scope utama |
|---|---|
| Admin | full operational control |
| Guru | own attendance, own leave, student QR scanning, correction request |
| Wali Kelas | assigned class + student leave approval |
| Kepala Madrasah | monitoring + teacher leave approval + audit read |
| Siswa | own attendance/leave |

Role dapat dimiliki user yang sama lebih dari satu.

---

## 9. Supabase Layer

### 9.1 Database

PostgreSQL menjadi source of truth untuk data transaksi.

Entity utama mengikuti Data Model/ERD, termasuk:

- users;
- roles;
- user_roles;
- madrasah;
- teachers;
- students;
- academic_periods;
- classes;
- student_class_memberships;
- class_homeroom_assignments;
- standard_schedules;
- special_calendar_dates;
- teacher_schedule_overrides;
- attendance_records;
- leave_types;
- leave_requests;
- leave_attachments;
- leave_approvals;
- attendance_correction_requests;
- audit_logs;
- import_batches;
- import_errors.

### 9.2 Entities yang tidak dibuat untuk MVP

Tidak membuat tabel:

- `effective_schedules`;
- `daily_attendance_status`;
- `qr_codes`;
- `devices`.

Effective schedule dan daily status merupakan derived result.

---

## 10. Data Integrity Constraints

Pertahankan constraint dari ERD/Data Model.

### Attendance owner XOR

```text
teacher_id IS NOT NULL AND student_id IS NULL
OR
teacher_id IS NULL AND student_id IS NOT NULL
```

### Student scanner

Jika attendance milik siswa:

```text
scanner_teacher_id IS NOT NULL
```

Jika attendance milik guru:

```text
scanner_teacher_id IS NULL
```

### Duplicate attendance

Gunakan database constraint/index sesuai ERD untuk mencegah duplicate berdasarkan owner + date + category.

### Leave owner XOR

Satu leave request harus terkait tepat satu owner:

```text
student_id XOR teacher_id
```

### Period isolation

Entity period-scoped harus memiliki `academic_period_id` sesuai Data Model.

Database constraint/index adalah lapisan integritas; UI bukan pengganti constraint database.

---

## 11. RLS Architecture

RLS harus dianggap sebagai bagian dari arsitektur security, bukan task terakhir yang opsional.

Prinsip:

```text
User session
   ↓
Supabase Auth identity
   ↓
Authorization helper/context
   ↓
RLS policy
   ↓
Allowed rows only
```

Policy harus mempertimbangkan:

- current user;
- role;
- own record;
- assigned class;
- academic period;
- approval responsibility.

### Baseline implementation note

Migration awal sudah memiliki baseline policy/security note, tetapi policy final harus diverifikasi terhadap authorization helper dan period/class scoping. Jangan menganggap migration awal sebagai backend authorization yang sudah selesai.

RLS test wajib dilakukan dengan session masing-masing role.

---

## 12. Service Layer

Business logic penting tidak boleh tersebar di komponen UI.

Contoh service:

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

Nama dapat disesuaikan dengan implementasi, tetapi tanggung jawab harus tetap jelas.

---

## 13. Effective Schedule Engine

Ini merupakan salah satu bagian business logic paling penting.

API konseptual:

```ts
getEffectiveSchedule({
  date,
  teacherId,
  academicPeriodId,
})
```

Output konseptual:

```text
NO_ATTENDANCE
atau
{
  arrivalTime,
  departureTime,
  source
}
```

Resolusi:

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

Tidak membuat tabel effective schedule sebagai source of truth.

---

## 14. Geofence Architecture

Teacher attendance dan student QR attendance menggunakan GPS sesuai requirement.

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
Allow attendance
```

Konfigurasi default radius: **200 meter**.

Sistem menyimpan data lokasi yang diperlukan oleh attendance/audit, tetapi tidak menyimpan device information.

Geofence service harus menjadi pure/testable logic sejauh memungkinkan:

```text
calculateDistance(userLat, userLng, siteLat, siteLng)
validateAccuracy(accuracy)
validateRadius(distance, radius)
```

---

## 15. Teacher Attendance Flow

```text
Teacher opens attendance
       ↓
Load active period
       ↓
Resolve effective schedule
       ↓
Determine arrival/departure action
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
       ↓
Return success
```

Guru tidak boleh mengedit attendance record secara langsung.

---

## 16. Student QR Attendance Flow

```text
Teacher opens QR scanner
       ↓
Camera scans QR
       ↓
Read NISN
       ↓
Find student
       ↓
Teacher manually verifies identity
       ↓
Get teacher GPS
       ↓
Validate location
       ↓
Check duplicate
       ↓
Insert student attendance
       ↓
Store scanner_teacher_id
```

Tidak ada student self-scan.

---

## 17. Daily Status Architecture

Status harian dihitung, bukan disimpan sebagai duplicate master.

Input:

```text
attendance_records
+
effective schedule
+
attendance window / finalization rule
+
leave request + approval
```

Derived statuses mencakup kebutuhan seperti:

- Hadir;
- Terlambat;
- Pulang Cepat;
- Belum Absen Pulang;
- Alpa;
- status perizinan.

Nilai batas yang masih TBD tidak boleh di-hard-code sebelum keputusan final.

---

## 18. Leave & Approval Architecture

Leave request harus mendukung:

- owner Guru atau Siswa;
- category/type;
- tanggal mulai;
- tanggal selesai;
- status;
- attachment bila diaktifkan sesuai keputusan final.

Approval history dipisahkan dari request.

Konseptual:

```text
leave_requests
      │
      └──< leave_approvals
```

Approval authority:

```text
Student leave → Wali Kelas
Teacher leave → Kepala Madrasah
Admin → replacement approver / operational control
```

Dampak approval terhadap daily attendance harus dihitung secara konsisten dengan status engine.

---

## 19. Correction & Audit Architecture

Flow Guru:

```text
Existing attendance
      ↓
Correction request
      ↓
Admin review/edit
      ↓
Attendance updated
      ↓
Audit before/after
```

Admin dapat melakukan direct edit sesuai requirement.

Audit minimal harus dapat merekam informasi perubahan penting, termasuk:

- actor;
- timestamp;
- target/entity;
- before value;
- after value;
- context yang relevan.

Audit visibility: Admin dan Kepala Madrasah.

---

## 20. Dashboard Architecture

Dashboard tidak boleh menjadi tempat menghitung business rule secara terpisah.

```text
Shared services/query layer
          ↓
     role-scoped data
          ↓
       dashboard
```

Metrik inti:

- on-time;
- late;
- leave/sick;
- absent.

Filter dan scope harus mengikuti role.

Dashboard menggunakan reusable `MetricCard`, table, status badge, dan state components.

---

## 21. Reporting Architecture

Report service menyediakan query terstandar untuk:

- harian;
- mingguan;
- bulanan;
- individu;
- kelas;
- Madrasah.

Export layer mengubah result set menjadi:

- Excel;
- PDF.

Business filtering dilakukan sebelum formatting export.

Detail layout export tetap mengikuti keputusan implementasi final dan tidak boleh diinventasikan oleh AI.

---

## 22. Import Architecture

Flow:

```text
Upload Excel
   ↓
Parse
   ↓
Validate schema
   ↓
Validate row data
   ↓
Preview/result
   ↓
Persist valid rows
   ↓
Persist import batch
   ↓
Persist row errors
```

Gunakan:

- `import_batches` untuk satu proses import;
- `import_errors` untuk error per row.

Import harus aman terhadap data invalid dan tidak boleh membuat database dalam keadaan setengah valid tanpa informasi hasil proses.

---

## 23. Storage Architecture

Supabase Storage hanya digunakan untuk file yang memang masuk scope, misalnya attachment izin atau foto yang telah disetujui.

Rules:

- validasi tipe/ukuran sebelum upload;
- gunakan path yang terstruktur;
- akses mengikuti authorization;
- jangan expose bucket private secara publik bila datanya sensitif;
- metadata file harus konsisten dengan database.

Detail attachment masih mengikuti TBD-006 sampai keputusan final dibuat.

---

## 24. Error Handling

Semua feature harus memiliki state:

```text
idle
loading
success
empty
error
```

Error user-facing harus:

- menggunakan bahasa Indonesia sederhana;
- menjelaskan apa yang terjadi;
- bila memungkinkan memberi tindakan berikutnya;
- tidak menampilkan stack trace atau detail internal.

Technical error dicatat pada mekanisme logging yang aman bila diperlukan, tanpa membocorkan secret.

---

## 25. Environment Configuration

Gunakan environment variables untuk konfigurasi.

Contoh `.env.example`:

```text
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

Jangan commit:

- service role key;
- secret key;
- password;
- token private;
- file credential.

Service role key tidak boleh diletakkan di frontend.

---

## 26. API/Database Access Rule

Untuk MVP, frontend dapat menggunakan Supabase client secara langsung untuk operasi yang dilindungi RLS jika operasi tersebut sederhana dan aman.

Gunakan Edge Function/server-side operation hanya bila diperlukan, misalnya:

- secret harus tetap server-side;
- proses kompleks tidak aman di browser;
- integrasi eksternal yang memerlukan credential private;
- operasi batch yang memang membutuhkan server execution.

Jangan membuat API layer tambahan hanya demi arsitektur terlihat kompleks.

---

## 27. Security Architecture

Security minimum:

1. Supabase Auth.
2. RLS.
3. Role/authorization helper.
4. Period isolation.
5. Database constraints.
6. Input validation.
7. Storage access control.
8. No secrets in frontend.
9. Audit trail untuk perubahan penting.
10. Negative authorization tests.

Prinsip:

> UI visibility bukan security boundary.

---

## 28. Testing Architecture

Test dibagi:

```text
Unit
 ├─ geofence calculation
 ├─ schedule resolution
 ├─ status calculation
 └─ validation helpers

Integration
 ├─ Supabase queries
 ├─ authorization
 ├─ RLS
 ├─ attendance transaction
 └─ approval flow

E2E / workflow
 ├─ login
 ├─ teacher attendance
 ├─ student QR
 ├─ leave
 ├─ correction
 └─ report
```

Tidak harus membuat semua level sekaligus pada hari pertama. Mulai dari unit test untuk business logic yang berisiko tinggi dan integration/security test untuk data access.

---

## 29. Deployment Architecture

### Vercel

```text
GitHub
  ↓
Vercel build
  ↓
React/Vite dist
  ↓
Browser
  ↓
Supabase
```

### cPanel

```text
React/Vite build
  ↓
dist/
  ↓
cPanel public web root
  ↓
Browser
  ↓
Supabase
```

Supabase tetap menjadi backend sehingga frontend hosting dapat diganti tanpa memindahkan database/auth.

---

## 30. Build and Release Gates

Sebelum merge/deploy:

```text
npm install
npm run lint
npm run build
npm run test
```

Perintah aktual dapat disesuaikan dengan package configuration, tetapi harus ada equivalent checks.

Production release harus melewati:

- build;
- functional smoke test;
- auth test;
- role test;
- RLS/security test;
- critical attendance test;
- responsive check.

---

## 31. Technical Decision Rules

Jika Kilo Code mengusulkan library/arsitektur baru, jawab dengan pertanyaan:

1. Apakah diperlukan requirement?
2. Apakah fitur dapat dibuat dengan stack yang sudah dipilih?
3. Apakah menambah dependency yang tidak perlu?
4. Apakah memperumit maintenance pemula?
5. Apakah memengaruhi security?
6. Apakah memengaruhi deployment Vercel/cPanel?

Jika tidak diperlukan, jangan ditambahkan.

---

## 32. Implementation Boundaries

### UI layer

Boleh:

- render data;
- form interaction;
- state presentation;
- navigation.

Tidak boleh menjadi tempat utama untuk:

- authorization security;
- database integrity;
- complex business rules.

### Service layer

Boleh:

- orchestration;
- business rule composition;
- data operations;
- validation coordination.

### Database

Harus menangani:

- persistence;
- FK;
- unique constraints;
- check constraints;
- RLS.

### Supabase Auth

Menangani identity/session.

---

## 33. Architecture Acceptance Checklist

- [ ] React + TypeScript + Vite ditetapkan.
- [ ] Tailwind ditetapkan.
- [ ] Supabase menjadi backend utama.
- [ ] Auth menggunakan Supabase Auth.
- [ ] PostgreSQL menjadi source of truth.
- [ ] RLS menjadi security boundary data.
- [ ] Multi-role didukung.
- [ ] Period isolation didukung.
- [ ] Effective schedule dihitung, bukan disimpan sebagai tabel.
- [ ] Daily status dihitung, bukan duplicate table.
- [ ] QR static berbasis NISN.
- [ ] Student self-scan tidak ada.
- [ ] Device information tidak disimpan.
- [ ] Geofence 200m default.
- [ ] GPS accuracy <=30m.
- [ ] Attendance duplicate dicegah database.
- [ ] Correction dan audit terpisah secara konsep.
- [ ] Dashboard menggunakan shared query/business logic.
- [ ] Export dipisahkan dari report query.
- [ ] Import memiliki batch + row error.
- [ ] Responsive desktop + Android.
- [ ] Tidak ada fitur di luar scope.

---

## 34. Handoff ke Kilo Code

Dokumen ini belum merupakan prompt implementasi per task.

Kilo Code harus menerima dokumen ini bersama:

```text
000 Spesifikasi Aplikasi
001 BRD Final
002 Functional Specification Final
003 Data Model Specification
004 ERD
005 Supabase Migration
006 Stitch UI/UX Prompt Plan
007 Final UX Simplification Review & Implementation Blueprint
008 Development Master Plan
009 Technical Architecture
```

Urutan kerja berikutnya adalah membuat **010 Kilo Code Master Instructions** dan **011 Development Task Breakdown**.

---

## 35. Status

**Technical Architecture v1.0 — READY AS IMPLEMENTATION BASELINE**

Arsitektur ini mendefinisikan struktur teknis tanpa mengubah business requirements. Semua TBD yang belum diputuskan tetap harus diselesaikan melalui decision record sebelum memengaruhi implementasi.
