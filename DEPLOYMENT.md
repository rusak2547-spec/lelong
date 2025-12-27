# Panduan Deployment ke Hostinger

## Prasyarat

- Akun Hostinger dengan paket yang mendukung Node.js
- Database MySQL sudah dibuat di panel Hostinger
- Repository Git (GitHub/GitLab) untuk project ini

---

## Langkah 1: Persiapan Database MySQL di Hostinger

1. Login ke **hPanel Hostinger**
2. Pergi ke **Databases > MySQL Databases**
3. Buat database baru:
   - **Database name**: `lelong_db` (atau nama pilihan Anda)
   - **Username**: Catat username yang dibuat
   - **Password**: Buat password yang kuat dan catat
4. Catat informasi berikut:
   ```
   Host: localhost (biasanya)
   Port: 3306
   Database: u123456789_lelong_db
   Username: u123456789_user
   Password: [password Anda]
   ```

---

## Langkah 2: Konfigurasi Environment Variables

Di panel Hostinger, set environment variable berikut:

```env
DATABASE_URL="mysql://USERNAME:PASSWORD@localhost:3306/DATABASE_NAME"
```

**Contoh:**

```env
DATABASE_URL="mysql://u123456789_user:MySecurePass123@localhost:3306/u123456789_lelong_db"
```

---

## Langkah 3: Push ke GitHub

```bash
# Inisialisasi git (jika belum)
git init

# Tambahkan remote
git remote add origin https://github.com/USERNAME/lelong.git

# Commit semua perubahan
git add .
git commit -m "Ready for Hostinger deployment with MySQL"

# Push ke GitHub
git push -u origin main
```

---

## Langkah 4: Deploy di Hostinger

1. Di halaman **Deploy Aplikasi Web Node.js**, pilih **"Hubungkan dengan GitHub"**
2. Authorize Hostinger untuk mengakses repository Anda
3. Pilih repository `lelong`
4. Konfigurasi deployment:
   - **Branch**: `main`
   - **Build command**: `npm run build`
   - **Start command**: `npm run start`
   - **Node.js version**: 18.x atau lebih tinggi

---

## Langkah 5: Migrasi Database

Setelah deployment berhasil, jalankan migrasi database melalui SSH atau terminal Hostinger:

```bash
# Generate Prisma Client
npx prisma generate

# Jalankan migrasi untuk membuat tabel
npx prisma db push

# (Opsional) Seed data awal
npx prisma db seed
```

---

## Langkah 6: Verifikasi

1. Buka URL aplikasi Anda
2. Coba akses halaman admin: `https://your-domain.com/admin`
3. Login dengan kredensial admin default
4. Verifikasi semua fitur berfungsi dengan baik

---

## Troubleshooting

### Error: "Can't reach database server"

- Pastikan DATABASE_URL sudah benar
- Periksa username/password database
- Pastikan database sudah dibuat

### Error: "Access denied for user"

- Periksa kembali username dan password
- Pastikan user memiliki akses ke database yang dituju

### Error: "Unknown database"

- Buat database terlebih dahulu di panel Hostinger
- Pastikan nama database di DATABASE_URL sudah benar

---

## File yang TIDAK boleh di-commit ke Git

Pastikan file berikut ada di `.gitignore`:

```
node_modules/
.env
dev.db
.next/
```

---

## Struktur Environment Variables

| Variable       | Deskripsi               | Contoh                                |
| -------------- | ----------------------- | ------------------------------------- |
| `DATABASE_URL` | Connection string MySQL | `mysql://user:pass@localhost:3306/db` |

---

## Kontak Support

Jika ada masalah deployment, hubungi:

- Hostinger Support: https://www.hostinger.com/support
- Prisma Documentation: https://www.prisma.io/docs
