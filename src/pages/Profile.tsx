import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Camera, User as UserIcon, Heart, MessageCircle, Image, Video, ChevronDown, Settings, Edit, HelpCircle, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getUser, updateUser } from '@/lib/storage';
import { getAllPosts, addPost, toggleLike, deletePost } from '@/lib/db';
import { calculateStats } from '@/lib/stats';
import type { User as UserType, Post, MediaItem } from '@/lib/types';
import { Navigation } from '@/components/Navigation';
import { SEO } from '@/components/SEO';
import { ComposeModal } from '@/components/ComposeModal';
import { FloatingMenu } from '@/components/FloatingMenu';
import { ReceiveShareModal } from '@/components/ReceiveShareModal';
import { toast } from 'sonner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

import { compressImage } from '@/lib/performance';

const MAX_AVATAR_SIZE = 2 * 1024 * 1024; // 2MB

export default function Profile() {
  const [user, setUser] = useState<UserType | null>(null);
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [avatar, setAvatar] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [stats, setStats] = useState({ totalPosts: 0, totalLikes: 0, totalComments: 0, totalMedia: 0 });
  const [activeTab, setActiveTab] = useState<'posts' | 'media' | 'likes' | 'comments'>('posts');
  const [posts, setPosts] = useState<Post[]>([]);
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [isReceiveShareOpen, setIsReceiveShareOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const currentUser = getUser();
    if (!currentUser) {
      return;
    }
    setUser(currentUser);
    setName(currentUser.name);
    setBio(currentUser.bio || '');
    setAvatar(currentUser.avatar || null);

    loadStats();
  }, []);

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
    await loadStats();
  };

  const loadStats = async () => {
    const allPosts = await getAllPosts();
    setPosts(allPosts);
    const calculated = calculateStats(allPosts);
    
    const totalComments = allPosts.reduce((sum, post) => sum + (post.comments?.length || 0), 0);
    const totalMedia = allPosts.filter(post => post.image || post.video).length;
    
    setStats({
      totalPosts: calculated.totalPosts,
      totalLikes: calculated.totalLikes,
      totalComments,
      totalMedia,
    });
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('File harus berupa gambar');
      return;
    }

    if (file.size > MAX_AVATAR_SIZE) {
      toast.error('Ukuran gambar maksimal 2MB');
      return;
    }

    try {
      // Compress image for better performance
      const compressedImage = await compressImage(file, 400, 0.8);
      setAvatar(compressedImage);
      toast.success('Foto profil berhasil diubah');
    } catch (error) {
      toast.error('Gagal memproses gambar');
    }
    
    e.target.value = '';
  };

  const handleSave = async () => {
    if (!name.trim()) {
      toast.error('Nama tidak boleh kosong');
      return;
    }

    setIsSaving(true);
    try {
      const updated = updateUser({
        name: name.trim(),
        bio: bio.trim() || undefined,
        avatar: avatar || undefined,
      });
      
      if (updated) {
        setUser(updated);
        setIsEditing(false);
        toast.success('Profil berhasil disimpan');
        
        // Verify avatar is saved
        const savedUser = getUser();
        if (savedUser?.avatar !== avatar) {
          console.warn('Avatar not properly saved, retrying...');
          updateUser({ avatar: avatar || undefined });
        }
      } else {
        toast.error('Gagal menyimpan profil');
      }
    } catch (error) {
      console.error('Save profile error:', error);
      toast.error('Gagal menyimpan profil');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (user) {
      setName(user.name);
      setBio(user.bio || '');
      setAvatar(user.avatar || null);
    }
    setIsEditing(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title={`${user.name} - Profil | selfX`}
        description={`Profil ${user.name} di selfX - platform sosial media pribadi offline`}
        keywords="profil selfx, user profile, sosial media pribadi"
      />
      
      {/* Navigation */}
      <Navigation 
        onCompose={() => setIsComposeOpen(true)}
      />

      {/* Main Content */}
      <div className="main-with-sidebar">
        {/* Mobile Header */}
        <header className="clean-nav sticky top-0 z-30 md:hidden">
          <div className="container flex items-center justify-between h-16 px-4">
            <div className="flex items-center gap-3">
              <img src="/images/logo/logo.png" alt="selfX Logo" className="w-8 h-8 rounded-xl" />
              <h1 className="text-lg font-bold">Profil</h1>
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
                  <DropdownMenuItem onClick={() => setIsEditing(!isEditing)}>
                    <Edit className="w-4 h-4 mr-2" />
                    {isEditing ? 'Batal Edit' : 'Edit Profil'}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/help')}>
                    <HelpCircle className="w-4 h-4 mr-2" />
                    Pusat Bantuan
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/about')}>
                    <Info className="w-4 h-4 mr-2" />
                    Tentang selfX
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

        {/* Profile Info */}
        <div className="container px-4 md:px-6 py-8 relative z-10">
          {/* Edit Controls - Above Card */}
          {isEditing && (
            <div className="flex items-center justify-end gap-2 mb-4">
              <button
                onClick={handleCancel}
                className="px-4 py-2 text-sm font-medium bg-secondary border border-border/30 rounded-full hover:bg-secondary/80 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="px-4 py-2 text-sm font-medium bg-primary text-white rounded-full hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                {isSaving ? (
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                ) : (
                  'Simpan'
                )}
              </button>
            </div>
          )}
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="modern-card p-6 mb-6"
          >
            {/* Avatar and Name Section */}
            <div className="flex items-center gap-4 mb-6">
              <div className="relative flex-shrink-0">
                <div className="avatar-2xl rounded-full overflow-hidden bg-gradient-to-br from-mint-medium to-mint-dark flex items-center justify-center border-4 border-background">
                  {avatar ? (
                    <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <UserIcon className="w-8 h-8 text-white" />
                  )}
                </div>
                <button
                  onClick={() => isEditing && fileInputRef.current?.click()}
                  disabled={!isEditing}
                  className={`absolute bottom-0 right-0 p-2 rounded-full shadow-lg transition-colors ${
                    isEditing 
                      ? 'bg-primary text-white hover:bg-primary/90 cursor-pointer' 
                      : 'bg-muted text-muted-foreground cursor-not-allowed'
                  }`}
                >
                  <Camera className="w-4 h-4" />
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
              </div>
              
              <div className="flex-1 min-w-0">
                {isEditing ? (
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="text-2xl font-bold bg-secondary/50 border border-border/30 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="Nama"
                  />
                ) : (
                  <h2 className="text-2xl font-bold truncate">{user.name}</h2>
                )}
              </div>
              
              {/* Edit Icon Button */}
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="p-2 rounded-full bg-primary text-white hover:bg-primary/90 transition-colors"
                >
                  <Edit className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Bio Section */}
            <div className="mb-4">
              {isEditing ? (
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Bio..."
                  className="w-full bg-secondary/50 border border-border/30 rounded-lg px-3 py-2 resize-none text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  rows={3}
                  maxLength={200}
                />
              ) : (
                <p className="text-sm text-muted-foreground min-h-[1.5rem]">
                  {user.bio || 'Belum ada bio'}
                </p>
              )}
            </div>

            {/* Stats */}
            <div className="flex gap-6 mb-4">
              <div className="profile-stat">
                <div className="profile-stat-number">{stats.totalPosts}</div>
                <div className="profile-stat-label">Post</div>
              </div>
              <div className="profile-stat">
                <div className="profile-stat-number">{stats.totalLikes}</div>
                <div className="profile-stat-label">Disukai</div>
              </div>
              <div className="profile-stat">
                <div className="profile-stat-number">{stats.totalComments}</div>
                <div className="profile-stat-label">Komentar</div>
              </div>
              <div className="profile-stat">
                <div className="profile-stat-number">{stats.totalMedia}</div>
                <div className="profile-stat-label">Media</div>
              </div>
            </div>
          </motion.div>

          {/* Tab Navigation */}
          <div className="tab-nav mb-4">
            <button
              onClick={() => setActiveTab('posts')}
              className={`tab-item ${activeTab === 'posts' ? 'active' : ''}`}
            >
              Post
            </button>
            <button
              onClick={() => setActiveTab('media')}
              className={`tab-item ${activeTab === 'media' ? 'active' : ''}`}
            >
              Media
            </button>
            <button
              onClick={() => setActiveTab('likes')}
              className={`tab-item ${activeTab === 'likes' ? 'active' : ''}`}
            >
              Suka
            </button>
            <button
              onClick={() => setActiveTab('comments')}
              className={`tab-item ${activeTab === 'comments' ? 'active' : ''}`}
            >
              Komentar
            </button>
          </div>

          {/* Content */}
          <div className="pb-32 md:pb-4">
            {activeTab === 'posts' && (
              <div className="space-y-4">
                {posts.filter(post => !post.image && !post.video).length > 0 ? (
                  posts.filter(post => !post.image && !post.video).map(post => (
                    <div key={post.id} className="modern-card p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="avatar-sm rounded-full bg-gradient-to-br from-mint-medium to-mint-dark flex items-center justify-center">
                          {avatar ? (
                            <img src={avatar} alt="Avatar" className="w-full h-full object-cover rounded-full" />
                          ) : (
                            <UserIcon className="w-5 h-5 text-white" />
                          )}
                        </div>
                        <div>
                          <div className="text-username">{user.name}</div>
                          <div className="text-metadata">{new Date(post.createdAt).toLocaleDateString('id-ID')}</div>
                        </div>
                      </div>
                      {post.title && <h3 className="font-semibold mb-2">{post.title}</h3>}
                      <p className="text-foreground mb-3">{post.content}</p>
                      <div className="flex items-center gap-4 pt-3 border-t border-border/30">
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Heart className={`w-4 h-4 ${post.liked ? 'fill-current text-like' : ''}`} />
                          {post.liked ? 'Disukai' : ''}
                        </div>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <MessageCircle className="w-4 h-4" />
                          {post.comments?.length || 0} komentar
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">Belum ada post text</p>
                  </div>
                )}
              </div>
            )}
            
            {activeTab === 'media' && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {posts.filter(post => post.image || post.video).length > 0 ? (
                  posts.filter(post => post.image || post.video).map(post => (
                    <div key={post.id} className="aspect-square rounded-lg overflow-hidden bg-secondary/30 relative">
                      {post.image ? (
                        <img src={post.image} alt="Media" className="w-full h-full object-cover" />
                      ) : post.video ? (
                        <>
                          <video src={post.video} className="w-full h-full object-cover" />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Video className="w-8 h-8 text-white drop-shadow-lg" />
                          </div>
                        </>
                      ) : null}
                    </div>
                  ))
                ) : (
                  <div className="col-span-full text-center py-12">
                    <Image className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                    <p className="text-muted-foreground">Belum ada media</p>
                  </div>
                )}
              </div>
            )}
            
            {activeTab === 'likes' && (
              <div className="space-y-4">
                {posts.filter(post => post.liked).length > 0 ? (
                  posts.filter(post => post.liked).map(post => (
                    <div key={post.id} className="modern-card p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <Heart className="w-5 h-5 text-like fill-current" />
                        <span className="text-sm text-muted-foreground">Anda menyukai ini</span>
                      </div>
                      {post.title && <h3 className="font-semibold mb-2">{post.title}</h3>}
                      <p className="text-foreground">{post.content}</p>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <Heart className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                    <p className="text-muted-foreground">Belum ada post yang disukai</p>
                  </div>
                )}
              </div>
            )}
            
            {activeTab === 'comments' && (
              <div className="space-y-4">
                {posts.filter(post => post.comments && post.comments.length > 0).length > 0 ? (
                  posts.filter(post => post.comments && post.comments.length > 0).map(post => (
                    <div key={post.id} className="modern-card p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <MessageCircle className="w-5 h-5 text-primary" />
                        <span className="text-sm text-muted-foreground">{post.comments?.length} komentar</span>
                      </div>
                      {post.title && <h3 className="font-semibold mb-2">{post.title}</h3>}
                      <p className="text-foreground mb-3">{post.content}</p>
                      <div className="space-y-2">
                        {post.comments?.slice(0, 2).map(comment => (
                          <div key={comment.id} className="bg-secondary/30 rounded-lg p-3">
                            <p className="text-sm">{comment.content}</p>
                          </div>
                        ))}
                        {(post.comments?.length || 0) > 2 && (
                          <p className="text-xs text-muted-foreground">+{(post.comments?.length || 0) - 2} komentar lainnya</p>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <MessageCircle className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                    <p className="text-muted-foreground">Belum ada komentar</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Floating Menu */}
      <FloatingMenu
        onCompose={() => setIsComposeOpen(true)}
        onReceiveShare={() => setIsReceiveShareOpen(true)}
      />

      {/* Compose Modal */}
      <ComposeModal
        isOpen={isComposeOpen}
        onClose={() => setIsComposeOpen(false)}
        onSubmit={handleCreatePost}
      />

      {/* Receive Share Modal */}
      <ReceiveShareModal
        isOpen={isReceiveShareOpen}
        onClose={() => setIsReceiveShareOpen(false)}
        onSuccess={loadStats}
      />
    </div>
  );
}
