# Stitch UI/UX Prompt Plan v1.1

## Sistem Absensi Madrasah

**Basis:** BRD v1.3, Functional Specification v2.0, Data Model v1.0, ERD v1.0  
**Tujuan:** prompt siap copy-paste ke Stitch, satu tahap setiap kali.

---

## Cara Pakai

Jalankan prompt **satu per satu**.

Urutan:

`01 → 02 → 03 → ... → 16`

Setelah setiap tahap:

1. review hasil Stitch;
2. hapus/abaikan elemen yang tidak diminta;
3. pastikan desktop dan Android tetap nyaman;
4. baru lanjut ke tahap berikutnya.

**Prinsip:** One module, one workflow, one review cycle.

### Aturan global untuk semua prompt

Semua prompt di bawah sudah memasukkan aturan berikut:

- simple;
- minimal;
- beginner-friendly;
- responsive desktop + Android;
- sedikit tombol;
- satu primary action utama;
- tidak menambah fitur;
- tidak membuat dashboard terlalu kompleks;
- gunakan bahasa Indonesia yang jelas;
- jangan membuat lesson schedule;
- jangan membuat subject timetable;
- jangan membuat biometric authentication;
- jangan membuat WhatsApp/email/push notification;
- jangan mencatat device information;
- jangan membuat student self-scan;
- jangan membuat QR reset.

Jika Stitch menambahkan fitur di luar scope, jangan dibawa ke tahap development.

---

# PROMPT 01 — Design Direction

```text
Design the visual direction for a simple, minimal, beginner-friendly Madrasah Attendance Management web application in Indonesia.

Users:
- Admin
- Guru
- Wali Kelas
- Siswa
- Kepala Madrasah

Core product functions:
- teacher self attendance using GPS/geofencing;
- student attendance through teacher-scanned static QR;
- academic period;
- master data;
- schedules;
- leave and approval;
- attendance correction;
- audit;
- reports;
- Excel import/export.

Design goals:
- simple;
- minimal;
- clean;
- professional;
- easy for first-time users;
- low cognitive load;
- responsive for desktop and Android;
- easy to implement as reusable React components.

Visual direction should define:
- typography;
- spacing;
- button style;
- form style;
- table style;
- card style;
- status/badge style;
- color direction;
- responsive approach.

Avoid:
- excessive cards;
- excessive charts;
- decorative widgets;
- heavy gradients;
- glassmorphism;
- decorative animation;
- complex navigation;
- unnecessary settings;
- enterprise-style visual complexity.

Do not design the complete application yet.
Only create the visual foundation.
```

---

# PROMPT 02 — Minimal Design System

```text
Using the approved visual direction, create a minimal reusable design system for the Madrasah Attendance web application.

Create only the components needed for the approved requirements:

- typography;
- page header;
- primary button;
- secondary button;
- text button;
- input;
- select;
- date input;
- textarea;
- checkbox;
- table;
- simple card;
- status badge;
- alert;
- toast;
- modal;
- confirmation dialog;
- loading state;
- empty state;
- error state;
- mobile navigation.

Rules:
- keep component variants minimal;
- use consistent spacing;
- use consistent typography;
- use consistent form labels;
- use clear validation messages;
- use consistent status colors;
- keep touch targets comfortable on Android.

Do not invent new components or product features unless required by the existing requirements.

Show how the same components behave on desktop and Android.
```

---

# PROMPT 03 — App Shell & Navigation

```text
Design the responsive application shell for the Madrasah Attendance System.

Create:
- desktop sidebar;
- mobile navigation;
- top bar;
- page title;
- active academic period indicator;
- user/account area.

Role-based navigation:

Admin:
Dashboard
Master Data
Periode Akademik
Jadwal
Presensi
Izin
Koreksi
Audit
Import Excel
Laporan

Guru:
Dashboard
Presensi Saya
Scan Siswa
Riwayat
Izin Saya
Koreksi
Panduan

Wali Kelas:
Dashboard
Presensi Kelas
Siswa
Approval Izin
Izin Saya
Panduan

Siswa:
Dashboard
Presensi Saya
Izin Saya
QR Saya
Panduan

Kepala Madrasah:
Dashboard
Monitoring Presensi
Approval Izin Guru
Laporan
Audit

Keep navigation shallow and simple.

On Android:
- prioritize frequent actions;
- avoid overcrowding;
- use a simple menu for secondary items.

Always show the active academic period clearly.

Do not add new navigation items or product features.
```

