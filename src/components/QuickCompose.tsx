import { motion } from 'framer-motion';
import { PenLine } from 'lucide-react';
import { cn } from '@/lib/utils';

interface QuickComposeProps {
  onClick: () => void;
  className?: string;
}

export function QuickCompose({ onClick, className }: QuickComposeProps) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      className={cn(
        'w-full flex items-center gap-3 p-4 rounded-2xl',
        'glass-card',
        'transition-all duration-200',
        className
      )}
    >
      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
        <PenLine className="w-5 h-5 text-primary" />
      </div>
      <span className="text-muted-foreground text-left flex-1">
        Tulis pikiranmu disini...
      </span>
    </motion.button>
  );
}
