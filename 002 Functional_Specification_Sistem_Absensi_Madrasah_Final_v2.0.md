# FINAL FUNCTIONAL SPECIFICATION
## Sistem Absensi Madrasah Berbasis Geofencing & QR Code

**Versi:** 2.0  
**Status:** Final Functional Specification  
**Basis:** BRD v1.3  
**Tanggal:** 23 September 2026

---

# 1. Tujuan

Dokumen ini menerjemahkan BRD v1.3 menjadi perilaku fungsional sistem yang dapat digunakan sebagai dasar:

1. UI/UX;
2. Data Model;
3. API/Service Specification;
4. Technical Specification;
5. Development;
6. Testing.

Dokumen ini tidak menetapkan struktur tabel database final.

# 2. Prinsip Umum

- Setiap transaksi harus melewati validasi hak akses.
- Presensi lokasi harus melewati validasi GPS, akurasi, dan radius.
- Jadwal efektif harus ditentukan sebelum validasi waktu.
- Periode aktif menjadi konteks transaksi.
- Perubahan presensi oleh Admin harus diaudit.
- Tidak ada device information dalam data presensi/audit.
- Notifikasi hanya berada di dalam aplikasi.

# 3. Aktor

| Aktor | Hak utama |
|---|---|
| Admin | Full management, konfigurasi, koreksi, approval pengganti, audit |
| Guru | Presensi diri, scan siswa, izin, koreksi |
| Wali Kelas | Fungsi Guru + approval izin siswa |
| Siswa | Riwayat pribadi + pengajuan izin |
| Kepala Madrasah | Dashboard, laporan, audit, approval izin Guru |

Satu user dapat memiliki multi-role.

# 4. Authentication

## FS-AUTH-001 — Login

**Actor:** Semua user.

**Input:** kredensial login.

**Proses:**
1. Validasi kredensial.
2. Validasi status akun.
3. Ambil seluruh role.
4. Buat sesi.
5. Arahkan ke dashboard sesuai hak akses.

**Gagal:** tampilkan pesan kesalahan.

## FS-AUTH-002 — Logout

Mengakhiri sesi aktif.

## FS-AUTH-003 — Authorization

Setiap request/fungsi harus memeriksa:
- login;
- status akun;
- role;
- izin fungsi.

# 5. User & Role Management

## FS-USER-001 — Daftar User
Admin melihat user, status, dan role.

## FS-USER-002 — Tambah User
Admin membuat akun dan menetapkan role.

## FS-USER-003 — Edit User
Admin mengubah data akun dan role.

## FS-USER-004 — Aktivasi
Admin mengaktifkan akun.

## FS-USER-005 — Nonaktifkan
Admin menonaktifkan akun. Akun nonaktif tidak dapat login.

## FS-USER-006 — Multi-Role
Admin dapat memberikan beberapa role kepada user.

# 6. Master Data

## FS-MASTER-001 — Data Madrasah
Admin dapat melihat dan mengedit data Madrasah.

## FS-MASTER-002 — Data Guru
Admin dapat CRUD data Guru.

## FS-MASTER-003 — Data Siswa
Admin dapat CRUD data Siswa.

## FS-MASTER-004 — Kelas/Rombel
Admin mengelola kelas, rombel, dan penempatan siswa.

## FS-MASTER-005 — Wali Kelas
Sistem dapat menetapkan Guru sebagai Wali Kelas.

# 7. Tahun Pelajaran/Periode

## FS-PERIOD-001 — Kelola Periode
Admin dapat membuat, mengubah, dan menetapkan periode aktif.

## FS-PERIOD-002 — Periode Aktif
Sistem menggunakan satu periode aktif sebagai konteks transaksi.

## FS-PERIOD-003 — Isolasi Data
Presensi, izin, jadwal, kelas/rombel, dan laporan tidak boleh bercampur antarperiode.

# 8. Import Excel

## FS-IMPORT-001 — Template
Sistem menyediakan template Excel Guru dan Siswa.

## FS-IMPORT-002 — Upload
Admin mengunggah file Excel.

## FS-IMPORT-003 — Validasi
Sistem memvalidasi setiap baris.

## FS-IMPORT-004 — Hasil
Sistem menampilkan:
- jumlah diproses;
- berhasil;
- gagal;
- alasan kegagalan.

