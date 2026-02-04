import { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ArrowLeft, X, ChevronDown, Settings, User, Edit } from 'lucide-react';
import { getAllPosts, addPost, toggleLike, deletePost, updatePost } from '@/lib/db';
import type { Post, MediaItem } from '@/lib/types';
import { PostCard } from '@/components/PostCard';
import { Navigation } from '@/components/Navigation';
import { SEO } from '@/components/SEO';
import { FloatingMenu } from '@/components/FloatingMenu';
import { ComposeModal } from '@/components/ComposeModal';
import { ReceiveShareModal } from '@/components/ReceiveShareModal';
import { getUser } from '@/lib/storage';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

export default function SearchPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [isReceiveShareOpen, setIsReceiveShareOpen] = useState(false);
  const navigate = useNavigate();
  const user = getUser();

  // Handle search from URL params
  useEffect(() => {
    const query = searchParams.get('q');
    if (query) {
      setSearchQuery(query);
    }
  }, [searchParams]);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      const data = await getAllPosts();
      setPosts(data);
    } catch (error) {
      console.error('Failed to load posts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    const newSearchParams = new URLSearchParams();
    if (query.trim()) {
      newSearchParams.set('q', query);
    }
    setSearchParams(newSearchParams);
  }, [setSearchParams]);

  const handleClearSearch = useCallback(() => {
    setSearchQuery('');
    setSearchParams(new URLSearchParams());
  }, [setSearchParams]);

  // Filter posts based on search query
  const filteredPosts = useMemo(() => {
    if (!searchQuery.trim()) return [];
    
    const query = searchQuery.toLowerCase();
    return posts.filter(post => 
      post.content.toLowerCase().includes(query) ||
      (post.title && post.title.toLowerCase().includes(query)) ||
      (post.sharedFrom && post.sharedFrom.name.toLowerCase().includes(query))
    );
  }, [posts, searchQuery]);

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
    await loadPosts();
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

  const handlePostUpdate = (updatedPost: Post) => {
    setPosts((prev) =>
      prev.map((p) => (p.id === updatedPost.id ? updatedPost : p))
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title={searchQuery ? `Pencarian: ${searchQuery} - selfX` : 'Pencarian - selfX'}
        description="Cari postingan di selfX - platform sosial media pribadi offline"
        keywords="pencarian selfx, cari postingan, search"
      />
      
      <Navigation />

      <div className="main-with-sidebar">
        {/* Mobile Header */}
        <header className="clean-nav sticky top-0 z-30 md:hidden">
          <div className="container flex items-center justify-between h-16 px-4">
            <div className="flex items-center gap-3">
              <img src="/images/logo/logo.png" alt="selfX Logo" className="w-8 h-8 rounded-xl" />
              <h1 className="text-lg font-bold">Pencarian</h1>
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
                  <DropdownMenuItem onClick={() => navigate('/settings')}>
                    <Settings className="w-4 h-4 mr-2" />
                    Pengaturan
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </header>

        {/* Search Header */}
        <header className="clean-nav sticky top-16 md:top-0 z-30 border-b border-border/30">
          <div className="container flex items-center gap-4 h-16 px-4 md:px-6">
            
            
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Cari postingan..."
                autoFocus
                className="w-full h-12 pl-12 pr-12 rounded-full bg-secondary/50 border border-border/30 text-base focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={handleClearSearch}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-muted transition-colors"
                >
                  <X className="w-4 h-4 text-muted-foreground" />
                </button>
              )}
            </div>
          </div>
        </header>
        

        {/* Content */}
        <main className="container px-4 md:px-6 py-4 pb-32 md:pb-4">
          {!searchQuery ? (
            <div className="text-center py-20">
              <Search className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">Cari Postingan</h2>
              <p className="text-muted-foreground">
                Masukkan kata kunci untuk mencari postingan
              </p>
            </div>
          ) : isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="modern-card p-4 animate-pulse">
                  <div className="h-4 bg-muted rounded w-3/4 mb-3" />
                  <div className="h-4 bg-muted rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="text-center py-12">
              <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                Tidak ada postingan yang cocok dengan "{searchQuery}"
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Coba gunakan kata kunci yang berbeda
              </p>
            </div>
          ) : (
            <motion.div layout className="space-y-4">
              <AnimatePresence mode="popLayout">
                {filteredPosts.map((post) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    onLike={handleLike}
                    onDelete={handleDelete}
                    onEdit={() => {}}
                    onUpdate={handlePostUpdate}
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

      {/* Modals */}
      <ComposeModal
        isOpen={isComposeOpen}
        onClose={() => setIsComposeOpen(false)}
        onSubmit={handleCreatePost}
      />

      <ReceiveShareModal
        isOpen={isReceiveShareOpen}
        onClose={() => setIsReceiveShareOpen(false)}
        onSuccess={loadPosts}
      />
    </div>
  );
}