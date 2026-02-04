import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  HelpCircle,
  ChevronDown,
  BookOpen,
  Shield,
  Download,
  Upload,
  Share2,
  Bookmark,
  MessageCircle,
  Smartphone,
  Lock,
  RefreshCw,
  Trash2,
  Sparkles
} from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { cn } from '@/lib/utils';
import { getUser } from '@/lib/storage';

interface FAQItem {
  question: string;
  answer: string;
}

interface TutorialItem {
  icon: React.ElementType;
  title: string;
  steps: string[];
}

const faqs: FAQItem[] = [
  {
    question: 'Apa itu selfX?',
    answer: 'selfX adalah platform journaling pribadi yang sepenuhnya offline. Semua data tersimpan di perangkatmu sendiri, tidak ada server yang menyimpan datamu. Cocok untuk menulis pikiran pribadi tanpa khawatir privasi.'
  },
  {
    question: 'Apakah selfX aman untuk menyimpan data pribadi dan sensitif?',
    answer: 'Ya, selfX adalah platform paling aman untuk data pribadi. Menggunakan enkripsi AES-256-GCM dengan salt berlapis dan signature khusus. Data tidak pernah meninggalkan perangkat Anda, tidak ada server yang bisa diretas, dan tidak ada pihak ketiga yang bisa mengakses informasi Anda. Bahkan developer selfX tidak bisa melihat data Anda.'
  },
  {
    question: 'Bagaimana cara kerja teknologi offline-first selfX?',
    answer: 'selfX menggunakan teknologi Progressive Web App (PWA) dengan IndexedDB untuk penyimpanan lokal dan Service Worker untuk cache. Semua operasi dilakukan di browser menggunakan Web Crypto API untuk enkripsi. Tidak ada komunikasi dengan server eksternal, menjadikan selfX benar-benar offline dan independen.'
  },
  {
    question: 'Apakah selfX cocok sebagai alternatif Twitter atau Instagram pribadi?',
    answer: 'Sangat cocok! selfX dirancang khusus sebagai alternatif aman untuk akun kedua di platform mainstream. Anda bisa posting pemikiran pribadi, foto personal, dan berinteraksi tanpa algoritma yang memanipulasi timeline atau iklan yang mengganggu. Perfect untuk Gen Z yang butuh ruang digital yang benar-benar privat.'
  },
  {
    question: 'Apakah data saya aman?',
    answer: 'Sangat aman! Data dienkripsi dengan AES-256-GCM berlapis salt. Tidak ada data yang dikirim ke server manapun. Semua tersimpan lokal di perangkatmu.'
  },
  {
    question: 'Bagaimana jika perangkat saya rusak?',
    answer: 'Sangat penting untuk backup secara rutin! Gunakan fitur "Ekspor Data" di Settings untuk mengunduh file backup. Simpan file tersebut di Google Drive, Dropbox, atau penyimpanan cloud lainnya.'
  },
  {
    question: 'Apakah bisa diakses dari perangkat lain?',
    answer: 'Data tersimpan di perangkat tempat kamu menggunakannya. Untuk memindahkan data, ekspor backup dari perangkat lama dan impor ke perangkat baru.'
  },
  {
    question: 'Apakah gratis?',
    answer: 'Ya, selfX 100% gratis dan akan selalu gratis. Tidak ada iklan, tidak ada langganan, tidak ada biaya tersembunyi.'
  },
  {
    question: 'Bagaimana cara berbagi post?',
    answer: 'Klik tombol "Bagikan" (ikon share) pada post yang ingin dibagikan. File JSON terenkripsi akan diunduh otomatis. Kirimkan file tersebut ke penerima, dan mereka bisa mengimpor melalui tombol "Terima Kiriman".'
  },
  {
    question: 'Kenapa foto/video tidak bisa di-share?',
    answer: 'Foto dan video dengan ukuran besar tidak dapat dibagikan untuk menjaga performa. Hanya post teks yang dapat dibagikan melalui fitur sharing terenkripsi.'
  },
  {
    question: 'Apakah selfX bisa diinstall di HP?',
    answer: 'Ya! selfX adalah PWA (Progressive Web App). Buka di browser HP, lalu pilih "Add to Home Screen" atau "Install App" dari menu browser.'
  }
];

