import { useState, useEffect, forwardRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Trash2, MoreHorizontal, Pencil, Bookmark, BookmarkCheck, MessageCircle, User, ImageOff, Share2, Download } from 'lucide-react';
import type { Post, BookmarkCategory, MediaItem } from '@/lib/types';
import { cn } from '@/lib/utils';
import { CustomDialog } from '@/components/ui/custom-dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { CommentSection } from '@/components/CommentSection';
import { BookmarkPicker } from '@/components/BookmarkPicker';
import { ShareModal } from '@/components/ShareModal';
import { MediaViewer } from '@/components/MediaViewer';
import { addComment, deleteComment, setBookmark, getBookmarkCategories } from '@/lib/db';
import { toast } from 'sonner';

interface PostCardProps {
  post: Post;
  onLike: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (post: Post) => void;
  onUpdate?: (post: Post) => void;
  showBookmarkBadge?: boolean;
}

export const PostCard = forwardRef<HTMLElement, PostCardProps>(({ post, onLike, onDelete, onEdit, onUpdate, showBookmarkBadge }, ref) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showBookmarkPicker, setShowBookmarkPicker] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showMediaViewer, setShowMediaViewer] = useState(false);
  const [mediaViewerIndex, setMediaViewerIndex] = useState(0);
  const [currentPost, setCurrentPost] = useState(post);
  const [categoryInfo, setCategoryInfo] = useState<BookmarkCategory | null>(null);

  useEffect(() => {
    setCurrentPost(post);
    if (post.bookmarkCategory) {
      loadCategoryInfo();
    }
  }, [post]);

  const loadCategoryInfo = async () => {
    if (!post.bookmarkCategory) return;
    const categories = await getBookmarkCategories();
    const category = categories.find(c => c.id === post.bookmarkCategory);
    setCategoryInfo(category || null);
  };

  const formatDate = (dateString: string, isEdited?: boolean) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    let timeStr = '';
    if (diffMins < 1) timeStr = 'Baru saja';
    else if (diffMins < 60) timeStr = `${diffMins}m`;
    else if (diffHours < 24) timeStr = `${diffHours}h`;
    else if (diffDays < 7) timeStr = `${diffDays}d`;
    else timeStr = date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
    
    return isEdited ? `${timeStr} (diedit)` : timeStr;
  };

  const handleAddComment = async (content: string) => {
    const updated = await addComment(currentPost.id, content);
    if (updated) {
      setCurrentPost(updated);
      onUpdate?.(updated);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    const updated = await deleteComment(currentPost.id, commentId);
    if (updated) {
      setCurrentPost(updated);
      onUpdate?.(updated);
    }
  };

  const handleBookmark = async (categoryId: string | null) => {
    const updated = await setBookmark(currentPost.id, categoryId);
    if (updated) {
      setCurrentPost(updated);
      onUpdate?.(updated);
      if (categoryId) {
        loadCategoryInfo();
      } else {
        setCategoryInfo(null);
      }
    }
  };

  const downloadMedia = (item: MediaItem) => {
    const timestamp = new Date().toISOString().slice(0, 19).replace(/[:-]/g, '');
    const extension = item.type === 'image' ? 'jpg' : 'mp4';
    const link = document.createElement('a');
    link.href = item.data;
    link.download = `selfX_${timestamp}_${item.id.slice(-6)}.${extension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const openMediaViewer = (index: number) => {
    setMediaViewerIndex(index);
    setShowMediaViewer(true);
  };

  // Check if post has media (photo or video cannot be shared)
  const hasMedia = currentPost.image || currentPost.video || (currentPost.media && currentPost.media.length > 0);

  return (
    <>
      <motion.article
        ref={ref}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="post-card"
      >
        {/* Shared from info */}
        {currentPost.sharedFrom && (
          <div className="flex items-center gap-2 mb-3 p-3 rounded-lg bg-secondary/50 border border-border/30">
            <User className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              Dibagikan oleh <span className="font-medium text-foreground">{currentPost.sharedFrom.name}</span>
              <span className="mx-1">•</span>
              <span className="text-xs">{formatDate(currentPost.sharedFrom.sharedAt)}</span>
            </span>
          </div>
        )}

        {/* Post type indicator */}
        {!currentPost.sharedFrom && (
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-primary"></div>
            <span className="text-xs text-muted-foreground font-medium">Postingan Anda</span>
          </div>
        )}

        {/* Bookmark badge */}
        {showBookmarkBadge && categoryInfo && (
          <div 
            className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium mb-3"
            style={{ 
              backgroundColor: `${categoryInfo.color}20`,
              color: categoryInfo.color 
            }}
          >
            <BookmarkCheck className="w-3 h-3" />
            {categoryInfo.name}
          </div>
        )}

        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            {currentPost.title && (
              <h3 className="text-foreground font-semibold text-lg mb-1">
                {currentPost.title}
              </h3>
            )}
            <p className="text-foreground whitespace-pre-wrap break-words leading-relaxed">
              {currentPost.content}
            </p>
            
            {/* Multi-media display */}
            {currentPost.media && currentPost.media.length > 0 && (
              <div className="mt-3">
                {currentPost.media.length === 1 ? (
                  // Single media - compact size
                  <div className="relative rounded-xl overflow-hidden group cursor-pointer max-w-sm" onClick={() => openMediaViewer(0)}>
                    {currentPost.media[0].type === 'image' ? (
                      <img
                        src={currentPost.media[0].data}
                        alt="Post media"
                        className="w-full h-48 object-cover bg-transparent"
                        loading="lazy"
                      />
                    ) : (
                      <video
                        src={currentPost.media[0].data}
                        className="w-full h-48 object-cover"
                        muted
                      />
                    )}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        downloadMedia(currentPost.media[0]);
                      }}
                      className="absolute top-2 right-2 p-2 bg-foreground/80 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Download className="w-4 h-4 text-background" />
                    </button>
                  </div>
                ) : (
                  // Multiple media - compact grid
                  <div className={cn(
                    'grid gap-2 max-w-md',
                    currentPost.media.length === 2 ? 'grid-cols-2' :
                    currentPost.media.length === 3 ? 'grid-cols-3' :
                    'grid-cols-2'
                  )}>
                    {currentPost.media.slice(0, 4).map((item, index) => (
                      <div key={item.id} className="relative rounded-xl overflow-hidden group cursor-pointer" onClick={() => openMediaViewer(index)}>
                        {item.type === 'image' ? (
                          <img
                            src={item.data}
                            alt={`Media ${index + 1}`}
                            className="w-full h-24 object-cover bg-transparent"
                            loading="lazy"
                          />
                        ) : (
                          <video
                            src={item.data}
                            className="w-full h-24 object-cover"
                            muted
                          />
                        )}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            downloadMedia(item);
                          }}
                          className="absolute top-1 right-1 p-1 bg-foreground/80 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Download className="w-3 h-3 text-background" />
                        </button>
                        {/* Show count overlay for 4+ items */}
                        {index === 3 && currentPost.media.length > 4 && (
                          <div className="absolute inset-0 bg-foreground/60 flex items-center justify-center">
                            <span className="text-background font-semibold text-sm">
                              +{currentPost.media.length - 4}
                            </span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
            
            {/* Legacy single image/video display for backward compatibility */}
            {!currentPost.media?.length && currentPost.image && (
              <div className="mt-3 rounded-xl overflow-hidden">
                <img
                  src={currentPost.image}
                  alt="Post attachment"
                  className={cn(
                    'w-full object-contain bg-transparent',
                    currentPost.imageDimension === '1:1' ? 'aspect-square' :
                    currentPost.imageDimension === '4:5' ? 'aspect-[4/5]' :
                    'max-h-96'
                  )}
                  loading="lazy"
                />
              </div>
            )}

            {!currentPost.media?.length && currentPost.video && (
              <div className="mt-3 media-container rounded-xl overflow-hidden bg-secondary/30">
                <video
                  src={currentPost.video}
                  controls
                  className="w-full h-auto"
                  style={{ maxHeight: '500px' }}
                />
              </div>
            )}
            
            <p className="text-muted-foreground text-sm mt-3">
              {formatDate(currentPost.updatedAt || currentPost.createdAt, !!currentPost.updatedAt)}
            </p>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="p-2 rounded-full hover:bg-secondary transition-colors">
                <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-card border-border">
              <DropdownMenuItem onClick={() => onEdit(currentPost)}>
                <Pencil className="w-4 h-4 mr-2" />
                Edit Post
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => setShowDeleteDialog(true)}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Hapus Post
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Action bar - all in one row */}
        <div className="flex items-center justify-between pt-3 border-t border-border/30">
          <div className="flex items-center gap-1">
            {/* Comment */}
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => setShowComments(!showComments)}
                  className={cn(
                    'flex items-center gap-1.5 px-3 py-2 rounded-full hover:bg-secondary transition-colors',
                    showComments && 'bg-secondary/50'
                  )}
                >
                  <MessageCircle className={cn(
                    'w-5 h-5',
                    showComments ? 'text-primary' : 'text-muted-foreground'
                  )} />
                  {(currentPost.comments?.length || 0) > 0 && (
                    <span className={cn(
                      'text-sm',
                      showComments ? 'text-primary' : 'text-muted-foreground'
                    )}>{currentPost.comments.length}</span>
                  )}
                </button>
              </TooltipTrigger>
              <TooltipContent className="hidden md:block">
                <p>{showComments ? 'Tutup komentar' : 'Komentar'}</p>
              </TooltipContent>
            </Tooltip>

            
            {/* Like */}
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => onLike(currentPost.id)}
                  className={cn(
                    'like-btn flex items-center gap-1.5 px-3 py-2 rounded-full',
                    'hover:bg-like/10 transition-colors',
                    currentPost.liked && 'liked'
                  )}
                >
                  <Heart
                    className={cn(
                      'w-5 h-5 transition-colors',
                      currentPost.liked ? 'fill-current text-like' : 'text-muted-foreground'
                    )}
                  />
                  {currentPost.liked && (
                    <span className="text-sm text-like font-medium">Suka</span>
                  )}
                </button>
              </TooltipTrigger>
              <TooltipContent className="hidden md:block">
                <p>{currentPost.liked ? 'Batal suka' : 'Suka'}</p>
              </TooltipContent>
            </Tooltip>
          </div>

          <div className="flex items-center gap-1">
            {/* Bookmark */}
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => setShowBookmarkPicker(true)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-full hover:bg-secondary transition-colors"
                >
                  {currentPost.bookmarkCategory ? (
                    <BookmarkCheck className="w-5 h-5 text-primary" />
                  ) : (
                    <Bookmark className="w-5 h-5 text-muted-foreground" />
                  )}
                </button>
              </TooltipTrigger>
              <TooltipContent className="hidden md:block">
                <p>{currentPost.bookmarkCategory ? 'Edit bookmark' : 'Simpan'}</p>
              </TooltipContent>
            </Tooltip>

            {/* Share button */}
            {hasMedia ? (
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => toast.info('Post dengan foto/video tidak dapat dibagikan')}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-full hover:bg-secondary transition-colors opacity-50 cursor-not-allowed"
                  >
                    <ImageOff className="w-5 h-5 text-muted-foreground" />
                  </button>
                </TooltipTrigger>
                <TooltipContent className="hidden md:block">
                  <p>Post dengan media tidak dapat dibagikan</p>
                </TooltipContent>
              </Tooltip>
            ) : (
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => setShowShareModal(true)}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-full hover:bg-secondary transition-colors"
                  >
                    <Share2 className="w-5 h-5 text-muted-foreground" />
                  </button>
                </TooltipTrigger>
                <TooltipContent className="hidden md:block">
                  <p>Bagikan post</p>
                </TooltipContent>
              </Tooltip>
            )}
          </div>
        </div>

        {/* Comments Section */}
        <AnimatePresence>
          {showComments && (
            <CommentSection
              comments={currentPost.comments || []}
              onAddComment={handleAddComment}
              onDeleteComment={handleDeleteComment}
            />
          )}
        </AnimatePresence>
      </motion.article>

      {/* Delete Dialog */}
      <CustomDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={() => {
          onDelete(currentPost.id);
          setShowDeleteDialog(false);
        }}
        title="Hapus Post?"
        description="Post ini akan dihapus secara permanen dan tidak bisa dikembalikan."
        type="danger"
        confirmText="Hapus"
      />

      {/* Bookmark Picker */}
      <BookmarkPicker
        isOpen={showBookmarkPicker}
        onClose={() => setShowBookmarkPicker(false)}
        currentCategory={currentPost.bookmarkCategory}
        onSelect={handleBookmark}
      />

      {/* Share Modal */}
      <ShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        post={currentPost}
      />

      {/* Media Viewer */}
      <MediaViewer
        isOpen={showMediaViewer}
        onClose={() => setShowMediaViewer(false)}
        media={currentPost.media || []}
        initialIndex={mediaViewerIndex}
      />
    </>
  );
});
