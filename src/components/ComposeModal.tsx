import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Layers, Grid3X3 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { MultiMediaPicker } from '@/components/MultiMediaPicker';
import type { Post, MediaItem } from '@/lib/types';

const MAX_CHARS = 1000;

interface ComposeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (content: string, media?: MediaItem[], title?: string, postOption?: 'combined' | 'separate') => Promise<void>;
  editPost?: Post | null;
}

export function ComposeModal({ isOpen, onClose, onSubmit, editPost }: ComposeModalProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [postOption, setPostOption] = useState<'combined' | 'separate'>('combined');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const charCount = content.length;
  const isOverLimit = charCount > MAX_CHARS;
  const isEmpty = content.trim().length === 0 && media.length === 0;
  const isValid = !isEmpty && !isOverLimit;
  const hasMultipleMedia = media.length > 1;

  useEffect(() => {
    if (isOpen && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && editPost) {
      setTitle(editPost.title || '');
      setContent(editPost.content);
      
      // Handle legacy media format
      const legacyMedia: MediaItem[] = [];
      if (editPost.image) {
        legacyMedia.push({
          id: 'legacy-image',
          data: editPost.image,
          type: 'image',
          dimension: editPost.imageDimension
        });
      }
      if (editPost.video) {
        legacyMedia.push({
          id: 'legacy-video',
          data: editPost.video,
          type: 'video'
        });
      }
      
      setMedia(editPost.media || legacyMedia);
    } else if (!isOpen) {
      setTitle('');
      setContent('');
      setMedia([]);
    }
  }, [isOpen, editPost]);

  const handleSubmit = async () => {
    if (!isValid || isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      await onSubmit(
        content.trim(), 
        media.length > 0 ? media : undefined,
        title.trim() || undefined,
        hasMultipleMedia ? postOption : 'combined'
      );
      setTitle('');
      setContent('');
      setMedia([]);
      setPostOption('combined');
      onClose();
    } catch (error) {
      console.error('Failed to post:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Enter to submit, Shift+Enter for newline
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const getCharCountColor = () => {
    if (isOverLimit) return 'danger';
    if (charCount >= MAX_CHARS - 20) return 'warning';
    return '';
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
            className="fixed inset-0 bg-black/20 backdrop-blur-md z-90"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: '100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-x-0 bottom-20 md:bottom-0 z-50 backdrop-blur-2xl bg-white/70 dark:bg-gray-900/70 border-t border-white/20 rounded-t-3xl safe-bottom max-h-[80vh] md:max-h-[90vh] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <button
                onClick={onClose}
                className="p-2 -ml-2 rounded-full hover:bg-secondary transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              
              <h2 className="font-semibold">{editPost ? 'Edit Post' : 'Tulis Post'}</h2>
              
              <Button
                onClick={handleSubmit}
                disabled={!isValid || isSubmitting}
                size="sm"
                className="rounded-full px-4"
              >
                {isSubmitting ? (
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-1" />
                    Post
                  </>
                )}
              </Button>
            </div>

            {/* Content */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Judul (opsional)"
                className={cn(
                  'w-full bg-transparent border-b border-border/50 pb-2 mb-2',
                  'text-lg font-semibold placeholder:text-muted-foreground',
                  'focus:outline-none focus:border-primary'
                )}
              />
              <textarea
                ref={textareaRef}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Apa yang sedang kamu pikirkan? (Enter untuk post, Shift+Enter untuk baris baru)"
                className={cn(
                  'w-full min-h-[120px] resize-none bg-transparent',
                  'text-base placeholder:text-muted-foreground',
                  'focus:outline-none'
                )}
              />
              
              <MultiMediaPicker 
                media={media}
                onMediaChange={setMedia} 
              />
              
              {/* Post Options */}
              {hasMultipleMedia && (
                <div className="space-y-3">
                  <p className="text-sm font-medium text-foreground">Opsi Posting:</p>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setPostOption('combined')}
                      className={cn(
                        'p-3 rounded-xl border-2 transition-all text-left',
                        postOption === 'combined' 
                          ? 'border-primary bg-primary/5' 
                          : 'border-border hover:border-primary/50'
                      )}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <Grid3X3 className="w-4 h-4 text-primary" />
                        <span className="text-sm font-medium">Gabung</span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Semua media dalam 1 post
                      </p>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPostOption('separate')}
                      className={cn(
                        'p-3 rounded-xl border-2 transition-all text-left',
                        postOption === 'separate' 
                          ? 'border-primary bg-primary/5' 
                          : 'border-border hover:border-primary/50'
                      )}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <Layers className="w-4 h-4 text-primary" />
                        <span className="text-sm font-medium">Terpisah</span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Setiap media jadi post sendiri
                      </p>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between p-4 border-t border-border">
              <p className="text-sm text-muted-foreground">
                <kbd className="px-1.5 py-0.5 bg-secondary rounded text-xs">Enter</kbd> post •
                <kbd className="px-1.5 py-0.5 bg-secondary rounded text-xs ml-1">Shift+Enter</kbd> baris baru
              </p>
              
              <div className="flex items-center gap-3">
                <span className={cn('char-counter', getCharCountColor())}>
                  {charCount}/{MAX_CHARS}
                </span>
                
                {/* Progress ring */}
                <div className="relative w-6 h-6">
                  <svg className="w-6 h-6 -rotate-90">
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      fill="none"
                      stroke="hsl(var(--border))"
                      strokeWidth="2"
                    />
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      fill="none"
                      stroke={isOverLimit ? 'hsl(var(--destructive))' : 'hsl(var(--primary))'}
                      strokeWidth="2"
                      strokeDasharray={`${Math.min((charCount / MAX_CHARS) * 62.8, 62.8)} 62.8`}
                      className="transition-all duration-200"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
