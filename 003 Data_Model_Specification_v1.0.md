# Data Model Specification v1.0
## Sistem Absensi Madrasah

**Status:** Draft/Finalisasi Data Model  
**Basis:** BRD v1.3 dan Functional Specification v2.0  
**Tanggal:** 23 September 2026  
**Target Database:** PostgreSQL / Supabase

---

## 1. Tujuan

Dokumen ini menerjemahkan kebutuhan bisnis dan functional specification Sistem Absensi Madrasah menjadi spesifikasi data model tingkat implementasi.

Functional Specification menyatakan bahwa dokumen tersebut menjadi dasar untuk Data Model, API/Service, Technical Specification, Development, dan Testing, tetapi tidak menetapkan struktur tabel database final. Karena itu, spesifikasi di bawah ini merupakan rancangan data model yang diturunkan dari aturan bisnis dan perilaku sistem pada BRD/FS. 

**Catatan penting:** nama tabel dan tipe data di dokumen ini adalah keputusan desain data model, bukan nama tabel yang secara eksplisit ditetapkan oleh BRD/FS.

---

## 2. Prinsip Data Model

1. **Authentication menggunakan Supabase Auth** (`auth.users`) sebagai identity pengguna.
2. Data profil aplikasi disimpan pada tabel `users`.
3. Satu user dapat memiliki lebih dari satu role.
4. Semua data yang bersifat periodik harus memiliki konteks `academic_period_id` jika memang terikat pada periode akademik.
5. Riwayat siswa antarkelas tidak boleh ditimpa; gunakan tabel membership per periode.
6. Jadwal efektif tidak disimpan sebagai master permanen; jadwal dihitung berdasarkan prioritas:
   - special calendar date;
   - jika hari tersebut bukan holiday, special schedule;
   - teacher override;
   - standard schedule.
7. Attendance disimpan sebagai satu tabel ter-normalisasi untuk attendance Guru maupun Siswa.
8. Satu entitas hanya boleh memiliki satu attendance untuk setiap tanggal dan kategori (`ARRIVAL`/`DEPARTURE`).
9. Status harian seperti `Absent` dan `Not Yet Checked Out` sebaiknya diturunkan dari data attendance + leave, bukan menjadi sumber data terpisah.
10. Tidak menyimpan device information karena BRD/FS secara eksplisit mengecualikannya.
11. Semua perubahan administratif penting harus dapat diaudit.

---

# 3. Entity Inventory

| No | Entity | Fungsi |
|---:|---|---|
| 1 | `users` | Profil pengguna aplikasi |
| 2 | `roles` | Master role |
| 3 | `user_roles` | Relasi user dengan role |
| 4 | `madrasah` | Master madrasah |
| 5 | `teachers` | Master guru |
| 6 | `students` | Master siswa |
| 7 | `academic_periods` | Periode akademik |
| 8 | `classes` | Master kelas/rombel |
| 9 | `student_class_memberships` | Riwayat siswa pada kelas/rombel per periode |
| 10 | `class_homeroom_assignments` | Penugasan wali kelas |
| 11 | `standard_schedules` | Jadwal standar kedatangan/kepulangan |
| 12 | `special_calendar_dates` | Kalender tanggal khusus/libur |
| 13 | `teacher_schedule_overrides` | Override jadwal individual guru |
| 14 | `attendance_records` | Record attendance Guru/Siswa |
| 15 | `leave_types` | Master jenis izin/cuti |
| 16 | `leave_requests` | Pengajuan izin Guru/Siswa |
| 17 | `leave_attachments` | Lampiran izin |
| 18 | `leave_approvals` | Riwayat approval izin |
| 19 | `attendance_correction_requests` | Pengajuan koreksi attendance oleh Guru |
| 20 | `audit_logs` | Audit trail perubahan |
| 21 | `import_batches` | Batch import Excel |
| 22 | `import_errors` | Detail error import |

---

# 4. Konvensi Tipe Data

| Tipe | Penggunaan |
|---|---|
| `uuid` | Primary key / foreign key entity utama |
| `text` | String bebas |
| `varchar(n)` | String dengan panjang maksimum yang jelas |
| `date` | Tanggal kalender |
| `time` | Jam |
| `timestamptz` | Timestamp dengan timezone |
| `boolean` | Nilai true/false |
| `integer` | Bilangan bulat |
| `numeric(p,s)` | Angka desimal presisi |
| `jsonb` | Snapshot/metadata terstruktur |
| `bytea` | Tidak direkomendasikan untuk file upload; gunakan object storage dan simpan path |
| `enum` | Nilai status/kategori yang stabil; dapat juga diimplementasikan sebagai `text + CHECK` |

> Rancangan ini menggunakan `uuid` untuk primary key aplikasi agar aman untuk distributed/web application. Kode bisnis seperti NIK/NISN tetap disimpan sebagai string dan memiliki unique constraint sesuai kebutuhan.

---

# 5. Detail Data Model

## 5.1 `users`

Profil pengguna aplikasi. Identity login berasal dari Supabase Auth.

| Entity | Attribute | Data Type | PK/FK | Nullable | Default | Unique | Constraint | Relationship | Cardinality | Source Business Rule |
|---|---|---|---|---|---|---|---|---|---|---|
| users | id | uuid | PK | No | `gen_random_uuid()` | Yes | Primary key; idealnya mereferensikan `auth.users.id` | users → auth.users | 1:1 | FS Auth: login/account/session |
| users | full_name | text | - | No | - | No | Trimmed, non-empty | - | - | FS User Management |
| users | email | text | - | No | - | Yes | Format email; sinkron dengan identity login bila digunakan | - | - | FS Authentication |
| users | phone | varchar(30) | - | Yes | NULL | No | - | - | - | BRD Master Account |
| users | is_active | boolean | - | No | `true` | No | Akun nonaktif tidak dapat login/authorized | - | - | BRD/FS Auth & Account Status |
| users | created_at | timestamptz | - | No | `now()` | No | - | - | - | General auditability |
| users | updated_at | timestamptz | - | No | `now()` | No | - | - | - | General auditability |

**Catatan:** jika email dikelola sepenuhnya oleh Supabase Auth, `users.email` dapat dibuat sebagai cached/profile field atau tidak disimpan. Jika disimpan, sinkronisasi harus ditentukan pada implementation stage.

---

## 5.2 `roles`

Master role sistem.

