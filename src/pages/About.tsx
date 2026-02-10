import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useEffect } from 'react';
import { 
  ArrowLeft, 
  Heart, 
  Shield, 
  Zap, 
  Users, 
  Globe, 
  Github, 
  Mail, 
  Instagram, 
  Linkedin,
  ExternalLink,
  Award,
  Code,
  Palette,
  Database,
  Lock,
  Smartphone,
  Download,
  Star,
  CheckCircle,
  Eye,
  FileText,
  Layers,
  Server,
  EyeOff,
  UserX,
  Coffee,
  MessageCircle,
  Copy
} from 'lucide-react';
import { SEO } from '@/components/SEO';
import { Button } from '@/components/ui/button';
import { toast } from '@/lib/toast';

export default function About() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Scroll to top when page loads, unless there's a hash
    if (!location.hash) {
      window.scrollTo(0, 0);
    } else {
      // Scroll to hash section after a short delay
      setTimeout(() => {
        const element = document.querySelector(location.hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  }, [location]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <SEO 
        title="Tentang selfQ"
        description="selfQ - Platform sosial media pribadi offline yang mengutamakan privasi dengan enkripsi AES-256"
        keywords="selfq, sosial media pribadi, offline, privasi, enkripsi, PWA"
      />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-purple-600/10" />
        <div className="container mx-auto px-4 py-16 md:py-24 relative">
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={() => navigate(-1)}
              className="bg-white/30 dark:bg-gray-800/30 backdrop-blur-2xl border border-white/20 rounded-3xl p-3 hover:bg-white/40 dark:hover:bg-gray-700/40 transition-all duration-200"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          </div>
          
          <div className="text-center max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-8"
            >
              <img 
                src="/images/logo/logo.png" 
                alt="selfQ Logo" 
                className="w-32 h-32 mx-auto rounded-3xl shadow-2xl mb-6"
              />
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
            >
              selfQ
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-lg md:text-xl lg:text-2xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed px-4"
            >
              Platform sosial media pribadi yang 100% offline,<br className="hidden md:block" />
              mengutamakan privasi dengan enkripsi AES-256
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-wrap justify-center gap-4 mb-12"
            >
              <span className="px-6 py-3 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded-full font-semibold flex items-center gap-2">
                <Lock className="w-4 h-4" />
                100% Offline
              </span>
              <span className="px-6 py-3 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full font-semibold flex items-center gap-2">
                <Smartphone className="w-4 h-4" />
                PWA Ready
              </span>
              <span className="px-6 py-3 bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 rounded-full font-semibold flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Enkripsi AES-256
              </span>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white/50 dark:bg-gray-800/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">Mengapa selfQ?</h2>
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto px-4">
              Solusi terdepan untuk journaling pribadi dengan keamanan tingkat militer
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-2xl border border-white/20 rounded-3xl p-8 text-center hover:shadow-2xl transition-all duration-300"
            >
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-500 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <Shield className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4">100% Offline</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Semua data tersimpan di perangkat Anda. Tidak ada server, tidak ada tracking, kontrol penuh di tangan Anda.
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-2xl border border-white/20 rounded-3xl p-8 text-center hover:shadow-2xl transition-all duration-300"
            >
              <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-pink-500 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <Server className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Tidak Ada Server</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Data tidak pernah dikirim ke server manapun. Semua proses terjadi di perangkat Anda sendiri.
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-2xl border border-white/20 rounded-3xl p-8 text-center hover:shadow-2xl transition-all duration-300"
            >
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <Lock className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Enkripsi AES-256</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Keamanan tingkat militer dengan enkripsi berlapis. Data Anda terlindungi dengan standar keamanan tertinggi.
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-2xl border border-white/20 rounded-3xl p-8 text-center hover:shadow-2xl transition-all duration-300"
            >
              <div className="w-20 h-20 bg-gradient-to-br from-yellow-500 to-amber-500 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <Heart className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Gratis 100%</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Sepenuhnya gratis tanpa biaya tersembunyi, iklan, atau subscription. Akses penuh ke semua fitur.
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-2xl border border-white/20 rounded-3xl p-8 text-center hover:shadow-2xl transition-all duration-300"
            >
              <div className="w-20 h-20 bg-gradient-to-br from-gray-500 to-gray-700 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <EyeOff className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Tanpa Tracking</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Tidak ada analytics, cookies, atau pelacakan aktivitas. Privasi Anda benar-benar terjaga.
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-2xl border border-white/20 rounded-3xl p-8 text-center hover:shadow-2xl transition-all duration-300"
            >
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <Smartphone className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4">PWA Ready</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Install seperti aplikasi native di semua platform. Bekerja offline dengan performa optimal.
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
              className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-2xl border border-white/20 rounded-3xl p-8 text-center hover:shadow-2xl transition-all duration-300"
            >
              <div className="w-20 h-20 bg-gradient-to-br from-teal-500 to-green-500 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <Github className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Open Source</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Kode terbuka dan transparan. Anda bisa melihat source code di GitHub.
              </p>
              <a
                href="https://github.com/nafiurohman/selfQ--sosial-media-berbasis-offline-dan-private.git"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors text-sm font-medium"
              >
                <Github className="w-4 h-4" />
                View on GitHub
                <ExternalLink className="w-3 h-3" />
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-2xl border border-white/20 rounded-3xl p-12">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">selfQ dalam Angka</h2>
              <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 px-4">
                Statistik pengembangan dan fitur
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
              <div className="text-center">
                <div className="text-3xl md:text-4xl lg:text-5xl font-bold text-blue-600 mb-2">15,000+</div>
                <div className="text-sm md:text-base text-gray-600 dark:text-gray-300">Lines of Code</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl lg:text-5xl font-bold text-purple-600 mb-2">50+</div>
                <div className="text-sm md:text-base text-gray-600 dark:text-gray-300">Components</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl lg:text-5xl font-bold text-green-600 mb-2">12+</div>
                <div className="text-sm md:text-base text-gray-600 dark:text-gray-300">Pages</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl lg:text-5xl font-bold text-orange-600 mb-2">3</div>
                <div className="text-sm md:text-base text-gray-600 dark:text-gray-300">Security Layers</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="py-20 bg-white/50 dark:bg-gray-800/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 flex items-center justify-center gap-3 px-4">
              <Code className="w-8 h-8 md:w-10 md:h-10" />
              Teknologi Modern
            </h2>
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto px-4">
              Dibangun dengan teknologi terdepan untuk performa dan keamanan optimal
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { name: 'React 18', desc: 'UI Library dengan TypeScript', color: 'from-blue-500 to-cyan-500' },
              { name: 'Vite', desc: 'Build tool yang cepat dan modern', color: 'from-purple-500 to-pink-500' },
              { name: 'Tailwind CSS', desc: 'Utility-first CSS framework', color: 'from-teal-500 to-green-500' },
              { name: 'Framer Motion', desc: 'Animation library yang powerful', color: 'from-orange-500 to-red-500' },
              { name: 'IndexedDB', desc: 'Database browser untuk storage', color: 'from-indigo-500 to-purple-500' },
              { name: 'Web Crypto API', desc: 'Enkripsi native browser', color: 'from-green-500 to-emerald-500' }
            ].map((tech, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-2xl border border-white/20 rounded-3xl p-6 hover:shadow-xl transition-all duration-300"
              >
                <div className={`w-12 h-12 bg-gradient-to-br ${tech.color} rounded-2xl flex items-center justify-center mb-4`}>
                  <Code className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">{tech.name}</h3>
                <p className="text-gray-600 dark:text-gray-300">{tech.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20">
        <div className="container mx-auto px-4">
          <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-2xl border border-white/20 rounded-3xl p-6 md:p-12">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 px-4">Hubungi Kami</h2>
              <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 px-4">
                Ada pertanyaan atau butuh bantuan? Kami siap membantu Anda
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
              <motion.a
                href="mailto:support@beznproject.web.id"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-white/50 dark:bg-gray-700/50 backdrop-blur-xl border border-white/20 rounded-2xl p-6 hover:bg-white/70 dark:hover:bg-gray-600/70 transition-all duration-200 flex items-center gap-4 group"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center">
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">Email Support</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">support@beznproject.web.id</p>
                </div>
                <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors ml-auto" />
              </motion.a>
              
              <motion.a
                href="https://wa.me/6285189643588"
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="bg-white/50 dark:bg-gray-700/50 backdrop-blur-xl border border-white/20 rounded-2xl p-6 hover:bg-white/70 dark:hover:bg-gray-600/70 transition-all duration-200 flex items-center gap-4 group"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center">
                  <MessageCircle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">WhatsApp</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">085189643588</p>
                </div>
                <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-green-600 transition-colors ml-auto" />
              </motion.a>
            </div>
          </div>
        </div>
      </section>

      {/* Bezn Project */}
      <section className="py-20 bg-white/50 dark:bg-gray-800/50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-2xl border border-white/20 rounded-3xl p-12"
            >
              <div className="w-20 h-20 bg-gradient-to-br from-amber-500 to-orange-500 rounded-3xl flex items-center justify-center mx-auto mb-8">
                <Award className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 px-4">Bezn Project</h2>
              <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed px-4">
                selfQ adalah bagian dari <strong>Bezn Project</strong> - inisiatif pengembangan 
                aplikasi yang berfokus pada privasi, keamanan, dan pengalaman pengguna yang luar biasa. 
                Kami berkomitmen untuk menciptakan teknologi yang memberdayakan pengguna.
              </p>
              <div className="flex flex-wrap justify-center gap-6">
                <a
                  href="https://beznproject.web.id"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-2xl font-semibold flex items-center gap-2 shadow-lg transition-all duration-200"
                >
                  <Globe className="w-5 h-5" />
                  Visit Website
                  <ExternalLink className="w-4 h-4" />
                </a>
                <a
                  href="https://instagram.com/bezn.project"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white/50 dark:bg-gray-700/50 backdrop-blur-xl border border-white/20 rounded-2xl px-8 py-4 hover:bg-white/70 dark:hover:bg-gray-600/70 transition-all duration-200 flex items-center gap-2 font-semibold"
                >
                  <Instagram className="w-5 h-5" />
                  Follow Us
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-8 md:p-12 text-center text-white">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 px-4">
              Siap Memulai Journey Anda?
            </h2>
            <p className="text-lg md:text-xl mb-8 opacity-90 max-w-2xl mx-auto px-4">
              Bergabunglah dengan ribuan pengguna yang sudah merasakan kebebasan 
              menulis tanpa khawatir privasi terganggu.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button
                size="lg"
                className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 rounded-2xl text-lg font-semibold shadow-lg"
                onClick={() => navigate('/onboarding')}
              >
                <Download className="w-5 h-5 mr-2" />
                Mulai Sekarang
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 rounded-2xl text-lg font-semibold"
                onClick={() => navigate('/help')}
              >
                Pelajari Lebih Lanjut
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Donate Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-3xl p-8 md:p-12 text-center text-white">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-white/20 rounded-3xl flex items-center justify-center mx-auto mb-8">
              <Coffee className="w-8 h-8 md:w-10 md:h-10 text-white" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 px-4">
              Belikan Developer Kopi
            </h2>
            <p className="text-lg md:text-xl mb-8 opacity-90 max-w-2xl mx-auto px-4">
              Jika selfQ bermanfaat untuk Anda, dukung pengembangan dengan memberikan donasi. 
              Setiap kontribusi sangat berarti untuk keberlanjutan proyek ini.
            </p>
            
            <div className="bg-white/20 backdrop-blur-xl rounded-2xl p-6 max-w-md mx-auto mb-8">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium opacity-90">Bank Jago</span>
                <span className="text-sm opacity-90">a.n M. Nafiurohman</span>
              </div>
              <div className="flex items-center gap-3">
                <code className="flex-1 px-4 py-3 bg-white/30 rounded-xl text-lg font-mono font-bold">
                  507938016692
                </code>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText('507938016692');
                    toast.success('Nomor rekening berhasil disalin!');
                  }}
                  className="flex items-center gap-2 px-4 py-3 bg-white text-orange-600 hover:bg-gray-100 rounded-xl font-semibold transition-colors"
                >
                  <Copy className="w-4 h-4" />
                  Salin
                </button>
              </div>
              <p className="text-sm opacity-75 mt-3">
                Terima kasih atas dukungannya!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 bg-white/50 dark:bg-gray-800/50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {/* selfQ */}
            <div>
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-blue-600" />
                selfQ
              </h3>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                <li>
                  <button onClick={() => navigate('/help')} className="hover:text-blue-600 transition-colors">
                    Bantuan
                  </button>
                </li>
                <li>
                  <button onClick={() => navigate('/about')} className="hover:text-blue-600 transition-colors">
                    Tentang selfQ
                  </button>
                </li>
                <li>
                  <button onClick={() => navigate('/terms')} className="hover:text-blue-600 transition-colors">
                    Syarat & Ketentuan
                  </button>
                </li>
                <li>
                  <button onClick={() => navigate('/privacy')} className="hover:text-blue-600 transition-colors">
                    Kebijakan Privasi
                  </button>
                </li>
              </ul>
            </div>

            {/* Platform Lainnya */}
            <div>
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <Globe className="w-5 h-5 text-green-600" />
                Platform Lainnya
              </h3>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                <li>
                  <a href="https://moneyrecord.web.id" target="_blank" rel="noopener noreferrer" className="hover:text-green-600 transition-colors flex items-center gap-1">
                    Money Record
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </li>
                <li>
                  <a href="https://ezzy.my.id" target="_blank" rel="noopener noreferrer" className="hover:text-green-600 transition-colors flex items-center gap-1">
                    Ezzy
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </li>
                <li>
                  <a href="https://cv-maker.bezn.web.id" target="_blank" rel="noopener noreferrer" className="hover:text-green-600 transition-colors flex items-center gap-1">
                    CV Maker
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </li>
              </ul>
            </div>

            {/* Tentang Bezn */}
            <div>
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <Award className="w-5 h-5 text-purple-600" />
                Tentang Bezn
              </h3>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                <li>
                  <a href="https://beznproject.web.id" target="_blank" rel="noopener noreferrer" className="hover:text-purple-600 transition-colors flex items-center gap-1">
                    Bezn Project
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </li>
                <li>
                  <a href="https://beznproject.web.id/platform" target="_blank" rel="noopener noreferrer" className="hover:text-purple-600 transition-colors flex items-center gap-1">
                    Bezn Platform
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </li>
              </ul>
            </div>

            {/* Ekosistem Bezn */}
            <div>
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <Code className="w-5 h-5 text-orange-600" />
                Ekosistem Bezn
              </h3>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                <li>
                  <a href="https://studio.beznproject.web.id" target="_blank" rel="noopener noreferrer" className="hover:text-orange-600 transition-colors flex items-center gap-1">
                    Bezn Studio
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </li>
                <li>
                  <a href="https://beznlabs.web.id" target="_blank" rel="noopener noreferrer" className="hover:text-orange-600 transition-colors flex items-center gap-1">
                    Bezn Labs
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Footer */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-8">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-4">
                <span className="text-gray-600 dark:text-gray-300">by</span>
                <a 
                  href="https://beznproject.web.id" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                >
                  Bezn Project
                </a>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                © 2025 M. Nafiurohman. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}