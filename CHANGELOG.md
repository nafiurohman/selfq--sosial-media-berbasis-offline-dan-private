# Changelog - selfQ

## Version 26.02.10 (10 Februari 2025)

### 🎨 UI Improvements

#### Perbaikan Tampilan Form
- Konsistensi penggunaan icon Lucide di seluruh aplikasi
- Icon size optimization: 4x4 untuk form input, 5x5 untuk button
- Padding adjustment: pl-9 untuk konsistensi spacing
- Perbaikan alignment icon dan text di form input
- Remove emoji, ganti dengan Lucide icons (Smartphone, Heart)

#### Navigation Improvements
- Sidebar hanya muncul di halaman Profile (MobileSidebar)
- Dropdown menu untuk semua halaman lain (Feed, Archive, Bookmarks, dll)
- Request Fitur menu ditambahkan ke semua dropdown
- Cleaner UI dan faster navigation

### ⚡ Performance Improvements

#### Download System Optimization
- Implementasi File System Access API untuk Chrome/Edge (native "Save As" dialog)
- Web Share API fallback untuk mobile devices
- Blob URL fallback untuk universal compatibility
- Async/await implementation untuk better error handling
- Memory leak prevention dengan proper cleanup
- Fix backup tidak bisa diunduh di PWA mode

### 🐛 Bug Fixes

- Fix duplicate code di textarea RequestFeature
- Fix icon dan text alignment di form input
- Fix sidebar muncul di semua halaman (seharusnya hanya Profile)
- Fix URL GitHub yang salah
- Fix deskripsi aplikasi (hapus kata "sosial media")
- Fix nama aplikasi dari selfX menjadi selfQ di semua file
- Fix struktur folder di README (selfx/ → selfq/)
- Fix rotate feature di Image Editor

### 🔄 Image Editor Enhancement

#### Rotate Feature
- Tambah tombol Rotate Left (90° counter-clockwise)
- Tambah tombol Rotate Right (90° clockwise)
- Real-time preview saat rotate
- Canvas-based rotation dengan proper dimension handling
- Save rotated image dengan kualitas terjaga
- Reset function includes rotation state

### 📝 Content Update

#### Deskripsi Baru
- Old: "Platform sosial media pribadi 100% offline..."
- New: "selfQ adalah ruang pribadi untuk mengungkapkan perasaan yang sebenarnya dari diri sendiri. Tempat aman tanpa tekanan sosial, di mana kamu bebas mengekspresikan diri apa adanya."

#### Branding Consistency
- Update semua meta tags (index.html, manifest.json, package.json)
- Update SEO configuration (src/lib/seo.ts)
- Update README.md dengan deskripsi dan branding baru
- Konsistensi nama selfQ di semua file
- URL canonical update ke selfq.bezn.web.id

### 📦 Files Modified
- src/lib/mobile-download.ts
- src/pages/RequestFeature.tsx
- src/pages/Feed.tsx
- src/pages/Archive.tsx
- src/pages/Bookmarks.tsx
- src/pages/CalendarView.tsx
- src/pages/Stories.tsx
- src/pages/Search.tsx
- src/components/ImageEditor.tsx
- index.html
- public/manifest.json
- package.json
- src/lib/seo.ts
- README.md
- CHANGELOG.md

### 🔗 Links
**Website**: https://selfq.bezn.web.id
**Documentation**: https://selfq.bezn.web.id/docs/26.02.10.html

---

## Version 26.02.08 (8 Februari 2025)

### 🎉 Fitur Baru

#### 1. Custom Toast Notification System
- Mengganti sistem notifikasi sonner dengan custom toast popup
- Toast muncul di tengah layar dengan animasi smooth
- Auto-close dalam 3 detik dengan progress bar visual
- Tombol close manual untuk kontrol pengguna
- Mendukung 3 tipe: success, error, dan info

#### 2. Statistik Cerita (Story Statistics)
- Menambahkan 2 statistik baru: **Total Cerita** dan **Cerita Hari Ini**
- Total statistik sekarang menjadi 6 (Posts, Bookmarks, Stories, Today's Posts, Today's Bookmarks, Today's Stories)
- Terintegrasi di 3 halaman: Settings, Profile, dan Calendar
- Icon BookOpen untuk representasi cerita
- Real-time update saat cerita dibuat/dihapus

#### 3. Voice Recorder (Perekam Suara)
- Perekaman audio langsung dari aplikasi menggunakan MediaRecorder API
- Batas maksimal 3 menit per rekaman
- Visualisasi waveform real-time dengan 25 bar animasi
- Kontrol lengkap: Record, Pause, Resume, Stop
- Preview audio sebelum ditambahkan ke post
- Automatic microphone permission handling
- Format output: WebM (Chrome/Edge) atau MP4 (Safari)

#### 4. Audio Player UI
- Play/Pause controls dengan icon yang jelas
- Progress bar real-time menunjukkan posisi playback
- Duration tracking dengan format MM:SS
- Tombol download untuk save audio ke device
- Scrubbing support - klik progress bar untuk jump ke posisi tertentu
- Auto-pause saat audio selesai

#### 5. URL Detection & Styling
- Auto-detect URL dalam text post
- Support berbagai format URL (http://, https://, www., domain.com)
- Clickable link dengan target="_blank"
- Icon Lucide Link2 SVG inline (bukan emoji)
- Styling khusus dengan warna primary dan hover effect

#### 6. Halaman Calendar (Kalender)
- Calendar view dengan react-day-picker
- Highlight tanggal yang ada aktivitas
- Filter berdasarkan tanggal
- Period summary dengan statistik lengkap

#### 7. Halaman Archive (Arsip)
- List semua post yang diarsipkan
- Unarchive post untuk kembalikan ke feed
- Delete permanent dari archive
- Search dan sort functionality

#### 8. Advanced Photo Editor
- Crop Tool dengan aspect ratio preset
- Rotate foto 90°, 180°, 270°
- Filter Effects: Grayscale, Sepia, Blur, Sharpen, Vintage, Cool, Warm
- Brightness & Contrast Adjustment
- Real-time Preview
- Reset Function

### 🐛 Bug Fixes & Improvements
- Fix memory leak pada audio recorder component
- Fix progress bar tidak update pada beberapa browser
- Fix toast notification tidak muncul di beberapa kondisi
- Fix statistics tidak update real-time
- Fix image transparency issue pada PNG files
- Fix dark mode inconsistency
- Fix responsive layout issue di mobile devices
- Fix service worker caching issue
- Fix IndexedDB transaction error handling

### ⚡ Performance Optimization
- Optimasi rendering untuk large media files
- Reduce bundle size dengan code splitting
- Improve IndexedDB query performance
- Optimize image loading dengan lazy loading
- Better memory management untuk audio/video
- Faster app initialization

### 🔗 Links
**Website**: https://selfq.bezn.web.id
**Documentation**: https://selfq.bezn.web.id/docs/26.02.08.html