| Entity | Attribute | Data Type | PK/FK | Nullable | Default | Unique | Constraint | Relationship | Cardinality | Source Business Rule |
|---|---|---|---|---|---|---|---|---|---|---|
| roles | id | uuid | PK | No | `gen_random_uuid()` | Yes | Primary key | roles → user_roles | 1:N | BRD Role |
| roles | code | varchar(50) | - | No | - | Yes | `ADMIN`, `GURU`, `WALI_KELAS`, `SISWA`, `KEPALA_MADRASAH` | roles → user_roles | 1:N | BRD/FS Actors |
| roles | name | varchar(100) | - | No | - | No | Non-empty | - | - | BRD Role |
| roles | description | text | - | Yes | NULL | No | - | - | - | General documentation |

---

## 5.3 `user_roles`

Relasi many-to-many antara user dan role.

| Entity | Attribute | Data Type | PK/FK | Nullable | Default | Unique | Constraint | Relationship | Cardinality | Source Business Rule |
|---|---|---|---|---|---|---|---|---|---|---|
| user_roles | user_id | uuid | PK, FK | No | - | Composite | FK → users.id | users ↔ roles | N:M | BRD multi-role |
| user_roles | role_id | uuid | PK, FK | No | - | Composite | FK → roles.id | roles ↔ users | N:M | BRD multi-role |
| user_roles | created_at | timestamptz | - | No | `now()` | No | - | - | - | General auditability |

**Unique:** `(user_id, role_id)`.

---

## 5.4 `madrasah`

Master madrasah.

| Entity | Attribute | Data Type | PK/FK | Nullable | Default | Unique | Constraint | Relationship | Cardinality | Source Business Rule |
|---|---|---|---|---|---|---|---|---|---|---|
| madrasah | id | uuid | PK | No | `gen_random_uuid()` | Yes | Primary key | madrasah → teachers/students/classes/etc. | 1:N | BRD Master Madrasah |
| madrasah | name | text | - | No | - | No | Non-empty | - | - | BRD Master Madrasah |
| madrasah | address | text | - | Yes | NULL | No | - | - | - | BRD Master Madrasah |
| madrasah | latitude | numeric(9,6) | - | No | - | No | `-90 <= latitude <= 90` | - | - | BRD Geofence |
| madrasah | longitude | numeric(9,6) | - | No | - | No | `-180 <= longitude <= 180` | - | - | BRD Geofence |
| madrasah | geofence_radius_meter | numeric(8,2) | - | No | `200` | No | `> 0` | - | - | BRD/FS default radius 200m |
| madrasah | max_gps_accuracy_meter | numeric(8,2) | - | No | `30` | No | `> 0` | - | - | BRD/FS accuracy threshold |
| madrasah | created_at | timestamptz | - | No | `now()` | No | - | - | - | General auditability |
| madrasah | updated_at | timestamptz | - | No | `now()` | No | - | - | - | General auditability |

---

## 5.5 `teachers`

Master guru.

| Entity | Attribute | Data Type | PK/FK | Nullable | Default | Unique | Constraint | Relationship | Cardinality | Source Business Rule |
|---|---|---|---|---|---|---|---|---|---|---|
| teachers | id | uuid | PK | No | `gen_random_uuid()` | Yes | Primary key | teachers → attendance/leave/override | 1:N | BRD Master Guru |
| teachers | user_id | uuid | FK | Yes | NULL | Yes | FK → users.id; unique bila 1 akun per guru | users → teachers | 1:0..1 | BRD Accounts; role Guru |
| teachers | madrasah_id | uuid | FK | No | - | No | FK → madrasah.id | madrasah → teachers | 1:N | BRD Master Guru |
| teachers | nik | varchar(50) | - | No | - | Yes | Non-empty | - | - | BRD Master Guru |
| teachers | full_name | text | - | No | - | No | Non-empty | - | - | BRD Master Guru |
| teachers | subject | text | Yes | Yes | NULL | No | - | - | - | BRD Master Guru |
| teachers | photo_url | text | - | Yes | NULL | No | Object storage URL/path | - | - | BRD Master Guru |
| teachers | phone | varchar(30) | - | Yes | NULL | No | - | - | - | BRD Master Guru |
| teachers | is_active | boolean | - | No | `true` | No | - | - | - | Account/master activation |
| teachers | created_at | timestamptz | - | No | `now()` | No | - | - | - | General |
| teachers | updated_at | timestamptz | - | No | `now()` | No | - | - | - | General |

---

## 5.6 `students`

Master siswa.

| Entity | Attribute | Data Type | PK/FK | Nullable | Default | Unique | Constraint | Relationship | Cardinality | Source Business Rule |
|---|---|---|---|---|---|---|---|---|---|---|
| students | id | uuid | PK | No | `gen_random_uuid()` | Yes | Primary key | students → attendance/leave/membership | 1:N | BRD Master Siswa |
| students | user_id | uuid | FK | Yes | NULL | Yes | FK → users.id; unique bila siswa memiliki akun | users → students | 1:0..1 | BRD Accounts |
| students | madrasah_id | uuid | FK | No | - | No | FK → madrasah.id | madrasah → students | 1:N | BRD Master Siswa |
| students | nisn | varchar(20) | - | No | - | Yes | Non-empty; QR mengandung NISN | - | - | BRD/FS Static QR |
| students | full_name | text | - | No | - | No | Non-empty | - | - | BRD Master Siswa |
| students | major | text | - | Yes | NULL | No | - | - | - | BRD Master Siswa |
| students | photo_url | text | - | Yes | NULL | No | Object storage URL/path | - | - | BRD Master Siswa |
| students | phone | varchar(30) | - | Yes | NULL | No | - | - | - | BRD Master Siswa |
| students | is_active | boolean | - | No | `true` | No | - | - | - | Master/account status |
| students | created_at | timestamptz | - | No | `now()` | No | - | - | - | General |
| students | updated_at | timestamptz | - | No | `now()` | No | - | - | - | General |

---

## 5.7 `academic_periods`

Periode akademik dan konteks isolasi data.

| Entity | Attribute | Data Type | PK/FK | Nullable | Default | Unique | Constraint | Relationship | Cardinality | Source Business Rule |
|---|---|---|---|---|---|---|---|---|---|---|
| academic_periods | id | uuid | PK | No | `gen_random_uuid()` | Yes | Primary key | academic_periods → period data | 1:N | BR-001 / BRD Period |
| academic_periods | madrasah_id | uuid | FK | No | - | No | FK → madrasah.id | madrasah → academic_periods | 1:N | BRD Period |
| academic_periods | name | varchar(100) | - | No | - | No | Non-empty | - | - | BRD Period |
| academic_periods | start_date | date | - | No | - | No | `< end_date` | - | - | BRD Period |
| academic_periods | end_date | date | - | No | - | No | `> start_date` | - | - | BRD Period |
| academic_periods | is_active | boolean | - | No | `false` | No | Maksimal satu active period per madrasah | - | - | BR-001 |
| academic_periods | created_at | timestamptz | - | No | `now()` | No | - | - | - | General |
| academic_periods | updated_at | timestamptz | - | No | `now()` | No | - | - | - | General |

