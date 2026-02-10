import { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ImagePlus, Film, X, RectangleHorizontal, Square, Maximize } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from '@/lib/toast';
import { Button } from '@/components/ui/button';

interface MediaPickerProps {
  image: string | null;
  video: string | null;
  imageDimension?: '4:5' | '1:1' | 'original';
  onMediaChange: (media: { image?: string | null; video?: string | null; imageDimension?: '4:5' | '1:1' | 'original' }) => void;
  className?: string;
}

const MAX_IMAGE_SIZE = 3 * 1024 * 1024; // 3MB
const MAX_VIDEO_SIZE = 5 * 1024 * 1024; // 5MB

export function MediaPicker({ image, video, imageDimension, onMediaChange, className }: MediaPickerProps) {
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const [pendingImage, setPendingImage] = useState<string | null>(null);
  const [showDimensionPicker, setShowDimensionPicker] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('File harus berupa gambar');
      return;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      toast.error('Ukuran gambar maksimal 3MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      setPendingImage(base64);
      setShowDimensionPicker(true);
    };
    reader.onerror = () => {
      toast.error('Gagal membaca gambar');
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleDimensionSelect = async (dimension: '4:5' | '1:1' | 'original') => {
    if (pendingImage && !isProcessing) {
      setIsProcessing(true);
      try {
        if (dimension === 'original') {
          // Use original image without cropping
          onMediaChange({ image: pendingImage, video: null, imageDimension: dimension });
        } else {
          // Crop image to selected dimension
          const croppedImage = await cropImage(pendingImage, dimension);
          onMediaChange({ image: croppedImage, video: null, imageDimension: dimension });
        }
        setPendingImage(null);
        setShowDimensionPicker(false);
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const cropImage = (base64: string, dimension: '4:5' | '1:1'): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d')!;
        
        let targetWidth: number;
        let targetHeight: number;
        let sx = 0;
        let sy = 0;
        let sWidth = img.width;
        let sHeight = img.height;

        if (dimension === '1:1') {
          const size = Math.min(img.width, img.height);
          sx = (img.width - size) / 2;
          sy = (img.height - size) / 2;
          sWidth = size;
          sHeight = size;
          targetWidth = Math.min(800, size);
          targetHeight = targetWidth;
        } else {
          // 4:5 ratio
          const aspectRatio = 4 / 5;
          if (img.width / img.height > aspectRatio) {
            sHeight = img.height;
            sWidth = img.height * aspectRatio;
            sx = (img.width - sWidth) / 2;
          } else {
            sWidth = img.width;
            sHeight = img.width / aspectRatio;
            sy = (img.height - sHeight) / 2;
          }
          targetHeight = Math.min(1000, sHeight);
          targetWidth = targetHeight * aspectRatio;
        }

        canvas.width = targetWidth;
        canvas.height = targetHeight;
        ctx.drawImage(img, sx, sy, sWidth, sHeight, 0, 0, targetWidth, targetHeight);
        
        resolve(canvas.toDataURL('image/jpeg', 0.85));
      };
      img.src = base64;
    });
  };

  const handleVideoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('video/')) {
      toast.error('File harus berupa video');
      return;
    }

    if (file.size > MAX_VIDEO_SIZE) {
      toast.error('Ukuran video maksimal 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      onMediaChange({ image: null, video: base64 });
    };
    reader.onerror = () => {
      toast.error('Gagal membaca video');
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const clearMedia = () => {
    onMediaChange({ image: null, video: null });
  };

  const hasMedia = image || video;

  return (
    <>
      <div className={cn('flex flex-col gap-2', className)}>
        {image && (
          <div className="relative rounded-xl overflow-hidden">
            <img
              src={image}
              alt="Preview"
              className={cn(
                'w-full object-contain bg-transparent',
                imageDimension === '1:1' ? 'aspect-square' : 
                imageDimension === '4:5' ? 'aspect-[4/5]' : 'max-h-80'
              )}
            />
            <button
              type="button"
              onClick={clearMedia}
              className="absolute top-2 right-2 p-1.5 bg-foreground/80 rounded-full hover:bg-foreground transition-colors"
            >
              <X className="w-4 h-4 text-background" />
            </button>
          </div>
        )}

        {video && (
          <div className="relative rounded-xl overflow-hidden">
            <video
              src={video}
              controls
              className="w-full max-h-64"
            />
            <button
              type="button"
              onClick={clearMedia}
              className="absolute top-2 right-2 p-1.5 bg-foreground/80 rounded-full hover:bg-foreground transition-colors"
            >
              <X className="w-4 h-4 text-background" />
            </button>
          </div>
        )}

        {!hasMedia && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => imageInputRef.current?.click()}
              className={cn(
                'flex items-center gap-2 px-3 py-2 rounded-lg',
                'text-sm text-muted-foreground',
                'hover:bg-secondary transition-colors'
              )}
            >
              <ImagePlus className="w-5 h-5" />
              <span>Gambar</span>
              <span className="text-xs">(3MB)</span>
            </button>
            <button
              type="button"
              onClick={() => videoInputRef.current?.click()}
              className={cn(
                'flex items-center gap-2 px-3 py-2 rounded-lg',
                'text-sm text-muted-foreground',
                'hover:bg-secondary transition-colors'
              )}
            >
              <Film className="w-5 h-5" />
              <span>Video</span>
              <span className="text-xs">(5MB)</span>
            </button>
          </div>
        )}

        <input
          ref={imageInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageSelect}
          className="hidden"
        />
        <input
          ref={videoInputRef}
          type="file"
          accept="video/*"
          onChange={handleVideoSelect}
          className="hidden"
        />
      </div>

      {/* Dimension Picker Modal */}
      <AnimatePresence>
        {showDimensionPicker && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setShowDimensionPicker(false);
                setPendingImage(null);
              }}
              className="fixed inset-0 bg-foreground/60 backdrop-blur-sm z-[60]"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="fixed inset-0 z-[60] flex items-center justify-center p-4"
            >
              <div className="bg-card rounded-2xl shadow-xl max-w-md w-full p-6 border border-border/50">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 mx-auto mb-4 flex items-center justify-center">
                    <ImagePlus className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="font-semibold text-xl mb-2">
                    Pilih Dimensi Gambar
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Pilih bagaimana gambar akan ditampilkan
                  </p>
                </div>

                {pendingImage && (
                  <div className="mb-6">
                    <p className="text-sm font-medium text-foreground mb-3">Preview:</p>
                    <div className="grid grid-cols-3 gap-3">
                      {/* 4:5 Preview */}
                      <div className="text-center">
                        <div className="aspect-[4/5] rounded-xl overflow-hidden bg-secondary/30 border border-border/30 mb-2">
                          <img src={pendingImage} alt="4:5 Preview" className="w-full h-full object-cover" />
                        </div>
                        <span className="text-xs font-medium text-muted-foreground">Portrait</span>
                      </div>
                      
                      {/* 1:1 Preview */}
                      <div className="text-center">
                        <div className="aspect-square rounded-xl overflow-hidden bg-secondary/30 border border-border/30 mb-2">
                          <img src={pendingImage} alt="1:1 Preview" className="w-full h-full object-cover" />
                        </div>
                        <span className="text-xs font-medium text-muted-foreground">Square</span>
                      </div>

                      {/* Original Preview */}
                      <div className="text-center">
                        <div className="h-20 rounded-xl overflow-hidden bg-secondary/30 border border-border/30 mb-2 flex items-center justify-center">
                          <img src={pendingImage} alt="Original Preview" className="max-w-full max-h-full object-contain" />
                        </div>
                        <span className="text-xs font-medium text-muted-foreground">Original</span>
                      </div>
                    </div>
                  </div>
                )}

                <div className="space-y-4">
                  <p className="text-sm font-medium text-foreground">Pilih dimensi:</p>
                  <div className="grid grid-cols-3 gap-3">
                    <button
                      onClick={() => handleDimensionSelect('4:5')}
                      disabled={isProcessing}
                      className={cn(
                        'p-4 rounded-xl border-2 border-border hover:border-primary hover:bg-primary/5',
                        'flex flex-col items-center gap-2 transition-all group disabled:opacity-50 disabled:cursor-not-allowed'
                      )}
                    >
                      {isProcessing ? (
                        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <RectangleHorizontal className="w-8 h-8 rotate-90 text-primary group-hover:scale-110 transition-transform" />
                      )}
                      <div className="text-center">
                        <span className="text-sm font-semibold">4:5</span>
                        <p className="text-xs text-muted-foreground">Portrait</p>
                      </div>
                    </button>
                    <button
                      onClick={() => handleDimensionSelect('1:1')}
                      disabled={isProcessing}
                      className={cn(
                        'p-4 rounded-xl border-2 border-border hover:border-primary hover:bg-primary/5',
                        'flex flex-col items-center gap-2 transition-all group disabled:opacity-50 disabled:cursor-not-allowed'
                      )}
                    >
                      {isProcessing ? (
                        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Square className="w-8 h-8 text-primary group-hover:scale-110 transition-transform" />
                      )}
                      <div className="text-center">
                        <span className="text-sm font-semibold">1:1</span>
                        <p className="text-xs text-muted-foreground">Square</p>
                      </div>
                    </button>
                    <button
                      onClick={() => handleDimensionSelect('original')}
                      disabled={isProcessing}
                      className={cn(
                        'p-4 rounded-xl border-2 border-border hover:border-primary hover:bg-primary/5',
                        'flex flex-col items-center gap-2 transition-all group disabled:opacity-50 disabled:cursor-not-allowed'
                      )}
                    >
                      {isProcessing ? (
                        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Maximize className="w-8 h-8 text-primary group-hover:scale-110 transition-transform" />
                      )}
                      <div className="text-center">
                        <span className="text-sm font-semibold">Asli</span>
                        <p className="text-xs text-muted-foreground">Original</p>
                      </div>
                    </button>
                  </div>
                </div>

                <Button
                  variant="outline"
                  className="w-full mt-4"
                  onClick={() => {
                    setShowDimensionPicker(false);
                    setPendingImage(null);
                  }}
                >
                  Batal
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