# 9. Geofencing

## FS-GEO-001 — Konfigurasi
Admin mengatur latitude, longitude, dan radius.

Default radius:

**200 meter.**

## FS-GEO-002 — Akurasi
Lokasi valid jika:

```text
accuracy <= 30 meter
```

## FS-GEO-003 — Radius
Lokasi valid jika:

```text
distance <= configured_radius
```

## FS-GEO-004 — GPS Tidak Tersedia
Transaksi ditolak dan aplikasi menampilkan guidance.

## FS-GEO-005 — Permission Ditolak
Transaksi ditolak dan aplikasi menampilkan guidance.

## FS-GEO-006 — Data Lokasi
Presensi menyimpan:
- timestamp;
- latitude;
- longitude;
- distance.

Device information tidak disimpan.

# 10. Jadwal Efektif

## FS-SCHEDULE-001 — Jadwal Standar

Default hari aktif:

```text
Sabtu, Minggu, Senin, Selasa, Rabu, Kamis
```

Jumat adalah libur rutin.

Admin menentukan:
- jam datang;
- jam pulang.

## FS-SCHEDULE-002 — Kalender Khusus

Admin dapat menetapkan tanggal:
- Libur; atau
- Aktif dengan jadwal khusus.

## FS-SCHEDULE-003 — Override Guru

Admin dapat menetapkan jam khusus Guru.

Tidak ada batasan bahwa override harus berada di antara jadwal standar.

## FS-SCHEDULE-004 — Prioritas Jadwal

Sistem menentukan jadwal efektif dengan urutan:

```text
Tanggal khusus
   ↓
Jika LIBUR → tidak ada absensi
   ↓
Jika jadwal khusus → jadwal khusus menjadi dasar
   ↓
Override Guru
   ↓
Jadwal Standar
```

Jika ada override Guru pada tanggal aktif, override diterapkan terhadap jadwal dasar tanggal tersebut.

## FS-SCHEDULE-005 — Contoh

Jadwal standar:

```text
Datang 07:00
Pulang 15:00
```

Jadwal khusus:

```text
Datang 08:00
Pulang 14:00
```

Override Guru:

```text
Datang 08:30
Pulang 14:30
```

Jadwal efektif Guru:

```text
Datang 08:30
Pulang 14:30
```

# 11. Jam Aktif Absensi

## FS-TIME-001 — Window Datang

```text
Mulai = jadwal datang efektif - 60 menit
Selesai = jadwal datang efektif + 120 menit
```

Di luar window, transaksi datang ditolak.

## FS-TIME-002 — Window Pulang

```text
Mulai = jadwal pulang efektif - 120 menit
Selesai = jadwal pulang efektif + 180 menit
```

Di luar window, transaksi pulang ditolak.

## FS-TIME-003 — Grace Period Datang

Grace period:

**10 menit.**

Contoh jadwal 07:00:

```text
<= 07:10  → Hadir
>  07:10  → Terlambat
```

## FS-TIME-004 — Toleransi Pulang

Toleransi:

**10 menit sebelum jadwal pulang.**

Contoh jadwal 15:00:

```text
14:50–15:00 → Normal
< 14:50     → Pulang Cepat
```

# 12. Absensi Guru

## FS-ATT-G-001 — Absen Datang

**Actor:** Guru/Wali Kelas.

Urutan:

```text
Pilih Datang
 ↓
Cek periode
 ↓
Cek tanggal aktif
 ↓
Tentukan jadwal efektif
 ↓
Cek window waktu
 ↓
Ambil GPS
 ↓
Validasi akurasi
 ↓
Validasi radius
 ↓
Cek duplicate
 ↓
Hitung status
 ↓
Simpan
```

## FS-ATT-G-002 — Absen Pulang

Urutan sama dengan Absen Datang, menggunakan window dan status pulang.

## FS-ATT-G-003 — Anti-Duplicate

Jika kategori yang sama sudah tercatat pada tanggal tersebut, transaksi ditolak.

# 13. Absensi Siswa

## FS-ATT-S-001 — Scanner

Guru/Wali Kelas membuka scanner.

## FS-ATT-S-002 — Decode QR

QR dibaca sebagai NISN.

## FS-ATT-S-003 — Cari Siswa

Jika NISN tidak ditemukan, transaksi ditolak.

