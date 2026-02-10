import { Navigation } from '@/components/Navigation';
import { SEO } from '@/components/SEO';
import { motion } from 'framer-motion';

export default function Terms() {
  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="Ketentuan Layanan - selfQ"
        description="Ketentuan layanan penggunaan selfQ - platform sosial media pribadi offline yang mengutamakan privasi pengguna."
        keywords="ketentuan layanan selfq, terms of service, syarat penggunaan, bezn project"
      />
      
      <Navigation />
      
      <div className="main-with-sidebar">
        <main className="container px-4 md:px-6 py-8 pb-24 md:pb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto"
          >
            <div className="text-center mb-8">
              <img src="/images/logo/logo.png" alt="selfQ Logo" className="w-16 h-16 mx-auto mb-4 rounded-xl" />
              <h1 className="text-3xl font-bold mb-2">Ketentuan Layanan</h1>
              <p className="text-muted-foreground">Terakhir diperbarui: Januari 2025</p>
            </div>

            <div className="modern-card p-8 space-y-8">
              <section>
                <h2 className="text-xl font-semibold mb-4">1. Penerimaan Ketentuan</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Dengan mengakses dan menggunakan selfQ ("Layanan"), Anda menyetujui untuk terikat dengan 
                  ketentuan layanan ini. Jika Anda tidak setuju dengan ketentuan ini, mohon jangan gunakan 
                  layanan kami.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-4">2. Deskripsi Layanan</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  selfQ adalah platform sosial media pribadi berbasis Progressive Web App (PWA) yang:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                  <li>Beroperasi 100% offline setelah instalasi</li>
                  <li>Menyimpan semua data di perangkat pengguna (termasuk foto dan video)</li>
                  <li>Tidak mengirim data ke server eksternal</li>
                  <li>Menggunakan enkripsi AES-256-GCM multi-layer untuk backup dan sharing</li>
                  <li>Mendukung berbagai format media dengan opsi dimensi fleksibel</li>
                  <li>Memberikan kontrol penuh kepada pengguna atas data mereka</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-4">3. Penyimpanan dan Keamanan Data</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-2">3.1 Penyimpanan Lokal</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Semua data pengguna disimpan secara lokal menggunakan IndexedDB dan LocalStorage 
                      di browser. Tidak ada data yang dikirim ke server Bezn Project atau pihak ketiga.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-medium mb-2">3.2 Enkripsi Multi-Layer</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      File backup dan sharing menggunakan enkripsi AES-256-GCM dengan salt berlapis 
                      dan signature khusus untuk memastikan keamanan dan autentikasi data.
                    </p>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-4">4. Tanggung Jawab Pengguna</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Sebagai pengguna selfQ, Anda bertanggung jawab untuk:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                  <li>Melakukan backup data secara berkala</li>
                  <li>Menjaga keamanan perangkat dan browser</li>
                  <li>Tidak menyalahgunakan fitur sharing untuk konten ilegal</li>
                  <li>Memahami bahwa data dapat hilang jika browser data dihapus</li>
                  <li>Menggunakan layanan sesuai dengan tujuan yang dimaksudkan</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-4">5. Batasan Layanan</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-2">5.1 Ukuran File</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Foto maksimal 3MB, video maksimal 5MB per file untuk menjaga performa aplikasi.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-medium mb-2">5.2 Kompatibilitas Browser</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Layanan memerlukan browser modern dengan dukungan IndexedDB dan Web Crypto API.
                    </p>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-4">6. Batasan Tanggung Jawab</h2>
                <p className="text-muted-foreground leading-relaxed">
                  selfQ disediakan "sebagaimana adanya" tanpa jaminan apapun. Bezn Project dan 
                  pengembang tidak bertanggung jawab atas:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2 mt-4">
                  <li>Kehilangan data akibat kerusakan perangkat atau penghapusan browser data</li>
                  <li>Gangguan layanan akibat pembaruan browser atau sistem operasi</li>
                  <li>Kerugian finansial atau non-finansial dari penggunaan layanan</li>
                  <li>Masalah kompatibilitas dengan perangkat atau browser tertentu</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-4">7. Kekayaan Intelektual</h2>
                <p className="text-muted-foreground leading-relaxed">
                  selfQ adalah proyek open source di bawah lisensi MIT. Kode sumber tersedia untuk 
                  umum, namun merek dagang "selfQ" dan "Bezn Project" tetap menjadi milik pengembang.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-4">8. Perubahan Ketentuan</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Kami berhak mengubah ketentuan ini kapan saja. Perubahan signifikan akan 
                  dikomunikasikan melalui aplikasi atau website. Penggunaan berkelanjutan 
                  setelah perubahan dianggap sebagai penerimaan ketentuan baru.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-4">9. Hukum yang Berlaku</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Ketentuan ini diatur oleh hukum Republik Indonesia. Setiap sengketa akan 
                  diselesaikan melalui pengadilan yang berwenang di Indonesia.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-4">10. Kontak</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Untuk pertanyaan mengenai ketentuan ini, hubungi:
                </p>
                <div className="mt-4 space-y-2 text-muted-foreground">
                  <p>Email: nafiurohman25@gmail.com</p>
                  <p>Website: <a href="https://beznproject.web.id" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">beznproject.web.id</a></p>
                  <p>WhatsApp: <a href="https://wa.me/6281358198565" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">+62 813-5819-8565</a></p>
                </div>
              </section>
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
}