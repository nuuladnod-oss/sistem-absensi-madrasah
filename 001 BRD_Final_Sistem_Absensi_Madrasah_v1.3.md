# FINAL BRD — Sistem Absensi Madrasah Berbasis Geofencing & QR Code

**Versi:** 1.3  
**Status:** Final Business Requirements Document  
**Basis:** BRD v1.2 + hasil review Functional Specification  
**Tanggal revisi:** 23 September 2026

---

## 1. Pendahuluan

Dokumen ini menjadi acuan kebutuhan bisnis untuk aplikasi absensi Madrasah berbasis web yang mengelola presensi Guru dan Siswa menggunakan geofencing dan QR Code.

Dokumen v1.3 menyelesaikan seluruh kebutuhan yang sebelumnya berstatus TBD pada Functional Specification dan menambahkan aturan prioritas antara jadwal standar, override Guru, serta kalender/jadwal khusus.

## 2. Tujuan Bisnis

1. Mencatat kehadiran Guru secara mandiri menggunakan validasi lokasi.
2. Mencatat kehadiran Siswa melalui scan QR oleh Guru.
3. Mengurangi pencatatan manual dan duplikasi presensi.
4. Menyediakan status kehadiran yang konsisten.
5. Menyediakan mekanisme izin, approval, dan koreksi.
6. Menyediakan audit trail untuk perubahan presensi.
7. Menyediakan dashboard, laporan, dan export.
8. Memisahkan data berdasarkan Tahun Pelajaran/Periode.

## 3. Ruang Lingkup

### Termasuk
- Authentication dan role management.
- Data Madrasah, Guru, Siswa, Kelas/Rombel.
- Tahun Pelajaran/Periode.
- Import Excel.
- Geofencing.
- Jadwal standar.
- Override jadwal Guru.
- Kalender libur dan jadwal khusus.
- QR Code statis berbasis NISN.
- Absensi Guru datang/pulang.
- Scan absensi Siswa datang/pulang.
- Status kehadiran dan auto-Alpa.
- Koreksi presensi.
- Audit trail.
- Perizinan dan approval.
- Dashboard.
- Laporan dan export.
- Notifikasi/panduan di dalam aplikasi.

### Tidak termasuk
- Jadwal mata pelajaran/lesson period.
- Biometrik kepemilikan QR.
- Email notification.
- WhatsApp notification.
- Push notification eksternal.
- Pencatatan informasi perangkat.

## 4. Aktor dan Role

| Role | Fungsi utama |
|---|---|
| Admin | Pengelolaan sistem, master data, konfigurasi, koreksi, approval pengganti, audit, laporan |
| Guru | Absen datang/pulang, scan Siswa, riwayat pribadi, pengajuan izin, pengajuan koreksi |
| Wali Kelas | Seluruh fungsi Guru + approval izin Siswa di kelas tanggung jawab |
| Siswa | Melihat presensi dan mengajukan izin; tidak melakukan scan absensi |
| Kepala Madrasah | Dashboard, laporan, audit trail, approval izin Guru |

Satu user dapat memiliki lebih dari satu role. Seorang Guru dapat sekaligus menjadi Wali Kelas.

## 5. Tahun Pelajaran/Periode

Sistem menggunakan konsep Tahun Pelajaran/Periode.

- Satu periode operasional ditetapkan sebagai periode aktif.
- Data periodik tidak boleh tercampur antarperiode.
- Presensi, izin, jadwal, kelas/rombel, dan laporan harus berada pada konteks periode yang benar.

## 6. Master Data

### 6.1 Madrasah
Admin dapat melihat dan mengedit:
- Nama Lembaga;
- NSM;
- Alamat;
- data konfigurasi lokasi yang relevan.

### 6.2 Guru
Data minimal:
- Nama;
- NIK;
- Mata Pelajaran;
- Foto;
- Nomor HP.

### 6.3 Siswa
Data minimal:
- Nama;
- NISN;
- Kelas;
- Jurusan;
- Foto.

### 6.4 Kelas/Rombel
Admin mengelola Kelas dan Rombongan Belajar serta penempatan Siswa.

### 6.5 Akun
Admin dapat:
- membuat;
- mengedit;
- mengaktifkan;
- menonaktifkan;
- memberikan role.

## 7. Import Data

Import awal mendukung Guru dan Siswa melalui Excel.

Ketentuan:
- tersedia template;
- sistem melakukan validasi;
- hasil menampilkan jumlah berhasil dan gagal;
- setiap kegagalan memiliki alasan.