**Recommended DB rule:** partial unique index pada `madrasah_id WHERE is_active = true`.

---

## 5.8 `classes`

Master kelas/rombel.

| Entity | Attribute | Data Type | PK/FK | Nullable | Default | Unique | Constraint | Relationship | Cardinality | Source Business Rule |
|---|---|---|---|---|---|---|---|---|---|---|
| classes | id | uuid | PK | No | `gen_random_uuid()` | Yes | Primary key | classes → membership/homeroom | 1:N | BRD Class/Rombel |
| classes | madrasah_id | uuid | FK | No | - | No | FK → madrasah.id | madrasah → classes | 1:N | BRD Master Class |
| classes | academic_period_id | uuid | FK | No | - | No | FK → academic_periods.id | period → classes | 1:N | BR-001 / period context |
| classes | name | varchar(100) | - | No | - | No | Non-empty | - | - | BRD Class/Rombel |
| classes | code | varchar(50) | - | Yes | NULL | No | Unique per period recommended | - | - | BRD Class/Rombel |
| classes | grade_level | varchar(30) | - | Yes | NULL | No | - | - | - | BRD Class/Rombel |
| classes | is_active | boolean | - | No | `true` | No | - | - | - | Master management |
| classes | created_at | timestamptz | - | No | `now()` | No | - | - | - | General |
| classes | updated_at | timestamptz | - | No | `now()` | No | - | - | - | General |

**Recommended unique:** `(academic_period_id, name)`.

---

## 5.9 `student_class_memberships`

Riwayat penempatan siswa pada kelas/rombel.

| Entity | Attribute | Data Type | PK/FK | Nullable | Default | Unique | Constraint | Relationship | Cardinality | Source Business Rule |
|---|---|---|---|---|---|---|---|---|---|---|
| student_class_memberships | id | uuid | PK | No | `gen_random_uuid()` | Yes | Primary key | students/classes → membership | 1:N | BRD Period isolation |
| student_class_memberships | academic_period_id | uuid | FK | No | - | No | FK → academic_periods.id | period → membership | 1:N | BR-001 |
| student_class_memberships | student_id | uuid | FK | No | - | No | FK → students.id | student → membership | 1:N | BRD Master Student |
| student_class_memberships | class_id | uuid | FK | No | - | No | FK → classes.id | class → membership | 1:N | BRD Class/Rombel |
| student_class_memberships | start_date | date | - | Yes | NULL | No | Within period if supplied | - | - | Period history |
| student_class_memberships | end_date | date | - | Yes | NULL | No | `start_date <= end_date` | - | - | Period history |
| student_class_memberships | is_active | boolean | - | No | `true` | No | At most one active membership per student per period | - | - | Period isolation |
| student_class_memberships | created_at | timestamptz | - | No | `now()` | No | - | - | - | General |
| student_class_memberships | updated_at | timestamptz | - | No | `now()` | No | - | - | - | General |

**Recommended unique:** `(academic_period_id, student_id)` if business rules guarantee one class at a time.

---

## 5.10 `class_homeroom_assignments`

Penugasan wali kelas.

| Entity | Attribute | Data Type | PK/FK | Nullable | Default | Unique | Constraint | Relationship | Cardinality | Source Business Rule |
|---|---|---|---|---|---|---|---|---|---|---|
| class_homeroom_assignments | id | uuid | PK | No | `gen_random_uuid()` | Yes | Primary key | classes/teachers → assignment | 1:N | BRD Wali Kelas |
| class_homeroom_assignments | academic_period_id | uuid | FK | No | - | No | FK → academic_periods.id | period → assignment | 1:N | BR-001 |
| class_homeroom_assignments | class_id | uuid | FK | No | - | No | FK → classes.id | class → assignment | 1:N | BRD Wali Kelas |
| class_homeroom_assignments | teacher_id | uuid | FK | No | - | No | FK → teachers.id | teacher → assignment | 1:N | BRD Wali Kelas |
| class_homeroom_assignments | start_date | date | - | Yes | NULL | No | - | - | - | Assignment history |
| class_homeroom_assignments | end_date | date | - | Yes | NULL | No | `start_date <= end_date` | - | - | Assignment history |
| class_homeroom_assignments | is_active | boolean | - | No | `true` | No | At most one active homeroom assignment per class/period | - | - | BRD approval default |
| class_homeroom_assignments | created_at | timestamptz | - | No | `now()` | No | - | - | - | General |
| class_homeroom_assignments | updated_at | timestamptz | - | No | `now()` | No | - | - | - | General |

---

## 5.11 `standard_schedules`

Jadwal standar kedatangan dan kepulangan.

| Entity | Attribute | Data Type | PK/FK | Nullable | Default | Unique | Constraint | Relationship | Cardinality | Source Business Rule |
|---|---|---|---|---|---|---|---|---|---|---|
| standard_schedules | id | uuid | PK | No | `gen_random_uuid()` | Yes | Primary key | period → standard schedule | 1:N | BRD Standard Schedule |
| standard_schedules | academic_period_id | uuid | FK | No | - | No | FK → academic_periods.id | academic_periods → schedules | 1:N | BR-001 |
| standard_schedules | day_of_week | integer | - | No | - | No | 0..6 sesuai convention aplikasi | - | - | BRD active days Sat-Thu |
| standard_schedules | arrival_time | time | - | No | - | No | Valid time | - | - | BRD Standard Arrival |
| standard_schedules | departure_time | time | - | No | - | No | `> arrival_time` | - | - | BRD Standard Departure |
| standard_schedules | is_active | boolean | - | No | `true` | No | - | - | - | Schedule management |
| standard_schedules | created_at | timestamptz | - | No | `now()` | No | - | - | - | General |
| standard_schedules | updated_at | timestamptz | - | No | `now()` | No | - | - | - | General |

**Recommended unique:** `(academic_period_id, day_of_week)`.

**Friday:** tidak perlu menjadi row attendance schedule jika diperlakukan sebagai routine holiday; implementasi dapat merepresentasikan Jumat sebagai inactive/no schedule.

---

## 5.12 `special_calendar_dates`

Tanggal khusus: holiday atau active date dengan special schedule.

