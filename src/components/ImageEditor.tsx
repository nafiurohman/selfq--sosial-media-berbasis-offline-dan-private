import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, RotateCw, RotateCcw, Crop, Palette, Sparkles, Sun, Contrast, Droplets } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface ImageEditorProps {
  isOpen: boolean;
  onClose: () => void;
  imageData: string;
  onSave: (editedImage: string) => void;
}

type FilterType = 'none' | 'grayscale' | 'sepia' | 'vintage' | 'warm' | 'cool' | 'bright' | 'dark';
type CropRatio = '4:5' | '1:1' | 'original';

const filters = [
  { id: 'none', name: 'Original', filter: '' },
  { id: 'grayscale', name: 'B&W', filter: 'grayscale(100%)' },
  { id: 'sepia', name: 'Sepia', filter: 'sepia(100%)' },
  { id: 'vintage', name: 'Vintage', filter: 'sepia(50%) contrast(120%) brightness(90%)' },
  { id: 'warm', name: 'Warm', filter: 'sepia(30%) saturate(130%)' },
  { id: 'cool', name: 'Cool', filter: 'hue-rotate(180deg) saturate(120%)' },
  { id: 'bright', name: 'Bright', filter: 'brightness(120%) contrast(110%)' },
  { id: 'dark', name: 'Dark', filter: 'brightness(80%) contrast(120%)' },
];