## 8. Geofencing

### 8.1 Titik dan Radius
Admin menentukan:
- Latitude;
- Longitude;
- Radius.

Default:

**200 meter.**

### 8.2 Akurasi GPS
Batas minimum akurasi:

**30 meter.**

Lokasi dengan akurasi lebih buruk dari 30 meter ditolak.

### 8.3 GPS Tidak Tersedia
Absensi ditolak dan aplikasi menampilkan panduan.

### 8.4 Permission Ditolak
Absensi ditolak dan aplikasi menampilkan panduan untuk mengaktifkan permission lokasi.

### 8.5 Data Lokasi Presensi
Presensi menyimpan:
- timestamp;
- latitude/longitude;
- jarak dari titik Madrasah.

Informasi perangkat tidak dicatat.

## 9. Jadwal Kehadiran

Sistem hanya mengenal:
- jadwal datang;
- jadwal pulang.

Tidak ada jadwal mata pelajaran atau periodisasi pelajaran.

### 9.1 Hari Aktif Standar
Default hari aktif:
- Sabtu;
- Minggu;
- Senin;
- Selasa;
- Rabu;
- Kamis.

Jumat adalah libur rutin.

### 9.2 Jadwal Standar
Admin menentukan jam datang dan pulang standar.

### 9.3 Override Jadwal Guru
Admin dapat menetapkan jadwal khusus per Guru.

Aturan revisi:
- override datang **boleh lebih awal atau lebih lambat** dari jadwal standar;
- override pulang **boleh lebih awal atau lebih lambat** dari jadwal standar.

Tidak ada lagi pembatasan bahwa override harus berada di dalam jadwal standar.

### 9.4 Kalender/Jadwal Khusus
Admin dapat menentukan tanggal khusus sebagai:
1. Libur; atau
2. Hari aktif dengan jadwal khusus.

### 9.5 Prioritas Jadwal
Untuk menentukan jadwal efektif pada tanggal tertentu:

```text
Kalender tanggal khusus
        ↓
Jika LIBUR → tidak ada absensi normal
        ↓
Jika JADWAL KHUSUS → gunakan jadwal khusus sebagai dasar
        ↓
Override Guru pada tanggal tersebut
        ↓
Jadwal Standar
```

Dengan demikian:
- kalender menentukan apakah tanggal aktif/libur;
- jadwal khusus menentukan jam dasar tanggal tersebut;
- override Guru menyesuaikan jadwal Guru pada tanggal tersebut;
- jika tidak ada konfigurasi khusus, sistem memakai jadwal standar.

## 10. Toleransi Kedatangan

Untuk menyederhanakan operasional:

**Grace period datang = 10 menit.**

Contoh:
- Jadwal efektif 07:00.
- Datang sampai 07:10 → **Hadir**.
- Datang setelah 07:10 → **Terlambat**.

Grace period hanya berlaku untuk klasifikasi status dan tidak mengubah jam jadwal efektif.

## 11. Batas Pulang Cepat

Untuk menyederhanakan operasional:

**Toleransi pulang = 10 menit.**

Contoh jadwal efektif 15:00:
- Pulang 14:50–15:00 → **Hadir/Normal**.
- Pulang sebelum 14:50 → **Pulang Cepat**.

## 12. Jam Aktif Absensi

Jam aktif menggunakan jadwal efektif.

### 12.1 Datang
Absensi datang dibuka:

**60 menit sebelum jadwal datang efektif**

dan ditutup:

**120 menit setelah jadwal datang efektif.**

### 12.2 Pulang
Absensi pulang dibuka:

**120 menit sebelum jadwal pulang efektif**

dan ditutup:

**180 menit setelah jadwal pulang efektif.**

Di luar jendela tersebut transaksi ditolak.

## 13. Absensi Guru

Guru melakukan:
- absen datang;
- absen pulang.

Validasi:
1. periode aktif;
2. tanggal aktif;
3. jadwal efektif;
4. jam aktif;
5. GPS tersedia;
6. akurasi <= 30 meter;
7. jarak <= radius;
8. tidak duplikat.

## 14. Absensi Siswa

Siswa tidak melakukan scan sendiri.

Guru melakukan scan QR Siswa.

Semua Guru dapat scan semua Siswa, tidak dibatasi berdasarkan kelas.

GPS yang digunakan adalah GPS Guru yang melakukan scan.

ID Guru pemindai disimpan sebagai bagian dari jejak audit presensi Siswa.

## 15. QR Code Siswa

