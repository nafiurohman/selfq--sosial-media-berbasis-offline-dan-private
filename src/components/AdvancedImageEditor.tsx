import { useState, useRef, useEffect } from 'react';
import { X, RotateCw, RotateCcw, Crop, Sparkles, Check, Undo } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { motion, AnimatePresence } from 'framer-motion';

interface AdvancedImageEditorProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  onSave: (editedImageUrl: string) => void;
}

const filters = [
  { name: 'Normal', filter: '' },
  { name: 'Grayscale', filter: 'grayscale(100%)' },
  { name: 'Sepia', filter: 'sepia(100%)' },
  { name: 'Vintage', filter: 'sepia(50%) contrast(110%)' },
  { name: 'Bright', filter: 'brightness(120%) contrast(110%)' },
  { name: 'Dark', filter: 'brightness(80%) contrast(120%)' },
];

export function AdvancedImageEditor({ isOpen, onClose, imageUrl, onSave }: AdvancedImageEditorProps) {
  const [rotation, setRotation] = useState(0);
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [selectedFilter, setSelectedFilter] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (isOpen && imgRef.current) {
      imgRef.current.src = imageUrl;
    }
  }, [isOpen, imageUrl]);

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const handleRotateLeft = () => {
    setRotation((prev) => (prev - 90 + 360) % 360);
  };

  const handleReset = () => {
    setRotation(0);
    setBrightness(100);
    setContrast(100);
    setSelectedFilter(0);
  };

  const handleSave = async () => {
    if (!canvasRef.current || !imgRef.current) return;

    setIsSaving(true);
    try {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const img = imgRef.current;
      
      // Set canvas size based on rotation
      if (rotation === 90 || rotation === 270) {
        canvas.width = img.naturalHeight;
        canvas.height = img.naturalWidth;
      } else {
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
      }

      // Apply transformations
      ctx.save();
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate((rotation * Math.PI) / 180);
      
      // Apply filters
      ctx.filter = `brightness(${brightness}%) contrast(${contrast}%) ${filters[selectedFilter].filter}`;
      
      ctx.drawImage(
        img,
        -img.naturalWidth / 2,
        -img.naturalHeight / 2,
        img.naturalWidth,
        img.naturalHeight
      );
      ctx.restore();

      const editedImageUrl = canvas.toDataURL('image/jpeg', 0.9);
      onSave(editedImageUrl);
      onClose();
    } catch (error) {
      console.error('Failed to save image:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/90 z-50"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-4 md:inset-10 z-50 bg-background rounded-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h3 className="font-semibold">Edit Gambar</h3>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={handleReset}>
                  <Undo className="w-4 h-4 mr-2" />
                  Reset
                </Button>
                <Button variant="ghost" size="sm" onClick={onClose}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Preview */}
            <div className="flex-1 flex items-center justify-center p-4 bg-secondary/20 overflow-hidden">
              <img
                ref={imgRef}
                alt="Preview"
                className="max-w-full max-h-full object-contain"
                style={{
                  transform: `rotate(${rotation}deg)`,
                  filter: `brightness(${brightness}%) contrast(${contrast}%) ${filters[selectedFilter].filter}`,
                  transition: 'all 0.3s ease',
                }}
              />
              <canvas ref={canvasRef} className="hidden" />
            </div>

            {/* Controls */}
            <div className="p-4 border-t border-border space-y-4 max-h-[40vh] overflow-y-auto">
              {/* Filters */}
              <div>
                <label className="text-sm font-medium mb-2 flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Filter
                </label>
                <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                  {filters.map((filter, index) => (
                    <button
                      key={filter.name}
                      onClick={() => setSelectedFilter(index)}
                      className={`p-2 rounded-lg border-2 transition-all ${
                        selectedFilter === index
                          ? 'border-primary bg-primary/10'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <div
                        className="w-full aspect-square rounded bg-gradient-to-br from-blue-500 to-purple-500 mb-1"
                        style={{ filter: filter.filter }}
                      />
                      <span className="text-xs">{filter.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Brightness */}
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Kecerahan: {brightness}%
                </label>
                <Slider
                  value={[brightness]}
                  onValueChange={([v]) => setBrightness(v)}
                  min={50}
                  max={150}
                  step={1}
                />
              </div>

              {/* Contrast */}
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Kontras: {contrast}%
                </label>
                <Slider
                  value={[contrast]}
                  onValueChange={([v]) => setContrast(v)}
                  min={50}
                  max={150}
                  step={1}
                />
              </div>

              {/* Rotate */}
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Rotasi: {rotation}°
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    onClick={handleRotateLeft}
                    className="w-full"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Kiri 90°
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleRotate}
                    className="w-full"
                  >
                    <RotateCw className="w-4 h-4 mr-2" />
                    Kanan 90°
                  </Button>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-border flex gap-2">
              <Button variant="outline" onClick={onClose} className="flex-1">
                Batal
              </Button>
              <Button onClick={handleSave} disabled={isSaving} className="flex-1">
                {isSaving ? (
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Simpan
                  </>
                )}
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
