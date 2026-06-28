# Panduan Distribusi Mandiri APK BULK

Agar pengguna dapat mengunduh berkas Android APK langsung dari website dengan mengklik tombol "UNDUH APLIKASI", ikuti langkah-langkah berikut:

---

## 🛠️ Langkah 1: Bangun Berkas APK Aplikasi

Anda dapat menggunakan **EAS Build** (Expo Application Services) untuk memaketkan aplikasi menjadi file APK:

1.  Buka terminal di root proyek Anda.
2.  Jalankan perintah berikut:
    ```bash
    eas build --platform android --profile preview
    ```
    *(Profil `preview` dikonfigurasi untuk menghasilkan format `.apk` yang bisa langsung dipasang secara mandiri di HP, sedangkan profil `production` akan menghasilkan format `.aab` untuk Google Play Store).*

3.  Tunggu hingga proses perakitan selesai di server Expo. 
4.  Setelah selesai, Expo akan memberikan tautan untuk mengunduh berkas `.apk` hasil kompilasi. Unduh berkas tersebut ke komputer Anda.

---

## 📂 Langkah 2: Tempatkan APK di Proyek

1.  Ubah nama berkas APK yang sudah diunduh menjadi:
    👉 **`bulk-app.apk`**
2.  Letakkan berkas tersebut ke dalam folder ini:
    👉 **`public/downloads/`**
3.  Lakukan commit dan push ke GitHub:
    ```bash
    git add public/downloads/bulk-app.apk
    git commit -m "dist: add compiled release apk"
    git push
    ```

---

Setelah Anda melakukan push ke GitHub, Vercel secara otomatis akan mempublikasikan file tersebut di alamat:
🔗 `https://bulk-website-daffs26.vercel.app/downloads/bulk-app.apk`

Pengguna kini dapat mengunjungi website Anda via HP, mengklik tombol **Unduh Aplikasi**, dan memasang aplikasi **Bulk** secara instan!
