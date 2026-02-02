# ▲ Deploy Frontend ke Vercel

Panduan ini untuk men-deploy **Nutribot Frontend (Next.js)** ke Vercel.

---

## 🚀 Langkah Deploy

1.  **Push code ke GitHub** (Sudah dilakukan).
2.  Buka [Vercel Dashboard](https://vercel.com/dashboard).
3.  Klik **"Add New..."** -> **"Project"**.
4.  Import repository `Nutribot`.
5.  Di halaman **Configure Project**:
    *   **Framework Preset**: Next.js (Default)
    *   **Root Directory**: Klik `Edit` dan pilih folder `nutribot-next`. **(PENTING!)**
6.  **Environment Variables**:
    Expand section Environment Variables, lalu tambahkan:
    
    | Key | Value |
    | :--- | :--- |
    | `NEXT_PUBLIC_API_URL` | `http://IP_PUBLIC_ORACLE_VM:5000` |

    *Ganti `IP_PUBLIC_ORACLE_VM` dengan IP asli VM Oracle kamu. Contoh: `http://129.150.xxx.xxx:5000`*

7.  Klik **Deploy**.

---

## ⚠️ Masalah Umum (Mixed Content Error)

Karena Oracle VM (biasanya) pakai HTTP (bukan HTTPS), dan Vercel pakai HTTPS, browser mungkin akan memblokir request ("Mixed Content").

**Solusi Sementara (Development):**
1.  Saat buka web app di Vercel, klik icon gembok/site settings di browser.
2.  Allow "Insecure content" (tidak disarankan untuk production).

**Solusi Permanen (Production):**
Kamu perlu setup HTTPS di backend Oracle Cloud kamu.
Cara termudah:
1.  Beli domain murah.
2.  Point domain ke IP Oracle VM.
3.  Install **Nginx** & **Certbot** (Let's Encrypt) di dalam VM Oracle untuk handle SSL Proxy ke port 5000.