- QR bersifat statis.
- QR berisi NISN.
- Tidak ada proses reset QR.
- Guru wajib melakukan verifikasi manual bahwa QR sesuai dengan Siswa.
- Tidak ada verifikasi biometrik.

## 16. Anti-Duplicate

Sistem tidak mengizinkan lebih dari satu presensi untuk kombinasi:

```text
Entitas + tanggal + kategori presensi
```

Kategori:
- Datang;
- Pulang.

## 17. Status Kehadiran

Status utama:
- Hadir;
- Terlambat;
- Pulang Cepat;
- Belum Absen Pulang;
- Alpa;
- status izin yang disetujui.

### 17.1 Belum Absen Pulang
Jika:
```text
Ada Datang
+
Tidak Ada Pulang
```
maka status:

**Belum Absen Pulang**

Admin menangani melalui koreksi presensi.

### 17.2 Alpa
Jika pada hari aktif:
```text
Tidak Ada Datang
+
Tidak Ada Pulang
+
Periode absensi berakhir
+
Tidak ada izin disetujui
```
maka sistem menetapkan **Alpa**.

### 17.3 Tidak Ada Datang tetapi Ada Pulang
Jika:
```text
Tidak Ada Datang
+
Ada Pulang
```
status ditetapkan:

**Terlambat.**

Ini mencegah kondisi tersebut menjadi Alpa karena sudah terdapat aktivitas presensi.

## 18. Auto-Alpa

Setelah periode absensi berakhir, sistem mengevaluasi entitas yang seharusnya melakukan presensi.

Alpa hanya diberikan jika tidak ada datang dan tidak ada pulang serta tidak ada izin yang telah disetujui.

## 19. Koreksi Presensi

Guru:
- tidak dapat mengubah presensi langsung;
- dapat mengajukan koreksi.

Admin:
- dapat menyetujui/menindaklanjuti koreksi sesuai kebutuhan;
- dapat mengubah presensi langsung tanpa pengajuan Guru.

Alasan koreksi tidak wajib.

Setiap perubahan dicatat pada audit trail.

## 20. Audit Trail

Audit minimal mencatat:
- timestamp;
- Admin yang melakukan perubahan;
- presensi yang diubah;
- nilai/status sebelum;
- nilai/status sesudah.

Audit presensi juga menyimpan:
- timestamp;
- koordinat;
- jarak;
- Guru pemindai untuk presensi Siswa.

Audit hanya dapat dilihat Admin dan Kepala Madrasah.

## 21. Perizinan Siswa

Siswa dapat mengajukan:
- Izin;
- Sakit.

Ketentuan:
- tidak ada deadline;
- tanggal masa lalu diperbolehkan;
- satu pengajuan dapat mencakup satu tanggal atau rentang tanggal;
- lampiran bersifat opsional.

### Lampiran
Untuk operasional sederhana:
- maksimal 1 file;
- format: PDF, JPG, JPEG, PNG;
- ukuran maksimal: 2 MB;
- lampiran tidak wajib.

## 22. Approval Izin Siswa

Default approver: Wali Kelas.

Jika Wali Kelas tidak tersedia, Admin dapat menjadi approver pengganti.

Status:
- Pending;
- Approved;
- Rejected.

### Pembatalan Approval
Approval dapat dibatalkan **oleh Admin**.

Setelah dibatalkan:
```text
Approved
   ↓
Pending
```

Dampak ke presensi tanggal terkait:

**Izin Menunggu Approval.**

Sistem tidak mengembalikan tanggal tersebut secara otomatis menjadi Hadir atau Alpa.

## 23. Perizinan Guru

Guru dapat mengajukan:
- Sakit;
- Izin Keperluan Pribadi;
- Tugas Luar/Dinas;
- kategori khusus yang disediakan sistem.

Tidak ada deadline dan tanggal masa lalu diperbolehkan.

Satu pengajuan dapat mencakup rentang tanggal.

Lampiran mengikuti ketentuan umum:
- maksimal 1 file;
- PDF/JPG/JPEG/PNG;
- maksimal 2 MB;
- opsional.

## 24. Approval Izin Guru

Default approver: Kepala Madrasah.

Jika Kepala Madrasah tidak tersedia, Admin menjadi approver pengganti.

Pembatalan approval hanya oleh Admin dan mengembalikan status ke Pending dengan dampak status kehadiran **Izin Menunggu Approval**.

## 25. Dashboard

Dashboard menggunakan pendekatan sederhana dan informatif.

### Default
- periode aktif;
- tanggal hari ini.

