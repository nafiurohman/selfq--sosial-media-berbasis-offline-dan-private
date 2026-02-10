import { useRef } from 'react';
import { ImagePlus, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from '@/lib/toast';

interface ImagePickerProps {
  image: string | null;
  onImageChange: (image: string | null) => void;
  className?: string;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export function ImagePicker({ image, onImageChange, className }: ImagePickerProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('File harus berupa gambar');
      return;
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      toast.error('Ukuran gambar maksimal 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      onImageChange(base64);
    };
    reader.onerror = () => {
      toast.error('Gagal membaca gambar');
    };
    reader.readAsDataURL(file);

    // Reset input
    e.target.value = '';
  };

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      {image ? (
        <div className="relative rounded-xl overflow-hidden">
          <img
            src={image}
            alt="Preview"
            className="w-full max-h-48 object-cover"
          />
          <button
            type="button"
            onClick={() => onImageChange(null)}
            className="absolute top-2 right-2 p-1.5 bg-foreground/80 rounded-full hover:bg-foreground transition-colors"
          >
            <X className="w-4 h-4 text-background" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className={cn(
            'flex items-center gap-2 px-3 py-2 rounded-lg',
            'text-sm text-muted-foreground',
            'hover:bg-secondary transition-colors'
          )}
        >
          <ImagePlus className="w-5 h-5" />
          <span>Tambah Gambar</span>
        </button>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
}
