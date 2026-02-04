import { motion } from 'framer-motion';
import { Feather } from 'lucide-react';

export function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16 px-4 text-center"
    >
      <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6">
        <Feather className="w-10 h-10 text-primary" />
      </div>
      <h3 className="text-xl font-semibold mb-2">Belum ada post</h3>
      <p className="text-muted-foreground max-w-xs">
        Mulai menulis pikiran pertamamu dengan menekan tombol + di bawah
      </p>
    </motion.div>
  );
}