## FS-ATT-S-004 — Verifikasi Manual

Sistem menampilkan identitas Siswa setelah QR dibaca.

Guru memastikan QR benar-benar milik Siswa.

Tidak ada biometrik.

## FS-ATT-S-005 — Tentukan Datang/Pulang

Sistem menentukan kategori berdasarkan tindakan Guru dan window waktu.

## FS-ATT-S-006 — GPS Guru

GPS yang digunakan adalah GPS perangkat Guru pemindai.

## FS-ATT-S-007 — Simpan Pemindai

ID Guru pemindai disimpan pada transaksi presensi Siswa.

## FS-ATT-S-008 — Semua Guru

Tidak ada pembatasan berdasarkan kelas. Semua Guru dapat scan semua Siswa.

## FS-ATT-S-009 — Anti-Duplicate

Satu Siswa hanya dapat memiliki satu presensi untuk kategori yang sama pada tanggal yang sama.

# 14. QR Code

## FS-QR-001 — Generate
Admin membuat QR berbasis NISN.

## FS-QR-002 — Statis
QR tidak berubah/reset secara berkala.

## FS-QR-003 — Cetak
Admin dapat menghasilkan QR untuk kebutuhan cetak kartu.

# 15. Status Kehadiran

## FS-STATUS-001 — Hadir

Datang sampai 10 menit setelah jadwal efektif dikategorikan Hadir.

## FS-STATUS-002 — Terlambat

Datang setelah grace period dikategorikan Terlambat.

Jika tidak ada Datang tetapi ada Pulang, status juga ditetapkan **Terlambat**.

## FS-STATUS-003 — Pulang Cepat

Pulang lebih dari 10 menit sebelum jadwal efektif dikategorikan Pulang Cepat.

## FS-STATUS-004 — Belum Absen Pulang

```text
Ada Datang
+
Tidak Ada Pulang
```

Sistem menampilkan **Belum Absen Pulang** setelah periode pulang berakhir.

Penanganan dilakukan Admin melalui koreksi.

## FS-STATUS-005 — Alpa

```text
Tidak Ada Datang
+
Tidak Ada Pulang
+
Periode absensi berakhir
+
Tidak ada izin Approved
```

→ Alpa.

## FS-STATUS-006 — Izin

Approved leave menggantikan status kehadiran tanggal terkait sesuai jenis izin.

# 16. Auto-Alpa

## FS-ALPA-001 — Evaluasi

Setelah window absensi selesai, sistem mengevaluasi kehadiran.

## FS-ALPA-002 — Penetapan

Alpa hanya ditetapkan bila:
- tidak ada Datang;
- tidak ada Pulang;
- tidak ada izin Approved.

# 17. Koreksi Presensi

## FS-CORR-001 — Pengajuan Guru

Guru dapat mengajukan koreksi tanpa mengubah data langsung.

## FS-CORR-002 — Review Admin

Admin dapat melihat dan menindaklanjuti pengajuan.

## FS-CORR-003 — Koreksi Langsung

Admin dapat mengubah presensi tanpa pengajuan.

## FS-CORR-004 — Alasan

Alasan koreksi tidak wajib.

## FS-CORR-005 — Audit

Setiap perubahan menghasilkan:
- timestamp;
- Admin;
- record presensi;
- before;
- after.

# 18. Audit Trail

## FS-AUDIT-001 — Presensi

Simpan:
- timestamp;
- koordinat;
- jarak;
- Guru pemindai untuk Siswa.

## FS-AUDIT-002 — Koreksi

Simpan:
- timestamp;
- Admin;
- presensi;
- before;
- after.

## FS-AUDIT-003 — Akses

Hanya Admin dan Kepala Madrasah.

## FS-AUDIT-004 — Device

Device information tidak direkam.

# 19. Perizinan Siswa

## FS-LEAVE-S-001 — Pengajuan

Siswa dapat mengajukan Izin/Sakit.

## FS-LEAVE-S-002 — Tanggal

Mendukung:
- tanggal tunggal;
- rentang tanggal;
- tanggal masa lalu.

Tidak ada deadline.

## FS-LEAVE-S-003 — Lampiran

Lampiran:
- opsional;
- maksimal 1 file;
- PDF/JPG/JPEG/PNG;
- maksimal 2 MB.

