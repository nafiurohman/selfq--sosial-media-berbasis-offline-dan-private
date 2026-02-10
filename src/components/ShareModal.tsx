import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, Share2, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { sharePost } from '@/lib/db';
import type { Post } from '@/lib/types';
import { toast } from '@/lib/toast';
import { downloadFile } from '@/lib/mobile-download';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  post: Post;
}

export function ShareModal({ isOpen, onClose, post }: ShareModalProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [shareData, setShareData] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleGenerateShare = async () => {
    setIsGenerating(true);
    try {
      const encryptedData = await sharePost(post.id);
      setShareData(encryptedData);
    } catch (error) {
      console.error('Failed to generate share:', error);
      toast.error('Gagal membuat data share');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = async () => {
    if (!shareData) return;

    try {
      const filename = `selfq-shared-post-${new Date().toISOString().split('T')[0]}.json`;
      await downloadFile(shareData, filename, 'application/json');
      toast.success('File berhasil didownload');
    } catch (error) {
      console.error('Download failed:', error);
      toast.error('Gagal mendownload file');
    }
  };

  const handleCopyData = async () => {
    if (!shareData) return;

    try {
      await navigator.clipboard.writeText(shareData);
      setCopied(true);
      toast.success('Data berhasil disalin');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('Gagal menyalin data');
    }
  };

  const handleClose = () => {
    setShareData(null);
    setCopied(false);
    onClose();
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
            onClick={handleClose}
            className="fixed inset-0 bg-foreground/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-x-4 top-1/2 -translate-y-1/2 z-50 bg-card rounded-2xl shadow-xl max-w-md mx-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div className="flex items-center gap-2">
                <Share2 className="w-5 h-5 text-primary" />
                <h2 className="font-semibold">Bagikan Post</h2>
              </div>
              <button
                onClick={handleClose}
                className="p-2 -mr-2 rounded-full hover:bg-secondary transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-4 space-y-4">
              {/* Post Preview */}
              <div className="p-3 rounded-xl bg-secondary/50 border border-border/50">
                {post.title && (
                  <h3 className="font-semibold text-sm mb-1">{post.title}</h3>
                )}
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {post.content}
                </p>
              </div>

              {!shareData ? (
                <div className="text-center py-4">
                  <p className="text-sm text-muted-foreground mb-4">
                    Generate file terenkripsi untuk dibagikan
                  </p>
                  <Button
                    onClick={handleGenerateShare}
                    disabled={isGenerating}
                    className="w-full"
                  >
                    {isGenerating ? (
                      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                    ) : (
                      <Share2 className="w-4 h-4 mr-2" />
                    )}
                    {isGenerating ? 'Generating...' : 'Generate Share'}
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Data terenkripsi siap dibagikan:
                  </p>
                  
                  <div className="flex gap-2">
                    <Button
                      onClick={handleDownload}
                      className="flex-1"
                      variant="default"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download JSON
                    </Button>
                    
                    <Button
                      onClick={handleCopyData}
                      variant="outline"
                      className="flex-1"
                    >
                      {copied ? (
                        <Check className="w-4 h-4 mr-2 text-success" />
                      ) : (
                        <Copy className="w-4 h-4 mr-2" />
                      )}
                      {copied ? 'Tersalin' : 'Salin Data'}
                    </Button>
                  </div>

                  <div className="text-xs text-muted-foreground bg-secondary/30 p-3 rounded-lg">
                    <p className="font-medium mb-1">💡 Cara berbagi:</p>
                    <p>1. Download file JSON atau salin data</p>
                    <p>2. Kirim ke teman melalui chat/email</p>
                    <p>3. Teman dapat import di selfQ mereka</p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}