import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Bug, Send, User, Mail, Phone, MessageSquare, ChevronDown, Settings, Bookmark, Archive, Lightbulb, Smartphone, AlertTriangle } from 'lucide-react';
import { Navigation } from '@/components/Navigation';
import { ComposeModal } from '@/components/ComposeModal';
import { ReceiveShareModal } from '@/components/ReceiveShareModal';
import { SEO } from '@/components/SEO';
import { Button } from '@/components/ui/button';
import { toast } from '@/lib/toast';
import { getUser } from '@/lib/storage';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

export default function ReportBug() {
  const navigate = useNavigate();
  const user = getUser();
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [isReceiveShareOpen, setIsReceiveShareOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: '',
    whatsapp: '',
    bug: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.bug) {
      toast.error('Mohon isi semua field yang wajib');
      return;
    }

    setIsSubmitting(true);

    const message = `*REPORT BUG - selfQ*

*Dari:* ${formData.name}
*Email:* ${formData.email}
${formData.whatsapp ? `*WhatsApp:* ${formData.whatsapp}\n` : ''}
*Bug yang Ditemukan:*
${formData.bug}

---
Dikirim dari selfQ - Ruang Pribadimu, Tanpa Tekanan`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/6285189643588?text=${encodedMessage}`;

    window.open(whatsappUrl, '_blank');

    setTimeout(() => {
      setFormData({
        name: user?.name || '',
        email: '',
        whatsapp: '',
        bug: ''
      });
      setIsSubmitting(false);
      toast.success('Terima kasih! Silakan kirim pesan di WhatsApp');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="Report Bug - selfQ"
        description="Laporkan bug atau masalah di selfQ - Ruang Pribadimu, Tanpa Tekanan"
        keywords="report bug, lapor bug, bug selfq, masalah selfq"
      />
      
      <Navigation 
        onCompose={() => setIsComposeOpen(true)}
        onReceiveShare={() => setIsReceiveShareOpen(true)}
      />

      <div className="main-with-sidebar">
        <header className="clean-nav sticky top-0 z-30 md:hidden">
          <div className="container flex items-center justify-between h-16 px-4">
            <div className="flex items-center gap-3">
              <img src="/images/logo/logo.png" alt="selfQ Logo" className="w-8 h-8 rounded-xl" />
              <h1 className="text-lg font-bold">Report Bug</h1>
            </div>

            {user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 p-2 rounded-full hover:bg-secondary transition-colors">
                    <div className="avatar-sm rounded-full bg-gradient-to-br from-mint-medium to-mint-dark flex items-center justify-center">
                      {user.avatar ? (
                        <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover rounded-full" />
                      ) : (
                        <span className="text-white font-semibold text-sm">
                          {user.name.charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>
                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => navigate('/profile')}>
                    <User className="w-4 h-4 mr-2" />
                    Profil
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/bookmarks')}>
                    <Bookmark className="w-4 h-4 mr-2" />
                    Bookmark
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/archive')}>
                    <Archive className="w-4 h-4 mr-2" />
                    Arsip
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/settings')}>
                    <Settings className="w-4 h-4 mr-2" />
                    Pengaturan
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/request-feature')}>
                    <Lightbulb className="w-4 h-4 mr-2" />
                    Request Fitur
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/report-bug')}>
                    <Bug className="w-4 h-4 mr-2" />
                    Report Bug
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </header>

        <main className="container px-4 md:px-6 py-8 pb-32 md:pb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto"
          >
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-500/10 mb-4">
                <Bug className="w-8 h-8 text-red-600" />
              </div>
              <h1 className="text-3xl font-bold mb-2">Report Bug</h1>
              <p className="text-muted-foreground">
                Temukan bug atau masalah? Laporkan ke kami!
              </p>
            </div>

            <form onSubmit={handleSubmit} className="glass-card p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Nama Lengkap <span className="text-destructive">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Masukkan nama lengkap"
                    className="glass-input pl-9"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Email <span className="text-destructive">*</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="nama@email.com"
                    className="glass-input pl-9"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  No. WhatsApp <span className="text-muted-foreground text-xs">(Opsional)</span>
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="tel"
                    value={formData.whatsapp}
                    onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                    placeholder="08123456789"
                    className="glass-input pl-9"
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Agar kami bisa follow up langsung
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Bug yang Ditemukan <span className="text-destructive">*</span>
                </label>
                <div className="relative">
                  <MessageSquare className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <textarea
                    value={formData.bug}
                    onChange={(e) => setFormData({ ...formData, bug: e.target.value })}
                    placeholder="Jelaskan bug yang Anda temukan secara detail...&#10;&#10;Contoh:&#10;- Apa yang terjadi?&#10;- Kapan bug muncul?&#10;- Langkah untuk reproduce bug?&#10;- Browser/device yang digunakan?"
                    className="glass-input pl-9 min-h-[200px] resize-none"
                    required
                  />
                </div>
              </div>

              <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium mb-1">Catatan</p>
                    <p className="text-sm text-muted-foreground">
                      Setelah klik tombol kirim, Anda akan diarahkan ke WhatsApp untuk mengirim pesan ke developer. Pastikan WhatsApp sudah terinstall di perangkat Anda.
                    </p>
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-red-600 hover:bg-red-700"
                size="lg"
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Send className="w-5 h-5 mr-2" />
                    Kirim via WhatsApp
                  </>
                )}
              </Button>
            </form>

            <div className="mt-8 text-center text-sm text-muted-foreground">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Bug className="w-4 h-4 text-red-600" />
                <p>Terima kasih telah membantu memperbaiki selfQ!</p>
              </div>
              <p>Developer: M. Nafiurohman | WhatsApp: 081358198565</p>
            </div>
          </motion.div>
        </main>
      </div>

      <ComposeModal
        isOpen={isComposeOpen}
        onClose={() => setIsComposeOpen(false)}
        onSubmit={async () => {}}
      />

      <ReceiveShareModal
        isOpen={isReceiveShareOpen}
        onClose={() => setIsReceiveShareOpen(false)}
        onSuccess={() => {}}
      />
    </div>
  );
}
