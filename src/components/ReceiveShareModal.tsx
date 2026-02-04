import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, FileJson, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { importSharedPost } from '@/lib/db';
import { toast } from 'sonner';

interface ReceiveShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function ReceiveShareModal({ isOpen, onClose, onSuccess }: ReceiveShareModalProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.name.endsWith('.json') && file.type !== 'application/json') {
      toast.error('Hanya file JSON yang diperbolehkan');
      return;
    }

    setIsLoading(true);
    try {
      const text = await file.text();
      
      // Validate and import with signature check
      await importSharedPost(text);
      
      toast.success('Post berhasil diterima dan ditambahkan ke timeline!');
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Import failed:', error);
      if (error instanceof Error) {
        if (error.message.includes('Invalid selfX shared post')) {
          toast.error('File bukan kiriman selfX yang valid');
        } else if (error.message.includes('Invalid shared post format')) {
          toast.error('Format file tidak valid');
        } else if (error.message.includes('atob')) {
          toast.error('File rusak atau tidak dapat dibaca');
        } else {
          toast.error('Gagal mengimpor post: ' + error.message);
        }
      } else {
        toast.error('Gagal mengimpor post');
      }
    } finally {
      setIsLoading(false);
      e.target.value = '';
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-foreground/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-card rounded-2xl shadow-xl max-w-md w-full overflow-hidden border border-border/50">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-border">
                <h2 className="font-semibold">Terima Kiriman</h2>
                <button
                  onClick={onClose}
                  className="p-2 rounded-full hover:bg-secondary transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="text-center mb-6">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-success/20 to-success/10 mx-auto mb-4 flex items-center justify-center">
                    <Download className="w-10 h-10 text-success" />
                  </div>
                  
                  <h3 className="text-lg font-semibold mb-2">Terima Kiriman Post</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Impor post yang dibagikan oleh pengguna selfX lain. File harus berformat JSON terenkripsi dari selfX.
                  </p>
                </div>

                {/* File Drop Zone */}
                <label 
                  className="block w-full p-6 border-2 border-dashed border-border hover:border-success/50 rounded-xl cursor-pointer transition-colors group"
                  onDrop={(e) => {
                    e.preventDefault();
                    const files = Array.from(e.dataTransfer.files);
                    const file = files[0];
                    if (file && (file.type === 'application/json' || file.name.endsWith('.json'))) {
                      handleFileSelect({ target: { files: [file] } } as any);
                    } else {
                      toast.error('Hanya file JSON yang diperbolehkan');
                    }
                  }}
                  onDragOver={(e) => e.preventDefault()}
                  onDragEnter={(e) => e.preventDefault()}
                >
                  <div className="text-center">
                    <FileJson className="w-12 h-12 text-muted-foreground group-hover:text-success mx-auto mb-3 transition-colors" />
                    <p className="font-medium text-foreground mb-1">
                      {isLoading ? 'Mengimpor...' : 'Klik untuk pilih file'}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      atau drag & drop file JSON di sini
                    </p>
                  </div>
                  <input
                    type="file"
                    accept=".json,application/json"
                    onChange={handleFileSelect}
                    className="hidden"
                    disabled={isLoading}
                  />
                </label>

                {/* Info */}
                <div className="mt-4 p-3 bg-secondary/30 rounded-lg">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs font-medium text-foreground">Keamanan Terjamin</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Hanya file dari selfX yang valid yang dapat diimpor
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
