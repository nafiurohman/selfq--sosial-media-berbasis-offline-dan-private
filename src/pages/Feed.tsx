import { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Settings, User, Bookmark, Archive, Lightbulb, Bug } from 'lucide-react';
import { getUser } from '@/lib/storage';
import { getAllPosts, addPost, deletePost, toggleLike, updatePost } from '@/lib/db';
import type { Post, MediaItem } from '@/lib/types';
import { PostCard } from '@/components/PostCard';
import { ComposeModal } from '@/components/ComposeModal';
import { ReceiveShareModal } from '@/components/ReceiveShareModal';
import { EmptyState } from '@/components/EmptyState';
import { Navigation } from '@/components/Navigation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

import { SEO } from '@/components/SEO';

export default function Feed() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [isReceiveShareOpen, setIsReceiveShareOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [activeTab, setActiveTab] = useState<'posts' | 'shared'>('posts');
  const navigate = useNavigate();

  const user = getUser();

  useEffect(() => {
    // Redirect to landing if no user
    if (!user) {
      navigate('/');
      return;
    }

    loadPosts();
  }, [navigate, user]);

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

  const handleCreatePost = async (
    content: string, 
    media?: MediaItem[], 
    title?: string,
    postOption?: 'combined' | 'separate'
  ) => {
    if (editingPost) {
      const updated = await updatePost(editingPost.id, { 
        title, 
        content, 
        media,
        image: media?.find(m => m.type === 'image')?.data,
        video: media?.find(m => m.type === 'video')?.data,
        imageDimension: media?.find(m => m.type === 'image')?.dimension,
      });
      if (updated) {
        setPosts((prev) => prev.map((p) => (p.id === editingPost.id ? updated : p)));
      }
      setEditingPost(null);
    } else {
      if (media && media.length > 1 && postOption === 'separate') {
        const newPosts = [];
        for (const mediaItem of media) {
          const newPost = await addPost(content, [mediaItem], title);
          newPosts.push(newPost);
        }
        setPosts((prev) => [...newPosts, ...prev]);
      } else {
        const newPost = await addPost(content, media, title);
        setPosts((prev) => [newPost, ...prev]);
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleEdit = (post: Post) => {
    setEditingPost(post);
    setIsComposeOpen(true);
  };

  const handleCloseCompose = () => {
    setIsComposeOpen(false);
    setEditingPost(null);
  };

  const handleLike = async (id: string) => {
    const updated = await toggleLike(id);
    if (updated) {
      setPosts((prev) =>
        prev.map((p) => (p.id === id ? updated : p))
      );
    }
  };

  const handleDelete = async (id: string) => {
    await deletePost(id);
    setPosts((prev) => prev.filter((p) => p.id !== id));
  };

  const handlePostUpdate = (updatedPost: Post) => {
    setPosts((prev) =>
      prev.map((p) => (p.id === updatedPost.id ? updatedPost : p))
        .filter((p) => !p.archived) // Filter out archived posts
    );
  };

  // Filter posts based on active tab
  const filteredPosts = useMemo(() => {
    if (activeTab === 'shared') {
      return posts.filter(post => post.sharedFrom);
    } else {
      return posts.filter(post => !post.sharedFrom);
    }
  }, [posts, activeTab]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="Feed - selfQ"
        description="Timeline postingan di selfQ - platform sosial media pribadi offline yang mengutamakan privasi"
        keywords="feed selfq, timeline, postingan pribadi, sosial media offline"
      />
      
      {/* Navigation */}
      <Navigation 
        onCompose={() => setIsComposeOpen(true)}
        onReceiveShare={() => setIsReceiveShareOpen(true)}
      />

      {/* Main Content */}
      <div className="main-with-sidebar">
        {/* Top Header - Mobile */}
        <header className="clean-nav sticky top-0 z-30 md:hidden">
          <div className="container flex items-center justify-between h-16 px-4">
            <div className="flex items-center gap-3">
              <img src="/images/logo/logo.png" alt="selfQ Logo" className="w-8 h-8 rounded-xl" />
              <h1 className="text-lg font-bold">selfQ</h1>
            </div>

            {user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 p-2 rounded-full hover:bg-secondary transition-colors">
                    <div className="avatar-sm rounded-full bg-gradient-to-br from-mint-medium to-mint-dark flex items-center justify-center">
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

        {/* Tab Navigation */}
        <div className="border-b border-border/30 backdrop-blur-2xl bg-white/60 dark:bg-gray-900/60 sticky top-16 md:top-0 z-20">
          <div className="container px-4 md:px-6">
            <div className="flex justify-center">
              <div className="tab-nav max-w-md w-full">
                <button
                  onClick={() => setActiveTab('posts')}
                  className={`tab-item flex-1 text-center ${activeTab === 'posts' ? 'active' : ''}`}
                >
                  Postingan
                </button>
                <button
                  onClick={() => setActiveTab('shared')}
                  className={`tab-item flex-1 text-center ${activeTab === 'shared' ? 'active' : ''}`}
                >
                  Sharing
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <main className="container px-4 md:px-6 py-4 pb-32 md:pb-4">
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="glass-card p-4 animate-pulse">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="avatar-sm bg-muted rounded-full" />
                    <div className="space-y-1">
                      <div className="h-4 bg-muted rounded w-24" />
                      <div className="h-3 bg-muted rounded w-16" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-4 bg-muted rounded w-3/4" />
                    <div className="h-4 bg-muted rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="text-center py-12">
              {activeTab === 'shared' ? (
                <div className="glass-card p-12 text-center">
                  <EmptyState />
                  <p className="text-muted-foreground mt-4">
                    Belum ada postingan yang dibagikan
                  </p>
                  <div className="flex justify-center mt-6">
                    <button
                      onClick={() => setIsReceiveShareOpen(true)}
                      className="glass-button bg-primary text-white"
                    >
                      Import Postingan
                    </button>
                  </div>
                </div>
              ) : (
                <div className="glass-card p-12 text-center">
                  <EmptyState />
                </div>
              )}
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
                    onEdit={handleEdit}
                    onUpdate={handlePostUpdate}
                  />
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </main>
      </div>

      {/* Modals */}
      <ComposeModal
        isOpen={isComposeOpen}
        onClose={handleCloseCompose}
        onSubmit={handleCreatePost}
        editPost={editingPost}
      />

      <ReceiveShareModal
        isOpen={isReceiveShareOpen}
        onClose={() => setIsReceiveShareOpen(false)}
        onSuccess={loadPosts}
      />
    </div>
  );
}