| Entity | Attribute | Data Type | PK/FK | Nullable | Default | Unique | Constraint | Relationship | Cardinality | Source Business Rule |
|---|---|---|---|---|---|---|---|---|---|---|
| special_calendar_dates | id | uuid | PK | No | `gen_random_uuid()` | Yes | Primary key | period → special dates | 1:N | BRD Special Calendar |
| special_calendar_dates | academic_period_id | uuid | FK | No | - | No | FK → academic_periods.id | period → special dates | 1:N | BR-001 |
| special_calendar_dates | calendar_date | date | - | No | - | Composite | One record per period/date | - | - | BRD Special Calendar |
| special_calendar_dates | day_type | varchar(30) | - | No | - | No | `HOLIDAY` or `ACTIVE_SPECIAL` | - | - | BRD priority |
| special_calendar_dates | arrival_time | time | - | Yes | NULL | No | Required for `ACTIVE_SPECIAL` | - | - | BRD special schedule |
| special_calendar_dates | departure_time | time | - | Yes | NULL | No | Required for `ACTIVE_SPECIAL` | - | - | BRD special schedule |
| special_calendar_dates | reason | text | - | Yes | NULL | No | - | - | - | Special calendar explanation |
| special_calendar_dates | created_at | timestamptz | - | No | `now()` | No | - | - | - | General |
| special_calendar_dates | updated_at | timestamptz | - | No | `now()` | No | - | - | - | General |

**Recommended unique:** `(academic_period_id, calendar_date)`.

---

## 5.13 `teacher_schedule_overrides`

Override jadwal individual guru.

| Entity | Attribute | Data Type | PK/FK | Nullable | Default | Unique | Constraint | Relationship | Cardinality | Source Business Rule |
|---|---|---|---|---|---|---|---|---|---|---|
| teacher_schedule_overrides | id | uuid | PK | No | `gen_random_uuid()` | Yes | Primary key | teacher/period/date → override | 1:N | BRD Teacher Override |
| teacher_schedule_overrides | academic_period_id | uuid | FK | No | - | No | FK → academic_periods.id | period → overrides | 1:N | BR-001 |
| teacher_schedule_overrides | teacher_id | uuid | FK | No | - | No | FK → teachers.id | teacher → overrides | 1:N | BRD Teacher Override |
| teacher_schedule_overrides | override_date | date | - | No | - | Composite | Date within period | - | - | BRD Teacher Override |
| teacher_schedule_overrides | arrival_time | time | - | No | - | No | Valid time | - | - | BRD Teacher Override |
| teacher_schedule_overrides | departure_time | time | - | No | - | No | `> arrival_time` | - | - | BRD Teacher Override |
| teacher_schedule_overrides | reason | text | - | Yes | NULL | No | - | - | - | General schedule management |
| teacher_schedule_overrides | created_at | timestamptz | - | No | `now()` | No | - | - | - | General |
| teacher_schedule_overrides | updated_at | timestamptz | - | No | `now()` | No | - | - | - | General |

**Recommended unique:** `(academic_period_id, teacher_id, override_date)`.

---

## 5.14 `attendance_records`

Record attendance untuk Guru maupun Siswa.

> Desain ini memakai satu tabel dengan `teacher_id` XOR `student_id`: tepat satu harus terisi.

| Entity | Attribute | Data Type | PK/FK | Nullable | Default | Unique | Constraint | Relationship | Cardinality | Source Business Rule |
|---|---|---|---|---|---|---|---|---|---|---|
| attendance_records | id | uuid | PK | No | `gen_random_uuid()` | Yes | Primary key | entity → attendance | 1:N | BRD Attendance |
| attendance_records | academic_period_id | uuid | FK | No | - | No | FK → academic_periods.id | period → attendance | 1:N | BR-001 |
| attendance_records | teacher_id | uuid | FK | Yes | NULL | Conditional | XOR with student_id | teacher → attendance | 1:N | BRD Teacher Attendance |
| attendance_records | student_id | uuid | FK | Yes | NULL | Conditional | XOR with teacher_id | student → attendance | 1:N | BRD Student Attendance |
| attendance_records | attendance_date | date | - | No | - | Composite | Within academic period | - | - | BRD date context |
| attendance_records | category | varchar(20) | - | No | - | Composite | `ARRIVAL` or `DEPARTURE` | - | - | BRD arrival/departure |
| attendance_records | status | varchar(30) | - | No | - | No | `PRESENT`, `LATE`, `EARLY_DEPARTURE` for stored event; broader daily status derived separately | - | - | BRD Status |
| attendance_records | checked_at | timestamptz | - | No | `now()` | No | - | - | - | BRD timestamp |
| attendance_records | latitude | numeric(9,6) | - | No | - | No | `-90 <= latitude <= 90` | - | - | BRD GPS storage |
| attendance_records | longitude | numeric(9,6) | - | No | - | No | `-180 <= longitude <= 180` | - | - | BRD GPS storage |
| attendance_records | distance_meter | numeric(10,2) | - | No | - | No | `>= 0` | - | - | BRD distance storage |
| attendance_records | gps_accuracy_meter | numeric(10,2) | - | Yes | NULL | No | If present, `>= 0`; validation `<=30m` | - | - | FS GPS accuracy validation |
| attendance_records | scanner_teacher_id | uuid | FK | Yes | NULL | Conditional | Required for student attendance; NULL for teacher self attendance | teacher → scanned attendance | 0..1:N | BRD Student scanner |
| attendance_records | created_at | timestamptz | - | No | `now()` | No | - | - | - | General |
| attendance_records | updated_at | timestamptz | - | No | `now()` | No | - | - | - | Correction/audit |

### Required CHECK constraints

```sql
CHECK (
  (teacher_id IS NOT NULL AND student_id IS NULL)
  OR
  (teacher_id IS NULL AND student_id IS NOT NULL)
);

CHECK (
  (student_id IS NOT NULL AND scanner_teacher_id IS NOT NULL)
  OR
  (teacher_id IS NOT NULL AND scanner_teacher_id IS NULL)
);
```

### Anti-duplicate rule

Recommended partial unique indexes:

```sql
CREATE UNIQUE INDEX uq_teacher_attendance_event
ON attendance_records (teacher_id, attendance_date, category)
WHERE teacher_id IS NOT NULL;

CREATE UNIQUE INDEX uq_student_attendance_event
ON attendance_records (student_id, attendance_date, category)
WHERE student_id IS NOT NULL;
```

This directly implements the rule that one entity can have no more than one attendance per date and category.

---

## 5.15 `leave_types`

Master jenis izin.

| Entity | Attribute | Data Type | PK/FK | Nullable | Default | Unique | Constraint | Relationship | Cardinality | Source Business Rule |
|---|---|---|---|---|---|---|---|---|---|---|
| leave_types | id | uuid | PK | No | `gen_random_uuid()` | Yes | Primary key | leave_types → leave_requests | 1:N | BRD Leave |
| leave_types | code | varchar(50) | - | No | - | Yes | `STUDENT_IZIN`, `STUDENT_SAKIT`, `TEACHER_SAKIT`, `TEACHER_PERSONAL`, `TEACHER_OFFICIAL_DUTY`, `TEACHER_OTHER` | - | - | BRD Student/Teacher Leave |
| leave_types | name | varchar(100) | - | No | - | No | Non-empty | - | - | BRD Leave |
| leave_types | actor_type | varchar(20) | - | No | - | No | `STUDENT` or `TEACHER` | - | - | BRD Leave |
| leave_types | is_active | boolean | - | No | `true` | No | - | - | - | Master management |
| leave_types | created_at | timestamptz | - | No | `now()` | No | - | - | - | General |

