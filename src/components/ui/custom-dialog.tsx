import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertTriangle, CheckCircle, Info, HelpCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './button';

type DialogType = 'danger' | 'success' | 'info' | 'confirm';

interface CustomDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  title: string;
  description: string;
  type?: DialogType;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
}

const iconMap = {
  danger: AlertTriangle,
  success: CheckCircle,
  info: Info,
  confirm: HelpCircle,
};

const colorMap = {
  danger: {
    bg: 'bg-destructive/10',
    icon: 'text-destructive',
    button: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
  },
  success: {
    bg: 'bg-success/10',
    icon: 'text-success',
    button: 'bg-success text-success-foreground hover:bg-success/90',
  },
  info: {
    bg: 'bg-primary/10',
    icon: 'text-primary',
    button: 'bg-primary text-primary-foreground hover:bg-primary/90',
  },
  confirm: {
    bg: 'bg-primary/10',
    icon: 'text-primary',
    button: 'bg-primary text-primary-foreground hover:bg-primary/90',
  },
};

export function CustomDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  type = 'confirm',
  confirmText = 'Konfirmasi',
  cancelText = 'Batal',
  isLoading = false,
}: CustomDialogProps) {
  const Icon = iconMap[type];
  const colors = colorMap[type];

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
            className="fixed inset-0 bg-foreground/60 backdrop-blur-sm z-50"
          />

          {/* Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-card rounded-2xl shadow-xl max-w-sm w-full overflow-hidden">
              {/* Header with icon */}
              <div className="p-6 pb-4 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', delay: 0.1, damping: 15 }}
                  className={cn(
                    'w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center',
                    colors.bg
                  )}
                >
                  <Icon className={cn('w-8 h-8', colors.icon)} />
                </motion.div>
                
                <motion.h2
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                  className="text-xl font-semibold mb-2"
                >
                  {title}
                </motion.h2>
                
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-muted-foreground text-sm"
                >
                  {description}
                </motion.p>
              </div>

              {/* Actions */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.25 }}
                className="px-6 pb-6 flex gap-3"
              >
                <Button
                  variant="outline"
                  onClick={onClose}
                  disabled={isLoading}
                  className="flex-1 rounded-xl h-12"
                >
                  {cancelText}
                </Button>
                {onConfirm && (
                  <Button
                    onClick={onConfirm}
                    disabled={isLoading}
                    className={cn('flex-1 rounded-xl h-12', colors.button)}
                  >
                    {isLoading ? (
                      <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    ) : (
                      confirmText
                    )}
                  </Button>
                )}
              </motion.div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