### Filter
- tanggal/rentang tanggal;
- individu;
- kelas;
- seluruh Madrasah.

### Indikator
Minimal:
- Hadir;
- Terlambat;
- Pulang Cepat;
- Belum Absen Pulang;
- Alpa;
- Izin/Sakit.

### Visualisasi
Minimal:
1. ringkasan jumlah/status;
2. grafik distribusi status;
3. tren kehadiran berdasarkan tanggal.

Dashboard Guru dan Siswa difokuskan pada data pribadi. Dashboard Wali Kelas difokuskan pada kelasnya. Dashboard Admin dan Kepala Madrasah dapat melihat lingkup Madrasah sesuai hak akses.

## 26. Laporan

Periode:
- harian;
- mingguan;
- bulanan.

Filter:
- individu;
- kelas;
- seluruh Madrasah;
- periode.

## 27. Export

Format:
- Excel (.xlsx);
- PDF.

### Excel
Minimal berisi:
- periode;
- tanggal;
- identitas;
- kelas/rombel bila relevan;
- jam datang;
- status datang;
- jam pulang;
- status pulang;
- status akhir;
- keterangan izin bila ada.

### PDF
- ukuran A4;
- orientasi landscape untuk rekap;
- header nama Madrasah;
- periode laporan;
- rentang tanggal;
- tabel rekap;
- nomor halaman.

### Penamaan
Format sederhana:

```text
Rekap-Presensi_[Periode]_[TanggalMulai]-[TanggalAkhir].[xlsx/pdf]
```

## 28. Notifikasi dan Guidance

Sistem **tidak menggunakan** email, WhatsApp, atau push notification.

Notifikasi hanya berupa informasi di dalam aplikasi, misalnya:
- toast;
- alert;
- banner;
- dialog konfirmasi;
- status/panduan pada halaman.

Digunakan untuk:
- GPS tidak tersedia;
- permission ditolak;
- akurasi tidak memenuhi;
- di luar radius;
- waktu absensi belum/sudah berakhir;
- duplikasi;
- QR tidak valid;
- pengajuan berhasil;
- approval/rejection;
- status Belum Absen Pulang;
- pengingat saat pengguna membuka aplikasi bahwa ia belum melakukan tindakan yang diperlukan.

## 29. Keamanan

Minimal:
- authentication;
- authorization/RBAC;
- pemisahan akses berdasarkan role;
- isolasi data periode;
- perlindungan data presensi;
- pembatasan akses audit;
- validasi input.

## 30. Deployment

Sistem digunakan untuk operasional internal Madrasah.

Madrasah dapat mengoperasikan dan melakukan deployment secara mandiri. Detail infrastruktur ditentukan pada tahap deployment.

## 31. Aturan Bisnis Utama

