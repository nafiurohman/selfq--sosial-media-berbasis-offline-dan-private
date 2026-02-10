import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Send, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Comment } from '@/lib/types';
import { Button } from '@/components/ui/button';

interface CommentSectionProps {
  comments: Comment[];
  onAddComment: (content: string) => Promise<void>;
  onDeleteComment: (commentId: string) => Promise<void>;
}

export function CommentSection({ comments, onAddComment, onDeleteComment }: CommentSectionProps) {
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-focus input when component mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async () => {
    if (!newComment.trim() || isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      await onAddComment(newComment);
      setNewComment('');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Baru saja';
    if (diffMins < 60) return `${diffMins}m`;
    if (diffHours < 24) return `${diffHours}h`;
    if (diffDays < 7) return `${diffDays}d`;
    return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
  };

  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: 'auto', opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="mt-3 pt-3 border-t border-border/50 overflow-hidden"
    >
      {/* Comments list */}
      {comments.length > 0 && (
        <div className="mb-3 space-y-2">
          {comments.map((comment) => (
            <motion.div
              key={comment.id}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="group flex items-start gap-2 p-3 rounded-lg bg-secondary/30 border border-border/20"
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm whitespace-pre-wrap break-words leading-relaxed">
                  {comment.content}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {formatDate(comment.createdAt)}
                </p>
              </div>
              <button
                onClick={() => onDeleteComment(comment.id)}
                className="p-1 rounded-full opacity-0 group-hover:opacity-100 hover:bg-destructive/10 transition-all"
              >
                <Trash2 className="w-3 h-3 text-destructive" />
              </button>
            </motion.div>
          ))}
        </div>
      )}

      {/* Add comment input */}
      <div className="flex gap-2">
        <input
          ref={inputRef}
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Tulis komentar..."
          className={cn(
            'flex-1 px-3 py-2 rounded-lg text-sm',
            'bg-secondary/50 border border-border/50',
            'focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20',
            'placeholder:text-muted-foreground transition-all'
          )}
        />
        <Button
          size="sm"
          onClick={handleSubmit}
          disabled={!newComment.trim() || isSubmitting}
          className="rounded-lg px-3"
        >
          {isSubmitting ? (
            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}
        </Button>
      </div>
    </motion.div>
  );
}