---

## 5.16 `leave_requests`

Pengajuan izin Guru/Siswa.

> Satu row mewakili satu pengajuan dan harus terkait tepat ke satu actor: student atau teacher.

| Entity | Attribute | Data Type | PK/FK | Nullable | Default | Unique | Constraint | Relationship | Cardinality | Source Business Rule |
|---|---|---|---|---|---|---|---|---|---|---|
| leave_requests | id | uuid | PK | No | `gen_random_uuid()` | Yes | Primary key | actor → leave requests | 1:N | BRD Leave |
| leave_requests | academic_period_id | uuid | FK | No | - | No | FK → academic_periods.id | period → leave requests | 1:N | BR-001 |
| leave_requests | student_id | uuid | FK | Yes | NULL | Conditional | XOR with teacher_id | student → leave requests | 1:N | BRD Student Leave |
| leave_requests | teacher_id | uuid | FK | Yes | NULL | Conditional | XOR with student_id | teacher → leave requests | 1:N | BRD Teacher Leave |
| leave_requests | leave_type_id | uuid | FK | No | - | No | FK → leave_types.id | leave_type → requests | 1:N | BRD Leave Type |
| leave_requests | start_date | date | - | No | - | No | - | - | - | BRD single/range date |
| leave_requests | end_date | date | - | No | - | No | `>= start_date` | - | - | BRD date range |
| leave_requests | reason | text | - | Yes | NULL | No | - | - | - | Leave submission |
| leave_requests | status | varchar(30) | - | No | `PENDING` | No | `PENDING`, `APPROVED`, `REJECTED` | - | - | BRD approval status |
| leave_requests | submitted_by_user_id | uuid | FK | No | - | No | FK → users.id | user → leave request | 1:N | General auditability |
| leave_requests | submitted_at | timestamptz | - | No | `now()` | No | - | - | - | BRD submission |
| leave_requests | created_at | timestamptz | - | No | `now()` | No | - | - | - | General |
| leave_requests | updated_at | timestamptz | - | No | `now()` | No | - | - | - | General |

### Required CHECK

```sql
CHECK (
  (student_id IS NOT NULL AND teacher_id IS NULL)
  OR
  (student_id IS NULL AND teacher_id IS NOT NULL)
);
```

---

## 5.17 `leave_attachments`

Lampiran pengajuan izin.

| Entity | Attribute | Data Type | PK/FK | Nullable | Default | Unique | Constraint | Relationship | Cardinality | Source Business Rule |
|---|---|---|---|---|---|---|---|---|---|---|
| leave_attachments | id | uuid | PK | No | `gen_random_uuid()` | Yes | Primary key | leave_request → attachment | 1:0..1 | BRD attachment max 1 |
| leave_attachments | leave_request_id | uuid | FK | No | - | Yes | FK → leave_requests.id; one attachment per request | leave_requests → attachments | 1:0..1 | BRD max 1 attachment |
| leave_attachments | file_name | text | - | No | - | No | Non-empty | - | - | BRD attachment |
| leave_attachments | storage_path | text | - | No | - | No | Non-empty | - | - | Implementation |
| leave_attachments | mime_type | varchar(100) | - | No | - | No | PDF/JPG/JPEG/PNG | - | - | BRD attachment |
| leave_attachments | file_size_bytes | bigint | - | No | - | No | `<= 2MB` | - | - | BRD max 2MB |
| leave_attachments | created_at | timestamptz | - | No | `now()` | No | - | - | - | General |

---

## 5.18 `leave_approvals`

Riwayat approval/cancellation izin.

| Entity | Attribute | Data Type | PK/FK | Nullable | Default | Unique | Constraint | Relationship | Cardinality | Source Business Rule |
|---|---|---|---|---|---|---|---|---|---|---|
| leave_approvals | id | uuid | PK | No | `gen_random_uuid()` | Yes | Primary key | leave_request → approval history | 1:N | BRD Approval |
| leave_approvals | leave_request_id | uuid | FK | No | - | No | FK → leave_requests.id | leave → approvals | 1:N | BRD Approval |
| leave_approvals | approver_user_id | uuid | FK | No | - | No | FK → users.id | user → approvals | 1:N | BRD Approval |
| leave_approvals | action | varchar(30) | - | No | - | No | `APPROVED`, `REJECTED`, `CANCEL_APPROVAL`, `RETURNED_TO_PENDING` | - | - | BRD approval/cancel |
| leave_approvals | note | text | - | Yes | NULL | No | - | - | - | Approval note |
| leave_approvals | acted_at | timestamptz | - | No | `now()` | No | - | - | - | Auditability |
| leave_approvals | created_at | timestamptz | - | No | `now()` | No | - | - | - | General |

**Current status** tetap berada di `leave_requests.status`; `leave_approvals` adalah history.

---

## 5.19 `attendance_correction_requests`

Permintaan koreksi attendance oleh Guru.

| Entity | Attribute | Data Type | PK/FK | Nullable | Default | Unique | Constraint | Relationship | Cardinality | Source Business Rule |
|---|---|---|---|---|---|---|---|---|---|---|
| attendance_correction_requests | id | uuid | PK | No | `gen_random_uuid()` | Yes | Primary key | attendance → correction requests | 1:N | BRD Correction |
| attendance_correction_requests | attendance_record_id | uuid | FK | No | - | No | FK → attendance_records.id | attendance → correction | 1:N | BRD Correction |
| attendance_correction_requests | requested_by_teacher_id | uuid | FK | No | - | No | FK → teachers.id | teacher → requests | 1:N | BRD Teacher correction |
| attendance_correction_requests | requested_at | timestamptz | - | No | `now()` | No | - | - | - | BRD Correction |
| attendance_correction_requests | requested_changes | jsonb | - | No | - | No | Must contain valid change payload | - | - | BRD Correction |
| attendance_correction_requests | reason | text | - | Yes | NULL | No | Optional per BRD | - | - | BRD Correction |
| attendance_correction_requests | status | varchar(30) | - | No | `PENDING` | No | `PENDING`, `APPROVED`, `REJECTED` | - | - | Correction workflow |
| attendance_correction_requests | reviewed_by_user_id | uuid | FK | Yes | NULL | No | FK → users.id | admin → request | 0..1:N | BRD Admin review |
| attendance_correction_requests | reviewed_at | timestamptz | - | Yes | NULL | No | - | - | - | BRD Admin review |
| attendance_correction_requests | review_note | text | - | Yes | NULL | No | - | - | - | General |
| attendance_correction_requests | created_at | timestamptz | - | No | `now()` | No | - | - | - | General |
| attendance_correction_requests | updated_at | timestamptz | - | No | `now()` | No | - | - | - | General |

