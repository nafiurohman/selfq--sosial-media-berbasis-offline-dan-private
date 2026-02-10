import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Bookmark, Archive, Settings, Lightbulb, Calendar, BookOpen, Edit, HelpCircle, Info, FileCheck, Shield, Bug } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getUser } from '@/lib/storage';

interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onEditProfile?: () => void;
}

export function MobileSidebar({ isOpen, onClose, onEditProfile }: MobileSidebarProps) {
  const navigate = useNavigate();
  const user = getUser();

  const menuItems = [
    ...(onEditProfile ? [{ icon: Edit, label: 'Edit Profil', action: () => { onEditProfile(); onClose(); } }] : []),
    { icon: User, label: 'Profil', path: '/profile' },
    { icon: Calendar, label: 'Kalender', path: '/calendar' },
    { icon: BookOpen, label: 'Ceritamu', path: '/stories' },
    { icon: Bookmark, label: 'Bookmark', path: '/bookmarks' },
    { icon: Archive, label: 'Arsip', path: '/archive' },
    { icon: HelpCircle, label: 'Pusat Bantuan', path: '/help' },
    { icon: Info, label: 'Tentang selfQ', path: '/about' },
    { icon: FileCheck, label: 'Syarat & Ketentuan', path: '/terms' },
    { icon: Shield, label: 'Kebijakan Privasi', path: '/privacy' },
    { icon: Settings, label: 'Pengaturan', path: '/settings' },
    { icon: Lightbulb, label: 'Request Fitur', path: '/request-feature' },
    { icon: Bug, label: 'Report Bug', path: '/report-bug' },
  ];

  const handleItemClick = (item: typeof menuItems[0]) => {
    if ('action' in item && item.action) {
      item.action();
    } else if ('path' in item && item.path) {
      navigate(item.path);
      onClose();
    }
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
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] md:hidden"
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-80 max-w-[85vw] bg-background border-l border-border z-[101] md:hidden overflow-y-auto"
          >
            {/* Header */}
            <div className="sticky top-0 bg-background/95 backdrop-blur-xl border-b border-border p-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Menu</h2>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-secondary transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* User Profile */}
            {user && (
              <div className="p-6 border-b border-border">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                    {user.avatar ? (
                      <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover rounded-full" />
                    ) : (
                      <span className="text-white font-semibold text-xl">
                        {user.name.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-foreground truncate">{user.name}</p>
                    <p className="text-sm text-muted-foreground truncate">
                      @{user.name.toLowerCase().replace(/\s+/g, '')}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Menu Items */}
            <div className="p-4 space-y-2">
              {menuItems.map((item, index) => {
                const Icon = item.icon;
                return (
                  <button
                    key={index}
                    onClick={() => handleItemClick(item)}
                    className="w-full flex items-center gap-4 px-4 py-3 rounded-2xl hover:bg-secondary transition-colors text-left"
                  >
                    <Icon className="w-5 h-5 text-muted-foreground" />
                    <span className="font-medium">{item.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-border mt-auto">
              <p className="text-xs text-muted-foreground text-center">
                selfQ - Ruang Pribadimu, Tanpa Tekanan
              </p>
              <p className="text-xs text-muted-foreground text-center mt-1">
                v26.02.10
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
