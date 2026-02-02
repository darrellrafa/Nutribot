# 🚀 Quick Setup - Qwen2.5 untuk Summarization

## 📋 Prerequisites

- Ollama sudah terinstall
- Minimal 8GB RAM
- Minimal 5GB disk space

---

## ⚡ Setup Steps

### 1. Download Model Qwen2.5

```bash
# Download Qwen2.5 7B Instruct Q5_K_M (recommended)
ollama pull qwen2.5:7b-instruct-q5_K_M
```

**Ukuran:** ~4.7GB  
**Waktu download:** ~5-15 menit (tergantung internet)

**Progress indicator:**
```
pulling manifest
pulling 8934d96d3f08... 100% ▕████████████████▏ 4.7 GB
pulling 8c17c2ebb0ea... 100% ▕████████████████▏ 7.0 KB
pulling 7c23fb36d801... 100% ▕████████████████▏ 4.8 KB
pulling 2e0493f67d0c... 100% ▕████████████████▏   59 B
pulling fa8235e5b48f... 100% ▕████████████████▏  485 B
verifying sha256 digest
writing manifest
success
```

---

### 2. Verify Installation

```bash
# List installed models
ollama list
```

**Expected output:**
```
NAME                              ID              SIZE      MODIFIED
llama3.2:3b                       a80c4f17acd5    2.0 GB    2 hours ago
qwen2.5:7b-instruct-q5_K_M        3f8d85b4e9c2    4.7 GB    5 minutes ago
```

---

### 3. Test Model

```bash
# Test Qwen2.5
ollama run qwen2.5:7b-instruct-q5_K_M "Ringkas teks ini: NutriBot adalah aplikasi meal planning yang membantu user membuat rencana makan sehat."
```

**Expected response:**
```
NutriBot: aplikasi meal planning untuk rencana makan sehat.
```

---

### 4. Update .env

File: `backend-flask/.env`

```bash
# Tambahkan baris ini
SUMMARIZATION_MODEL=qwen2.5:7b-instruct-q5_K_M
```

**Full .env example:**
```bash
FLASK_ENV=development
FLASK_PORT=5000
CORS_ORIGINS=http://localhost:3000

# Local LLM Configuration
LLM_PROVIDER=ollama
OLLAMA_HOST=http://localhost:11434
DEFAULT_MODEL=llama3.2:3b
SUMMARIZATION_MODEL=qwen2.5:7b-instruct-q5_K_M  # ← Tambah ini
ENABLE_RAG=true
FOOD_DB_PATH=dataset/nutribot_foods.db
```

---

### 5. Restart Backend

```bash
cd backend-flask

# Stop backend jika running (Ctrl+C)

# Restart
python app.py
```

**Expected log:**
```
✓ Using model: llama3.2:3b
✓ RAG Service initialized with llama3.2:3b
 * Running on http://127.0.0.1:5000
```

---

### 6. Test Summarization

Buka browser → http://localhost:3000

**Test:**
```
User: "Buatin meal plan 7 hari untuk diet dong"
```

**Expected:**
- Meal plan lengkap 7 hari
- Di akhir ada section "📋 Ringkasan Meal Plan"
- Summary 3-4 paragraf yang informatif

---

## 🎯 Model Variants

Jika `qwen2.5:7b-instruct-q5_K_M` terlalu besar, coba alternatif:

### Opsi 1: Q4 (Lebih kecil, sedikit kurang akurat)

```bash
ollama pull qwen2.5:7b-instruct-q4_K_M
```

Update `.env`:
```bash
SUMMARIZATION_MODEL=qwen2.5:7b-instruct-q4_K_M
```

**Ukuran:** ~4.0GB

### Opsi 2: Full Model (Paling akurat, paling besar)

```bash
ollama pull qwen2.5:7b
```

Update `.env`:
```bash
SUMMARIZATION_MODEL=qwen2.5:7b
```

**Ukuran:** ~4.9GB

### Opsi 3: Qwen 3B (Paling kecil, untuk low-end PC)

```bash
ollama pull qwen2.5:3b
```

Update `.env`:
```bash
SUMMARIZATION_MODEL=qwen2.5:3b
```

**Ukuran:** ~2.0GB

---

## 📊 Comparison

| Model | Size | Quality | Speed | RAM |
|-------|------|---------|-------|-----|
| qwen2.5:3b | 2.0GB | ⭐⭐⭐ | ⚡⚡⚡ | 4GB |
| qwen2.5:7b-q4 | 4.0GB | ⭐⭐⭐⭐ | ⚡⚡ | 6GB |
| qwen2.5:7b-q5 | 4.7GB | ⭐⭐⭐⭐⭐ | ⚡⚡ | 8GB |
| qwen2.5:7b | 4.9GB | ⭐⭐⭐⭐⭐ | ⚡ | 8GB |

**Recommended:** `qwen2.5:7b-instruct-q5_K_M` (best balance)

---

## 🐛 Troubleshooting

### Error: "connection refused"

**Problem:** Ollama tidak running

**Solution:**
```bash
# Windows: Buka Ollama app dari Start Menu
# Atau jalankan:
ollama serve
```

### Error: "model not found"

**Problem:** Model belum di-download

**Solution:**
```bash
ollama pull qwen2.5:7b-instruct-q5_K_M
```

### Error: "out of memory"

**Problem:** RAM tidak cukup

**Solution:**
1. Close aplikasi lain
2. Atau gunakan model lebih kecil: `qwen2.5:3b`

### Download sangat lambat

**Solution:**
1. Check koneksi internet
2. Atau download saat malam (less traffic)
3. Atau gunakan mirror (jika ada)

---

## ✅ Verification Checklist

- [ ] Ollama running (`ollama list` works)
- [ ] Llama 3.2:3b installed
- [ ] Qwen2.5:7b-q5 installed
- [ ] `.env` updated with `SUMMARIZATION_MODEL`
- [ ] Backend restart successful
- [ ] Test chat works (fast response)
- [ ] Test summary appears (after meal plan)
- [ ] Summary quality good (informative)

---

## 📝 Notes

1. **First run:** Model akan di-load ke RAM, bisa 5-10 detik
2. **Subsequent runs:** Lebih cepat karena model sudah di-cache
3. **RAM usage:** Qwen 7B butuh ~6-8GB RAM saat running
4. **Disk space:** Pastikan ada 5GB+ free space

---

**Next:** Lihat [dual_model_summarization.md](file:///C:/Users/PC/.gemini/antigravity/brain/42cecb0d-d805-4fcb-8f6a-520dbd9f4cfb/dual_model_summarization.md) untuk detail teknis
