import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Download, Copy, Share2, CheckCircle, Shield } from 'lucide-react';
import { toast } from 'sonner';
import { getUser } from '@/lib/storage';
import { encryptStoryData } from '@/lib/storyEncryption';

interface ShareStoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  story: {
    id: string;
    title: string;
    content: string;
    synopsis?: string;
    category: string;
    wordCount: number;
    characterCount: number;
    createdAt: string;
    updatedAt: string;
    isDraft: boolean;
    views: number;
    likes: number;
  };
}

export function ShareStoryModal({ isOpen, onClose, story }: ShareStoryModalProps) {
  const [copied, setCopied] = useState(false);
  const [isEncrypting, setIsEncrypting] = useState(false);
  const user = getUser();

  const generateShareData = async () => {
    const shareData = {
      ...story,
      sharedFrom: {
        name: user?.name || 'Anonim',
        sharedAt: new Date().toISOString()
      }
    };

    // Encrypt the story data
    return await encryptStoryData(shareData);
  };

  const handleDownload = async () => {
    setIsEncrypting(true);
    try {
      const data = await generateShareData();
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `selfX-story-encrypted-${story.title.replace(/[^a-zA-Z0-9]/g, '-')}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success('File cerita terenkripsi berhasil diunduh');
    } catch (error) {
      toast.error('Gagal mengenkripsi cerita');
    } finally {
      setIsEncrypting(false);
    }
  };

  const handleCopy = async () => {
    setIsEncrypting(true);
    try {
      const data = await generateShareData();
      await navigator.clipboard.writeText(data);
      setCopied(true);
      toast.success('Data cerita terenkripsi berhasil disalin');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('Gagal mengenkripsi atau menyalin data');
    } finally {
      setIsEncrypting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="glass-card w-full max-w-md"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/20">
          <div className="flex items-center gap-3">
            <Share2 className="w-5 h-5 text-purple-500" />
            <h2 className="text-xl font-semibold">Bagikan Cerita</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Story Info */}
          <div className="mb-6 p-4 rounded-xl bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800">
            <h3 className="font-semibold text-purple-900 dark:text-purple-100 mb-1">
              {story.title}
            </h3>
            <p className="text-sm text-purple-700 dark:text-purple-300">
              {story.wordCount.toLocaleString()} kata • {story.category}
            </p>
            {story.synopsis && (
              <p className="text-sm text-purple-600 dark:text-purple-400 mt-2 line-clamp-2">
                {story.synopsis}
              </p>
            )}
          </div>

          {/* Share Options */}
          <div className="space-y-3">
            <button
              onClick={handleDownload}
              disabled={isEncrypting}
              className="w-full glass-button bg-gradient-to-r from-purple-500 to-pink-500 text-white justify-center disabled:opacity-50"
            >
              {isEncrypting ? (
                <>
                  <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                  Mengenkripsi...
                </>
              ) : (
                <>
                  <Download className="w-5 h-5 mr-2" />
                  Download Terenkripsi
                </>
              )}
            </button>

            <button
              onClick={handleCopy}
              disabled={isEncrypting}
              className="w-full glass-button border border-gray-300 dark:border-gray-600 justify-center disabled:opacity-50"
            >
              {isEncrypting ? (
                <>
                  <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                  Mengenkripsi...
                </>
              ) : copied ? (
                <>
                  <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
                  Tersalin!
                </>
              ) : (
                <>
                  <Copy className="w-5 h-5 mr-2" />
                  Salin Data Terenkripsi
                </>
              )}
            </button>
          </div>

          {/* Security Info */}
          <div className="mt-6 p-4 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
            <div className="flex items-start gap-2">
              <Shield className="w-4 h-4 text-green-500 mt-0.5" />
              <div className="text-sm text-green-700 dark:text-green-400">
                <p className="font-medium mb-1">Keamanan Tingkat Tinggi:</p>
                <ul className="space-y-1 text-xs">
                  <li>• Enkripsi AES-256-GCM dengan 3 layer</li>
                  <li>• Salt berlapis untuk setiap layer</li>
                  <li>• Signature selfX khusus untuk validasi</li>
                  <li>• 100,000 iterasi PBKDF2 per layer</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Info */}
          <div className="mt-4 p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
            <p className="text-sm text-blue-700 dark:text-blue-400">
              <span className="font-medium">Catatan:</span> File JSON terenkripsi ini hanya dapat dibuka 
              dengan selfX versi terbaru. Penerima dapat mengimpor menggunakan fitur "Terima Cerita".
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}