# 20. Approval Siswa

## FS-APP-S-001 — Wali Kelas

Wali Kelas dapat Approve/Reject pengajuan siswa kelasnya.

## FS-APP-S-002 — Admin Pengganti

Admin dapat menjadi approver jika Wali Kelas tidak tersedia.

## FS-APP-S-003 — Pembatalan

Hanya Admin yang dapat membatalkan approval.

```text
Approved
 ↓
Pending
```

Dampak:

**Izin Menunggu Approval.**

## FS-APP-S-004 — Status

```text
Pending → Approved
Pending → Rejected
Approved → Pending (Admin cancel)
```

# 21. Perizinan Guru

## FS-LEAVE-G-001 — Pengajuan

Guru dapat mengajukan:
- Sakit;
- Izin Keperluan Pribadi;
- Tugas Luar/Dinas;
- kategori lain yang disediakan.

## FS-LEAVE-G-002 — Tanggal

Mendukung tanggal tunggal, rentang, dan tanggal masa lalu.

Tidak ada deadline.

## FS-LEAVE-G-003 — Lampiran

Mengikuti aturan umum lampiran.

# 22. Approval Guru

## FS-APP-G-001 — Kepala Madrasah

Kepala Madrasah dapat Approve/Reject.

## FS-APP-G-002 — Admin Pengganti

Admin dapat menjadi approver pengganti.

## FS-APP-G-003 — Pembatalan

Admin dapat membatalkan approval.

Hasil:

```text
Approved → Pending
```

Dampak:

**Izin Menunggu Approval.**

# 23. Dashboard

## FS-DASH-001 — Default

Default:
- periode aktif;
- tanggal hari ini.

## FS-DASH-002 — Filter

Mendukung:
- tanggal/rentang;
- individu;
- kelas;
- seluruh Madrasah sesuai hak akses.

## FS-DASH-003 — Indikator

Minimal:
- Hadir;
- Terlambat;
- Pulang Cepat;
- Belum Absen Pulang;
- Alpa;
- Izin/Sakit.

## FS-DASH-004 — Visualisasi

Minimal:
1. kartu ringkasan;
2. distribusi status;
3. tren kehadiran.

## FS-DASH-005 — Scope Role

- Siswa: pribadi.
- Guru: pribadi.
- Wali Kelas: kelas.
- Admin: Madrasah.
- Kepala Madrasah: Madrasah.

# 24. Laporan

## FS-REPORT-001 — Harian
## FS-REPORT-002 — Mingguan
## FS-REPORT-003 — Bulanan

Setiap laporan mendukung filter:
- periode;
- individu;
- kelas;
- seluruh Madrasah.

# 25. Export

## FS-EXPORT-001 — Excel

Format `.xlsx`.

Kolom minimal:
- periode;
- tanggal;
- identitas;
- kelas/rombel;
- jam datang;
- status datang;
- jam pulang;
- status pulang;
- status akhir;
- keterangan izin.

## FS-EXPORT-002 — PDF

Format `.pdf`.

Ketentuan:
- A4;
- landscape untuk rekap;
- header Madrasah;
- periode;
- rentang tanggal;
- tabel;
- nomor halaman.

## FS-EXPORT-003 — Nama File

```text
Rekap-Presensi_[Periode]_[TanggalMulai]-[TanggalAkhir].[xlsx/pdf]
```

## FS-EXPORT-004 — Konsistensi

Export harus mengikuti filter dan hak akses aktif.

# 26. Notifikasi & Guidance

## FS-NOTIF-001 — Kanal

Hanya in-app.

Tidak ada:
- email;
- WhatsApp;
- push notification eksternal.

## FS-NOTIF-002 — Bentuk

Dapat menggunakan:
- toast;
- alert;
- banner;
- dialog;
- status pada halaman.

## FS-NOTIF-003 — Kondisi

Minimal untuk:
- GPS tidak tersedia;
- permission ditolak;
- akurasi gagal;
- di luar radius;
- window belum/sudah berakhir;
- duplicate;
- QR tidak valid;
- submit berhasil;
- approval/rejection;
- Belum Absen Pulang;
- pengingat saat membuka aplikasi.

# 27. Keamanan

## FS-SEC-001
Authentication wajib.

## FS-SEC-002
Authorization berdasarkan role.

