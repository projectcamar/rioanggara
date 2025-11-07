# Email Notification Setup - Gateway Access Attempts

## 🎯 Fitur
Sistem akan mengirimkan email ke `rioanggaraclub@gmail.com` setiap kali ada yang mencoba akses password gateway (baik benar atau salah). Email berisi:
- IP address visitor
- Nomor attempt (attempt 1, attempt 2, dst)
- Password yang dimasukkan
- Timestamp percobaan

## 🔧 Setup di Local Development

1. **Isi RESEND_API_KEY di file `.env`:**
   ```
   RESEND_API_KEY=your_api_key_here
   ```
   ⚠️ **JANGAN commit file .env ke git!** (sudah ada di .gitignore)

2. **Test dengan Netlify Dev:**
   ```bash
   npx netlify dev
   ```

3. **Coba akses website dan masukkan password** - kamu akan dapat email notifikasi!

## 🚀 Setup di Production (Netlify)

1. **Login ke Netlify Dashboard**
2. **Pilih site kamu**
3. **Pergi ke: Site settings → Environment variables**
4. **Add variable baru:**
   - Key: `RESEND_API_KEY`
   - Value: (your Resend API key)
5. **Save** dan **re-deploy** site

## 📧 Resend.com Setup

Jika API key kamu belum di-setup di Resend.com:

1. Login ke https://resend.com
2. Pergi ke **API Keys**
3. Gunakan API key yang sudah ada atau create new API key

**Note:** Resend free tier allows 100 emails/day. Cukup untuk monitoring gateway access.

## 🔍 Cara Kerja Sistem

1. **Tracking per IP:** Setiap IP address visitor ditrack secara terpisah
2. **Attempt Counter:** Setiap IP punya counter sendiri (attempt 1, attempt 2, dst)
3. **Email Async:** Email dikirim di background, tidak mengganggu proses password verification
4. **Fail-safe:** Kalau email gagal terkirim, password verification tetap jalan normal

## 📁 File yang Ditambahkan/Diubah

- ✅ `/netlify/functions/send-gateway-attempt-email.js` - Function untuk send email
- ✅ `/netlify/functions/verify-password.js` - Updated dengan IP tracking & email trigger
- ✅ `package.json` - Added `resend` package
- ✅ `.env` - Added RESEND_API_KEY placeholder
- ✅ `.env.example` - Template untuk environment variables

## 🧪 Testing

Setelah setup, test dengan:
1. Buka website
2. Masukkan password (bisa yang salah atau benar)
3. Check email `rioanggaraclub@gmail.com`
4. Kamu akan dapat email dengan subject: "🚨 Gateway Access Attempt #1 - IP: xxx.xxx.xxx.xxx"

## ⚠️ Catatan Penting

- **IP tracking** menggunakan in-memory storage, jadi akan reset ketika Netlify function cold-start
- Ini cukup bagus untuk basic monitoring, tapi kalau butuh persistent storage bisa upgrade ke database
- Email dikirim dari `onboarding@resend.dev` (default Resend sender untuk free tier)
- Kalau mau custom domain sender, perlu verify domain di Resend.com dulu

## 🔐 Security Notes

- ⚠️ **JANGAN PERNAH** commit API keys ke git repository
- API keys harus disimpan di `.env` (local) atau Netlify Environment Variables (production)
- File `.env` sudah ada di `.gitignore` jadi tidak akan ter-commit
