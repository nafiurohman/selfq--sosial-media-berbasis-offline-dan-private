import { useState, useEffect } from 'react';
import { Clock, X, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const MAX_HISTORY = 10;
const STORAGE_KEY = 'selfq_search_history';

export function SearchHistory({ onSelect }: { onSelect: (query: string) => void }) {
  const [history, setHistory] = useState<string[]>([]);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setHistory(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Failed to load search history:', error);
    }
  };

  const removeItem = (query: string) => {
    const updated = history.filter(q => q !== query);
    setHistory(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const clearAll = () => {
    setHistory([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  if (history.length === 0) return null;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between px-1">
        <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
          <Clock className="w-4 h-4" />
          Pencarian Terakhir
        </h3>
        <button
          onClick={clearAll}
          className="text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          Hapus Semua
        </button>
      </div>
      <AnimatePresence>
        {history.map((query, index) => (
          <motion.button
            key={query}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => onSelect(query)}
            className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-secondary/50 transition-colors group"
          >
            <span className="text-sm flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-muted-foreground" />
              {query}
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                removeItem(query);
              }}
              className="opacity-0 group-hover:opacity-100 p-1 rounded-full hover:bg-muted transition-all"
            >
              <X className="w-3 h-3" />
            </button>
          </motion.button>
        ))}
      </AnimatePresence>
    </div>
  );
}

export function addToSearchHistory(query: string) {
  if (!query.trim()) return;
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    let history: string[] = stored ? JSON.parse(stored) : [];
    
    // Remove if already exists
    history = history.filter(q => q !== query);
    
    // Add to beginning
    history.unshift(query);
    
    // Keep only MAX_HISTORY items
    history = history.slice(0, MAX_HISTORY);
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  } catch (error) {
    console.error('Failed to save search history:', error);
  }
}
