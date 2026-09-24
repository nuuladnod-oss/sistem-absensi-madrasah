-- ============================================================
-- Supabase SQL Migration v1.0
-- Sistem Absensi Madrasah
-- ============================================================
-- Basis:
--   BRD v1.3
--   Functional Specification v2.0
--   Data Model Specification v1.0
--
-- Target:
--   PostgreSQL / Supabase
--
-- IMPORTANT:
--   1. Run in a fresh Supabase project or reconcile names first.
--   2. Supabase Auth owns auth.users.
--   3. This migration creates application tables, constraints,
--      indexes, triggers, helper functions, and baseline RLS.
--   4. Business workflows such as effective schedule calculation,
--      auto-Alpa evaluation, and approval authorization remain
--      service/database-function concerns to be implemented later.
-- ============================================================

begin;

create extension if not exists pgcrypto;

-- ============================================================
-- 0. Utility: updated_at trigger
-- ============================================================

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ============================================================
-- 1. USERS
-- ============================================================

create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null check (btrim(full_name) <> ''),
  email text not null unique,
  phone varchar(30),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.roles (
  id uuid primary key default gen_random_uuid(),
  code varchar(50) not null unique,
  name varchar(100) not null,
  description text
);

create table if not exists public.user_roles (
  user_id uuid not null references public.users(id) on delete cascade,
  role_id uuid not null references public.roles(id) on delete restrict,
  created_at timestamptz not null default now(),
  primary key (user_id, role_id)
);

-- ============================================================
-- 2. MADRASAH
-- ============================================================

