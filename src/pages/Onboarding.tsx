import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, 
  Upload, 
  UserPlus, 
  Sparkles,
  HelpCircle,
  FileJson,
  Download,
  Info,
  CheckCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { setUser, setOnboarded, hasAcceptedTerms, setTermsAccepted } from '@/lib/storage';
import { initDB, importAllData } from '@/lib/db';
import { toast } from '@/lib/toast';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';
import { usePWAInstall } from '@/hooks/usePWAInstall';

type Step = 'choice' | 'import' | 'create';

export default function Onboarding() {
  const [step, setStep] = useState<Step>('choice');
  const [name, setName] = useState('');
  const [termsAccepted, setTermsAcceptedLocal] = useState(hasAcceptedTerms());
  const [isLoading, setIsLoading] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { isInstallable, isInstalled, promptInstall } = usePWAInstall();

  const isNameValid = name.trim().length >= 1 && name.trim().length <= 50;

  const handleCreateAccount = async () => {
    if (!isNameValid || !termsAccepted || isLoading) return;

    setIsLoading(true);
    try {
      await initDB();
      
      setUser({
        name: name.trim(),
        createdAt: new Date().toISOString(),
      });
      
      setTermsAccepted(true);
      setOnboarded(true);
      
      toast.success('Akun berhasil dibuat!');
      navigate('/feed');
    } catch (error) {
      console.error('Setup failed:', error);
      toast.error('Gagal membuat akun. Coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.name.endsWith('.json') && file.type !== 'application/json') {
      toast.error('Hanya file JSON yang diperbolehkan');
      return;
    }

    setIsImporting(true);
    try {
      const text = await file.text();
      
      // Decrypt and validate selfQ signature
      const { decryptData } = await import('@/lib/crypto');
      const data = await decryptData<{
        version: string;
        user: unknown;
        posts: unknown[];
        encrypted: boolean;
      }>(text);
      
      // Validate selfQ backup structure
      if (!data.version || !data.user || !Array.isArray(data.posts) || !data.encrypted) {
        throw new Error('File bukan backup selfQ yang valid');
      }
      
      await initDB();
      await importAllData(text);
      
      setTermsAccepted(true);
      setOnboarded(true);
      toast.success('Data berhasil diimpor!');
      
      navigate('/feed');
    } catch (error) {
      console.error('Import failed:', error);
      if (error instanceof Error) {
        if (error.message.includes('Invalid selfQ backup')) {
          toast.error('File bukan backup selfQ yang valid');
        } else if (error.message.includes('atob')) {
          toast.error('File rusak atau format tidak didukung');
        } else {
          toast.error(error.message);
        }
      } else {
        toast.error('Gagal mengimpor data');
      }
    } finally {
      setIsImporting(false);
      e.target.value = '';
    }
  };

  const handleInstallPWA = async () => {
    const installed = await promptInstall();
    if (installed) {
      toast.success('Aplikasi berhasil diinstall!');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-primary/5 via-background to-primary/5">
      <main className="flex-1 flex items-center justify-center p-4 py-8">
        <div className="w-full max-w-md">
          <AnimatePresence mode="wait">
            {step === 'choice' && (
              <motion.div
                key="choice"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                {/* Logo */}
                <div className="text-center mb-8">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', damping: 10 }}
                    className="w-20 h-20 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg"
                  >
                    <img src="/images/logo/logo.png" alt="selfQ Logo" className="w-full h-full rounded-2xl" />
                  </motion.div>
                  <h1 className="text-2xl font-bold">Selamat Datang!</h1>
                  <p className="text-muted-foreground mt-2">
                    Pilih cara untuk memulai
                  </p>
                </div>

                {/* Options */}
                <div className="space-y-4">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        onClick={() => setStep('create')}
                        className={cn(
                          'w-full p-6 rounded-2xl text-left',
                          'glass-card',
                          'transition-all duration-200 group'
                        )}
                      >
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                            <UserPlus className="w-6 h-6 text-primary" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg">Buat Akun Baru</h3>
                            <p className="text-sm text-muted-foreground mt-1">
                              Mulai dari awal dengan akun kosong
                            </p>
                          </div>
                          <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                        </div>
                      </button>
                    </TooltipTrigger>
                    <TooltipContent className="hidden md:block">
                      <p>Buat akun baru untuk memulai journaling</p>
                    </TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        onClick={() => setStep('import')}
                        className={cn(
                          'w-full p-6 rounded-2xl text-left',
                          'glass-card',
                          'transition-all duration-200 group'
                        )}
                      >
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center group-hover:bg-success/20 transition-colors">
                            <Upload className="w-6 h-6 text-success" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg">Impor Data</h3>
                            <p className="text-sm text-muted-foreground mt-1">
                              Pulihkan dari file backup yang sudah ada
                            </p>
                          </div>
                          <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-success transition-colors" />
                        </div>
                      </button>
                    </TooltipTrigger>
                    <TooltipContent className="hidden md:block">
                      <p>Pulihkan data dari file backup</p>
                    </TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        onClick={() => navigate('/about')}
                        className={cn(
                          'w-full p-6 rounded-2xl text-left',
                          'glass-card',
                          'transition-all duration-200 group'
                        )}
                      >
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 rounded-xl bg-info/10 flex items-center justify-center group-hover:bg-info/20 transition-colors">
                            <Info className="w-6 h-6 text-info" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg">Pelajari Lebih Lanjut</h3>
                            <p className="text-sm text-muted-foreground mt-1">
                              Tentang selfQ dan fitur-fiturnya
                            </p>
                          </div>
                          <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-info transition-colors" />
                        </div>
                      </button>
                    </TooltipTrigger>
                    <TooltipContent className="hidden md:block">
                      <p>Pelajari lebih lanjut tentang selfQ</p>
                    </TooltipContent>
                  </Tooltip>
                </div>

                {/* PWA Install Button */}
                {(isInstallable || !isInstalled) && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="glass-card p-4 rounded-2xl"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0">
                        {isInstalled ? (
                          <CheckCircle className="w-5 h-5 text-success" />
                        ) : (
                          <Download className="w-5 h-5 text-primary" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm">
                          {isInstalled ? 'Aplikasi Terinstall' : 'Install Aplikasi'}
                        </h4>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {isInstalled 
                            ? 'selfQ sudah terinstall di perangkatmu' 
                            : 'Sangat disarankan agar data tersimpan di perangkat'}
                        </p>
                      </div>
                      {isInstallable && !isInstalled && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              size="sm"
                              onClick={handleInstallPWA}
                              className="rounded-xl gap-1.5"
                            >
                              <Download className="w-4 h-4" />
                              Install
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent className="hidden md:block">
                            <p>Install selfQ sebagai aplikasi di perangkatmu</p>
                          </TooltipContent>
                        </Tooltip>
                      )}
                    </div>
                  </motion.div>
                )}

                {/* Help */}
                <div className="flex items-center justify-center pt-4">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        onClick={() => navigate('/help')}
                        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                      >
                        <HelpCircle className="w-4 h-4" />
                        Butuh bantuan?
                      </button>
                    </TooltipTrigger>
                    <TooltipContent className="hidden md:block">
                      <p>Lihat pusat bantuan</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </motion.div>
            )}

            {step === 'import' && (
              <motion.div
                key="import"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <div className="text-center mb-8">
                  <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                    <img src="/images/logo/logo.png" alt="selfQ Logo" className="w-full h-full rounded-2xl" />
                  </div>
                  <h1 className="text-2xl font-bold">Impor Data</h1>
                  <p className="text-muted-foreground mt-2">
                    Pilih file backup selfQ (.json)
                  </p>
                </div>

                <div className="space-y-4">
                  <label
                    className={cn(
                      'block w-full p-8 rounded-2xl text-center cursor-pointer',
                      'glass-card',
                      'border-2 border-dashed border-border hover:border-success',
                      'transition-colors'
                    )}
                    onDrop={(e) => {
                      e.preventDefault();
                      const files = Array.from(e.dataTransfer.files);
                      const file = files[0];
                      if (file && (file.type === 'application/json' || file.name.endsWith('.json'))) {
                        // Create a synthetic event with proper FileList
                        const dataTransfer = new DataTransfer();
                        dataTransfer.items.add(file);
                        const syntheticEvent = {
                          target: { files: dataTransfer.files, value: '' }
                        } as React.ChangeEvent<HTMLInputElement>;
                        handleFileSelect(syntheticEvent);
                      } else {
                        toast.error('Hanya file JSON yang diperbolehkan');
                      }
                    }}
                    onDragOver={(e) => e.preventDefault()}
                    onDragEnter={(e) => e.preventDefault()}
                  >
                    <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="font-medium">
                      {isImporting ? 'Mengimpor...' : 'Klik untuk pilih file'}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      atau drag & drop file di sini
                    </p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".json,application/json"
                      onChange={handleFileSelect}
                      disabled={isImporting}
                      className="hidden"
                    />
                  </label>

                  <Button
                    variant="outline"
                    className="w-full glass-button"
                    onClick={() => setStep('choice')}
                    disabled={isImporting}
                  >
                    Kembali
                  </Button>
                </div>
              </motion.div>
            )}

            {step === 'create' && (
              <motion.div
                key="create"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <div className="text-center mb-8">
                  <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                    <img src="/images/logo/logo.png" alt="selfQ Logo" className="w-full h-full rounded-2xl" />
                  </div>
                  <h1 className="text-2xl font-bold">Buat Akun</h1>
                  <p className="text-muted-foreground mt-2">
                    Siapa namamu?
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Masukkan namamu"
                      maxLength={50}
                      autoFocus
                      className={cn(
                        'w-full px-4 py-4 rounded-xl text-lg',
                        'glass-input',
                        'focus:outline-none focus:ring-2 focus:ring-primary/50',
                        'placeholder:text-muted-foreground'
                      )}
                    />
                    <p className="text-xs text-muted-foreground mt-2 text-right">
                      {name.length}/50 karakter
                    </p>
                  </div>

                  {/* Terms checkbox */}
                  <div className="flex items-start gap-3 p-4 rounded-xl glass-card">
                    <Checkbox
                      id="terms"
                      checked={termsAccepted}
                      onCheckedChange={(checked) => setTermsAcceptedLocal(checked === true)}
                      className="mt-0.5"
                    />
                    <label htmlFor="terms" className="text-sm text-muted-foreground cursor-pointer">
                      Saya telah membaca dan menyetujui{' '}
                      <Link to="/terms" className="text-primary hover:underline">
                        Ketentuan Layanan
                      </Link>{' '}
                      dan{' '}
                      <Link to="/privacy" className="text-primary hover:underline">
                        Kebijakan Privasi
                      </Link>
                    </label>
                  </div>

                  <Button
                    className="w-full h-14 text-lg gap-2 rounded-2xl"
                    onClick={handleCreateAccount}
                    disabled={!isNameValid || !termsAccepted || isLoading}
                  >
                    {isLoading ? (
                      <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        Mulai Menulis
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full glass-button"
                    onClick={() => setStep('choice')}
                    disabled={isLoading}
                  >
                    Kembali
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Minimal Footer */}
      <footer className="py-4 px-4 text-center text-xs text-muted-foreground">
        <a 
          href="https://beznproject.web.id" 
          target="_blank" 
          rel="noopener noreferrer"
          className="hover:text-primary transition-colors"
        >
          by bezn project
        </a>
      </footer>
    </div>
  );
}