| ID | Aturan |
|---|---|
| BR-001 | Hanya ada jadwal datang dan pulang. |
| BR-002 | Tidak ada jadwal mata pelajaran. |
| BR-003 | Radius default 200 meter. |
| BR-004 | Batas akurasi GPS 30 meter. |
| BR-005 | GPS wajib untuk absensi lokasi. |
| BR-006 | Guru melakukan absensi mandiri. |
| BR-007 | Semua Guru dapat scan semua Siswa. |
| BR-008 | QR statis. |
| BR-009 | QR berisi NISN. |
| BR-010 | Guru memverifikasi kepemilikan QR secara manual. |
| BR-011 | Siswa tidak melakukan scan sendiri. |
| BR-012 | GPS scan Siswa berasal dari Guru pemindai. |
| BR-013 | Tidak boleh ada duplikasi kategori presensi. |
| BR-014 | Absen pulang wajib. |
| BR-015 | Ada datang tanpa pulang = Belum Absen Pulang. |
| BR-016 | Tidak datang dan tidak pulang setelah periode berakhir = Alpa. |
| BR-017 | Auto-Alpa dijalankan setelah periode absensi berakhir. |
| BR-018 | Guru tidak dapat mengubah presensi langsung. |
| BR-019 | Guru dapat mengajukan koreksi. |
| BR-020 | Admin dapat mengubah presensi. |
| BR-021 | Alasan koreksi tidak wajib. |
| BR-022 | Koreksi wajib masuk audit trail. |
| BR-023 | Audit hanya Admin dan Kepala Madrasah. |
| BR-024 | Informasi perangkat tidak dicatat. |
| BR-025 | Override Guru boleh lebih awal/lambat untuk datang. |
| BR-026 | Override Guru boleh lebih awal/lambat untuk pulang. |
| BR-027 | Tidak ada deadline pengajuan izin. |
| BR-028 | Pengajuan izin masa lalu diperbolehkan. |
| BR-029 | Pengajuan izin mendukung rentang tanggal. |
| BR-030 | Approval dapat dibatalkan oleh Admin. |
| BR-031 | Pembatalan approval mengembalikan status ke Pending. |
| BR-032 | Dampak pembatalan = Izin Menunggu Approval. |
| BR-033 | Admin dapat menjadi approver pengganti. |
| BR-034 | User dapat memiliki multi-role. |
| BR-035 | Guru dapat menjadi Wali Kelas. |
| BR-036 | Data terisolasi berdasarkan periode. |
| BR-037 | Admin dapat mengedit data Madrasah. |
| BR-038 | Approval izin mengubah status kehadiran sesuai jenis izin. |
| BR-039 | Grace period datang 10 menit. |
| BR-040 | Pulang lebih dari 10 menit sebelum jadwal efektif = Pulang Cepat. |
| BR-041 | Jendela datang = -60 sampai +120 menit dari jadwal efektif. |
| BR-042 | Jendela pulang = -120 sampai +180 menit dari jadwal efektif. |
| BR-043 | Tidak datang tetapi ada pulang = Terlambat. |
| BR-044 | Lampiran maksimal 1 file, PDF/JPG/JPEG/PNG, maksimal 2 MB, opsional. |
| BR-045 | Export tersedia dalam Excel dan PDF dengan format standar. |
| BR-046 | Dashboard default menggunakan periode aktif dan tanggal hari ini. |
| BR-047 | Notifikasi hanya di dalam aplikasi; tanpa email/WhatsApp/push notification. |
| BR-048 | Kalender tanggal khusus menentukan libur atau jadwal khusus sebelum jadwal standar. |
| BR-049 | Jika tanggal khusus aktif, override Guru dapat menyesuaikan jadwal efektif Guru. |

## 32. Acceptance Criteria Utama

### Absensi
- GPS harus tersedia.
- Akurasi <= 30 meter.
- Jarak <= radius.
- Jadwal efektif harus tersedia.
- Transaksi harus berada dalam jam aktif.
- Duplikasi ditolak.

### Jadwal
- Override boleh lebih awal maupun lebih lambat dari standar.
- Kalender khusus diprioritaskan terhadap jadwal standar.
- Override Guru dapat diterapkan pada tanggal aktif yang memiliki jadwal khusus.

### Status
- Datang sampai 10 menit setelah jadwal = Hadir.
- Setelah grace period = Terlambat.
- Pulang lebih dari 10 menit sebelum jadwal = Pulang Cepat.
- Datang ada, pulang tidak ada = Belum Absen Pulang.
- Tidak datang dan tidak pulang setelah periode berakhir = Alpa.
- Tidak datang tetapi ada pulang = Terlambat.

### Izin
- Pengajuan dapat menggunakan tanggal masa lalu.
- Pengajuan dapat berupa rentang tanggal.
- Approval dapat dibatalkan Admin.
- Pembatalan menghasilkan Pending + Izin Menunggu Approval.

### Audit
- Koreksi tercatat before/after.
- Actor dan timestamp tercatat.
- Device information tidak dicatat.

## 33. Prioritas Pengembangan

### MVP-1
Authentication, role, user, Madrasah, periode, Guru, Siswa, kelas/rombel.

### MVP-2
Geofencing, jadwal standar, override Guru, kalender libur/jadwal khusus.

### MVP-3
Absensi Guru, scan Siswa, anti-duplicate, status, auto-Alpa, Belum Absen Pulang.

### MVP-4
Izin Siswa, approval Wali Kelas, izin Guru, approval Kepala Madrasah, Admin sebagai approver pengganti, koreksi, audit.

### MVP-5
Dashboard, rekap harian/mingguan/bulanan, filter.

### MVP-6
Export Excel/PDF, generator QR, cetak QR.

## 34. Prinsip Pengembangan

- Sederhana.
- Mudah dipahami pengguna Madrasah.
- Validasi dilakukan sebelum data disimpan.
- Aturan bisnis terpusat dan konsisten.
- Data historis tidak bercampur antarperiode.
- Perubahan presensi dapat ditelusuri.
- Tidak menambahkan kompleksitas yang tidak diperlukan.

## 35. Status Dokumen

**FINAL — BRD v1.3**

Seluruh TBD yang ditemukan pada Functional Specification telah diselesaikan dalam dokumen ini.
