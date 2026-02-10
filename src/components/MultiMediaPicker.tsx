import { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ImagePlus, Film, X, RectangleHorizontal, Square, Maximize, Download, Edit3, MoreHorizontal, Mic, Play, Pause } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from '@/lib/toast';
import { Button } from '@/components/ui/button';
import type { MediaItem } from '@/lib/types';
import { ImageEditor } from '@/components/ImageEditor';
import { AudioRecorder } from '@/components/AudioRecorder';

interface MultiMediaPickerProps {
  media: MediaItem[];
  onMediaChange: (media: MediaItem[]) => void;
  className?: string;
}

const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_VIDEO_SIZE = 20 * 1024 * 1024; // 20MB
const MAX_IMAGE_COUNT = 10;
const MAX_VIDEO_COUNT = 5;

export function MultiMediaPicker({ media, onMediaChange, className }: MultiMediaPickerProps) {
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const [pendingImage, setPendingImage] = useState<string | null>(null);
  const [editingMedia, setEditingMedia] = useState<MediaItem | null>(null);
  const [showDimensionPicker, setShowDimensionPicker] = useState(false);
  const [showImageEditor, setShowImageEditor] = useState(false);
  const [showAudioRecorder, setShowAudioRecorder] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);
  const [audioProgress, setAudioProgress] = useState<Map<string, number>>(new Map());
  const audioRefs = useRef<Map<string, HTMLAudioElement>>(new Map());

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const currentImageCount = media.filter(m => m.type === 'image').length;
    if (currentImageCount + files.length > MAX_IMAGE_COUNT) {
      toast.error(`Maksimal ${MAX_IMAGE_COUNT} gambar`);
      return;
    }

    // Process all files at once
    const processFiles = async () => {
      const newMediaItems: MediaItem[] = [];
      
      for (const file of files) {
        if (!file.type.startsWith('image/')) {
          toast.error('File harus berupa gambar');
          continue;
        }

        if (file.size > MAX_IMAGE_SIZE) {
          toast.error('Ukuran gambar maksimal 10MB');
          continue;
        }

        try {
          const base64 = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (event) => resolve(event.target?.result as string);
            reader.onerror = () => reject(new Error('Failed to read file'));
            reader.readAsDataURL(file);
          });

          // Use original dimension for multi-select
          const newMediaItem: MediaItem = {
            id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
            data: base64,
            type: 'image',
            dimension: 'original'
          };
          
          newMediaItems.push(newMediaItem);
        } catch (error) {
          toast.error('Gagal membaca gambar');
        }
      }
      
      if (newMediaItems.length > 0) {
        onMediaChange([...media, ...newMediaItems]);
      }
    };

    processFiles();
    e.target.value = '';
  };

  const handleDimensionSelect = async (dimension: '4:5' | '1:1' | 'original') => {
    if (isProcessing) return;
    
    setIsProcessing(true);
    try {
      // Check if editing existing media or adding new
      if (editingMedia) {
        // Edit existing media
        let processedImage = editingMedia.data;
        if (dimension !== 'original') {
          processedImage = await cropImage(editingMedia.data, dimension);
        }

        const updatedMedia = media.map(item => 
          item.id === editingMedia.id 
            ? { ...item, data: processedImage, dimension }
            : item
        );
        
        onMediaChange(updatedMedia);
        setEditingMedia(null);
        setShowDimensionPicker(false);
      } else if (pendingImage) {
        // Add new media
        let processedImage = pendingImage;
        if (dimension !== 'original') {
          processedImage = await cropImage(pendingImage, dimension);
        }

        const newMediaItem: MediaItem = {
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          data: processedImage,
          type: 'image',
          dimension
        };

        onMediaChange([...media, newMediaItem]);
        setPendingImage(null);
        setShowDimensionPicker(false);
      }
    } finally {
      setIsProcessing(false);
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

    const currentVideoCount = media.filter(m => m.type === 'video').length;
    if (currentVideoCount >= MAX_VIDEO_COUNT) {
      toast.error(`Maksimal ${MAX_VIDEO_COUNT} video`);
      return;
    }

    if (!file.type.startsWith('video/')) {
      toast.error('File harus berupa video');
      return;
    }

    if (file.size > MAX_VIDEO_SIZE) {
      toast.error('Ukuran video maksimal 20MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      const newMediaItem: MediaItem = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        data: base64,
        type: 'video'
      };
      onMediaChange([...media, newMediaItem]);
    };
    reader.onerror = () => {
      toast.error('Gagal membaca video');
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleEditMedia = (item: MediaItem) => {
    if (item.type === 'image') {
      setEditingMedia(item);
      setShowImageEditor(true);
    }
  };

  const handleSaveEditedImage = (editedImageData: string) => {
    if (editingMedia) {
      const updatedMedia = media.map(item => 
        item.id === editingMedia.id 
          ? { ...item, data: editedImageData }
          : item
      );
      onMediaChange(updatedMedia);
      setEditingMedia(null);
      toast.success('Foto berhasil diedit');
    }
  };

  const handleAudioSave = (audioData: string, duration: number) => {
    // Check if audio already exists
    const hasAudio = media.some(m => m.type === 'audio');
    if (hasAudio) {
      toast.error('Hanya 1 audio per post');
      return;
    }

    const newMediaItem: MediaItem = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      data: audioData,
      type: 'audio',
      duration
    };
    onMediaChange([...media, newMediaItem]);
    toast.success('Audio berhasil ditambahkan');
  };

  const toggleAudioPlayback = (id: string) => {
    const audio = audioRefs.current.get(id);
    if (!audio) return;

    if (playingAudioId === id) {
      audio.pause();
      setPlayingAudioId(null);
    } else {
      // Pause other audios
      audioRefs.current.forEach((a, audioId) => {
        if (audioId !== id) a.pause();
      });
      audio.play();
      setPlayingAudioId(id);
    }
  };

  const handleAudioTimeUpdate = (id: string) => {
    const audio = audioRefs.current.get(id);
    if (audio) {
      const progress = (audio.currentTime / audio.duration) * 100;
      setAudioProgress(prev => new Map(prev).set(id, progress));
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const removeMedia = (id: string) => {
    onMediaChange(media.filter(item => item.id !== id));
  };

  const downloadMedia = (item: MediaItem) => {
    const timestamp = new Date().toISOString().slice(0, 19).replace(/[:-]/g, '');
    const extension = item.type === 'image' ? 'jpg' : 'mp4';
    const link = document.createElement('a');
    link.href = item.data;
    link.download = `selfQ_${timestamp}_${item.id.slice(-6)}.${extension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <div className={cn('flex flex-col gap-3', className)}>
        {/* Media Grid */}
        {media.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {media.map((item) => (
              <div key={item.id} className="rounded-lg overflow-hidden border border-border/30 bg-card">
                {/* Media Preview */}
                <div className="relative aspect-square">
                  {item.type === 'image' ? (
                    <img src={item.data} alt="Media" className="w-full h-full object-cover bg-transparent" />
                  ) : item.type === 'video' ? (
                    <video src={item.data} className="w-full h-full object-cover" muted />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-primary/5 p-3">
                      <Mic className="w-10 h-10 text-primary mb-2" />
                      <p className="text-xs font-medium mb-2">{item.duration ? formatDuration(item.duration) : 'Audio'}</p>
                      <div className="w-full h-1 bg-primary/20 rounded-full overflow-hidden mb-2">
                        <div 
                          className="h-full bg-primary rounded-full transition-all" 
                          style={{ width: `${audioProgress.get(item.id) || 0}%` }}
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => toggleAudioPlayback(item.id)}
                        className="w-10 h-10 rounded-full bg-primary text-white hover:bg-primary/90 active:scale-95 transition-all flex items-center justify-center"
                      >
                        {playingAudioId === item.id ? (
                          <Pause className="w-4 h-4" />
                        ) : (
                          <Play className="w-4 h-4" style={{ marginLeft: '2px' }} />
                        )}
                      </button>
                      <audio
                        ref={(el) => { if (el) audioRefs.current.set(item.id, el); }}
                        src={item.data}
                        onEnded={() => { setPlayingAudioId(null); setAudioProgress(prev => new Map(prev).set(item.id, 0)); }}
                        onTimeUpdate={() => handleAudioTimeUpdate(item.id)}
                        className="hidden"
                      />
                    </div>
                  )}
                </div>
                
                {/* Media Controls */}
                <div className="flex items-center justify-center gap-1 p-2 bg-secondary/30">
                  {item.type === 'image' && (
                    <button
                      type="button"
                      onClick={() => handleEditMedia(item)}
                      className="p-2 rounded-lg hover:bg-secondary transition-colors"
                      title="Edit media"
                    >
                      <Edit3 className="w-4 h-4 text-muted-foreground" />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => downloadMedia(item)}
                    className="p-2 rounded-lg hover:bg-secondary transition-colors"
                    title="Download"
                  >
                    <Download className="w-4 h-4 text-muted-foreground" />
                  </button>
                  <button
                    type="button"
                    onClick={() => removeMedia(item.id)}
                    className="p-2 rounded-lg hover:bg-destructive/10 transition-colors"
                    title="Hapus"
                  >
                    <X className="w-4 h-4 text-destructive" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add Media Buttons */}
        {(media.filter(m => m.type === 'image').length < MAX_IMAGE_COUNT || 
          media.filter(m => m.type === 'video').length < MAX_VIDEO_COUNT || 
          !media.some(m => m.type === 'audio')) && (
          <div className="flex items-center gap-2 flex-wrap">
            {media.filter(m => m.type === 'image').length < MAX_IMAGE_COUNT && (
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
                <span className="text-xs">({media.filter(m => m.type === 'image').length}/{MAX_IMAGE_COUNT}) 10MB</span>
              </button>
            )}
            {media.filter(m => m.type === 'video').length < MAX_VIDEO_COUNT && (
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
                <span className="text-xs">({media.filter(m => m.type === 'video').length}/{MAX_VIDEO_COUNT}) 20MB</span>
              </button>
            )}
            {!media.some(m => m.type === 'audio') && (
              <button
                type="button"
                onClick={() => setShowAudioRecorder(true)}
                className={cn(
                  'flex items-center gap-2 px-3 py-2 rounded-lg',
                  'text-sm text-muted-foreground',
                  'hover:bg-secondary transition-colors'
                )}
              >
                <Mic className="w-5 h-5" />
                <span>Audio</span>
                <span className="text-xs">(Maks 3 menit)</span>
              </button>
            )}
          </div>
        )}

        <input
          ref={imageInputRef}
          type="file"
          accept="image/*"
          multiple
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

      {/* Image Editor */}
      {editingMedia && (
        <ImageEditor
          isOpen={showImageEditor}
          onClose={() => {
            setShowImageEditor(false);
            setEditingMedia(null);
          }}
          imageData={editingMedia.data}
          onSave={handleSaveEditedImage}
        />
      )}

      {/* Audio Recorder */}
      <AudioRecorder
        isOpen={showAudioRecorder}
        onClose={() => setShowAudioRecorder(false)}
        onSave={handleAudioSave}
      />

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
                    {editingMedia ? 'Ubah Dimensi Gambar' : 'Pilih Dimensi Gambar'}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {editingMedia ? 'Pilih dimensi baru untuk gambar' : 'Pilih bagaimana gambar akan ditampilkan'}
                  </p>
                </div>

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

                <Button
                  variant="outline"
                  className="w-full mt-4"
                  onClick={() => {
                    setShowDimensionPicker(false);
                    setPendingImage(null);
                    setEditingMedia(null);
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