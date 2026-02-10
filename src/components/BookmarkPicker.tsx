import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bookmark, BookmarkCheck, Plus, X, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { BookmarkCategory } from '@/lib/types';
import { getBookmarkCategories, addBookmarkCategory } from '@/lib/db';
import { Button } from '@/components/ui/button';
import { toast } from '@/lib/toast';

interface BookmarkPickerProps {
  currentCategory?: string;
  onSelect: (categoryId: string | null) => void;
  isOpen: boolean;
  onClose: () => void;
}

const COLORS = [
  '#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6', '#EC4899'
];

export function BookmarkPicker({ currentCategory, onSelect, isOpen, onClose }: BookmarkPickerProps) {
  const [categories, setCategories] = useState<BookmarkCategory[]>([]);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newName, setNewName] = useState('');
  const [newColor, setNewColor] = useState(COLORS[0]);

  useEffect(() => {
    if (isOpen) {
      loadCategories();
    }
  }, [isOpen]);

  const loadCategories = async () => {
    const cats = await getBookmarkCategories();
    setCategories(cats);
  };

  const handleAddCategory = async () => {
    if (!newName.trim()) return;
    
    try {
      await addBookmarkCategory(newName, newColor);
      await loadCategories();
      setNewName('');
      setNewColor(COLORS[0]);
      setIsAddingNew(false);
      toast.success('Kategori ditambahkan');
    } catch (error) {
      toast.error('Gagal menambah kategori');
    }
  };

  const handleSelect = (categoryId: string | null) => {
    onSelect(categoryId);
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
            onClick={onClose}
            className="fixed inset-0 bg-black/20 backdrop-blur-md z-50"
          />

          {/* Picker */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-4 z-50 backdrop-blur-2xl bg-white/70 dark:bg-gray-900/70 border border-white/20 rounded-3xl shadow-xl overflow-hidden max-h-[80vh] flex flex-col m-auto max-w-sm"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h3 className="font-semibold">Simpan ke Kategori</h3>
              <button
                onClick={onClose}
                className="p-1.5 rounded-full hover:bg-secondary transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Categories list */}
            <div className="p-2 max-h-[40vh] overflow-y-auto">
              {/* Remove bookmark option */}
              {currentCategory && (
                <button
                  onClick={() => handleSelect(null)}
                  className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-secondary transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                    <X className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <span className="text-muted-foreground">Hapus dari simpanan</span>
                </button>
              )}

              {/* Category list */}
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleSelect(category.id)}
                  className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-secondary transition-colors"
                >
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: `${category.color}20` }}
                  >
                    {currentCategory === category.id ? (
                      <BookmarkCheck className="w-4 h-4" style={{ color: category.color }} />
                    ) : (
                      <Bookmark className="w-4 h-4" style={{ color: category.color }} />
                    )}
                  </div>
                  <span className="flex-1 text-left">{category.name}</span>
                  {currentCategory === category.id && (
                    <Check className="w-4 h-4 text-primary" />
                  )}
                </button>
              ))}

              {/* Add new category */}
              {isAddingNew ? (
                <div className="p-3 space-y-3">
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="Nama kategori"
                    className={cn(
                      'w-full px-3 py-2 rounded-lg text-sm',
                      'bg-secondary border border-border/50',
                      'focus:outline-none focus:border-primary'
                    )}
                    autoFocus
                  />
                  <div className="flex gap-2">
                    {COLORS.map((color) => (
                      <button
                        key={color}
                        onClick={() => setNewColor(color)}
                        className={cn(
                          'w-8 h-8 rounded-full transition-all',
                          newColor === color && 'ring-2 ring-offset-2 ring-primary'
                        )}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsAddingNew(false)}
                      className="flex-1"
                    >
                      Batal
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleAddCategory}
                      disabled={!newName.trim()}
                      className="flex-1"
                    >
                      Simpan
                    </Button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setIsAddingNew(true)}
                  className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-secondary transition-colors text-primary"
                >
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <Plus className="w-4 h-4" />
                  </div>
                  <span>Buat kategori baru</span>
                </button>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