---

# PROMPT 04 — Login

```text
Design the Login screen for the Madrasah Attendance System.

Goal:
A first-time user should understand the screen immediately.

Include:
- credential field;
- password field;
- show/hide password;
- Login button;
- loading state;
- invalid credential message;
- inactive account message.

Design:
- clean;
- minimal;
- focused;
- responsive on desktop and Android.

Do not add:
- social login;
- public registration;
- marketing sections;
- onboarding;
- unnecessary authentication features.

Use clear Indonesian labels and short error messages.
```

---

# PROMPT 05 — Admin Foundation

```text
Design the Admin foundation screens.

Screens:
1. Admin Dashboard
2. User Management

Admin Dashboard should show only useful operational information:
- active academic period;
- today's attendance summary;
- pending approvals;
- pending correction requests;
- important in-app notices.

Do not create:
- complex analytics;
- large KPI walls;
- decorative charts;
- unnecessary widgets.

User Management:
- desktop: simple table;
- Android: readable list/card;
- search only when useful;
- clear account status;
- clear roles;
- simple actions.

Keep the screen suitable for a beginner administrator.
```

---

# PROMPT 06 — Master Data

```text
Design simple CRUD screens for:

- Data Madrasah
- Data Guru
- Data Siswa
- Data Kelas/Rombel
- Wali Kelas

Use the same pattern for every module:

1. page title;
2. short supporting text if needed;
3. one primary action;
4. optional search/filter;
5. table on desktop;
6. list/card on Android;
7. simple form;
8. validation;
9. success/error feedback.

Form rules:
- group related fields;
- avoid unnecessary sections;
- avoid long single-page forms when a simpler grouping is possible;
- use clear Indonesian labels.

Do not add fields that are not supported by the approved requirements/data model.
Do not add analytics or advanced bulk management.
```

---

# PROMPT 07 — Academic Period

```text
Design the Academic Period management workflow.

Screens:
- period list;
- add period;
- edit period;
- set active period.

Requirements:
- clearly identify the active period;
- show period status;
- use simple confirmation when changing the active period;
- make period context easy to understand.

The active academic period must also be visible in the application shell.

Keep the workflow simple.

Do not add:
- semester planning;
- lesson scheduling;
- curriculum management;
- unrelated academic features.
```

---

# PROMPT 08 — Schedule Management

```text
Design simple schedule management for:

1. Standard Schedule
2. Special Calendar
3. Teacher Schedule Override

Only arrival and departure schedules are needed.

Make this priority understandable:

Special Calendar
→ if holiday, no attendance
→ otherwise special schedule when applicable
→ Teacher Override
→ Standard Schedule

Screens should clearly communicate:
- normal schedule;
- holiday;
- special active date;
- teacher-specific override.

Use simple forms and readable time fields.

Do not add:
- lesson schedules;
- subject timetable;
- class lesson periods;
- unrelated scheduling features.
```

---

# PROMPT 09 — Teacher Self Attendance

```text
Design the simplest possible Teacher Self Attendance workflow for Android and desktop.

The main screen must make these items immediately understandable:
- today's date;
- active academic period;
- effective schedule;
- current attendance status;
- GPS status;
- GPS accuracy;
- distance from Madrasah;
- attendance window status;
- primary action.

Separate:
- Arrival;
- Departure.

Use one strong primary action at a time.

Required states:
- GPS permission denied;
- GPS unavailable;
- GPS accuracy too poor;
- outside geofence;
- attendance window not open;
- attendance window expired;
- duplicate attendance;
- holiday;
- no active academic period;
- already checked in;
- not yet checked out.

Business rules to reflect in the UI:
- default geofence radius: 200 meters;
- GPS accuracy threshold: 30 meters;
- arrival window: effective arrival -60 to +120 minutes;
- departure window: effective departure -120 to +180 minutes;
- arrival grace: 10 minutes;
- early departure: more than 10 minutes before effective departure.

Use plain Indonesian explanations.

Do not expose unnecessary technical implementation details.
Do not add device information.
```

