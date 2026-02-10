import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, PenLine, Download, X, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface FloatingMenuProps {
  onCompose: () => void;
  onReceiveShare: () => void;
}

export function FloatingMenu({ onCompose, onReceiveShare }: FloatingMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const menuItems = [
    {
      icon: PenLine,
      label: 'Buat Post',
      onClick: () => {
        setIsOpen(false);
        onCompose();
      },
      color: 'bg-blue-500 hover:bg-blue-600',
    },
    {
      icon: BookOpen,
      label: 'Tulis Cerita',
      onClick: () => {
        setIsOpen(false);
        navigate('/stories/new');
      },
      color: 'bg-purple-500 hover:bg-purple-600',
    },
    {
      icon: Download,
      label: 'Terima Kiriman',
      onClick: () => {
        setIsOpen(false);
        onReceiveShare();
      },
      color: 'bg-green-500 hover:bg-green-600',
    },
  ];

  return (
    <>
      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/20 backdrop-blur-[2px] z-40 md:hidden"
          />
        )}
      </AnimatePresence>

      {/* Menu Items */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed bottom-40 right-4 md:right-6 flex flex-col-reverse gap-3 z-50">
            {menuItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, scale: 0, y: 20 }}
                  animate={{ 
                    opacity: 1, 
                    scale: 1, 
                    y: 0,
                    transition: {
                      type: 'spring',
                      damping: 15,
                      stiffness: 300,
                      delay: index * 0.05,
                    }
                  }}
                  exit={{ 
                    opacity: 0, 
                    scale: 0,
                    transition: {
                      duration: 0.15,
                      delay: (menuItems.length - 1 - index) * 0.03,
                    }
                  }}
                  className="flex items-center gap-3"
                >
                  {/* Label */}
                  <motion.span
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ 
                      opacity: 1, 
                      x: 0,
                      transition: { delay: index * 0.05 + 0.1 }
                    }}
                    exit={{ opacity: 0, x: 10 }}
                    className="bg-gray-900 text-white text-sm font-medium px-3 py-2 rounded-lg shadow-lg whitespace-nowrap"
                  >
                    {item.label}
                  </motion.span>

                  {/* Button */}
                  <motion.button
                    onClick={item.onClick}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className={`w-14 h-14 rounded-full ${item.color} text-white shadow-lg flex items-center justify-center transition-colors`}
                  >
                    <Icon className="w-6 h-6" />
                  </motion.button>
                </motion.div>
              );
            })}
          </div>
        )}
      </AnimatePresence>

      {/* Main FAB Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-24 right-4 md:bottom-8 md:right-6 w-14 h-14 md:w-16 md:h-16 bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-xl flex items-center justify-center z-50 transition-colors"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        animate={{ rotate: isOpen ? 45 : 0 }}
        transition={{ type: 'spring', damping: 20, stiffness: 300 }}
      >
        <motion.div
          animate={{ rotate: isOpen ? -45 : 0 }}
          transition={{ type: 'spring', damping: 20, stiffness: 300 }}
        >
          {isOpen ? <X className="w-6 h-6 md:w-7 md:h-7" /> : <Plus className="w-6 h-6 md:w-7 md:h-7" />}
        </motion.div>
      </motion.button>
    </>
  );
}