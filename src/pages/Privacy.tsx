import { Navigation } from '@/components/Navigation';
import { SEO } from '@/components/SEO';
import { motion } from 'framer-motion';

export default function Privacy() {
  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="Kebijakan Privasi - selfQ"
        description="Kebijakan privasi selfQ - platform sosial media pribadi offline yang tidak mengumpulkan atau menyimpan data pengguna di server."
        keywords="kebijakan privasi selfq, privacy policy, perlindungan data, bezn project"
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
              <h1 className="text-3xl font-bold mb-2">Kebijakan Privasi</h1>
              <p className="text-muted-foreground">Terakhir diperbarui: Januari 2025</p>
            </div>

            <div className="modern-card p-8 space-y-8">
              <section>
                <h2 className="text-xl font-semibold mb-4">1. Komitmen Privasi</h2>
                <p className="text-muted-foreground leading-relaxed">
                  selfQ dirancang dengan prinsip "Privacy by Design". Kami berkomitmen untuk memberikan 
                  kontrol penuh kepada pengguna atas data pribadi mereka dengan tidak mengumpulkan, 
                  menyimpan, atau mengakses data apapun di server kami.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-4">2. Data yang TIDAK Kami Kumpulkan</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Berbeda dengan platform media sosial pada umumnya, selfQ TIDAK mengumpulkan:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                  <li>Informasi pribadi (nama, email, nomor telepon)</li>
                  <li>Konten postingan, foto, atau video</li>
                  <li>Komentar dan interaksi pengguna</li>
                  <li>Data lokasi atau GPS</li>
                  <li>Riwayat aktivitas atau perilaku pengguna</li>
                  <li>Cookies untuk tracking</li>
                  <li>Data analitik atau metrik penggunaan</li>
                  <li>Informasi perangkat atau browser</li>
                  <li>Alamat IP atau identitas jaringan</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-4">3. Penyimpanan Data Lokal</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-2">3.1 IndexedDB</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Semua data aplikasi (postingan, komentar, foto, video, pengaturan, bookmark) 
                      disimpan di IndexedDB browser Anda. Data ini hanya dapat diakses oleh aplikasi 
                      selfQ di perangkat Anda.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-medium mb-2">3.2 LocalStorage</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Informasi profil dan preferensi tema disimpan di LocalStorage browser untuk 
                      mempercepat loading aplikasi.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-medium mb-2">3.3 Service Worker Cache</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      File aplikasi di-cache oleh Service Worker untuk memungkinkan penggunaan offline. 
                      Tidak ada data pribadi yang disimpan dalam cache ini.
                    </p>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-4">4. Enkripsi dan Keamanan</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-2">4.1 Enkripsi Multi-Layer Backup</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      File backup menggunakan enkripsi AES-256-GCM dengan salt berlapis dan signature 
                      khusus selfQ. Hanya Anda yang dapat membuka file backup dengan aplikasi selfQ.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-medium mb-2">4.2 Sharing Terenkripsi dengan Signature</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Fitur sharing postingan menggunakan enkripsi end-to-end dengan signature khusus. 
                      Data hanya dapat dibaca oleh penerima yang memiliki aplikasi selfQ dan file 
                      yang valid.
                    </p>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-4">5. Tidak Ada Server Backend</h2>
                <p className="text-muted-foreground leading-relaxed">
                  selfQ adalah aplikasi client-side murni. Kami tidak memiliki server backend yang 
                  menyimpan data pengguna. Semua operasi dilakukan di perangkat Anda menggunakan 
                  teknologi browser modern.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-4">6. Tidak Ada Tracking atau Analytics</h2>
                <p className="text-muted-foreground leading-relaxed">
                  selfQ tidak menggunakan Google Analytics, Facebook Pixel, atau layanan tracking 
                  lainnya. Kami tidak mengetahui siapa yang menggunakan aplikasi ini atau bagaimana 
                  cara penggunaannya.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-4">7. Tidak Ada Iklan</h2>
                <p className="text-muted-foreground leading-relaxed">
                  selfQ tidak menampilkan iklan dan tidak bermitra dengan jaringan iklan apapun. 
                  Tidak ada data yang dikumpulkan untuk tujuan periklanan.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-4">8. Kontrol Data Pengguna</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-2">8.1 Ekspor Data</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Anda dapat mengekspor semua data Anda kapan saja dalam format terenkripsi 
                      melalui menu Pengaturan.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-medium mb-2">8.2 Hapus Data</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Anda dapat menghapus semua data aplikasi melalui menu Pengaturan atau dengan 
                      menghapus data browser untuk domain selfQ.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-medium mb-2">8.3 Portabilitas Data</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      File backup dapat diimpor ke perangkat lain, memberikan portabilitas penuh 
                      atas data Anda.
                    </p>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-4">9. Kepatuhan Regulasi</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-2">9.1 GDPR (General Data Protection Regulation)</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Karena tidak ada data yang dikumpulkan atau diproses di server, selfQ secara 
                      otomatis mematuhi GDPR.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-medium mb-2">9.2 UU PDP Indonesia</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      selfQ mematuhi Undang-Undang Perlindungan Data Pribadi Indonesia dengan tidak 
                      mengumpulkan atau memproses data pribadi apapun.
                    </p>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-4">10. Perubahan Kebijakan</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Perubahan pada kebijakan privasi ini akan dikomunikasikan melalui aplikasi. 
                  Karena sifat offline-first aplikasi, kami tidak dapat memberitahu pengguna 
                  secara langsung tentang perubahan.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-4">11. Kontak</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Untuk pertanyaan mengenai kebijakan privasi ini, hubungi:
                </p>
                <div className="mt-4 space-y-2 text-muted-foreground">
                  <p><strong>Data Protection Officer:</strong> M. Nafiurohman</p>
                  <p>Email: nafiurohman25@gmail.com</p>
                  <p>Website: <a href="https://beznproject.web.id" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">beznproject.web.id</a></p>
                  <p>WhatsApp: <a href="https://wa.me/6281358198565" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">+62 813-5819-8565</a></p>
                </div>
              </section>

              <section className="bg-primary/5 p-6 rounded-xl">
                <h2 className="text-xl font-semibold mb-4 text-primary">Ringkasan Privasi</h2>
                <p className="text-muted-foreground leading-relaxed">
                  <strong>TL;DR:</strong> selfQ tidak mengumpulkan, menyimpan, atau mengakses data Anda. 
                  Semua data tersimpan di perangkat Anda sendiri. Kami tidak tahu siapa Anda, apa yang 
                  Anda tulis, atau bagaimana Anda menggunakan aplikasi ini. Privasi Anda adalah prioritas utama.
                </p>
              </section>
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
}