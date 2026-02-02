# ☁️ Deploy ke Oracle Cloud (VM)

Panduan ini akan membantu kamu men-deploy NutriBot ke Oracle Cloud VM (Free Tier) menggunakan **Docker**.

---

## 📋 Prasyarat
1.  **Oracle Cloud Account** (Free Tier cukup).
2.  **VM Instance** (Compute Instance) sudah dibuat (Ubuntu 22.04 / Oracle Linux 8 recommended).
    -   *Shape recommended:* VM.Standard.A1.Flex (ARM) - 4 OCPUs, 24GB RAM (Free Tier raja!).
    -   *Atau:* VM.Standard.E2.1.Micro.
3.  **SSH Access** ke VM.
4.  **Ingress Rules (Firewall)**: Buka port `3000` (Frontend) dan `5000` (Backend).

---

## 🛠️ Langkah Tutorial

### 1. Masuk ke VM
Buka terminal di komputer kamu dan SSH ke VM:
```bash
ssh -i /path/to/your/key.key ubuntu@ip-public-vm-kamu
```

### 2. Install Docker & Docker Compose
Jalankan command ini satu per satu di dalam VM untuk install Docker:

**Untuk Ubuntu:**
```bash
# Update
sudo apt update && sudo apt upgrade -y

# Install Docker
sudo apt install docker.io docker-compose -y

# Start Docker
sudo systemctl start docker
sudo systemctl enable docker

# Tambahkan user ke group docker (biar ngga perlu sudo terus)
sudo usermod -aG docker $USER
```
*Logout dan Login lagi (exit lalu ssh lagi) supaya group update.*

### 3. Clone Repository
Clone project dari GitHub:
```bash
git clone https://github.com/darrellrafa/Nutribot.git
cd Nutribot
```

### 4. Setup Environment Variables
Kamu perlu buat file `.env` untuk backend di server.

```bash
# Masuk folder backend
cd backend-flask

# Buat file .env dan isi API Key
nano .env
```
Isi file dengan:
```env
GEMINI_API_KEY=masukan_api_key_gemini_kamu_disini
FLASK_ENV=production
FLASK_PORT=5000
CORS_ORIGINS=*
```
*Tekan `Ctrl+X`, lalu `Y`, lalu `Enter` untuk save.*

Kembali ke folder root:
```bash
cd ..
```

### 5. Config Host IP (PENTING!) ⚠️
Di VM cloud, kita harus set IP address public supaya frontend bisa ngobrol sama backend.

Buka `docker-compose.yml`:
```bash
nano docker-compose.yml
```
Update bagian:
1.  `CORS_ORIGINS`: Ganti `http://your-vm-ip:3000` jadi `http://PUBLIC_IP_VM_KAMU:3000` (atau `*` untuk test).
2.  `NEXT_PUBLIC_API_URL`: Ganti `http://your-vm-ip:5000` jadi `http://PUBLIC_IP_VM_KAMU:5000`.

**Contoh:**
Jika IP Public VM kamu `123.45.67.89`:
```yaml
      # di service nutribot-next
      - NEXT_PUBLIC_API_URL=http://123.45.67.89:5000
```

### 6. Run Project 🚀
Jalankan project dengan Docker Compose:

```bash
docker-compose up --build -d
```
- `--build`: Build image dari awal.
- `-d`: Detached mode (jalan di background).

Cek status:
```bash
docker-compose ps
```

### 7. Buka Firewall Oracle Cloud
Ini langkah yang sering lupa! Secara default port 3000 & 5000 diblokir.

1.  Buka Oracle Cloud Console (Website).
2.  Ke **Networking** -> **Virtual Cloud Networks**.
3.  Klik VCN yang dipake VM kamu.
4.  Klik **Security List** -> **Default Security List**.
5.  **Add Ingress Rules**:
    -   Source CIDR: `0.0.0.0/0`
    -   Destination Port Range: `3000,5000`
    -   Protocol: TCP
6.  **PENTING (Di Terminal VM):** Buka firewall internal Ubuntu (iptables) juga:
    ```bash
    sudo iptables -I INPUT 6 -m state --state NEW -p tcp --dport 3000 -j ACCEPT
    sudo iptables -I INPUT 6 -m state --state NEW -p tcp --dport 5000 -j ACCEPT
    sudo netfilter-persistent save
    ```

### 8. Akses Website
Buka browser: `http://PUBLIC_IP_VM_KAMU:3000`

---

## 🔄 Cara Update (Kalau ada perubahan code)
Kalau kamu push code baru ke GitHub, cara updatenya gampang:

```bash
# Masuk ke folder
cd Nutribot

# Pull code baru
git pull

# Config ulang IP kalau perlu (biasanya engga berubah)

# Rebuild dan Restart
docker-compose down
docker-compose up --build -d
```
