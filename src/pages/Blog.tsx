import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Calendar,
  Clock,
  User,
  Tag,
  Share2,
  BookOpen,
  TrendingUp,
  Shield,
  Wifi,
  Lock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Footer } from '@/components/layout/Footer';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

// Blog posts data - in real app, this would come from CMS or API
const blogPosts = [
  {
    id: 'mengapa-privasi-digital-penting-gen-z',
    title: 'Mengapa Privasi Digital Penting untuk Gen Z di Era AI',
    excerpt: 'Di era AI dan big data, privasi digital menjadi semakin langka. Pelajari mengapa Gen Z perlu lebih aware tentang jejak digital mereka.',
    content: `
      <h2>Krisis Privasi di Era Digital</h2>
      <p>Generasi Z tumbuh di era digital, namun ironisnya mereka adalah generasi yang paling rentan terhadap pelanggaran privasi. Setiap hari, data pribadi dikumpulkan, dianalisis, dan dijual tanpa sepengetahuan pengguna.</p>
      
      <h3>Masalah yang Dihadapi Gen Z</h3>
      <ul>
        <li><strong>Data Mining Masif:</strong> Platform media sosial mengumpulkan ribuan data point dari setiap pengguna</li>
        <li><strong>Algoritma Manipulatif:</strong> AI digunakan untuk mempengaruhi perilaku dan keputusan</li>
        <li><strong>Surveillance Capitalism:</strong> Model bisnis yang menjadikan data pribadi sebagai komoditas</li>
        <li><strong>Kurangnya Kontrol:</strong> Pengguna tidak memiliki kontrol penuh atas data mereka</li>
      </ul>
      
      <h3>Dampak Jangka Panjang</h3>
      <p>Kurangnya privasi digital dapat berdampak pada:</p>
      <ul>
        <li>Kesehatan mental akibat tekanan sosial</li>
        <li>Diskriminasi berdasarkan profiling data</li>
        <li>Kehilangan otonomi dalam pengambilan keputusan</li>
        <li>Risiko keamanan dan identity theft</li>
      </ul>
      
      <h3>Solusi: Privacy-First Tools</h3>
      <p>Tools seperti selfX menawarkan alternatif dengan prinsip privacy by design. Dengan enkripsi end-to-end dan penyimpanan lokal, pengguna memiliki kontrol penuh atas data mereka.</p>
      
      <blockquote>
        "Privasi bukan tentang menyembunyikan sesuatu yang buruk, tetapi tentang melindungi sesuatu yang berharga - otonomi dan kebebasan kita."
      </blockquote>
    `,
    author: 'Tim Bezn Project',
    date: '2024-12-19',
    readTime: '5 menit',
    tags: ['Privasi', 'Gen Z', 'AI', 'Digital Rights'],
    category: 'Privacy & Security',
    image: '/blog/privacy-gen-z.jpg',
    featured: true
  },
  {
    id: 'panduan-journaling-digital-offline',
    title: 'Panduan Lengkap Journaling Digital Offline untuk Pemula',
    excerpt: 'Mulai journaling digital dengan aman. Pelajari tips, teknik, dan manfaat menulis jurnal offline untuk kesehatan mental.',
    content: `
      <h2>Apa itu Journaling Digital Offline?</h2>
      <p>Journaling digital offline adalah praktik menulis jurnal menggunakan aplikasi yang tidak memerlukan koneksi internet dan menyimpan data secara lokal di perangkat Anda.</p>
      
      <h3>Manfaat Journaling untuk Kesehatan Mental</h3>
      <ul>
        <li><strong>Mengurangi Stres:</strong> Menulis membantu mengekspresikan emosi yang terpendam</li>
        <li><strong>Meningkatkan Self-Awareness:</strong> Refleksi diri melalui tulisan</li>
        <li><strong>Problem Solving:</strong> Menulis membantu mengorganisir pikiran</li>
        <li><strong>Tracking Progress:</strong> Melihat perkembangan diri dari waktu ke waktu</li>
      </ul>
      
      <h3>Mengapa Pilih Offline?</h3>
      <p>Journaling offline memberikan keuntungan:</p>
      <ul>
        <li>Privasi terjamin 100%</li>
        <li>Tidak ada risiko data breach</li>
        <li>Bisa diakses kapan saja tanpa internet</li>
        <li>Tidak ada distraksi notifikasi</li>
      </ul>
      
      <h3>Tips Memulai Journaling</h3>
      <ol>
        <li><strong>Mulai Kecil:</strong> Tulis 5 menit setiap hari</li>
        <li><strong>Konsisten:</strong> Tentukan waktu yang sama setiap hari</li>
        <li><strong>Jujur:</strong> Tulis apa yang benar-benar Anda rasakan</li>
        <li><strong>Tanpa Judgment:</strong> Tidak ada tulisan yang salah</li>
        <li><strong>Eksperimen:</strong> Coba berbagai format dan gaya</li>
      </ol>
      
      <h3>Format Journaling yang Bisa Dicoba</h3>
      <ul>
        <li><strong>Stream of Consciousness:</strong> Tulis apa yang ada di pikiran</li>
        <li><strong>Gratitude Journal:</strong> Fokus pada hal-hal yang disyukuri</li>
        <li><strong>Mood Tracking:</strong> Catat perubahan mood dan pemicunya</li>
        <li><strong>Goal Setting:</strong> Tulis target dan progress</li>
        <li><strong>Creative Writing:</strong> Ekspresikan kreativitas</li>
      </ul>
    `,
    author: 'Dr. Sarah Mental Health',
    date: '2024-12-18',
    readTime: '7 menit',
    tags: ['Journaling', 'Mental Health', 'Offline', 'Self-Care'],
    category: 'Lifestyle & Wellness',
    image: '/blog/journaling-guide.jpg',
    featured: true
  },
  {
    id: 'enkripsi-aes-256-explained',
    title: 'Enkripsi AES-256: Mengapa Data Anda Aman di selfX',
    excerpt: 'Pelajari bagaimana enkripsi AES-256-GCM melindungi data Anda. Penjelasan teknis yang mudah dipahami tentang keamanan data.',
    content: `
      <h2>Apa itu Enkripsi AES-256?</h2>
      <p>Advanced Encryption Standard (AES) dengan kunci 256-bit adalah standar enkripsi yang digunakan oleh pemerintah AS untuk melindungi informasi rahasia. Ini adalah enkripsi yang sama yang digunakan selfX untuk melindungi data Anda.</p>
      
      <h3>Seberapa Kuat AES-256?</h3>
      <p>Untuk memecahkan enkripsi AES-256 dengan brute force, dibutuhkan:</p>
      <ul>
        <li>2^256 kombinasi kunci yang harus dicoba</li>
        <li>Dengan komputer tercepat saat ini, butuh miliaran tahun</li>
        <li>Bahkan dengan quantum computer, masih sangat sulit dipecahkan</li>
      </ul>
      
      <h3>Implementasi di selfX</h3>
      <p>selfX menggunakan AES-256-GCM dengan fitur tambahan:</p>
      <ul>
        <li><strong>Salt Berlapis:</strong> Setiap data memiliki salt unik</li>
        <li><strong>Key Derivation:</strong> Password di-hash dengan PBKDF2</li>
        <li><strong>Authenticated Encryption:</strong> GCM mode mencegah tampering</li>
        <li><strong>Client-Side Encryption:</strong> Enkripsi terjadi di perangkat Anda</li>
      </ul>
      
      <h3>Mengapa Client-Side Encryption Penting?</h3>
      <p>Dengan enkripsi di sisi klien:</p>
      <ul>
        <li>Kunci enkripsi tidak pernah meninggalkan perangkat</li>
        <li>Bahkan pengembang tidak bisa membaca data Anda</li>
        <li>Tidak ada single point of failure</li>
        <li>Zero-knowledge architecture</li>
      </ul>
      
      <blockquote>
        "Enkripsi yang baik bukan hanya tentang algoritma, tetapi juga tentang implementasi yang benar dan arsitektur yang aman."
      </blockquote>
      
      <h3>Perbandingan dengan Platform Lain</h3>
      <table>
        <tr>
          <th>Platform</th>
          <th>Enkripsi</th>
          <th>Server Access</th>
          <th>Key Control</th>
        </tr>
        <tr>
          <td>selfX</td>
          <td>AES-256-GCM</td>
          <td>Tidak ada</td>
          <td>User</td>
        </tr>
        <tr>
          <td>Platform A</td>
          <td>TLS only</td>
          <td>Full access</td>
          <td>Platform</td>
        </tr>
        <tr>
          <td>Platform B</td>
          <td>AES-128</td>
          <td>Encrypted</td>
          <td>Platform</td>
        </tr>
      </table>
    `,
    author: 'Tim Security Bezn',
    date: '2024-12-17',
    readTime: '6 menit',
    tags: ['Enkripsi', 'Keamanan', 'AES-256', 'Technical'],
    category: 'Security & Tech',
    image: '/blog/encryption-explained.jpg',
    featured: false
  }
];

