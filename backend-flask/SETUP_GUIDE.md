# 🐍 Backend Flask Setup Guide - Anaconda

Panduan lengkap setup backend Flask menggunakan Anaconda environment.

---

## Step 1: Buka Anaconda Prompt

1. Tekan `Windows + S`
2. Ketik "Anaconda Prompt"
3. Klik kanan → "Run as Administrator" (optional, tapi recommended)

---

## Step 2: Navigate ke Backend Folder

```bash
cd C:\Users\PC\Documents\GitHub\NutriBot\meal-diet-planner\backend-flask
```

---

## Step 3: Create Conda Environment

```bash
conda create -n nutribot python=3.11 -y
```

**Penjelasan:**
- `-n nutribot` = nama environment
- `python=3.11` = versi Python yang digunakan
- `-y` = auto-confirm semua prompts

⏱️ **Waktu:** ~2-3 menit (tergantung internet)

---

## Step 4: Activate Environment

```bash
conda activate nutribot
```

**Cek berhasil atau tidak:**
Setelah activate, prompt kamu seharusnya berubah jadi:
```
(nutribot) C:\Users\PC\Documents\GitHub\NutriBot\meal-diet-planner\backend-flask>
```

---

## Step 5: Install Dependencies

```bash
pip install -r requirements.txt
```

**Dependencies yang akan diinstall:**
- `flask` - Web framework
- `flask-cors` - CORS support
- `python-dotenv` - Environment variables
- `google-generativeai` - Gemini AI SDK
- `requests` - HTTP library

⏱️ **Waktu:** ~1-2 menit

---

## Step 6: Setup Environment Variables

```bash
# Copy template
copy .env.example .env

# Edit .env file
notepad .env
```

**Isi file `.env` dengan:**
```
GEMINI_API_KEY=your_api_key_here
FLASK_ENV=development
FLASK_PORT=5000
CORS_ORIGINS=http://localhost:3000
```

⚠️ **PENTING:** Ganti `your_api_key_here` dengan Gemini API Key kamu!

### 🔑 Cara Mendapatkan Gemini API Key:

1. Buka: https://makersuite.google.com/app/apikey
2. Login dengan Google Account
3. Klik "Create API Key"
4. Copy API key yang muncul
5. Paste ke file `.env`

**Contoh:**
```
GEMINI_API_KEY=AIzaSyABC123def456GHI789jkl012MNO345pqr
```

---

## Step 7: Test Backend

```bash
python app.py
```

**Output yang diharapkan:**
```
    ╔═══════════════════════════════════════╗
    ║   🥗 NutriBot Backend is running!    ║
    ║                                       ║
    ║   Port: 5000                          ║
    ║   Debug: True                         ║
    ║   CORS: http://localhost:3000         ║
    ╚═══════════════════════════════════════╝

 * Serving Flask app 'app'
 * Debug mode: on
 * Running on http://0.0.0.0:5000
```

✅ **Kalau muncul output seperti di atas, backend BERHASIL running!**

---

## Step 8: Test API Endpoints

Buka browser baru (jangan tutup Anaconda Prompt yang running Flask):

### Test Health Check:
```
http://localhost:5000/health
```

**Expected Response:**
```json
{
  "status": "healthy",
  "service": "NutriBot Backend",
  "version": "1.0.0"
}
```

### Test Root Endpoint:
```
http://localhost:5000/
```

**Expected Response:**
```json
{
  "message": "NutriBot API is running! 🥗",
  "endpoints": {
    "health": "/health",
    "chat": "/api/chat",
    "nutrition": "/api/nutrition"
  }
}
```

---

## Step 9: Test Chat Integration

Sekarang buka frontend yang sudah running:
```
http://localhost:3000/chat
```

Coba chat:
```
Hai! Buatin meal plan 7 hari dong
```

✅ **Kalau NutriBot balas dengan meal plan, SUKSES!** 🎉

---

## 🐛 Troubleshooting

### Error: "No module named 'flask'"
**Solusi:**
```bash
# Pastikan environment sudah diaktifkan
conda activate nutribot

# Install ulang dependencies
pip install -r requirements.txt
```

### Error: "Address already in use"
**Solusi:**
Port 5000 sudah dipakai aplikasi lain.

Edit `.env`:
```
FLASK_PORT=5001
```

Lalu edit `frontend/.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:5001
```

Restart kedua server.

### Error: "Invalid API Key" atau "Gemini API Error"
**Solusi:**
1. Pastikan API key sudah benar di `.env`
2. Check quota API key di: https://makersuite.google.com/
3. Gemini API gratis punya rate limit, tunggu beberapa saat

### Backend running tapi frontend tidak connect
**Solusi:**
1. Check `.env.local` di frontend:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:5000
   ```
2. Restart frontend: `Ctrl+C` di terminal npm, lalu `npm run dev` lagi
3. Hard refresh browser: `Ctrl+Shift+R`

---

## 📌 Quick Commands Reference

```bash
# Activate environment
conda activate nutribot

# Deactivate environment
conda deactivate

# Run Flask server
python app.py

# Check installed packages
pip list

# Update dependencies
pip install -r requirements.txt --upgrade
```

---

## 🎯 Next Steps Setelah Backend Running:

1. ✅ Test chat dengan berbagai pertanyaan
2. ✅ Minta meal plan dengan info lengkap (umur, berat, tinggi, dll)
3. ✅ Test fitur nutrition calculator
4. ✅ Explore response markdown formatting
5. ✅ Customize NutriBot personality di `services/llm.py`

---

**Happy Coding! 🚀**

Kalau ada error atau pertanyaan, jangan ragu untuk tanya!