**Catatan:** Admin dapat mengubah attendance secara langsung tanpa correction request. Direct edit tersebut tetap harus menghasilkan `audit_logs`.

---

## 5.20 `audit_logs`

Audit trail untuk perubahan administratif.

| Entity | Attribute | Data Type | PK/FK | Nullable | Default | Unique | Constraint | Relationship | Cardinality | Source Business Rule |
|---|---|---|---|---|---|---|---|---|---|---|
| audit_logs | id | uuid | PK | No | `gen_random_uuid()` | Yes | Primary key | user → audit logs | 1:N | BRD Audit |
| audit_logs | actor_user_id | uuid | FK | No | - | No | FK → users.id | users → audit_logs | 1:N | BRD Audit |
| audit_logs | action | varchar(50) | - | No | - | No | Non-empty | - | - | BRD Audit |
| audit_logs | entity_type | varchar(100) | - | No | - | No | Non-empty | - | - | BRD Audit |
| audit_logs | entity_id | uuid | - | No | - | No | ID entity yang berubah | - | - | BRD Audit |
| audit_logs | before_data | jsonb | - | Yes | NULL | No | Snapshot before | - | - | BRD Audit before/after |
| audit_logs | after_data | jsonb | - | Yes | NULL | No | Snapshot after | - | - | BRD Audit before/after |
| audit_logs | created_at | timestamptz | - | No | `now()` | No | - | - | - | BRD Audit timestamp |

**Catatan:** `entity_id` tidak dibuat FK polymorphic karena satu kolom dapat menunjuk banyak tabel. Integritas entity harus dijaga pada service/application layer.

---

## 5.21 `import_batches`

Batch import Excel.

| Entity | Attribute | Data Type | PK/FK | Nullable | Default | Unique | Constraint | Relationship | Cardinality | Source Business Rule |
|---|---|---|---|---|---|---|---|---|---|---|
| import_batches | id | uuid | PK | No | `gen_random_uuid()` | Yes | Primary key | user → import batches | 1:N | BRD/FS Excel Import |
| import_batches | academic_period_id | uuid | FK | Yes | NULL | No | FK → academic_periods.id bila import period-specific | period → batches | 0..1:N | Period context |
| import_batches | import_type | varchar(30) | - | No | - | No | `TEACHER` / `STUDENT` | - | - | BRD Import |
| import_batches | file_name | text | - | No | - | No | Non-empty | - | - | BRD template/upload |
| import_batches | status | varchar(30) | - | No | `PROCESSING` | No | `PROCESSING`, `COMPLETED`, `FAILED` | - | - | FS Import Result |
| import_batches | total_rows | integer | - | No | `0` | No | `>= 0` | - | - | FS Import Result |
| import_batches | success_rows | integer | - | No | `0` | No | `>= 0` | - | - | FS Import Result |
| import_batches | failed_rows | integer | - | No | `0` | No | `>= 0` | - | - | FS Import Result |
| import_batches | uploaded_by_user_id | uuid | FK | No | - | No | FK → users.id | user → batch | 1:N | Admin import |
| import_batches | created_at | timestamptz | - | No | `now()` | No | - | - | - | General |

---

## 5.22 `import_errors`

Detail kegagalan setiap row import.

| Entity | Attribute | Data Type | PK/FK | Nullable | Default | Unique | Constraint | Relationship | Cardinality | Source Business Rule |
|---|---|---|---|---|---|---|---|---|---|---|
| import_errors | id | uuid | PK | No | `gen_random_uuid()` | Yes | Primary key | import_batch → errors | 1:N | FS Import Result |
| import_errors | import_batch_id | uuid | FK | No | - | No | FK → import_batches.id | batch → errors | 1:N | FS Import |
| import_errors | row_number | integer | - | No | - | No | `> 0` | - | - | Import failure identification |
| import_errors | field_name | varchar(100) | - | Yes | NULL | No | - | - | - | Failure reason |
| import_errors | error_code | varchar(50) | - | Yes | NULL | No | - | - | - | Validation |
| import_errors | error_message | text | - | No | - | No | Non-empty | - | - | BRD validation failure |
| import_errors | raw_data | jsonb | - | Yes | NULL | No | Optional row snapshot | - | - | Debug/audit |
| import_errors | created_at | timestamptz | - | No | `now()` | No | - | - | - | General |

---

# 6. Relationship Summary

| Parent Entity | Child Entity | FK | Cardinality | Business Meaning |
|---|---|---|---|---|
| users | user_roles | user_roles.user_id | 1:N | User dapat memiliki banyak role |
| roles | user_roles | user_roles.role_id | 1:N | Role dapat dimiliki banyak user |
| madrasah | teachers | teachers.madrasah_id | 1:N | Guru berada pada madrasah |
| madrasah | students | students.madrasah_id | 1:N | Siswa berada pada madrasah |
| madrasah | academic_periods | academic_periods.madrasah_id | 1:N | Madrasah memiliki periode |
| academic_periods | classes | classes.academic_period_id | 1:N | Kelas terikat periode |
| students | student_class_memberships | student_id | 1:N | Riwayat kelas siswa |
| classes | student_class_memberships | class_id | 1:N | Banyak siswa dalam kelas |
| academic_periods | student_class_memberships | academic_period_id | 1:N | Membership terikat periode |
| classes | class_homeroom_assignments | class_id | 1:N | Riwayat wali kelas |
| teachers | class_homeroom_assignments | teacher_id | 1:N | Guru dapat menjadi wali kelas |
| academic_periods | standard_schedules | academic_period_id | 1:N | Jadwal standar periode |
| academic_periods | special_calendar_dates | academic_period_id | 1:N | Kalender khusus periode |
| academic_periods | teacher_schedule_overrides | academic_period_id | 1:N | Override dalam periode |
| teachers | teacher_schedule_overrides | teacher_id | 1:N | Override per guru |
| teachers | attendance_records | teacher_id | 1:N | Attendance guru |
| students | attendance_records | student_id | 1:N | Attendance siswa |
| teachers | attendance_records | scanner_teacher_id | 1:N | Guru sebagai scanner siswa |
| academic_periods | attendance_records | academic_period_id | 1:N | Attendance terikat periode |
| leave_types | leave_requests | leave_type_id | 1:N | Jenis izin |
| students | leave_requests | student_id | 1:N | Izin siswa |
| teachers | leave_requests | teacher_id | 1:N | Izin guru |
| leave_requests | leave_attachments | leave_request_id | 1:0..1 | Maksimal satu attachment |
| leave_requests | leave_approvals | leave_request_id | 1:N | Riwayat approval |
| users | leave_approvals | approver_user_id | 1:N | User sebagai approver |
| attendance_records | attendance_correction_requests | attendance_record_id | 1:N | Koreksi attendance |
| teachers | attendance_correction_requests | requested_by_teacher_id | 1:N | Guru mengajukan koreksi |
| users | audit_logs | actor_user_id | 1:N | User melakukan perubahan |
| import_batches | import_errors | import_batch_id | 1:N | Detail error import |

