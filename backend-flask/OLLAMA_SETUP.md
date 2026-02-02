# NutriBot - Ollama Setup Guide

Panduan lengkap untuk setup Ollama dan model LLM lokal untuk NutriBot.

---

## Prerequisites

- **OS**: Windows 10/11, macOS, atau Linux
- **RAM**: Minimum 8GB (16GB recommended)
- **GPU**: NVIDIA GPU dengan 4GB+ VRAM (optional tapi sangat disarankan)
- **Disk Space**: ~10GB untuk models dan database
- **Python**: 3.11+

---

## Step 1: Install Ollama

### Windows

1. Download installer dari [ollama.com/download/windows](https://ollama.com/download/windows)
2. Run installer `OllamaSetup.exe`
3. Ollama akan otomatis start sebagai service

### macOS

```bash
brew install ollama
```

### Linux

```bash
curl -fsSL https://ollama.com/install.sh | sh
```

---

## Step 2: Verify Ollama Installation

Buka terminal/PowerShell dan jalankan:

```bash
ollama --version
```

Output seharusnya menampilkan versi Ollama (e.g., `ollama version is 0.1.x`)

---

## Step 3: Download LLM Models

### Option A: Automatic Setup (Recommended)

Jalankan setup script yang sudah disediakan:

```bash
cd backend-flask
python scripts/setup_models.py
```

Script akan:
- Check Ollama installation
- List available models
- Download model yang dipilih
- Test model inference

### Option B: Manual Download

Download model satu per satu:

```bash
# Llama-3.2-3B-Instruct (Lightweight, ~2GB)
ollama pull llama3.2:3b

# Qwen2.5-7B-Instruct (Smarter, ~4.5GB)
ollama pull qwen2.5:7b

# Llama-3.1-8B-Instruct Q4 (Balanced, ~4.5GB)
ollama pull llama3.1:8b-q4_K_M
```

**Download time**: Tergantung internet speed, bisa 5-30 menit per model.

---

## Step 4: Test Model

Test apakah model berfungsi:

```bash
ollama run llama3.2:3b "Sebutkan 3 makanan tinggi protein"
```

Expected output: Model akan respond dengan list makanan tinggi protein.

---

## Step 5: Configure NutriBot

1. **Copy environment file**:
   ```bash
   cd backend-flask
   cp .env.example .env
   ```

2. **Edit `.env` file**:
   ```env
   # Local LLM Configuration
   LLM_PROVIDER=ollama
   OLLAMA_HOST=http://localhost:11434
   DEFAULT_MODEL=llama3.2:3b
   ENABLE_RAG=true
   ```

3. **Choose your model**:
   - `llama3.2:3b` - Fastest, lowest VRAM (~2-3GB)
   - `qwen2.5:7b` - Best quality, higher VRAM (~5-6GB)
   - `llama3.1:8b-q4_K_M` - Balanced (~4-5GB)

---

## Step 6: Setup Food Database

Ingest FoodData Central dataset ke SQLite database:

```bash
cd backend-flask
python scripts/data_ingestion.py
```

**Expected output**:
```
Creating database schema...
Importing food.csv into foods...
✓ Imported 500,000+ rows from food.csv
...
Database Size: 2.5 GB
✅ Data ingestion completed successfully!
```

**Time**: ~10-20 menit tergantung hardware.

---

## Step 7: Install Python Dependencies

```bash
cd backend-flask
pip install -r requirements.txt
```

Dependencies yang akan diinstall:
- `ollama` - Ollama Python client
- `langchain` - LLM orchestration
- `sentence-transformers` - Embeddings
- `chromadb` - Vector database
- `pandas` - Data processing

---

## Step 8: Start Backend

```bash
python app.py
```

**Expected output**:
```
✓ RAG Service initialized with llama3.2:3b
 * Running on http://127.0.0.1:5000
```

---

## Step 9: Test API

Test chat endpoint:

```bash
curl -X POST http://localhost:5000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Hai! Buatkan meal plan 1 hari untuk diet",
    "context": {
      "age": 25,
      "gender": "male",
      "weight": 70,
      "height": 175,
      "goal": "weight loss",
      "activity_level": "moderately active"
    }
  }'
```

Test food search:

```bash
curl -X POST http://localhost:5000/api/search-foods \
  -H "Content-Type: application/json" \
  -d '{"query": "chicken", "limit": 5}'
```

---

## Troubleshooting

### Issue: "Model not found"

**Solution**:
```bash
ollama list  # Check installed models
ollama pull llama3.2:3b  # Download if missing
```

### Issue: "Ollama connection refused"

**Solution**:
```bash
# Windows: Ollama runs as service, restart it
# Mac/Linux:
ollama serve
```

### Issue: "Out of memory" / Slow inference

**Solutions**:
1. Switch to smaller model: `llama3.2:3b`
2. Close other applications
3. Use quantized model: `llama3.1:8b-q4_K_M`
4. Enable GPU acceleration (if available)

### Issue: "Database not found"

**Solution**:
```bash
python scripts/data_ingestion.py  # Re-run ingestion
```

### Issue: RAG service fails

**Solution**:
1. Check if database exists: `ls dataset/nutribot_foods.db`
2. Check Ollama is running: `ollama list`
3. Enable Gemini fallback in `.env`:
   ```env
   ENABLE_GEMINI_FALLBACK=true
   GEMINI_API_KEY=your_key
   ```

---

## Performance Tips

### GPU Acceleration

Ollama automatically uses GPU if available. Check with:

```bash
nvidia-smi  # Windows/Linux with NVIDIA GPU
```

### Model Selection Guide

| Model | VRAM | Speed | Quality | Use Case |
|-------|------|-------|---------|----------|
| llama3.2:3b | 2-3GB | ⚡⚡⚡ | ⭐⭐ | Development, Testing |
| qwen2.5:7b | 5-6GB | ⚡⚡ | ⭐⭐⭐ | Production, Best quality |
| llama3.1:8b-q4 | 4-5GB | ⚡⚡ | ⭐⭐⭐ | Balanced |

### Switch Models Runtime

Update `.env`:
```env
DEFAULT_MODEL=qwen2.5:7b
```

Restart backend:
```bash
python app.py
```

---

## Next Steps

1. ✅ Ollama installed and running
2. ✅ Models downloaded
3. ✅ Database created
4. ✅ Backend running

**Now you can**:
- Start frontend: `cd ../frontend && npm run dev`
- Test full application flow
- Create meal plans with real nutritional data!

---

## Additional Resources

- [Ollama Documentation](https://github.com/ollama/ollama)
- [Llama 3.2 Model Card](https://huggingface.co/meta-llama/Llama-3.2-3B-Instruct)
- [Qwen2.5 Model Card](https://huggingface.co/Qwen/Qwen2.5-7B-Instruct)
- [FoodData Central](https://fdc.nal.usda.gov/)

---

## Support

Jika ada masalah:
1. Check logs di terminal
2. Verify semua steps sudah dijalankan
3. Check `.env` configuration
4. Try Gemini fallback jika local LLM bermasalah