create table if not exists public.madrasah (
  id uuid primary key default gen_random_uuid(),
  name text not null check (btrim(name) <> ''),
  address text,
  latitude numeric(9,6) not null check (latitude between -90 and 90),
  longitude numeric(9,6) not null check (longitude between -180 and 180),
  geofence_radius_meter numeric(8,2) not null default 200
    check (geofence_radius_meter > 0),
  max_gps_accuracy_meter numeric(8,2) not null default 30
    check (max_gps_accuracy_meter > 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================================
-- 3. TEACHERS / STUDENTS
-- ============================================================

create table if not exists public.teachers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid unique references public.users(id) on delete set null,
  madrasah_id uuid not null references public.madrasah(id) on delete restrict,
  nik varchar(50) not null unique check (btrim(nik) <> ''),
  full_name text not null check (btrim(full_name) <> ''),
  subject text,
  photo_url text,
  phone varchar(30),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.students (
  id uuid primary key default gen_random_uuid(),
  user_id uuid unique references public.users(id) on delete set null,
  madrasah_id uuid not null references public.madrasah(id) on delete restrict,
  nisn varchar(20) not null unique check (btrim(nisn) <> ''),
  full_name text not null check (btrim(full_name) <> ''),
  major text,
  photo_url text,
  phone varchar(30),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================================
-- 4. ACADEMIC PERIOD
-- ============================================================

create table if not exists public.academic_periods (
  id uuid primary key default gen_random_uuid(),
  madrasah_id uuid not null references public.madrasah(id) on delete restrict,
  name varchar(100) not null check (btrim(name) <> ''),
  start_date date not null,
  end_date date not null,
  is_active boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint academic_period_dates_check
    check (start_date < end_date)
);

create unique index if not exists uq_active_period_per_madrasah
  on public.academic_periods (madrasah_id)
  where is_active = true;

-- ============================================================
-- 5. CLASSES / MEMBERSHIP / HOMEROOM
-- ============================================================

create table if not exists public.classes (
  id uuid primary key default gen_random_uuid(),
  madrasah_id uuid not null references public.madrasah(id) on delete restrict,
  academic_period_id uuid not null references public.academic_periods(id) on delete restrict,
  name varchar(100) not null check (btrim(name) <> ''),
  code varchar(50),
  grade_level varchar(30),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (academic_period_id, name)
);

create table if not exists public.student_class_memberships (
  id uuid primary key default gen_random_uuid(),
  academic_period_id uuid not null references public.academic_periods(id) on delete restrict,
  student_id uuid not null references public.students(id) on delete restrict,
  class_id uuid not null references public.classes(id) on delete restrict,
  start_date date,
  end_date date,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint student_membership_dates_check
    check (end_date is null or start_date is null or start_date <= end_date),
  unique (academic_period_id, student_id)
);

create table if not exists public.class_homeroom_assignments (
  id uuid primary key default gen_random_uuid(),
  academic_period_id uuid not null references public.academic_periods(id) on delete restrict,
  class_id uuid not null references public.classes(id) on delete restrict,
  teacher_id uuid not null references public.teachers(id) on delete restrict,
  start_date date,
  end_date date,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint homeroom_dates_check
    check (end_date is null or start_date is null or start_date <= end_date)
);

create unique index if not exists uq_active_homeroom_per_class
  on public.class_homeroom_assignments (academic_period_id, class_id)
  where is_active = true;

-- ============================================================
-- 6. SCHEDULES
-- ============================================================

create table if not exists public.standard_schedules (
  id uuid primary key default gen_random_uuid(),
  academic_period_id uuid not null references public.academic_periods(id) on delete restrict,
  day_of_week integer not null check (day_of_week between 0 and 6),
  arrival_time time not null,
  departure_time time not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint standard_schedule_time_check
    check (arrival_time < departure_time),
  unique (academic_period_id, day_of_week)
);

create table if not exists public.special_calendar_dates (
  id uuid primary key default gen_random_uuid(),
  academic_period_id uuid not null references public.academic_periods(id) on delete restrict,
  calendar_date date not null,
  day_type varchar(30) not null
    check (day_type in ('HOLIDAY', 'ACTIVE_SPECIAL')),
  arrival_time time,
  departure_time time,
  reason text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint special_calendar_time_check
    check (
      (day_type = 'HOLIDAY' and arrival_time is null and departure_time is null)
      or
      (day_type = 'ACTIVE_SPECIAL'
       and arrival_time is not null
       and departure_time is not null
       and arrival_time < departure_time)
    ),
  unique (academic_period_id, calendar_date)
);

create table if not exists public.teacher_schedule_overrides (
  id uuid primary key default gen_random_uuid(),
  academic_period_id uuid not null references public.academic_periods(id) on delete restrict,
  teacher_id uuid not null references public.teachers(id) on delete restrict,
  override_date date not null,
  arrival_time time not null,
  departure_time time not null,
  reason text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint teacher_override_time_check
    check (arrival_time < departure_time),
  unique (academic_period_id, teacher_id, override_date)
);

-- ============================================================
-- 7. ATTENDANCE
-- ============================================================

create table if not exists public.attendance_records (
  id uuid primary key default gen_random_uuid(),
  academic_period_id uuid not null references public.academic_periods(id) on delete restrict,

  teacher_id uuid references public.teachers(id) on delete restrict,
  student_id uuid references public.students(id) on delete restrict,

  attendance_date date not null,
  category varchar(20) not null
    check (category in ('ARRIVAL', 'DEPARTURE')),

  status varchar(30) not null
    check (status in ('PRESENT', 'LATE', 'EARLY_DEPARTURE')),

  checked_at timestamptz not null default now(),

  latitude numeric(9,6) not null
    check (latitude between -90 and 90),
  longitude numeric(9,6) not null
    check (longitude between -180 and 180),
  distance_meter numeric(10,2) not null
    check (distance_meter >= 0),

  -- Recommended field to preserve the accuracy value used during validation.
  gps_accuracy_meter numeric(10,2)
    check (gps_accuracy_meter is null or gps_accuracy_meter >= 0),

  scanner_teacher_id uuid references public.teachers(id) on delete restrict,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint attendance_owner_xor
    check (
      (teacher_id is not null and student_id is null)
      or
      (teacher_id is null and student_id is not null)
    ),

  constraint attendance_scanner_rule
    check (
      (student_id is not null and scanner_teacher_id is not null)
      or
      (teacher_id is not null and scanner_teacher_id is null)
    )
);

create unique index if not exists uq_teacher_attendance_event
  on public.attendance_records (teacher_id, attendance_date, category)
  where teacher_id is not null;

create unique index if not exists uq_student_attendance_event
  on public.attendance_records (student_id, attendance_date, category)
  where student_id is not null;

create index if not exists idx_attendance_period_date
  on public.attendance_records (academic_period_id, attendance_date);

create index if not exists idx_attendance_student_date
  on public.attendance_records (student_id, attendance_date)
  where student_id is not null;

create index if not exists idx_attendance_teacher_date
  on public.attendance_records (teacher_id, attendance_date)
  where teacher_id is not null;

-- ============================================================
-- 8. LEAVE
-- ============================================================

create table if not exists public.leave_types (
  id uuid primary key default gen_random_uuid(),
  code varchar(50) not null unique,
  name varchar(100) not null,
  actor_type varchar(20) not null
    check (actor_type in ('STUDENT', 'TEACHER')),
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.leave_requests (
  id uuid primary key default gen_random_uuid(),
  academic_period_id uuid not null references public.academic_periods(id) on delete restrict,

  student_id uuid references public.students(id) on delete restrict,
  teacher_id uuid references public.teachers(id) on delete restrict,

  leave_type_id uuid not null references public.leave_types(id) on delete restrict,

  start_date date not null,
  end_date date not null,
  reason text,

  status varchar(30) not null default 'PENDING'
    check (status in ('PENDING', 'APPROVED', 'REJECTED')),

  submitted_by_user_id uuid not null references public.users(id) on delete restrict,
  submitted_at timestamptz not null default now(),

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint leave_owner_xor
    check (
      (student_id is not null and teacher_id is null)
      or
      (student_id is null and teacher_id is not null)
    ),

  constraint leave_date_range_check
    check (start_date <= end_date)
);

create index if not exists idx_leave_period_dates
  on public.leave_requests (academic_period_id, start_date, end_date);

create table if not exists public.leave_attachments (
  id uuid primary key default gen_random_uuid(),
  leave_request_id uuid not null unique references public.leave_requests(id) on delete cascade,
  file_name text not null check (btrim(file_name) <> ''),
  storage_path text not null check (btrim(storage_path) <> ''),
  mime_type varchar(100) not null
    check (mime_type in ('application/pdf', 'image/jpeg', 'image/png')),
  file_size_bytes bigint not null
    check (file_size_bytes > 0 and file_size_bytes <= 2097152),
  created_at timestamptz not null default now()
);

create table if not exists public.leave_approvals (
  id uuid primary key default gen_random_uuid(),
  leave_request_id uuid not null references public.leave_requests(id) on delete cascade,
  approver_user_id uuid not null references public.users(id) on delete restrict,
  action varchar(30) not null
    check (
      action in (
        'APPROVED',
        'REJECTED',
        'CANCEL_APPROVAL',
        'RETURNED_TO_PENDING'
      )
    ),
  note text,
  acted_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

-- ============================================================
-- 9. ATTENDANCE CORRECTION
-- ============================================================

create table if not exists public.attendance_correction_requests (
  id uuid primary key default gen_random_uuid(),
  attendance_record_id uuid not null references public.attendance_records(id) on delete restrict,
  requested_by_teacher_id uuid not null references public.teachers(id) on delete restrict,
  requested_at timestamptz not null default now(),
  requested_changes jsonb not null,
  reason text,
  status varchar(30) not null default 'PENDING'
    check (status in ('PENDING', 'APPROVED', 'REJECTED')),
  reviewed_by_user_id uuid references public.users(id) on delete restrict,
  reviewed_at timestamptz,
  review_note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================================
-- 10. AUDIT
-- ============================================================

create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_user_id uuid not null references public.users(id) on delete restrict,
  action varchar(50) not null check (btrim(action) <> ''),
  entity_type varchar(100) not null check (btrim(entity_type) <> ''),
  entity_id uuid not null,
  before_data jsonb,
  after_data jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_audit_entity
  on public.audit_logs (entity_type, entity_id);

create index if not exists idx_audit_actor_created
  on public.audit_logs (actor_user_id, created_at);

-- ============================================================
-- 11. IMPORT
-- ============================================================

create table if not exists public.import_batches (
  id uuid primary key default gen_random_uuid(),
  academic_period_id uuid references public.academic_periods(id) on delete restrict,
  import_type varchar(30) not null
    check (import_type in ('TEACHER', 'STUDENT')),
  file_name text not null check (btrim(file_name) <> ''),
  status varchar(30) not null default 'PROCESSING'
    check (status in ('PROCESSING', 'COMPLETED', 'FAILED')),
  total_rows integer not null default 0 check (total_rows >= 0),
  success_rows integer not null default 0 check (success_rows >= 0),
  failed_rows integer not null default 0 check (failed_rows >= 0),
  uploaded_by_user_id uuid not null references public.users(id) on delete restrict,
  created_at timestamptz not null default now()
);

create table if not exists public.import_errors (
  id uuid primary key default gen_random_uuid(),
  import_batch_id uuid not null references public.import_batches(id) on delete cascade,
  row_number integer not null check (row_number > 0),
  field_name varchar(100),
  error_code varchar(50),
  error_message text not null check (btrim(error_message) <> ''),
  raw_data jsonb,
  created_at timestamptz not null default now()
);

-- ============================================================
-- 12. UPDATED_AT TRIGGERS
-- ============================================================

drop trigger if exists trg_users_updated_at on public.users;
create trigger trg_users_updated_at
before update on public.users
for each row execute function public.set_updated_at();

drop trigger if exists trg_madrasah_updated_at on public.madrasah;
create trigger trg_madrasah_updated_at
before update on public.madrasah
for each row execute function public.set_updated_at();

drop trigger if exists trg_teachers_updated_at on public.teachers;
create trigger trg_teachers_updated_at
before update on public.teachers
for each row execute function public.set_updated_at();

drop trigger if exists trg_students_updated_at on public.students;
create trigger trg_students_updated_at
before update on public.students
for each row execute function public.set_updated_at();

drop trigger if exists trg_academic_periods_updated_at on public.academic_periods;
create trigger trg_academic_periods_updated_at
before update on public.academic_periods
for each row execute function public.set_updated_at();

drop trigger if exists trg_classes_updated_at on public.classes;
create trigger trg_classes_updated_at
before update on public.classes
for each row execute function public.set_updated_at();

drop trigger if exists trg_student_class_memberships_updated_at on public.student_class_memberships;
create trigger trg_student_class_memberships_updated_at
before update on public.student_class_memberships
for each row execute function public.set_updated_at();

drop trigger if exists trg_class_homeroom_assignments_updated_at on public.class_homeroom_assignments;
create trigger trg_class_homeroom_assignments_updated_at
before update on public.class_homeroom_assignments
for each row execute function public.set_updated_at();

drop trigger if exists trg_standard_schedules_updated_at on public.standard_schedules;
create trigger trg_standard_schedules_updated_at
before update on public.standard_schedules
for each row execute function public.set_updated_at();

drop trigger if exists trg_special_calendar_dates_updated_at on public.special_calendar_dates;
create trigger trg_special_calendar_dates_updated_at
before update on public.special_calendar_dates
for each row execute function public.set_updated_at();

drop trigger if exists trg_teacher_schedule_overrides_updated_at on public.teacher_schedule_overrides;
create trigger trg_teacher_schedule_overrides_updated_at
before update on public.teacher_schedule_overrides
for each row execute function public.set_updated_at();

drop trigger if exists trg_attendance_records_updated_at on public.attendance_records;
create trigger trg_attendance_records_updated_at
before update on public.attendance_records
for each row execute function public.set_updated_at();

drop trigger if exists trg_leave_requests_updated_at on public.leave_requests;
create trigger trg_leave_requests_updated_at
before update on public.leave_requests
for each row execute function public.set_updated_at();

drop trigger if exists trg_attendance_correction_requests_updated_at on public.attendance_correction_requests;
create trigger trg_attendance_correction_requests_updated_at
before update on public.attendance_correction_requests
for each row execute function public.set_updated_at();

-- ============================================================
-- 13. SEED MASTER ROLES
-- ============================================================

insert into public.roles (code, name, description)
values
  ('ADMIN', 'Admin', 'Administrator sistem'),
  ('GURU', 'Guru', 'Guru/pengajar'),
  ('WALI_KELAS', 'Wali Kelas', 'Guru yang ditugaskan sebagai wali kelas'),
  ('SISWA', 'Siswa', 'Pengguna siswa'),
  ('KEPALA_MADRASAH', 'Kepala Madrasah', 'Kepala madrasah')
on conflict (code) do update
set name = excluded.name,
    description = excluded.description;

-- ============================================================
-- 14. SEED LEAVE TYPES
-- ============================================================

insert into public.leave_types (code, name, actor_type)
values
  ('STUDENT_IZIN', 'Izin', 'STUDENT'),
  ('STUDENT_SAKIT', 'Sakit', 'STUDENT'),
  ('TEACHER_SAKIT', 'Sakit', 'TEACHER'),
  ('TEACHER_PERSONAL', 'Personal Leave', 'TEACHER'),
  ('TEACHER_OFFICIAL_DUTY', 'Official Duty', 'TEACHER'),
  ('TEACHER_OTHER', 'Other', 'TEACHER')
on conflict (code) do update
set name = excluded.name,
    actor_type = excluded.actor_type;

-- ============================================================
-- 15. AUTH PROFILE TRIGGER
-- ============================================================
-- Creates application profile after Supabase Auth signup.
-- Role assignment remains an administrative operation.

create or replace function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.users (id, full_name, email)
  values (
    new.id,
    coalesce(
      nullif(new.raw_user_meta_data ->> 'full_name', ''),
      split_part(coalesce(new.email, ''), '@', 1),
      'User'
    ),
    coalesce(new.email, '')
  )
  on conflict (id) do update
    set email = excluded.email;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_auth_user();

-- ============================================================
-- 16. ROLE CHECK HELPER
-- ============================================================
-- SECURITY DEFINER avoids recursive RLS evaluation on user_roles.

create or replace function public.has_role(required_role varchar)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.user_roles ur
    join public.roles r on r.id = ur.role_id
    where ur.user_id = auth.uid()
      and r.code = required_role
  );
$$;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.has_role('ADMIN');
$$;

create or replace function public.is_admin_or_head()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.has_role('ADMIN')
      or public.has_role('KEPALA_MADRASAH');
$$;

-- ============================================================
-- 17. ENABLE RLS
-- ============================================================

alter table public.users enable row level security;
alter table public.roles enable row level security;
alter table public.user_roles enable row level security;
alter table public.madrasah enable row level security;
alter table public.teachers enable row level security;
alter table public.students enable row level security;
alter table public.academic_periods enable row level security;
alter table public.classes enable row level security;
alter table public.student_class_memberships enable row level security;
alter table public.class_homeroom_assignments enable row level security;
alter table public.standard_schedules enable row level security;
alter table public.special_calendar_dates enable row level security;
alter table public.teacher_schedule_overrides enable row level security;
alter table public.attendance_records enable row level security;
alter table public.leave_types enable row level security;
alter table public.leave_requests enable row level security;
alter table public.leave_attachments enable row level security;
alter table public.leave_approvals enable row level security;
alter table public.attendance_correction_requests enable row level security;
alter table public.audit_logs enable row level security;
alter table public.import_batches enable row level security;
alter table public.import_errors enable row level security;

-- ============================================================
-- 18. BASELINE RLS POLICIES
-- ============================================================
-- These are intentionally conservative.
-- Detailed class/period/actor-scoped policies should be added
-- during API/RLS implementation after application claims and
-- authorization flows are finalized.

-- Users: own profile or Admin
create policy "users_select_self_or_admin"
on public.users
for select
to authenticated
using (
  id = auth.uid()
  or public.is_admin()
);

create policy "users_update_self_or_admin"
on public.users
for update
to authenticated
using (
  id = auth.uid()
  or public.is_admin()
)
with check (
  id = auth.uid()
  or public.is_admin()
);

create policy "users_insert_admin"
on public.users
for insert
to authenticated
with check (public.is_admin());

create policy "users_delete_admin"
on public.users
for delete
to authenticated
using (public.is_admin());

-- Roles: authenticated users may read role definitions.
create policy "roles_select_authenticated"
on public.roles
for select
to authenticated
using (true);

create policy "roles_admin_write"
on public.roles
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

-- User roles: Admin manages; users may read their own roles.
create policy "user_roles_select_self_or_admin"
on public.user_roles
for select
to authenticated
using (
  user_id = auth.uid()
  or public.is_admin()
);

create policy "user_roles_admin_write"
on public.user_roles
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

-- Operational tables: Admin full access.
create policy "madrasah_admin_all"
on public.madrasah
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "teachers_admin_all"
on public.teachers
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "students_admin_all"
on public.students
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "academic_periods_admin_all"
on public.academic_periods
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "classes_admin_all"
on public.classes
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "student_class_memberships_admin_all"
on public.student_class_memberships
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "class_homeroom_assignments_admin_all"
on public.class_homeroom_assignments
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "standard_schedules_admin_all"
on public.standard_schedules
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "special_calendar_dates_admin_all"
on public.special_calendar_dates
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "teacher_schedule_overrides_admin_all"
on public.teacher_schedule_overrides
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "attendance_admin_all"
on public.attendance_records
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "leave_types_admin_all"
on public.leave_types
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "leave_requests_admin_all"
on public.leave_requests
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "leave_attachments_admin_all"
on public.leave_attachments
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "leave_approvals_admin_all"
on public.leave_approvals
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "attendance_correction_admin_all"
on public.attendance_correction_requests
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "audit_admin_head_select"
on public.audit_logs
for select
to authenticated
using (public.is_admin_or_head());

create policy "audit_admin_insert"
on public.audit_logs
for insert
to authenticated
with check (public.is_admin());

create policy "import_batches_admin_all"
on public.import_batches
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "import_errors_admin_all"
on public.import_errors
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

-- ============================================================
-- 19. SECURITY NOTES
-- ============================================================
-- Do NOT add a broad "authenticated can do everything" policy.
--
-- Next RLS iteration should implement:
--   * Guru: own attendance, own leave, student QR scanning
--   * Siswa: own attendance/leave
--   * Wali Kelas: assigned class + student leave approval
--   * Kepala Madrasah: monitoring + teacher leave approval + audit read
--   * Admin: full operational control
--
-- This requires stable application authorization helpers and
-- period/class scoping.

-- ============================================================
-- 20. MIGRATION COMPLETE
-- ============================================================

commit;
