import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Download } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { MediaItem } from '@/lib/types';

interface MediaViewerProps {
  isOpen: boolean;
  onClose: () => void;
  media: MediaItem[];
  initialIndex?: number;
}

export function MediaViewer({ isOpen, onClose, media, initialIndex = 0 }: MediaViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex, isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      
      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowLeft':
          goToPrevious();
          break;
        case 'ArrowRight':
          goToNext();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentIndex]);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : media.length - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev < media.length - 1 ? prev + 1 : 0));
  };

  const downloadCurrentMedia = () => {
    const currentMedia = media[currentIndex];
    if (!currentMedia) return;

    const timestamp = new Date().toISOString().slice(0, 19).replace(/[:-]/g, '');
    const extension = currentMedia.type === 'image' ? 'jpg' : 'mp4';
    const link = document.createElement('a');
    link.href = currentMedia.data;
    link.download = `selfQ_${timestamp}_${currentMedia.id.slice(-6)}.${extension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!isOpen || media.length === 0) return null;

  const currentMedia = media[currentIndex];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/30 backdrop-blur-lg z-[70] flex items-center justify-center"
        onClick={onClose}
      >
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 z-10 p-4 backdrop-blur-2xl bg-white/10 border-b border-white/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={onClose}
                className="p-2 rounded-full backdrop-blur-xl bg-white/20 hover:bg-white/30 transition-colors border border-white/20"
              >
                <X className="w-5 h-5 text-white" />
              </button>
              <span className="text-white text-sm font-medium">
                {currentIndex + 1} / {media.length}
              </span>
            </div>
            <button
              onClick={downloadCurrentMedia}
              className="p-2 rounded-full backdrop-blur-xl bg-white/20 hover:bg-white/30 transition-colors border border-white/20"
            >
              <Download className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        {/* Navigation Arrows */}
        {media.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                goToPrevious();
              }}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full backdrop-blur-xl bg-white/20 hover:bg-white/30 transition-colors z-10 border border-white/20"
            >
              <ChevronLeft className="w-6 h-6 text-white" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                goToNext();
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full backdrop-blur-xl bg-white/20 hover:bg-white/30 transition-colors z-10 border border-white/20"
            >
              <ChevronRight className="w-6 h-6 text-white" />
            </button>
          </>
        )}

        {/* Media Content */}
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.2 }}
          className="max-w-[90vw] max-h-[90vh] flex items-center justify-center"
          onClick={(e) => e.stopPropagation()}
        >
          {currentMedia.type === 'image' ? (
            <img
              src={currentMedia.data}
              alt={`Media ${currentIndex + 1}`}
              className="max-w-full max-h-full object-contain"
            />
          ) : (
            <video
              src={currentMedia.data}
              controls
              autoPlay
              className="max-w-full max-h-full"
            />
          )}
        </motion.div>

        {/* Thumbnail Navigation */}
        {media.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 p-2 backdrop-blur-2xl bg-white/20 rounded-3xl border border-white/20">
            {media.map((item, index) => (
              <button
                key={item.id}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentIndex(index);
                }}
                className={cn(
                  'w-12 h-12 rounded-lg overflow-hidden border-2 transition-all',
                  index === currentIndex ? 'border-white' : 'border-transparent opacity-60 hover:opacity-80'
                )}
              >
                {item.type === 'image' ? (
                  <img
                    src={item.data}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <video
                    src={item.data}
                    className="w-full h-full object-cover"
                    muted
                  />
                )}
              </button>
            ))}
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}