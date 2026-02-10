import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, FileText, AlertCircle, CheckCircle, Shield } from 'lucide-react';
import { toast } from '@/lib/toast';
import { cn } from '@/lib/utils';
import { decryptStoryData, validateEncryptedStory } from '@/lib/storyEncryption';

interface ReceiveStoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const SELFX_SIGNATURE = 'selfQ-story-v1.0';

export function ReceiveStoryModal({ isOpen, onClose, onSuccess }: ReceiveStoryModalProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDecrypting, setIsDecrypting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateStoryData = (data: any): data is StoryData => {
    if (!data || typeof data !== 'object') return false;
    
    // Check signature first
    if (data.signature !== SELFX_SIGNATURE) {
      throw new Error('File bukan dari selfQ atau versi tidak kompatibel');
    }

    // Validate required fields
    const requiredFields = ['id', 'title', 'content', 'category', 'createdAt', 'sharedFrom'];
    for (const field of requiredFields) {
      if (!data[field]) {
        throw new Error(`Data tidak valid: field ${field} tidak ditemukan`);
      }
    }

    // Validate sharedFrom structure
    if (!data.sharedFrom.name || !data.sharedFrom.sharedAt) {
      throw new Error('Data sharing tidak valid');
    }

    return true;
  };

  const processFile = async (file: File) => {
    setIsProcessing(true);
    setIsDecrypting(false);
    setError(null);

    try {
      // Validate file type
      if (file.type !== 'application/json' && !file.name.endsWith('.json')) {
        throw new Error('Hanya file JSON yang diperbolehkan');
      }

      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        throw new Error('File terlalu besar (maksimal 10MB)');
      }

      const text = await file.text();
      
      // Validate JSON format
      let jsonData;
      try {
        jsonData = JSON.parse(text);
      } catch {
        throw new Error('File JSON tidak valid');
      }

      // Check if it's encrypted or legacy format
      const isEncrypted = validateEncryptedStory(text);
      let storyData;

      if (isEncrypted) {
        // Handle encrypted story
        setIsDecrypting(true);
        try {
          storyData = await decryptStoryData(text);
        } catch (decryptError) {
          throw new Error(`Gagal mendekripsi: ${decryptError instanceof Error ? decryptError.message : 'Unknown error'}`);
        }
      } else {
        // Handle legacy unencrypted format
        if (jsonData.signature !== SELFX_SIGNATURE) {
          throw new Error('File bukan dari selfQ atau versi tidak kompatibel');
        }
        storyData = jsonData;
      }

      // Validate story data structure
      const requiredFields = ['title', 'content', 'category', 'createdAt'];
      for (const field of requiredFields) {
        if (!storyData[field]) {
          throw new Error(`Data tidak valid: field ${field} tidak ditemukan`);
        }
      }

      // Save to localStorage
      const storyId = `story-shared-${Date.now()}`;
      const finalStoryData = {
        ...storyData,
        id: storyId,
        sharedFrom: storyData.sharedFrom || {
          name: 'Unknown',
          sharedAt: new Date().toISOString()
        }
      };

      localStorage.setItem(storyId, JSON.stringify(finalStoryData));

      toast.success(`Cerita "${storyData.title}" berhasil diterima${isEncrypted ? ' dan didekripsi' : ''}`);
      onSuccess();
      onClose();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Gagal memproses file';
      setError(message);
      toast.error(message);
    } finally {
      setIsProcessing(false);
      setIsDecrypting(false);
    }
  };

  const handleFileSelect = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    processFile(files[0]);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
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
          <h2 className="text-xl font-semibold">Terima Cerita</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Upload Area */}
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={cn(
              'border-2 border-dashed rounded-2xl p-8 text-center transition-all cursor-pointer',
              isDragOver
                ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                : 'border-gray-300 dark:border-gray-600 hover:border-purple-400'
            )}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".json,application/json"
              onChange={(e) => handleFileSelect(e.target.files)}
              className="hidden"
            />

            {isProcessing ? (
              <div className="space-y-3">
                <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {isDecrypting ? 'Mendekripsi cerita...' : 'Memproses cerita...'}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <Upload className="w-12 h-12 text-gray-400 mx-auto" />
                <div>
                  <p className="font-medium mb-1">
                    Drop file JSON di sini atau klik untuk pilih
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Hanya file JSON dari selfQ yang diterima
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Error Message */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mt-4 p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
              >
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-500" />
                  <p className="text-sm text-red-700 dark:text-red-400">
                    {error}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Security Info */}
          <div className="mt-6 p-4 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
            <div className="flex items-start gap-2">
              <Shield className="w-4 h-4 text-green-500 mt-0.5" />
              <div className="text-sm text-green-700 dark:text-green-400">
                <p className="font-medium mb-1">Mendukung Enkripsi:</p>
                <ul className="space-y-1 text-xs">
                  <li>• File terenkripsi AES-256 (v2.0)</li>
                  <li>• File legacy tidak terenkripsi (v1.0)</li>
                  <li>• Validasi signature otomatis</li>
                  <li>• Dekripsi multi-layer aman</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Info */}
          <div className="mt-4 p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
            <div className="flex items-start gap-2">
              <FileText className="w-4 h-4 text-blue-500 mt-0.5" />
              <div className="text-sm text-blue-700 dark:text-blue-400">
                <p className="font-medium mb-1">Persyaratan file:</p>
                <ul className="space-y-1 text-xs">
                  <li>• Format: JSON (.json)</li>
                  <li>• Maksimal: 10MB</li>
                  <li>• Dari selfQ dengan signature valid</li>
                  <li>• Mendukung format lama dan terenkripsi</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}