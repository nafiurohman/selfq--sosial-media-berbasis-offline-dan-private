import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar as CalendarIcon, ChevronDown, User, Settings, Bookmark, Archive, Lightbulb, Bug } from 'lucide-react';
import { format, isSameDay } from 'date-fns';
import { id } from 'date-fns/locale';
import { getAllPosts, toggleLike, deletePost, addPost } from '@/lib/db';
import type { Post, MediaItem } from '@/lib/types';
import { Navigation } from '@/components/Navigation';
import { SEO } from '@/components/SEO';
import { CalendarHeatmap } from '@/components/CalendarHeatmap';
import { PeriodSummary } from '@/components/PeriodSummary';
import { PostCard } from '@/components/PostCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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

export default function CalendarView() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [isReceiveShareOpen, setIsReceiveShareOpen] = useState(false);
  const navigate = useNavigate();
  const user = getUser();

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

  const postsOnSelectedDate = useMemo(() => {
    return posts.filter(post => 
      isSameDay(new Date(post.createdAt), selectedDate)
    );
  }, [posts, selectedDate]);

  const handleLike = async (id: string) => {
    const updated = await toggleLike(id);
    if (updated) {
      setPosts(prev => prev.map(p => p.id === id ? updated : p));
    }
  };

  const handleDelete = async (id: string) => {
    await deletePost(id);
    setPosts(prev => prev.filter(p => p.id !== id));
  };

  const handlePostUpdate = (updatedPost: Post) => {
    setPosts(prev => prev.map(p => p.id === updatedPost.id ? updatedPost : p));
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
    await loadPosts();
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="Kalender - selfQ"
        description="Lihat aktivitas posting dalam tampilan kalender"
        keywords="kalender selfq, calendar view, heatmap aktivitas"
      />
      
      <Navigation />

      <div className="main-with-sidebar">
        {/* Mobile Header */}
        <header className="clean-nav sticky top-0 z-30 md:hidden">
          <div className="container flex items-center justify-between h-16 px-4">
            <div className="flex items-center gap-3">
              <img src="/images/logo/logo.png" alt="selfQ Logo" className="w-8 h-8 rounded-xl" />
              <h1 className="text-lg font-bold">Kalender</h1>
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

        {/* Content */}
        <main className="container px-4 md:px-6 py-6 pb-32 md:pb-6">
          {isLoading ? (
            <div className="space-y-4">
              <div className="modern-card p-6 animate-pulse">
                <div className="h-8 bg-muted rounded w-1/3 mb-4" />
                <div className="h-64 bg-muted rounded" />
              </div>
            </div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="modern-card p-6"
                >
                  <CalendarHeatmap
                    posts={posts}
                    onDateSelect={setSelectedDate}
                    selectedDate={selectedDate}
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="modern-card p-6"
                >
                  <Tabs value="month" onValueChange={() => {}}>
                    <TabsList className="grid w-full grid-cols-2 mb-4">
                      <TabsTrigger value="month">Bulan Ini</TabsTrigger>
                      <TabsTrigger value="year">Tahun Ini</TabsTrigger>
                    </TabsList>
                    <TabsContent value="month">
                      <PeriodSummary posts={posts} period="month" date={selectedDate} />
                    </TabsContent>
                    <TabsContent value="year">
                      <PeriodSummary posts={posts} period="year" date={selectedDate} />
                    </TabsContent>
                  </Tabs>
                </motion.div>
              </div>

              <div className="space-y-4">
                <div className="sticky top-20">
                  <div className="modern-card p-4 mb-4">
                    <div className="flex items-center gap-2 text-muted-foreground mb-2">
                      <CalendarIcon className="w-4 h-4" />
                      <span className="text-sm font-medium">Tanggal Dipilih</span>
                    </div>
                    <p className="text-lg font-semibold">
                      {format(selectedDate, 'dd MMMM yyyy', { locale: id })}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {postsOnSelectedDate.length} post
                    </p>
                  </div>

                  <div className="space-y-3 max-h-[600px] overflow-y-auto">
                    {postsOnSelectedDate.length === 0 ? (
                      <div className="text-center py-12 modern-card p-6">
                        <CalendarIcon className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                        <p className="text-muted-foreground text-sm">
                          Tidak ada post pada tanggal ini
                        </p>
                      </div>
                    ) : (
                      postsOnSelectedDate.map(post => (
                        <PostCard
                          key={post.id}
                          post={post}
                          onLike={handleLike}
                          onDelete={handleDelete}
                          onEdit={() => {}}
                          onUpdate={handlePostUpdate}
                        />
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      <FloatingMenu
        onCompose={() => setIsComposeOpen(true)}
        onReceiveShare={() => setIsReceiveShareOpen(true)}
      />

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