---

# 7. Business Rules yang Harus Diimplementasikan di Database/Service

## 7.1 Academic Period

- Hanya satu active academic period per madrasah.
- Attendance, leave, class, schedule, dan report harus menggunakan konteks period yang benar.
- Data historis periode lama tidak boleh tercampur dengan periode aktif.

## 7.2 Geofence

- Default radius: 200 meter.
- GPS accuracy harus memenuhi threshold maksimum 30 meter.
- Tidak ada GPS/permission ditolak.
- Attendance menyimpan timestamp, latitude, longitude, dan distance.
- Device information tidak disimpan.

## 7.3 Schedule Priority

Urutan penentuan effective schedule:

```text
Special Calendar Date
        ↓
Holiday?
   ├── Yes → Tidak ada attendance normal
   └── No
        ↓
Special Schedule?
        ↓
Teacher Override?
        ↓
Standard Schedule
```

Untuk tanggal special yang berupa holiday, proses attendance dihentikan.

## 7.4 Attendance Window

### Arrival

```text
effective_arrival - 60 menit
sampai
effective_arrival + 120 menit
```

### Departure

```text
effective_departure - 120 menit
sampai
effective_departure + 180 menit
```

## 7.5 Grace Period

Arrival:

- `actual <= effective_arrival + 10 menit` → `PRESENT`
- `actual > effective_arrival + 10 menit` → `LATE`

Departure:

- `actual < effective_departure - 10 menit` → `EARLY_DEPARTURE`

## 7.6 Student QR

- QR bersifat static.
- Isi QR adalah NISN.
- Tidak ada reset QR.
- Teacher melakukan scan.
- Teacher harus melakukan verifikasi manual bahwa QR sesuai siswa.
- GPS yang digunakan adalah GPS Teacher scanner.
- Semua Teacher dapat scan semua Student.
- Simpan `scanner_teacher_id`.

## 7.7 Anti-Duplicate

Tidak boleh ada lebih dari satu:

```text
entity + attendance_date + category
```

untuk category:

```text
ARRIVAL
DEPARTURE
```

## 7.8 Daily Status

Status harian sebaiknya dihitung dari:

```text
arrival attendance
+
departure attendance
+
approved/pending leave
+
attendance window
```

Contoh:

| Kondisi | Status |
|---|---|
| Arrival ada, departure belum ada | `NOT_YET_CHECKED_OUT` |
| Arrival ada terlambat | `LATE` |
| Departure lebih awal | `EARLY_DEPARTURE` |
| Tidak ada arrival/departure + tidak ada approved leave setelah window | `ABSENT` |
| Approved leave | Status leave yang sesuai |
| Leave masih pending | `LEAVE_PENDING_APPROVAL` |

`NOT_YET_CHECKED_OUT`, `ABSENT`, dan `LEAVE_PENDING_APPROVAL` sebaiknya **derived status**, bukan disimpan sebagai attendance event.

## 7.9 Auto-Alpa

Auto-Alpa dievaluasi setelah attendance window berakhir dan hanya jika:

- tidak ada arrival;
- tidak ada departure;
- tidak ada approved leave.

## 7.10 Correction

- Teacher tidak boleh langsung mengubah attendance.
- Teacher membuat correction request.
- Admin dapat approve/reject request.
- Admin juga dapat melakukan direct edit.
- Semua direct edit dan perubahan approval harus masuk audit.

## 7.11 Leave Approval

Student:

```text
Default approver = Wali Kelas
Fallback = Admin
```

Teacher:

```text
Default approver = Kepala Madrasah
Fallback = Admin
```

Admin dapat membatalkan approval:

```text
APPROVED → PENDING
```

Attendance impact:

```text
Approved Leave → leave status
Pending Leave → LEAVE_PENDING_APPROVAL
```

---

# 8. Index Recommendation

Index yang direkomendasikan untuk PostgreSQL/Supabase:

```sql
-- Active academic period
CREATE UNIQUE INDEX uq_active_period_per_madrasah
ON academic_periods (madrasah_id)
WHERE is_active = true;

-- Class
CREATE UNIQUE INDEX uq_class_name_per_period
ON classes (academic_period_id, name);

-- Student membership
CREATE UNIQUE INDEX uq_student_membership_per_period
ON student_class_memberships (academic_period_id, student_id);

-- Homeroom
CREATE UNIQUE INDEX uq_active_homeroom_per_class
ON class_homeroom_assignments (academic_period_id, class_id)
WHERE is_active = true;

-- Standard schedule
CREATE UNIQUE INDEX uq_standard_schedule_day
ON standard_schedules (academic_period_id, day_of_week);

-- Special calendar
CREATE UNIQUE INDEX uq_special_calendar_date
ON special_calendar_dates (academic_period_id, calendar_date);

-- Teacher override
CREATE UNIQUE INDEX uq_teacher_override_date
ON teacher_schedule_overrides (academic_period_id, teacher_id, override_date);

-- Attendance teacher
CREATE UNIQUE INDEX uq_teacher_attendance_event
ON attendance_records (teacher_id, attendance_date, category)
WHERE teacher_id IS NOT NULL;

-- Attendance student
CREATE UNIQUE INDEX uq_student_attendance_event
ON attendance_records (student_id, attendance_date, category)
WHERE student_id IS NOT NULL;

-- One attachment per leave
CREATE UNIQUE INDEX uq_one_leave_attachment
ON leave_attachments (leave_request_id);

-- Useful lookup indexes
CREATE INDEX idx_attendance_period_date
ON attendance_records (academic_period_id, attendance_date);

CREATE INDEX idx_attendance_student_date
ON attendance_records (student_id, attendance_date)
WHERE student_id IS NOT NULL;

CREATE INDEX idx_attendance_teacher_date
ON attendance_records (teacher_id, attendance_date)
WHERE teacher_id IS NOT NULL;

CREATE INDEX idx_leave_period_dates
ON leave_requests (academic_period_id, start_date, end_date);

CREATE INDEX idx_audit_entity
ON audit_logs (entity_type, entity_id);

CREATE INDEX idx_audit_actor_created
ON audit_logs (actor_user_id, created_at);
```

