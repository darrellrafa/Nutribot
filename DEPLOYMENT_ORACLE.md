# ☁️ Deploy Backend ke Oracle Cloud

Panduan ini khusus untuk deploy **Backend Flask saja** ke Oracle Cloud, karena Frontend akan di-deploy ke Vercel.

---

## 🛠️ Langkah 1: Setup Backend di Oracle Cloud

### 1. Masuk ke VM & Clone Repo
(Asumsi sudah install Docker sesuai panduan sebelumnya)

```bash
git clone https://github.com/darrellrafa/Nutribot.git
cd Nutribot
```

### 2. Setup Environment Variables
```bash
cd backend-flask
nano .env
```
Isi file `.env`:
```env
GEMINI_API_KEY=api_key_kamu_disini
FLASK_ENV=production
FLASK_PORT=5000
CORS_ORIGINS=*
```
*Catatan: Awalnya kita set `CORS_ORIGINS=*` agar bisa ditest. Nanti setelah deploy Vercel, kita ganti jadi domain Vercel supaya aman.*

### 3. Jalankan Backend
Kembali ke folder root, dan jalankan docker khusus backend:

```bash
cd ..
docker-compose -f docker-compose.backend.yml up --build -d
```
*Note: Kita pakai flag `-f docker-compose.backend.yml` supaya hanya menjalankan backend.*

### 4. Buka Firewall (PENTING)
Pastikan port 5000 dibuka di Oracle Cloud Console & Ubuntu Firewall (lihat langkah di panduan sebelumnya).

### 5. Cek IP Public
Catat IP Public VM kamu, misal `123.45.67.89`.
API URL kamu sekarang adalah: `http://123.45.67.89:5000`

---

## ⚡ Langkah 2: Hubungkan dengan Vercel

### 1. Deploy Frontend ke Vercel
Lihat panduan [DEPLOYMENT_VERCEL.md](DEPLOYMENT_VERCEL.md).
Saat deploy, kamu akan diminta Environment Variable. Masukkan IP backend tadi.

### 2. Update CORS (Opsional - untuk keamanan)
Setelah frontend di-deploy dan kamu punya domain (misal: `https://nutribot-ku.vercel.app`), balik lagi ke Oracle VM.

Edit `docker-compose.backend.yml`:
```bash
nano docker-compose.backend.yml
```

Ubah environment variable:
```yaml
    environment:
      - CORS_ORIGINS=https://nutribot-ku.vercel.app
```

Restart container:
```bash
docker-compose -f docker-compose.backend.yml up -d
```

Selesai! Sekarang Frontend (Vercel) dan Backend (Oracle) sudah terhubung. 🚀