const tutorials: TutorialItem[] = [
  {
    icon: Sparkles,
    title: 'Membuat Post Pertama',
    steps: [
      'Klik tombol "Tulis pikiranmu disini" atau tombol + di pojok kanan bawah',
      'Tulis isi postinganmu (opsional: tambah judul)',
      'Tambahkan gambar jika diinginkan (maks 3MB)',
      'Tekan Enter atau klik tombol Post'
    ]
  },
  {
    icon: Download,
    title: 'Backup Data',
    steps: [
      'Buka halaman Settings',
      'Scroll ke bagian "Data"',
      'Klik "Ekspor Data"',
      'Simpan file .json yang diunduh ke tempat aman (Google Drive, dll)'
    ]
  },
  {
    icon: Upload,
    title: 'Restore Data',
    steps: [
      'Buka halaman Settings',
      'Klik "Impor Data"',
      'Pilih file backup .json',
      'Konfirmasi untuk mengganti data yang ada'
    ]
  },
  {
    icon: Share2,
    title: 'Berbagi Post',
    steps: [
      'Buka post yang ingin dibagikan (hanya post teks)',
      'Klik tombol "Bagikan" (ikon share) pada post',
      'File JSON terenkripsi akan diunduh otomatis',
      'Kirimkan file tersebut ke penerima melalui chat/email'
    ]
  },
  {
    icon: Bookmark,
    title: 'Menyimpan Post',
    steps: [
      'Klik ikon bookmark pada post',
      'Pilih kategori (atau buat baru)',
      'Post akan tersimpan di halaman Bookmarks'
    ]
  },
  {
    icon: Smartphone,
    title: 'Install di HP',
    steps: [
      'Buka selfX di browser HP',
      'Chrome Android: Menu (...) → "Install App"',
      'Safari iOS: Share → "Add to Home Screen"',
      'Buka dari home screen seperti app biasa'
    ]
  }
];

export default function HelpCenter() {
  const navigate = useNavigate();
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'faq' | 'tutorial'>('tutorial');
  const [copied, setCopied] = useState(false);
  const user = getUser();

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-primary/5 via-background to-primary/5">
      <Navbar showHelp={false} showBack isLoggedIn={!!user} />

      {/* Header */}
      <header className="glass-section py-12 px-4">
        <div className="container max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-16 h-16 rounded-2xl bg-primary mx-auto mb-4 flex items-center justify-center shadow-lg shadow-primary/25"
          >
            <HelpCircle className="w-8 h-8 text-primary-foreground" />
          </motion.div>
          <h1 className="text-3xl font-bold mb-2">Pusat Bantuan</h1>
          <p className="text-muted-foreground">
            Panduan lengkap menggunakan selfX
          </p>
        </div>
      </header>

      <main className="flex-1 container max-w-4xl mx-auto px-4 py-8">

        {/* Tabs */}
        <div className="flex gap-2 mb-8">
          <button
            onClick={() => setActiveTab('tutorial')}
            className={cn(
              'flex-1 py-3 px-4 rounded-xl font-medium transition-colors',
              activeTab === 'tutorial'
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary hover:bg-secondary/80'
            )}
          >
            <BookOpen className="w-4 h-4 inline mr-2" />
            Tutorial
          </button>
          <button
            onClick={() => setActiveTab('faq')}
            className={cn(
              'flex-1 py-3 px-4 rounded-xl font-medium transition-colors',
              activeTab === 'faq'
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary hover:bg-secondary/80'
            )}
          >
            <MessageCircle className="w-4 h-4 inline mr-2" />
            FAQ
          </button>
        </div>

        {/* Tutorial Content */}
        {activeTab === 'tutorial' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid md:grid-cols-2 gap-4"
          >
            {tutorials.map((tutorial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="glass-card p-6 rounded-2xl"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <tutorial.icon className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-semibold">{tutorial.title}</h3>
                </div>
                <ol className="space-y-2">
                  {tutorial.steps.map((step, i) => (
                    <li key={i} className="flex gap-3 text-sm">
                      <span className="w-5 h-5 rounded-full bg-secondary flex-shrink-0 flex items-center justify-center text-xs font-medium">
                        {i + 1}
                      </span>
                      <span className="text-muted-foreground">{step}</span>
                    </li>
                  ))}
                </ol>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* FAQ Content */}
        {activeTab === 'faq' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-3"
          >
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
                className="glass-card rounded-xl overflow-hidden"
              >
                <button
                  onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                  className="w-full p-4 text-left flex items-center justify-between gap-4"
                >
                  <span className="font-medium">{faq.question}</span>
                  <ChevronDown
                    className={cn(
                      'w-5 h-5 text-muted-foreground transition-transform flex-shrink-0',
                      expandedFaq === index && 'rotate-180'
                    )}
                  />
                </button>
                {expandedFaq === index && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: 'auto' }}
                    className="px-4 pb-4"
                  >
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {faq.answer}
                    </p>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-8 p-6 rounded-2xl bg-secondary/50 border border-border"
        >
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            Tips Keamanan
          </h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Backup data secara rutin ke cloud storage (Google Drive, Dropbox)</li>
            <li>• Jangan hapus data browser jika tidak ingin kehilangan data</li>
            <li>• Gunakan browser yang sama untuk mengakses selfX</li>
            <li>• File backup terenkripsi, tapi tetap simpan di tempat aman</li>
          </ul>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