export default function Blog() {
  const navigate = useNavigate();

  const featuredPosts = blogPosts.filter(post => post.featured);
  const recentPosts = blogPosts.slice(0, 6);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-primary/5 via-background to-primary/5">
      {/* SEO Meta Tags */}
      <div style={{ display: 'none' }}>
        <h1>Blog selfX - Tips Privasi Digital, Journaling, dan Keamanan Data</h1>
        <p>Baca artikel terbaru tentang privasi digital, tips journaling offline, keamanan data, dan teknologi privacy-first dari tim Bezn Project.</p>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 w-full glass-nav border-b border-border/50">
        <nav className="container h-14 flex items-center justify-between px-4">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm font-medium">Kembali</span>
          </button>
          
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/about')}
              className="gap-2"
            >
              <BookOpen className="w-4 h-4" />
              <span className="hidden sm:inline">Tentang</span>
            </Button>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="py-16 px-4">
        <div className="container max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="w-16 h-16 rounded-2xl bg-primary mx-auto mb-6 flex items-center justify-center shadow-lg shadow-primary/25">
              <BookOpen className="w-8 h-8 text-primary-foreground" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Blog selfX
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Tips privasi digital, panduan journaling offline, dan insight tentang 
              teknologi privacy-first dari tim Bezn Project.
            </p>
          </motion.div>

          {/* Featured Posts */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-primary" />
              Artikel Pilihan
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              {featuredPosts.map((post, index) => (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="glass-card rounded-2xl overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => navigate(`/blog/${post.id}`)}
                >
                  <div className="aspect-video bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                    <BookOpen className="w-12 h-12 text-primary/50" />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(post.date).toLocaleDateString('id-ID')}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {post.readTime}
                      </span>
                    </div>
                    <h3 className="text-xl font-semibold mb-3 line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-muted-foreground mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap gap-2">
                        {post.tags.slice(0, 2).map(tag => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {post.author}
                      </span>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>

          {/* Recent Posts */}
          <div>
            <h2 className="text-2xl font-bold mb-8">Artikel Terbaru</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentPosts.map((post, index) => (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="glass-card rounded-xl p-6 hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => navigate(`/blog/${post.id}`)}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      {post.category.includes('Security') && <Shield className="w-5 h-5 text-primary" />}
                      {post.category.includes('Lifestyle') && <BookOpen className="w-5 h-5 text-primary" />}
                      {post.category.includes('Privacy') && <Lock className="w-5 h-5 text-primary" />}
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {post.category}
                    </Badge>
                  </div>
                  
                  <h3 className="font-semibold mb-2 line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {post.excerpt}
                  </p>
                  
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{new Date(post.date).toLocaleDateString('id-ID')}</span>
                    <span>{post.readTime}</span>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-16 px-4 glass-section">
        <div className="container max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="glass-card p-8 rounded-3xl border-primary/20"
          >
            <BookOpen className="w-12 h-12 text-primary mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-4">
              Dapatkan Update Terbaru
            </h2>
            <p className="text-muted-foreground mb-6">
              Ikuti perkembangan selfX dan dapatkan tips privasi digital 
              langsung dari tim Bezn Project.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                variant="outline"
                onClick={() => window.open('https://github.com/beznproject/selfx', '_blank')}
                className="gap-2"
              >
                <Share2 className="w-4 h-4" />
                Follow GitHub
              </Button>
              <Button 
                onClick={() => window.open('https://twitter.com/beznproject', '_blank')}
                className="gap-2"
              >
                <Share2 className="w-4 h-4" />
                Follow Twitter
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}