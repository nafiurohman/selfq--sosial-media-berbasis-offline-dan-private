import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  HelpCircle, 
  Shield, 
  Wifi, 
  Lock, 
  Database,
  RefreshCw,
  Smartphone,
  Download,
  Upload,
  Settings,
  AlertTriangle,
  CheckCircle2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Footer } from '@/components/layout/Footer';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

export default function FAQ() {
  const navigate = useNavigate();

  const faqData = [
    {
      category: "Dasar-dasar selfX",
      icon: HelpCircle,
      questions: [
        {
          q: "Apa itu selfX?",
          a: "selfX adalah platform journaling pribadi yang 100% offline. Ini adalah ruang aman untuk menulis pikiran, perasaan, dan pengalaman Anda tanpa khawatir data bocor atau diintip pihak lain. Semua data tersimpan lokal di perangkat Anda dengan enkripsi tingkat tinggi."
        },
        {
          q: "Apakah selfX benar-benar gratis?",
          a: "Ya, selfX sepenuhnya gratis tanpa iklan, tracking, atau biaya tersembunyi. Ini adalah proyek open source dari Bezn Project yang bertujuan memberikan privasi digital kepada semua orang."
        },
        {
          q: "Siapa yang membuat selfX?",
          a: "selfX dikembangkan oleh Bezn Project, sebuah studio kreatif dan lab riset yang fokus pada teknologi privacy-first dan solusi digital yang memberdayakan pengguna."
        },
        {
          q: "Apakah selfX tersedia untuk semua perangkat?",
          a: "Ya, selfX adalah Progressive Web App (PWA) yang bisa diakses melalui browser modern di desktop, tablet, dan smartphone. Anda juga bisa menginstalnya seperti aplikasi native di Android dan iOS."
        }
      ]
    },
    {
      category: "Privasi & Keamanan",
      icon: Shield,
      questions: [
        {
          q: "Bagaimana selfX melindungi privasi saya?",
          a: "selfX menggunakan pendekatan 'privacy by design' dengan enkripsi AES-256-GCM berlapis salt. Data Anda tidak pernah meninggalkan perangkat, tidak ada server yang menyimpan informasi pribadi, dan tidak ada tracking atau analytics."
        },
        {
          q: "Apakah data saya aman jika perangkat hilang atau rusak?",
          a: "Data Anda aman karena terenkripsi, tetapi akan hilang jika perangkat rusak tanpa backup. Oleh karena itu, sangat penting untuk melakukan backup berkala melalui fitur ekspor data."
        },
        {
          q: "Bisakah pihak lain membaca data saya?",
          a: "Tidak. Bahkan pengembang selfX tidak bisa membaca data Anda karena enkripsi dilakukan di sisi klien dengan kunci yang hanya Anda ketahui. Tanpa password Anda, data tidak bisa dibuka."
        },
        {
          q: "Apakah selfX mengumpulkan data analytics?",
          a: "Tidak sama sekali. selfX tidak menggunakan Google Analytics, Facebook Pixel, atau layanan tracking lainnya. Tidak ada cookies, tidak ada fingerprinting, dan tidak ada pengumpulan data."
        }
      ]
    },
    {
      category: "Fitur Offline",
      icon: Wifi,
      questions: [
        {
          q: "Bagaimana selfX bisa bekerja offline?",
          a: "selfX menggunakan teknologi Service Worker dan IndexedDB untuk menyimpan semua data dan aset aplikasi di perangkat Anda. Setelah instalasi pertama, tidak perlu koneksi internet untuk menggunakan aplikasi."
        },
        {
          q: "Apakah saya perlu internet untuk menginstall selfX?",
          a: "Ya, Anda perlu koneksi internet hanya untuk instalasi pertama. Setelah itu, selfX bisa digunakan sepenuhnya offline."
        },
        {
          q: "Berapa banyak storage yang dibutuhkan selfX?",
          a: "Aplikasi selfX sendiri hanya membutuhkan sekitar 5-10MB. Storage untuk data Anda tergantung pada jumlah post, foto, dan video yang Anda simpan. Setiap foto dibatasi 3MB dan video 5MB."
        },
        {
          q: "Bisakah saya sync data antar perangkat?",
          a: "Tidak ada fitur sync otomatis karena selfX tidak menggunakan server. Namun, Anda bisa mengekspor data dari satu perangkat dan mengimpornya ke perangkat lain secara manual."
        }
      ]
    },
    {
      category: "Backup & Restore",
      icon: Database,
      questions: [
        {
          q: "Bagaimana cara backup data saya?",
          a: "Pergi ke Settings > Backup & Restore > Export Data. File backup akan diunduh dalam format terenkripsi (.selfx) yang bisa Anda simpan di cloud storage atau perangkat lain."
        },
        {
          q: "Seberapa sering saya harus backup?",
          a: "Disarankan backup mingguan atau setelah menulis konten penting. Anda juga bisa mengatur reminder backup di pengaturan aplikasi."
        },
        {
          q: "Bisakah saya restore data di perangkat berbeda?",
          a: "Ya, file backup (.selfx) bisa diimpor ke perangkat apapun yang menjalankan selfX. Pastikan Anda ingat password untuk membuka file backup."
        },
        {
          q: "Apakah file backup aman?",
          a: "Ya, file backup menggunakan enkripsi yang sama dengan aplikasi (AES-256-GCM). Tanpa password yang benar, file backup tidak bisa dibuka oleh siapapun."
        }
      ]
    },
    {
      category: "Penggunaan & Tips",
      icon: Settings,
      questions: [
        {
          q: "Bagaimana cara menulis post pertama saya?",
          a: "Setelah onboarding, klik tombol '+' atau 'Tulis Baru' di feed. Anda bisa menulis teks, menambah foto/video, dan mengatur mood atau kategori post."
        },
        {
          q: "Bagaimana cara membuat cerita baru?",
          a: "Pergi ke halaman 'Ceritamu', klik 'Tulis Cerita' atau tombol '+'. Atur judul dan kategori cerita (Senang, Sedih, Romance, dll.) di tab 'Setting' sidebar. Gunakan editor dengan fitur formatting seperti bold, italic, dan alignment."
        },
        {
          q: "Apa saja fitur di Story Editor?",
          a: "Story Editor memiliki 4 tab: 1) Tulis - statistik kata dan ide cerita, 2) Karakter - kelola karakter cerita, 3) Outline - buat kerangka cerita, 4) Setting - pilih kategori dan tulis sinopsis. Ada juga preview mode dan auto-save setiap 2 detik."
        },
        {
          q: "Bagaimana cara mengedit cerita yang sudah ada?",
          a: "Di halaman 'Ceritamu', klik cerita yang ingin diedit, lalu pilih tombol 'Edit' di header. Atau hover pada card cerita dan klik ikon pensil. Semua perubahan tersimpan otomatis."
        },
        {
          q: "Bagaimana cara mengubah kategori cerita?",
          a: "Saat menulis/edit cerita, klik tab 'Setting' di sidebar, lalu pilih kategori dari tombol-tombol yang tersedia. Di halaman daftar cerita, klik tombol kategori di card cerita untuk mengubahnya langsung."
        },
        {
          q: "Apa itu fitur Characters dan Outline?",
          a: "Tab Characters memungkinkan Anda menambah karakter dengan nama, deskripsi, dan traits. Tab Outline untuk membuat kerangka cerita dengan template struktur dan perencanaan bab berdasarkan target 1000-2000 kata per bab."
        },
        {
          q: "Bagaimana cara berbagi cerita?",
          a: "Klik tombol 'Share' di halaman cerita atau editor. Cerita akan dienkripsi dengan AES-256 berlapis dan diunduh sebagai file JSON. Penerima bisa mengimpor melalui 'Terima Cerita' di halaman Ceritamu."
        },
        {
          q: "Bisakah saya mengedit post yang sudah dibuat?",
          a: "Ya, klik post yang ingin diedit, lalu pilih opsi 'Edit'. Semua perubahan akan tersimpan otomatis."
        },
        {
          q: "Apa itu fitur bookmark?",
          a: "Bookmark memungkinkan Anda menyimpan post penting untuk akses cepat. Post yang di-bookmark akan muncul di halaman Bookmarks."
        },
        {
          q: "Bisakah saya mengatur tema atau tampilan?",
          a: "Ya, selfX mendukung light mode dan dark mode yang bisa diatur di Settings. Tema akan mengikuti preferensi sistem secara default."
        }
      ]
    },
    {
      category: "Troubleshooting",
      icon: AlertTriangle,
      questions: [
        {
          q: "Aplikasi tidak bisa dibuka atau error?",
          a: "Coba refresh browser atau clear cache. Jika masih bermasalah, pastikan browser Anda mendukung teknologi modern (Chrome 80+, Firefox 75+, Safari 13+)."
        },
        {
          q: "Data saya hilang, bagaimana cara recovery?",
          a: "Jika Anda punya file backup, import melalui Settings > Backup & Restore. Jika tidak ada backup, data tidak bisa di-recovery karena tersimpan lokal di perangkat."
        },
        {
          q: "Foto/video tidak bisa diupload?",
          a: "Pastikan ukuran file tidak melebihi batas (3MB untuk foto, 5MB untuk video). Format yang didukung: JPG, PNG, GIF untuk foto; MP4, WebM untuk video."
        },
        {
          q: "Aplikasi lambat atau lag?",
          a: "Coba tutup tab browser lain atau restart aplikasi. Jika data Anda sudah banyak (>1000 post), pertimbangkan untuk archive post lama."
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-primary/5 via-background to-primary/5">
      {/* SEO Meta Tags */}
      <div style={{ display: 'none' }}>
        <h1>FAQ selfX - Pertanyaan yang Sering Diajukan</h1>
        <p>Temukan jawaban untuk pertanyaan umum tentang selfX, platform journaling pribadi offline dengan enkripsi AES-256. Pelajari cara backup, restore, dan menggunakan fitur-fitur selfX.</p>
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
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/about')}
            className="gap-2"
          >
            <HelpCircle className="w-4 h-4" />
            <span className="hidden sm:inline">Tentang selfX</span>
          </Button>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="py-16 px-4">
        <div className="container max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', duration: 0.8 }}
            className="w-20 h-20 rounded-2xl bg-primary mx-auto mb-6 flex items-center justify-center shadow-lg shadow-primary/25"
          >
            <HelpCircle className="w-10 h-10 text-primary-foreground" />
          </motion.div>

          <motion.h1 
            {...fadeInUp}
            className="text-3xl md:text-4xl font-bold mb-4"
          >
            Pertanyaan yang Sering Diajukan
          </motion.h1>

          <motion.p
            {...fadeInUp}
            transition={{ delay: 0.1 }}
            className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto"
          >
            Temukan jawaban untuk pertanyaan umum tentang selfX. 
            Jika tidak menemukan jawaban yang Anda cari, jangan ragu untuk menghubungi kami.
          </motion.p>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="pb-20 px-4">
        <div className="container max-w-4xl mx-auto">
          {faqData.map((category, categoryIndex) => (
            <motion.div
              key={categoryIndex}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: categoryIndex * 0.1 }}
              className="mb-8"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl backdrop-blur-2xl bg-white/20 dark:bg-gray-800/20 border border-white/20 flex items-center justify-center">
                  <category.icon className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-xl font-semibold">{category.category}</h2>
              </div>

              <Accordion type="single" collapsible className="backdrop-blur-2xl bg-white/30 dark:bg-gray-900/30 border border-white/20 rounded-3xl p-2">
                {category.questions.map((faq, faqIndex) => (
                  <AccordionItem 
                    key={faqIndex} 
                    value={`${categoryIndex}-${faqIndex}`}
                    className="border-border/50"
                  >
                    <AccordionTrigger className="px-4 py-3 text-left hover:no-underline hover:bg-white/20 dark:hover:bg-gray-800/20 rounded-2xl">
                      <span className="font-medium">{faq.q}</span>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pb-4 text-muted-foreground">
                      {faq.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 px-4 glass-section">
        <div className="container max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="backdrop-blur-2xl bg-white/30 dark:bg-gray-900/30 border border-white/20 p-8 rounded-3xl"
          >
            <CheckCircle2 className="w-12 h-12 text-primary mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-4">
              Masih Ada Pertanyaan?
            </h2>
            <p className="text-muted-foreground mb-6">
              Jika Anda tidak menemukan jawaban yang dicari, 
              silakan hubungi tim Bezn Project untuk bantuan lebih lanjut.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={() => window.open('mailto:support@beznproject.web.id', '_blank')}
                className="gap-2"
              >
                <HelpCircle className="w-4 h-4" />
                Email Support
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}