---

# PROMPT 10 — Student QR Attendance

```text
Design the Teacher workflow for recording Student attendance through static QR.

Primary workflow:

1. Open Scan Siswa.
2. Start scanner.
3. Scan static QR containing NISN.
4. Find student.
5. Show student identity.
6. Teacher manually verifies the QR belongs to the student.
7. Determine/confirm Arrival or Departure according to the workflow.
8. Validate attendance window and GPS.
9. Save attendance.
10. Show clear result.

Confirmation screen should show:
- student photo when available;
- student name;
- NISN;
- class;
- attendance category;
- time;
- relevant validation result.

Important business rules:
- Student does not scan themselves;
- any Teacher can scan any Student;
- scanner GPS belongs to the Teacher;
- QR is static;
- QR contains NISN;
- no biometric verification;
- no QR reset.

Make scanner and confirmation screens especially comfortable on Android.

Keep the workflow short and focused.
```

---

# PROMPT 11 — Leave & Approval

```text
Design simple leave and approval workflows.

Student leave:
- Izin;
- Sakit.

Teacher leave:
- Sick;
- Personal Leave;
- Official Duty;
- Other.

Support:
- single date;
- date range;
- optional one attachment;
- attachment validation;
- Pending;
- Approved;
- Rejected.

Approval:
- Student: Wali Kelas, Admin fallback;
- Teacher: Kepala Madrasah, Admin fallback.

Use a simple workflow:
List → Detail → Action.

For Android:
- use readable cards/list;
- make status prominent;
- make Approve and Reject clear;
- avoid crowded action bars.

For forms:
- keep fields short;
- group related fields;
- show validation close to the field.

Do not add external notifications.
```

---

# PROMPT 12 — Correction & Audit

```text
Design the Attendance Correction and Audit workflow.

Teacher:
- view attendance;
- submit correction request;
- enter requested correction;
- optional reason.

Admin:
- view pending requests;
- compare current value and requested value;
- approve or reject;
- direct edit attendance when allowed.

Audit:
- timestamp;
- actor;
- changed attendance;
- before value;
- after value.

Design the comparison so a beginner can understand what changed.

Audit is only accessible to authorized roles.

Do not add:
- device information;
- technical logs unrelated to the business audit;
- complex developer tools.

Keep the interface simple but traceable.
```

---

# PROMPT 13 — Dashboard & Reports

```text
Design simple dashboards and reports for all roles.

Admin Dashboard:
- operational summary;
- pending approvals;
- correction requests;
- today's attendance.

Guru Dashboard:
- personal attendance status;
- primary attendance action;
- recent attendance.

Wali Kelas Dashboard:
- class attendance;
- pending student leave approvals.

Siswa Dashboard:
- personal attendance;
- leave status;
- QR access.

Kepala Madrasah Dashboard:
- attendance monitoring;
- teacher leave approvals;
- reports;
- audit access.

Reports:
- daily;
- weekly;
- monthly;
- individual;
- class;
- Madrasah;
- academic period.

Design principle:
Use simple summary blocks and tables first.
Use charts only if they clearly improve understanding.

Do not create a dashboard full of cards, charts, or decorative statistics.
```

---

# PROMPT 14 — Import Excel & Export

```text
Design a beginner-friendly Excel Import workflow.

Flow:
1. Choose data type.
2. Download template.
3. Upload Excel.
4. Validate.
5. Show processing state.
6. Show success count.
7. Show failed count.
8. Show row/field/error details when needed.

Make validation results easy to understand.

Use a clear primary action.

Design Report Export:
- Excel;
- PDF.

Keep filter area simple:
- date/range when applicable;
- individual/class/Madrasah/period when applicable;
- Export action.

Do not add:
- scheduled reports;
- automated email delivery;
- external distribution;
- advanced data automation.
```

---

# PROMPT 15 — Responsive & Edge States

