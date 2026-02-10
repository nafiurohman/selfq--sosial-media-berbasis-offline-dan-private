import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bookmark, Trash2, ChevronDown, Settings, User, Archive, Lightbulb, Bug } from 'lucide-react';
import { getBookmarkedPosts, getBookmarkCategories, deleteBookmarkCategory, setBookmark, addPost, toggleLike, deletePost } from '@/lib/db';
import type { Post, BookmarkCategory, MediaItem } from '@/lib/types';
import { PostCard } from '@/components/PostCard';
import { Navigation } from '@/components/Navigation';
import { cn } from '@/lib/utils';
import { toast } from '@/lib/toast';
import { CustomDialog } from '@/components/ui/custom-dialog';
import { FloatingMenu } from '@/components/FloatingMenu';
import { ComposeModal } from '@/components/ComposeModal';
import { ReceiveShareModal } from '@/components/ReceiveShareModal';
import { getUser } from '@/lib/storage';
import { useNavigate } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

import { SEO } from '@/components/SEO';

export default function Bookmarks() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<BookmarkCategory[]>([]);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteCategory, setDeleteCategory] = useState<BookmarkCategory | null>(null);
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [isReceiveShareOpen, setIsReceiveShareOpen] = useState(false);
  const navigate = useNavigate();
  const user = getUser();

  useEffect(() => {
    loadData();
  }, [activeCategory]);

  const loadData = async () => {
    try {
      const [cats, bookmarked] = await Promise.all([
        getBookmarkCategories(),
        getBookmarkedPosts(activeCategory || undefined),
      ]);
      setCategories(cats);
      setPosts(bookmarked);
    } catch (error) {
      console.error('Failed to load bookmarks:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteCategory = async () => {
    if (!deleteCategory) return;
    
    try {
      await deleteBookmarkCategory(deleteCategory.id);
      await loadData();
      if (activeCategory === deleteCategory.id) {
        setActiveCategory(null);
      }
      toast.success('Kategori dihapus');
    } catch (error) {
      toast.error('Gagal menghapus kategori');
    } finally {
      setDeleteCategory(null);
    }
  };

  const handleCreatePost = async (
    content: string, 
    media?: MediaItem[], 
    title?: string,
    postOption?: 'combined' | 'separate'
  ) => {
    if (media && media.length > 1 && postOption === 'separate') {
      for (const mediaItem of media) {
        await addPost(content, [mediaItem], title);
      }
    } else {
      await addPost(content, media, title);
    }
    await loadData();
  };

  const handleLike = async (id: string) => {
    const updated = await toggleLike(id);
    if (updated) {
      setPosts((prev) => prev.map((p) => (p.id === id ? updated : p)));
    }
  };

  const handleDelete = async (id: string) => {
    await deletePost(id);
    setPosts((prev) => prev.filter((p) => p.id !== id));
  };

  const handleRemoveBookmark = async (postId: string) => {
    await setBookmark(postId, null);
    await loadData();
    toast.success('Dihapus dari simpanan');
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="Simpanan - selfQ"
        description="Postingan yang disimpan di selfQ - platform sosial media pribadi offline"
        keywords="simpanan selfq, bookmark, postingan tersimpan"
      />
      
      {/* Navigation */}
      <Navigation />

      {/* Main Content */}
      <div className="main-with-sidebar">
        {/* Mobile Header */}
        <header className="clean-nav sticky top-0 z-30 md:hidden">
          <div className="container flex items-center justify-between h-16 px-4">
            <div className="flex items-center gap-3">
              <img src="/images/logo/logo.png" alt="selfQ Logo" className="w-8 h-8 rounded-xl" />
              <h1 className="text-lg font-bold">Simpanan</h1>
            </div>

            {user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 p-2 rounded-full hover:bg-secondary transition-colors">
                    <div className="avatar-sm rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                      {user.avatar ? (
                        <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover rounded-full" />
                      ) : (
                        <span className="text-white font-semibold text-sm">
                          {user.name.charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>
                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => navigate('/profile')}>
                    <User className="w-4 h-4 mr-2" />
                    Profil
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/bookmarks')}>
                    <Bookmark className="w-4 h-4 mr-2" />
                    Bookmark
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/archive')}>
                    <Archive className="w-4 h-4 mr-2" />
                    Arsip
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/settings')}>
                    <Settings className="w-4 h-4 mr-2" />
                    Pengaturan
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/request-feature')}>
                    <Lightbulb className="w-4 h-4 mr-2" />
                    Request Fitur
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/report-bug')}>
                    <Bug className="w-4 h-4 mr-2" />
                    Report Bug
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </header>

        {/* Category Tabs */}
        <div className="sticky top-16 md:top-0 z-30 clean-nav border-b border-border/30">
          <div className="container px-4 md:px-6 py-3 overflow-x-auto no-scrollbar">
            <div className="flex gap-2">
              <button
                onClick={() => setActiveCategory(null)}
                className={cn(
                  'px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors',
                  activeCategory === null
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                )}
              >
                Semua
              </button>
              {categories.map((category) => (
                <div key={category.id} className="relative group">
                  <button
                    onClick={() => setActiveCategory(category.id)}
                    className={cn(
                      'px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors flex items-center gap-2',
                      activeCategory === category.id
                        ? 'text-white'
                        : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                    )}
                    style={{
                      backgroundColor: activeCategory === category.id ? category.color : undefined,
                    }}
                  >
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{
                        backgroundColor: activeCategory === category.id ? 'white' : category.color,
                      }}
                    />
                    {category.name}
                  </button>
                  {!category.isDefault && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeleteCategory(category);
                      }}
                      className="absolute -top-1 -right-1 p-1 rounded-full bg-destructive text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        <main className="container px-4 md:px-6 py-4 pb-32 md:pb-4">
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <div key={i} className="modern-card p-4 animate-pulse">
                  <div className="h-4 bg-muted rounded w-3/4 mb-3" />
                  <div className="h-4 bg-muted rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-12">
              <Bookmark className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                {activeCategory ? 'Tidak ada post di kategori ini' : 'Belum ada post yang disimpan'}
              </p>
            </div>
          ) : (
            <motion.div layout className="space-y-4">
              <AnimatePresence mode="popLayout">
                {posts.map((post) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    onLike={handleLike}
                    onDelete={handleDelete}
                    onEdit={() => window.open('/feed', '_self')}
                    showBookmarkBadge
                  />
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </main>
      </div>

      {/* Floating Menu */}
      <FloatingMenu
        onCompose={() => setIsComposeOpen(true)}
        onReceiveShare={() => setIsReceiveShareOpen(true)}
      />

      {/* Delete Category Dialog */}
      <CustomDialog
        isOpen={!!deleteCategory}
        onClose={() => setDeleteCategory(null)}
        onConfirm={handleDeleteCategory}
        title="Hapus Kategori?"
        description={`Kategori "${deleteCategory?.name}" akan dihapus. Post yang tersimpan di kategori ini akan tetap ada tapi tidak lagi terkategorikan.`}
        type="danger"
        confirmText="Hapus"
      />

      {/* Modals */}
      <ComposeModal
        isOpen={isComposeOpen}
        onClose={() => setIsComposeOpen(false)}
        onSubmit={handleCreatePost}
      />

      <ReceiveShareModal
        isOpen={isReceiveShareOpen}
        onClose={() => setIsReceiveShareOpen(false)}
        onSuccess={loadData}
      />
    </div>
  );
}