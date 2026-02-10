import { downloadFile } from '@/lib/mobile-download';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Download,
  Upload,
  Sun,
  Moon,
  Trash2,
  FileJson,
  AlertTriangle,
  BarChart3,
  Heart,
  Flame,
  FileText,
  Copy,
  Wallet,
  Shield,
  HelpCircle,
  ExternalLink,
  Coffee,
  Check,
  BookOpen,
  Calendar,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { CustomDialog } from '@/components/ui/custom-dialog';
import { Navigation } from '@/components/Navigation';
import { getTheme, setTheme as saveTheme } from '@/lib/storage';
import { exportAllData, importAllData, clearAllData, getAllPosts } from '@/lib/db';
import type { ExportData } from '@/lib/types';
import { calculateStats, calculateStoryStats, type Stats } from '@/lib/stats';
import { toast } from '@/lib/toast';

import { SEO } from '@/components/SEO';

export default function Settings() {
  const navigate = useNavigate();
  const [theme, setTheme] = useState<'light' | 'dark'>(getTheme());
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [showClearDialog, setShowClearDialog] = useState(false);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [importDataString, setImportDataString] = useState<string | null>(null);
  const [importInfo, setImportInfo] = useState<{ postCount: number; userName: string } | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast.success('Nomor rekening berhasil disalin!');
    } catch (err) {
      console.error('Failed to copy: ', err);
      toast.error('Gagal menyalin nomor rekening');
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const posts = await getAllPosts();
      const calculatedStats = calculateStats(posts);
      const storyStats = calculateStoryStats();
      setStats({
        ...calculatedStats,
        ...storyStats
      });
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  const handleThemeToggle = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    saveTheme(newTheme);
    // Force re-render to ensure UI updates
    setTimeout(() => {
      setTheme(getTheme());
    }, 100);
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const encryptedData = await exportAllData();
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
      const filename = `selfq-backup-${timestamp}.json`;
      
      await downloadFile(encryptedData, filename, 'application/json');
      toast.success('Data berhasil diekspor (terenkripsi)');
    } catch (error) {
      console.error('Export failed:', error);
      toast.error('Gagal mengekspor data');
    } finally {
      setIsExporting(false);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    try {
      const text = await file.text();
      
      // Try to decrypt and validate
      const { decryptData } = await import('@/lib/crypto');
      const data = await decryptData<ExportData>(text);

      // Validate structure
      if (!data.version || !data.user || !Array.isArray(data.posts)) {
        throw new Error('Invalid file format');
      }

      setImportDataString(text);
      setImportInfo({
        postCount: data.posts.length,
        userName: data.user.name,
      });
      setShowImportDialog(true);
    } catch (error) {
      console.error('Import validation failed:', error);
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      if (errorMsg.includes('Invalid selfQ backup')) {
        toast.error('File bukan backup selfQ yang valid. Pastikan file berasal dari export selfQ.');
      } else {
        toast.error('File tidak valid atau rusak. Pastikan ini adalah backup selfQ yang benar.');
      }
    } finally {
      setIsImporting(false);
      e.target.value = '';
    }
  };

  const confirmImport = async () => {
    if (!importDataString) return;

    setIsImporting(true);
    try {
      await importAllData(importDataString);
      toast.success('Data berhasil diimpor');
      window.location.href = '/feed';
    } catch (error) {
      console.error('Import failed:', error);
      toast.error('Gagal mengimpor data');
    } finally {
      setIsImporting(false);
      setShowImportDialog(false);
      setImportDataString(null);
      setImportInfo(null);
    }
  };

  const handleClearAll = async () => {
    try {
      await clearAllData();
      toast.success('Semua data berhasil dihapus');
      window.location.href = '/';
    } catch (error) {
      console.error('Clear failed:', error);
      toast.error('Gagal menghapus data');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="Pengaturan - selfQ"
        description="Pengaturan aplikasi selfQ - platform sosial media pribadi offline"
        keywords="pengaturan selfq, settings, konfigurasi aplikasi"
      />
      
      {/* Navigation */}
      <Navigation />

      {/* Main Content */}
      <div className="main-with-sidebar">
        {/* Content */}
        <main className="container px-4 md:px-6 py-6 space-y-6 pb-24 md:pb-6">
          {/* Statistics */}
          <motion.section
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-sm font-medium text-muted-foreground mb-3 px-1 flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Statistik
            </h2>
            <div className="grid grid-cols-2 gap-3">
              <div className="modern-card rounded-xl p-4">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <FileText className="w-4 h-4" />
                  <span className="text-xs">Total Post</span>
                </div>
                <p className="text-2xl font-bold">{stats?.totalPosts ?? '-'}</p>
              </div>
              <div className="modern-card rounded-xl p-4">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <Heart className="w-4 h-4 text-like" />
                  <span className="text-xs">Total Like</span>
                </div>
                <p className="text-2xl font-bold">{stats?.totalLikes ?? '-'}</p>
              </div>
              <div className="modern-card rounded-xl p-4">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <Flame className="w-4 h-4 text-warning" />
                  <span className="text-xs">Streak Saat Ini</span>
                </div>
                <p className="text-2xl font-bold">
                  {stats?.currentStreak ?? '-'}
                  <span className="text-sm font-normal text-muted-foreground ml-1">hari</span>
                </p>
              </div>
              <div className="modern-card rounded-xl p-4">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <Flame className="w-4 h-4 text-primary" />
                  <span className="text-xs">Streak Terpanjang</span>
                </div>
                <p className="text-2xl font-bold">
                  {stats?.longestStreak ?? '-'}
                  <span className="text-sm font-normal text-muted-foreground ml-1">hari</span>
                </p>
              </div>
              <div className="modern-card rounded-xl p-4">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <BookOpen className="w-4 h-4 text-purple-600" />
                  <span className="text-xs">Total Cerita</span>
                </div>
                <p className="text-2xl font-bold">{stats?.totalStories ?? '-'}</p>
              </div>
              <div className="modern-card rounded-xl p-4">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <Calendar className="w-4 h-4 text-green-600" />
                  <span className="text-xs">Cerita Hari Ini</span>
                </div>
                <p className="text-2xl font-bold">{stats?.todayStories ?? '-'}</p>
              </div>
            </div>
          </motion.section>

          {/* Appearance */}
          <motion.section
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h2 className="text-sm font-medium text-muted-foreground mb-3 px-1">
              Tampilan
            </h2>
            <div className="settings-item">
              <div className="flex items-center gap-3">
                {theme === 'light' ? (
                  <Sun className="w-5 h-5 text-warning" />
                ) : (
                  <Moon className="w-5 h-5 text-primary" />
                )}
                <div>
                  <p className="font-medium">Mode Gelap</p>
                  <p className="text-sm text-muted-foreground">
                    {theme === 'dark' ? 'Aktif' : 'Nonaktif'}
                  </p>
                </div>
              </div>
              <Switch
                checked={theme === 'dark'}
                onCheckedChange={handleThemeToggle}
              />
            </div>
          </motion.section>

          {/* Help & Support */}
          <motion.section
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-sm font-medium text-muted-foreground mb-3 px-1 flex items-center gap-2">
              <HelpCircle className="w-4 h-4" />
              Bantuan & Dukungan
            </h2>
            <div className="space-y-3">
              <button
                onClick={() => window.location.href = '/help'}
                className="settings-item w-full text-left"
              >
                <div className="flex items-center gap-3">
                  <HelpCircle className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-medium">Pusat Bantuan</p>
                    <p className="text-sm text-muted-foreground">
                      Tutorial lengkap dan panduan menggunakan selfQ
                    </p>
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-muted-foreground" />
              </button>
              
              <button
                onClick={() => window.location.href = '/about'}
                className="settings-item w-full text-left"
              >
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="font-medium">Tentang selfQ</p>
                    <p className="text-sm text-muted-foreground">
                      Informasi aplikasi, developer, dan teknologi
                    </p>
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-muted-foreground" />
              </button>
              
              <button
                onClick={() => window.location.href = '/terms'}
                className="settings-item w-full text-left"
              >
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="font-medium">Syarat & Ketentuan</p>
                    <p className="text-sm text-muted-foreground">
                      Syarat ketentuan penggunaan aplikasi
                    </p>
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-muted-foreground" />
              </button>
              
              <button
                onClick={() => window.location.href = '/privacy'}
                className="settings-item w-full text-left"
              >
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="font-medium">Kebijakan Privasi</p>
                    <p className="text-sm text-muted-foreground">
                      Kebijakan privasi dan keamanan data
                    </p>
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
          </motion.section>
          <motion.section
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <h2 className="text-sm font-medium text-muted-foreground mb-3 px-1 flex items-center gap-2">
              <Coffee className="w-4 h-4" />
              Dukung Developer
            </h2>
            <div className="modern-card rounded-xl p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500/20 to-yellow-500/20 flex items-center justify-center">
                  <Coffee className="w-5 h-5 text-orange-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">Belikan Developer Kopi ☕</p>
                  <p className="text-sm text-muted-foreground">
                    selfQ gratis selamanya! Dukung pengembangan dengan donasi
                  </p>
                </div>
              </div>
              <div className="bg-secondary/30 rounded-lg p-3 border border-border/30">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-muted-foreground">Bank Jago</span>
                  <span className="text-xs text-muted-foreground">a.n M. Nafiurohman</span>
                </div>
                <div className="flex items-center gap-2">
                  <code className="flex-1 px-2 py-1.5 bg-background rounded text-sm font-mono font-semibold">
                    507938016692
                  </code>
                  <button
                    onClick={() => copyToClipboard('507938016692')}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-500 hover:bg-orange-600 text-white rounded text-sm transition-colors"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3 h-3" />
                        <span>Tersalin!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Salin</span>
                      </>
                    )}
                  </button>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  💝 Terima kasih atas dukungannya!
                </p>
              </div>
            </div>
          </motion.section>

          {/* Donation Section */}
          <motion.section
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
          >
            <h2 className="text-sm font-medium text-muted-foreground mb-3 px-1">
              Data
            </h2>
            <div className="space-y-3">
              <button
                onClick={handleExport}
                disabled={isExporting}
                className="settings-item w-full text-left"
              >
                <div className="flex items-center gap-3">
                  <Download className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-medium">Ekspor Data</p>
                    <p className="text-sm text-muted-foreground">
                      Download backup terenkripsi dalam format JSON
                    </p>
                  </div>
                </div>
                {isExporting && (
                  <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                )}
              </button>

              <label className="settings-item w-full text-left cursor-pointer">
                <div className="flex items-center gap-3">
                  <Upload className="w-5 h-5 text-success" />
                  <div>
                    <p className="font-medium">Impor Data</p>
                    <p className="text-sm text-muted-foreground">
                      Restore dari file backup JSON terenkripsi
                    </p>
                  </div>
                </div>
                <input
                  type="file"
                  accept=".json,.zip,application/json,application/zip"
                  onChange={handleFileSelect}
                  className="hidden"
                  disabled={isImporting}
                />
                {isImporting && (
                  <div className="w-5 h-5 border-2 border-success border-t-transparent rounded-full animate-spin" />
                )}
              </label>
            </div>
          </motion.section>

          {/* Danger Zone */}
          <motion.section
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
          >
            <h2 className="text-sm font-medium text-destructive mb-3 px-1">
              Zona Bahaya
            </h2>
            <button
              onClick={() => setShowClearDialog(true)}
              className="settings-item w-full text-left border-destructive/50"
            >
              <div className="flex items-center gap-3">
                <Trash2 className="w-5 h-5 text-destructive" />
                <div>
                  <p className="font-medium text-destructive">Hapus Semua Data</p>
                  <p className="text-sm text-muted-foreground">
                    Menghapus semua post dan pengaturan secara permanen
                  </p>
                </div>
              </div>
            </button>
          </motion.section>
        </main>
      </div>

      {/* Import Confirmation Dialog */}
      <CustomDialog
        isOpen={showImportDialog}
        onClose={() => {
          setShowImportDialog(false);
          setImportDataString(null);
          setImportInfo(null);
        }}
        onConfirm={confirmImport}
        title="Impor Data?"
        description={`File backup berisi ${importInfo?.postCount || 0} post dari "${importInfo?.userName}". Data saat ini akan diganti dengan data dari backup ini.`}
        type="confirm"
        confirmText="Impor Data"
        isLoading={isImporting}
      />

      {/* Clear All Dialog */}
      <CustomDialog
        isOpen={showClearDialog}
        onClose={() => setShowClearDialog(false)}
        onConfirm={handleClearAll}
        title="Hapus Semua Data?"
        description="Tindakan ini tidak dapat dibatalkan. Semua post dan pengaturan akan dihapus secara permanen dari perangkat ini."
        type="danger"
        confirmText="Hapus Semua"
      />
    </div>
  );
}