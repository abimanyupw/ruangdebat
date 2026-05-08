# 🏛️ RuangDebat AI

**RuangDebat AI** adalah aplikasi web interaktif yang memungkinkan pengguna untuk mengasah kemampuan berpikir kritis melalui perdebatan sengit melawan Kecerdasan Buatan (AI). Aplikasi ini dirancang untuk memberikan pengalaman debat yang realistis dengan sistem penilaian objektif.

## ✨ Fitur Utama

- **🧠 AI Debate Opponent:** AI yang berperan sebagai lawan debat tangguh. Ia akan selalu memberikan kontra-argumen yang logis, tajam, dan berbasis data.
- **🗳️ Pemilihan Ronde:** Pengguna dapat memilih intensitas debat mulai dari 3 ronde (Singkat), 5 ronde (Standar), hingga 10 ronde (Maraton).
- **🎭 Topik Dinamis:** AI men-generate topik debat yang spesifik dan kontroversial secara acak setiap kali sesi dimulai (Bioetika, Teknologi, Hukum, dll).
- **⚖️ AI Judging System:** Setelah debat selesai, Juri AI akan memberikan:
  - Skor performa (0-100).
  - Analisis kelebihan (Pros) dan kekurangan (Cons) argumen Anda.
  - Tips pengembangan diri agar menjadi pendebat yang lebih baik.
- **📱 Responsive Bento Design:** Antarmuka modern yang futuristik, bersih, dan sepenuhnya responsif untuk desktop maupun mobile.

## 🚀 Teknologi yang Digunakan

- **Frontend:** [React.js](https://reactjs.org/) + [Vite](https://vitejs.dev/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Animation:** [Framer Motion](https://www.framer.com/motion/)
- **AI Engine:** [Google Gemini API (Gemini 1.5 Flash)](https://ai.google.dev/)
- **Icons:** [Lucide React](https://lucide.dev/)

## 🛠️ Cara Instalasi (Lokal)

1. **Clone repositori ini:**
   ```bash
   git clone https://github.com/username-anda/ruang-debat.git
   cd ruang-debat
   ```

1. **Install Dependencies**
  ```bash
   npm install
  ```

2. **Konfigurasi Environment Variable:**
Buat file .env di root folder dan masukkan API Key Gemini Anda:
  ```bash
  VITE_GEMINI_API_KEY=your_api_key_here
  ```
3. **Jalankan aplikasi**
  ```bash
  npm run dev
  ```

📝 Catatan Penting
Aplikasi ini menggunakan Free Tier Gemini API yang memiliki limitasi kuota (misal: 20 request per hari). Jika limit tercapai, aplikasi akan menampilkan pesan error yang ramah pengguna.
🤝 Kontribusi
Kontribusi selalu terbuka! Silakan buka Issue atau kirimkan Pull Request.


## Dokumentasi

- **Pilih Sesi Debat Yang Diinginkan**
  <img width="948" height="463" alt="Screenshot 2026-05-08 122709" src="https://github.com/user-attachments/assets/9be57a36-10f0-47d5-a0eb-58f365c734cb" />
- **Mulai Debat Sesuai Topik**
  <img width="955" height="499" alt="Screenshot 2026-05-08 123250" src="https://github.com/user-attachments/assets/e69fe72b-dcae-4764-b04f-5d54ddfe49da" />
- **Saat Sesi Terpenuhi Klik "Minta Penilaian Untuk Melihat Skor"
  <img width="947" height="476" alt="Screenshot 2026-05-08 123801" src="https://github.com/user-attachments/assets/ec9ad266-3025-4815-a362-182de681dee6" />
- **Skor Muncul**
  <img width="947" height="469" alt="Screenshot 2026-05-08 123826" src="https://github.com/user-attachments/assets/4682ee56-13ec-4a55-9242-fbb1689d9294" />

 