```text
Review all previously designed screens for responsive behavior.

Target:
- desktop;
- Android/mobile.

Mobile priorities:
- Teacher attendance;
- Student QR scanning;
- leave submission;
- approval;
- Student dashboard.

Desktop priorities:
- master data;
- configuration;
- reports;
- audit;
- import.

Standardize these states:
- loading;
- empty;
- validation error;
- success;
- GPS denied;
- GPS unavailable;
- poor GPS accuracy;
- outside geofence;
- attendance window not open;
- attendance window expired;
- duplicate;
- invalid QR;
- pending;
- approved;
- rejected;
- holiday;
- no active academic period;
- unauthorized;
- inactive account.

Rules:
- messages must be short;
- messages must explain what happened;
- when possible, tell the user what action to take next;
- do not use technical jargon.

Do not add new features.
```

---

# PROMPT 16 — Final Simplification & Handoff

```text
Perform a final UX simplification review of the complete Madrasah Attendance application.

For every screen check:

1. Is the purpose immediately clear?
2. Is there too much information?
3. Are there too many buttons?
4. Is there more than one competing primary action?
5. Can any card or widget be removed?
6. Can any form field be simplified?
7. Is the current status obvious?
8. Is the next action obvious?
9. Is the Android layout comfortable?
10. Is the desktop layout efficient?
11. Is the active academic period visible when relevant?
12. Does the UI follow the approved BRD and Functional Specification?
13. Does the UI map to the approved Data Model?
14. Are loading, empty, error, and success states covered where needed?

Remove unnecessary visual complexity.

Keep:
- simple navigation;
- short forms;
- clear status;
- one primary action;
- reusable components;
- responsive desktop + Android behavior.

Do not add any new product features.

Do not introduce:
- lesson schedules;
- subject timetable;
- biometric authentication;
- external notifications;
- device tracking;
- device information;
- QR reset;
- student self-scan;
- complex analytics;
- social/chat features.

Final output should be suitable as an implementation reference for React, VS Code, and Kilo Code.
```

---

# Review Checklist — Dipakai Setelah Setiap Prompt

```text
STITCH REVIEW CHECK

[ ] Sesuai BRD
[ ] Sesuai Functional Specification
[ ] Sesuai Data Model
[ ] Tidak ada fitur baru
[ ] Tidak ada field yang tidak diperlukan
[ ] Primary action jelas
[ ] Tidak terlalu banyak tombol
[ ] Form mudah dipahami pemula
[ ] Status mudah dipahami
[ ] Desktop nyaman
[ ] Android nyaman
[ ] Loading state tersedia bila relevan
[ ] Empty state tersedia bila relevan
[ ] Error state tersedia bila relevan
[ ] Success state tersedia bila relevan
[ ] Komponen dapat digunakan ulang
```

---

# Aturan Saat Hasil Stitch Terlalu Kompleks

Jika Stitch menghasilkan desain yang terlalu ramai, gunakan prompt koreksi berikut:

```text
Simplify this design.

Do not add features.

Reduce:
- cards;
- buttons;
- navigation items;
- visual decoration;
- charts;
- form complexity;
- unnecessary information.

Keep only information required for the current workflow.

Make the primary action obvious.

Make the screen beginner-friendly.

Make the layout comfortable on Android and efficient on desktop.

Keep the approved business rules unchanged.

Do not redesign unrelated modules.
```

---

# Aturan Saat Stitch Menambahkan Fitur di Luar Scope

```text
Remove all features that are not explicitly required by the Madrasah Attendance BRD and Functional Specification.

Do not add:
- lesson schedule;
- subject timetable;
- biometric authentication;
- WhatsApp/email/push notification;
- device tracking;
- device information;
- QR reset;
- student self-scan;
- complex analytics;
- chat/social features;
- unrelated settings.

Keep only the current workflow and its required states.

Do not change the approved business rules.
```

---

# Handoff Structure

```text
04_UIUX/
├── Stitch_UIUX_Prompt_Plan_v1.1_Sederhana_Minimalis.md
├── Stitch_UIUX_Prompts_CopyPaste_v1.0.md
└── [hasil/export desain Stitch]
```

**Urutan final:**

```text
BRD v1.3
   ↓
Functional Specification v2.0
   ↓
Data Model v1.0
   ↓
Stitch Prompt 01
   ↓ review
Stitch Prompt 02
   ↓ review
...
Stitch Prompt 16
   ↓
Final UX Review
   ↓
VS Code + Kilo Code
```