## FS-SEC-003
Data periode terisolasi.

## FS-SEC-004
Audit dibatasi Admin/Kepala Madrasah.

## FS-SEC-005
Input divalidasi.

# 28. Matriks Acceptance Criteria

| Area | Kriteria |
|---|---|
| Login | User aktif dapat login; user nonaktif ditolak |
| Role | Fungsi mengikuti role dan multi-role |
| Periode | Transaksi terikat periode aktif |
| GPS | Akurasi <= 30m |
| Radius | Jarak <= konfigurasi radius |
| Radius default | 200m |
| Datang | Window -60/+120 menit |
| Grace datang | 10 menit |
| Pulang | Window -120/+180 menit |
| Pulang cepat | >10 menit lebih awal |
| Override | Boleh lebih awal/lambat |
| Kalender | Tanggal khusus mengalahkan standar |
| QR | Statis dan berisi NISN |
| Scan | Semua Guru dapat scan semua Siswa |
| Duplicate | Kategori sama tidak boleh ganda |
| Belum Pulang | Ada datang, tidak ada pulang |
| Alpa | Tidak datang + tidak pulang setelah window berakhir |
| Tanpa Datang + Ada Pulang | Terlambat |
| Koreksi | Admin dapat mengubah |
| Audit | Before/after + actor + timestamp |
| Izin | Past date dan date range |
| Lampiran | 1 file, <=2MB, PDF/JPG/JPEG/PNG, opsional |
| Approval | Wali/Kepala sesuai jenis |
| Cancel approval | Hanya Admin |
| Cancel result | Pending + Izin Menunggu Approval |
| Dashboard | Default periode aktif + hari ini |
| Export | XLSX + PDF |
| Notification | In-app only |

# 29. Daftar Layar

## Authentication
1. Login

## Dashboard
2. Dashboard Admin
3. Dashboard Guru
4. Dashboard Wali Kelas
5. Dashboard Siswa
6. Dashboard Kepala Madrasah

## Master
7. Data Madrasah
8. Data Guru
9. Form Guru
10. Data Siswa
11. Form Siswa
12. Data Kelas/Rombel
13. Data User
14. Form User
15. Data Periode

## Konfigurasi
16. Geofencing
17. Jadwal Standar
18. Jadwal Khusus/Kalender
19. Override Guru

## Presensi
20. Absen Datang
21. Absen Pulang
22. Scanner QR
23. Konfirmasi Siswa
24. Hasil Scan
25. Riwayat Presensi

## Koreksi
26. Pengajuan Koreksi
27. Daftar Koreksi
28. Form Koreksi Admin
29. Audit Koreksi

## Perizinan
30. Pengajuan Izin Siswa
31. Pengajuan Izin Guru
32. Approval Izin Siswa
33. Approval Izin Guru
34. Detail Pengajuan

## Laporan
35. Rekap Harian
36. Rekap Mingguan
37. Rekap Bulanan
38. Export

## QR
39. Daftar QR
40. Cetak QR

## Audit
41. Audit Trail
42. Detail Audit

# 30. Status Akhir Functional Specification

Seluruh TBD yang sebelumnya tercantum pada FS telah diselesaikan:

| TBD | Status | Keputusan |
|---|---|---|
| TBD-001 | Resolved | Grace datang 10 menit |
| TBD-002 | Resolved | Pulang Cepat >10 menit lebih awal |
| TBD-003 | Resolved | Window datang -60/+120; pulang -120/+180 |
| TBD-004 | Resolved | Tidak datang + ada pulang = Terlambat |
| TBD-005 | Resolved | Admin cancel → Pending → Izin Menunggu Approval |
| TBD-006 | Resolved | 1 file, PDF/JPG/JPEG/PNG, <=2MB, opsional |
| TBD-007 | Resolved | Format/layout/kolom/nama file ditetapkan |
| TBD-008 | Resolved | Default hari ini + periode aktif; filter dan grafik ditetapkan |
| TBD-009 | Resolved | In-app only; tanpa email/WA/push |

## Kesimpulan

**Tidak ada lagi status TBD pada Functional Specification Sistem Absensi Madrasah.**

Dokumen ini dinyatakan:

**FINAL — Functional Specification v2.0**

Dokumen siap menjadi dasar penyusunan **Data Model**.