---

# 9. Entity yang Sengaja Tidak Dibuat

## 9.1 `effective_schedules`

Tidak dibuat sebagai tabel master.

Alasannya, effective schedule merupakan hasil kalkulasi dari:

```text
special_calendar_dates
→ teacher_schedule_overrides
→ standard_schedules
```

Menyimpan hasil kalkulasi sebagai master berisiko menghasilkan data stale ketika salah satu sumber berubah.

Gunakan:

- database view;
- PostgreSQL function;
- service layer;

untuk menghasilkan effective schedule.

## 9.2 `qr_codes`

Tidak diperlukan untuk MVP.

QR bersifat static dan berisi NISN. QR dapat di-generate saat dibutuhkan dari data `students.nisn`.

## 9.3 `daily_attendance_status`

Tidak diperlukan sebagai tabel fisik pada tahap awal.

Daily status dapat dihitung dari attendance event + leave + schedule/window.

## 9.4 `devices`

Tidak dibuat karena BRD/FS secara eksplisit menyatakan device information tidak termasuk scope.

---

# 10. Rekomendasi RLS Supabase

RLS perlu dirancang pada implementation stage berdasarkan role dan scope.

Prinsip minimum:

| Role | Scope Data |
|---|---|
| Admin | Full operational access |
| Kepala Madrasah | Monitoring, approval teacher leave, audit visibility sesuai scope |
| Guru | Attendance sendiri; scan attendance siswa; correction request; leave sendiri |
| Wali Kelas | Data/approval siswa pada kelas yang menjadi tanggung jawab |
| Siswa | Data attendance dan leave milik sendiri |

Audit log hanya dapat dilihat oleh Admin dan Kepala Madrasah sesuai BRD.

**Catatan:** RLS policy final tidak ditetapkan di dokumen ini karena policy membutuhkan keputusan implementasi Supabase Auth claims/session context dan fungsi authorization.

---

# 11. Mapping ke MVP

| MVP | Entity Utama |
|---|---|
| MVP 1 | users, roles, user_roles, madrasah, teachers, students, academic_periods, classes, student_class_memberships, class_homeroom_assignments |
| MVP 2 | standard_schedules, special_calendar_dates, teacher_schedule_overrides |
| MVP 3 | attendance_records + derived daily status |
| MVP 4 | leave_types, leave_requests, leave_attachments, leave_approvals, attendance_correction_requests, audit_logs |
| MVP 5 | query/view/service untuk dashboard & reports |
| MVP 6 | static QR generation + import_batches + import_errors + export |

---

# 12. Acceptance Checklist Data Model

- [ ] User dapat memiliki multiple roles.
- [ ] Satu academic period aktif per madrasah.
- [ ] Data siswa memiliki riwayat kelas per periode.
- [ ] Wali kelas dapat ditetapkan per kelas dan periode.
- [ ] Standard schedule mendukung arrival/departure.
- [ ] Special calendar dapat menandai holiday atau active special schedule.
- [ ] Teacher override dapat mengubah schedule individual.
- [ ] Attendance Guru dan Siswa dapat disimpan dalam satu model.
- [ ] Attendance menjamin tepat satu owner: teacher atau student.
- [ ] Student attendance menyimpan scanner Teacher.
- [ ] Anti-duplicate attendance dijamin database.
- [ ] GPS latitude/longitude/distance disimpan.
- [ ] GPS accuracy dapat divalidasi <= 30 meter.
- [ ] Device information tidak disimpan.
- [ ] Leave Guru dan Siswa dapat dimodelkan.
- [ ] Attachment maksimal satu per leave request.
- [ ] Approval memiliki history.
- [ ] Approval dapat dikembalikan ke Pending oleh Admin.
- [ ] Correction request Guru tersedia.
- [ ] Admin dapat direct edit attendance.
- [ ] Perubahan penting memiliki audit trail before/after.
- [ ] Effective schedule tidak perlu menjadi tabel fisik.
- [ ] QR tidak perlu tabel khusus untuk MVP.
- [ ] Daily status dapat dihitung tanpa tabel status terpisah.

---

# 13. Source Traceability

| Area | BRD | Functional Specification |
|---|---|---|
| Auth/RBAC | Role & account requirements | Auth, authorization, user/role management |
| Academic Period | Period isolation | Period management |
| Master Data | Madrasah, Guru, Siswa, Class | Master data |
| Import | Excel Teacher/Student | Import workflow |
| Geofence | Radius, GPS, accuracy | Geofence validation |
| Schedule | Standard, special calendar, override | Effective schedule |
| Teacher Attendance | Arrival/departure | Teacher attendance flow |
| Student Attendance | QR/static/scanner | Student attendance flow |
| Status | Present/Late/Early/Alpa/etc. | Status & auto-Alpa |
| Correction | Teacher request/Admin edit | Correction workflow |
| Audit | Audit requirements | Audit behavior |
| Student Leave | Izin/Sakit | Student leave |
| Teacher Leave | Sick/Personal/Official/Other | Teacher leave |
| Approval | Wali Kelas/Admin & Kepala/Admin | Approval workflow |
| Dashboard | Role-based scope | Dashboard/report behavior |
| Export | Excel/PDF | Export specification |
| Notification | In-app | Notification behavior |
| Security | RBAC/period isolation/audit | Security requirements |

---

# 14. Source Basis

Dokumen ini menggunakan dua sumber utama:

1. **BRD_Final_Sistem_Absensi_Madrasah_v1.3.md**
2. **Functional_Specification_Sistem_Absensi_Madrasah_Final_v2.0.md**

BRD v1.3 merupakan revisi final yang memasukkan hasil review Functional Specification. Functional Specification v2.0 secara eksplisit menerjemahkan BRD menjadi perilaku sistem dan menyatakan bahwa struktur database final belum ditentukan di dalam FS. Oleh karena itu, keputusan seperti pemisahan `student_class_memberships`, penggunaan `attendance_records` tunggal, partial unique index, dan entity pendukung import merupakan keputusan desain data model untuk implementasi.

---

# 15. Status Dokumen

**Data Model Specification v1.0**

Dokumen ini siap digunakan sebagai basis untuk:

1. ERD;
2. PostgreSQL/Supabase SQL migration;
3. RLS policy design;
4. API/service contract;
5. seed data;
6. development prompt untuk Kilo Code;
7. testing database constraint dan business rules.

**Langkah berikut yang disarankan:** membuat **ERD v1.0** berdasarkan seluruh entity, FK, dan cardinality pada dokumen ini sebelum menulis migration SQL.