export function ImageEditor({ isOpen, onClose, imageData, onSave }: ImageEditorProps) {
  const [activeTab, setActiveTab] = useState<'crop' | 'filter' | 'adjust'>('filter');
  const [selectedFilter, setSelectedFilter] = useState<FilterType>('none');
  const [cropRatio, setCropRatio] = useState<CropRatio>('original');
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturation, setSaturation] = useState(100);
  const [rotation, setRotation] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (isOpen && imgRef.current) {
      imgRef.current.src = imageData;
    }
  }, [isOpen, imageData]);

  const applyFilter = () => {
    const filter = filters.find(f => f.id === selectedFilter);
    const adjustFilter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`;
    return filter ? `${filter.filter} ${adjustFilter}` : adjustFilter;
  };

  const cropImage = async (ratio: CropRatio): Promise<string> => {
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

        if (ratio === '1:1') {
          const size = Math.min(img.width, img.height);
          sx = (img.width - size) / 2;
          sy = (img.height - size) / 2;
          sWidth = size;
          sHeight = size;
          targetWidth = Math.min(800, size);
          targetHeight = targetWidth;
        } else if (ratio === '4:5') {
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
        } else {
          targetWidth = img.width;
          targetHeight = img.height;
        }

        canvas.width = targetWidth;
        canvas.height = targetHeight;
        ctx.drawImage(img, sx, sy, sWidth, sHeight, 0, 0, targetWidth, targetHeight);
        
        resolve(canvas.toDataURL('image/jpeg', 0.9));
      };
      img.src = imageData;
    });
  };

  const applyFiltersToImage = async (base64: string): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d')!;
        
        // Set canvas size based on rotation
        if (rotation === 90 || rotation === 270) {
          canvas.width = img.height;
          canvas.height = img.width;
        } else {
          canvas.width = img.width;
          canvas.height = img.height;
        }
        
        // Apply rotation
        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate((rotation * Math.PI) / 180);
        
        // Apply brightness, contrast, saturation
        ctx.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`;
        
        // Apply selected filter
        const filter = filters.find(f => f.id === selectedFilter);
        if (filter && filter.filter) {
          ctx.filter += ` ${filter.filter}`;
        }
        
        ctx.drawImage(img, -img.width / 2, -img.height / 2);
        ctx.restore();
        
        resolve(canvas.toDataURL('image/jpeg', 0.9));
      };
      img.src = base64;
    });
  };

  const handleSave = async () => {
    setIsProcessing(true);
    try {
      // First crop if needed
      let processedImage = imageData;
      if (cropRatio !== 'original') {
        processedImage = await cropImage(cropRatio);
      }
      
      // Then apply filters and rotation
      if (selectedFilter !== 'none' || brightness !== 100 || contrast !== 100 || saturation !== 100 || rotation !== 0) {
        processedImage = await applyFiltersToImage(processedImage);
      }
      
      onSave(processedImage);
      onClose();
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setSelectedFilter('none');
    setCropRatio('original');
    setBrightness(100);
    setContrast(100);
    setSaturation(100);
    setRotation(0);
  };

  const handleRotateRight = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const handleRotateLeft = () => {
    setRotation((prev) => (prev - 90 + 360) % 360);
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
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[70]"
          />

          {/* Editor Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-4 md:inset-10 z-[70] flex items-center justify-center"
          >
            <div className="bg-card rounded-2xl shadow-2xl w-full h-full max-w-4xl max-h-[90vh] flex flex-col border border-border/50 overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-border">
                <h3 className="font-semibold text-lg">Edit Foto</h3>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleReset}
                  >
                    Reset
                  </Button>
                  <button
                    onClick={onClose}
                    className="p-2 rounded-full hover:bg-secondary transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 flex flex-col md:flex-row overflow-hidden min-h-0">
                {/* Preview */}
                <div className="flex-1 flex items-center justify-center p-4 bg-secondary/20 overflow-auto min-h-0">
                  <div className="relative max-w-full max-h-full">
                    <img
                      ref={imgRef}
                      src={imageData}
                      alt="Preview"
                      className="max-w-full max-h-[40vh] md:max-h-[60vh] object-contain rounded-lg transition-transform duration-300"
                      style={{ filter: applyFilter(), transform: `rotate(${rotation}deg)` }}
                    />
                  </div>
                </div>

                {/* Controls */}
                <div className="w-full md:w-80 border-t md:border-t-0 md:border-l border-border flex flex-col min-h-0">
                  {/* Tabs */}
                  <div className="flex border-b border-border flex-shrink-0">
                    <button
                      onClick={() => setActiveTab('crop')}
                      className={cn(
                        'flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors',
                        activeTab === 'crop' ? 'bg-primary text-primary-foreground' : 'hover:bg-secondary'
                      )}
                    >
                      <Crop className="w-4 h-4" />
                      Crop
                    </button>
                    <button
                      onClick={() => setActiveTab('filter')}
                      className={cn(
                        'flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors',
                        activeTab === 'filter' ? 'bg-primary text-primary-foreground' : 'hover:bg-secondary'
                      )}
                    >
                      <Palette className="w-4 h-4" />
                      Filter
                    </button>
                    <button
                      onClick={() => setActiveTab('adjust')}
                      className={cn(
                        'flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors',
                        activeTab === 'adjust' ? 'bg-primary text-primary-foreground' : 'hover:bg-secondary'
                      )}
                    >
                      <Sparkles className="w-4 h-4" />
                      Adjust
                    </button>
                  </div>

                  {/* Tab Content */}
                  <div className="flex-1 overflow-y-auto p-4 min-h-0">
                    {activeTab === 'crop' && (
                      <div className="space-y-3">
                        <p className="text-sm text-muted-foreground mb-3">Pilih rasio crop:</p>
                        <button
                          onClick={() => setCropRatio('4:5')}
                          className={cn(
                            'w-full p-3 rounded-lg border-2 transition-all text-left',
                            cropRatio === '4:5' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
                          )}
                        >
                          <div className="font-medium">4:5 Portrait</div>
                          <div className="text-xs text-muted-foreground">Instagram portrait</div>
                        </button>
                        <button
                          onClick={() => setCropRatio('1:1')}
                          className={cn(
                            'w-full p-3 rounded-lg border-2 transition-all text-left',
                            cropRatio === '1:1' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
                          )}
                        >
                          <div className="font-medium">1:1 Square</div>
                          <div className="text-xs text-muted-foreground">Instagram square</div>
                        </button>
                        <button
                          onClick={() => setCropRatio('original')}
                          className={cn(
                            'w-full p-3 rounded-lg border-2 transition-all text-left',
                            cropRatio === 'original' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
                          )}
                        >
                          <div className="font-medium">Original</div>
                          <div className="text-xs text-muted-foreground">Ukuran asli</div>
                        </button>
                      </div>
                    )}

                    {activeTab === 'filter' && (
                      <div className="grid grid-cols-2 gap-3 max-h-full">
                        {filters.map((filter) => (
                          <button
                            key={filter.id}
                            onClick={() => setSelectedFilter(filter.id as FilterType)}
                            className={cn(
                              'relative aspect-square rounded-lg overflow-hidden border-2 transition-all',
                              selectedFilter === filter.id ? 'border-primary' : 'border-border hover:border-primary/50'
                            )}
                          >
                            <img
                              src={imageData}
                              alt={filter.name}
                              className="w-full h-full object-cover"
                              style={{ filter: filter.filter }}
                            />
                            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                              <p className="text-white text-xs font-medium text-center">{filter.name}</p>
                            </div>
                            {selectedFilter === filter.id && (
                              <div className="absolute top-2 right-2 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                                <Check className="w-3 h-3 text-primary-foreground" />
                              </div>
                            )}
                          </button>
                        ))}
                      </div>
                    )}

                    {activeTab === 'adjust' && (
                      <div className="space-y-6">
                        {/* Rotate */}
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <RotateCw className="w-4 h-4 text-muted-foreground" />
                              <label className="text-sm font-medium">Rotate</label>
                            </div>
                            <span className="text-sm text-muted-foreground">{rotation}°</span>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={handleRotateLeft}
                              className="w-full"
                            >
                              <RotateCcw className="w-4 h-4 mr-2" />
                              Kiri
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={handleRotateRight}
                              className="w-full"
                            >
                              <RotateCw className="w-4 h-4 mr-2" />
                              Kanan
                            </Button>
                          </div>
                        </div>

                        {/* Brightness */}
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <Sun className="w-4 h-4 text-muted-foreground" />
                              <label className="text-sm font-medium">Brightness</label>
                            </div>
                            <span className="text-sm text-muted-foreground">{brightness}%</span>
                          </div>
                          <input
                            type="range"
                            min="50"
                            max="150"
                            value={brightness}
                            onChange={(e) => setBrightness(Number(e.target.value))}
                            className="w-full"
                          />
                        </div>

                        {/* Contrast */}
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <Contrast className="w-4 h-4 text-muted-foreground" />
                              <label className="text-sm font-medium">Contrast</label>
                            </div>
                            <span className="text-sm text-muted-foreground">{contrast}%</span>
                          </div>
                          <input
                            type="range"
                            min="50"
                            max="150"
                            value={contrast}
                            onChange={(e) => setContrast(Number(e.target.value))}
                            className="w-full"
                          />
                        </div>

                        {/* Saturation */}
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <Droplets className="w-4 h-4 text-muted-foreground" />
                              <label className="text-sm font-medium">Saturation</label>
                            </div>
                            <span className="text-sm text-muted-foreground">{saturation}%</span>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="200"
                            value={saturation}
                            onChange={(e) => setSaturation(Number(e.target.value))}
                            className="w-full"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end gap-2 p-4 border-t border-border">
                <Button
                  variant="outline"
                  onClick={onClose}
                >
                  Batal
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={isProcessing}
                  className="bg-primary text-primary-foreground"
                >
                  {isProcessing ? (
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      Simpan
                    </>
                  )}
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
