import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, 
  Plus, 
  Search, 
  Filter, 
  Clock, 
  Eye, 
  Heart,
  Folder,
  Edit3,
  Trash2,
  MoreHorizontal,
  Download,
  Share2,
  ChevronDown,
  Settings,
  User,
  FolderPlus,
  X,
  Check,
  FolderEdit,
  Bookmark,
  Archive,
  Lightbulb,
  Bug
} from 'lucide-react';
import { Navigation } from '@/components/Navigation';
import { FloatingMenu } from '@/components/FloatingMenu';
import { ComposeModal } from '@/components/ComposeModal';
import { ReceiveShareModal } from '@/components/ReceiveShareModal';
import { ReceiveStoryModal } from '@/components/ReceiveStoryModal';
import { ShareStoryModal } from '@/components/ShareStoryModal';
import { SEO } from '@/components/SEO';
import { cn } from '@/lib/utils';
import { getUser } from '@/lib/storage';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

interface Story {
  id: string;
  title: string;
  content: string;
  synopsis?: string;
  category: string;
  wordCount: number;
  characterCount: number;
  createdAt: string;
  updatedAt: string;
  isDraft: boolean;
  views: number;
  likes: number;
  sharedFrom?: {
    name: string;
    sharedAt: string;
  };
}

interface Category {
  id: string;
  name: string;
  color: string;
  isCustom?: boolean;
}

export default function Stories() {
  const [stories, setStories] = useState<Story[]>([]);
  const [categories, setCategories] = useState<Category[]>([
    { id: 'all', name: 'Semua', color: 'bg-blue-500' },
    { id: 'senang', name: 'Senang', color: 'bg-green-500' },
    { id: 'sedih', name: 'Sedih', color: 'bg-blue-500' },
  ]);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editingStoryCategory, setEditingStoryCategory] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeTab, setActiveTab] = useState<'personal' | 'shared'>('personal');
  const [searchQuery, setSearchQuery] = useState('');
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [isReceiveShareOpen, setIsReceiveShareOpen] = useState(false);
  const [isReceiveStoryOpen, setIsReceiveStoryOpen] = useState(false);
  const [shareStory, setShareStory] = useState<Story | null>(null);
  const [deleteStory, setDeleteStory] = useState<Story | null>(null);
  const [categoryPickerStory, setCategoryPickerStory] = useState<Story | null>(null);
  const [manageCategoriesOpen, setManageCategoriesOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [editCategoryName, setEditCategoryName] = useState('');
  const navigate = useNavigate();
  const user = getUser();

  useEffect(() => {
    loadStories();
    loadCategories();
  }, []);

  const loadCategories = () => {
    const saved = localStorage.getItem('selfq-story-categories');
    if (saved) {
      const custom = JSON.parse(saved);
      setCategories(prev => [
        ...prev.filter(c => !c.isCustom),
        ...custom
      ]);
    }
  };

  const addCategory = () => {
    if (!newCategoryName.trim()) return;
    const newCategory = {
      id: Date.now().toString(),
      name: newCategoryName,
      color: 'bg-purple-500',
      isCustom: true
    };
    const updated = [...categories, newCategory];
    setCategories(updated);
    localStorage.setItem('selfq-story-categories', JSON.stringify(updated.filter(c => c.isCustom)));
    setNewCategoryName('');
    setIsAddingCategory(false);
  };

  const deleteCategory = (categoryId: string) => {
    const updated = categories.filter(c => c.id !== categoryId);
    setCategories(updated);
    localStorage.setItem('selfq-story-categories', JSON.stringify(updated.filter(c => c.isCustom)));
    // Update stories that use this category to 'all'
    const updatedStories = stories.map(s => s.category === categoryId ? { ...s, category: 'all' } : s);
    setStories(updatedStories);
  };

  const updateCategory = (categoryId: string, newName: string) => {
    if (!newName.trim()) return;
    const updated = categories.map(c => c.id === categoryId ? { ...c, name: newName } : c);
    setCategories(updated);
    localStorage.setItem('selfq-story-categories', JSON.stringify(updated.filter(c => c.isCustom)));
    setEditingCategory(null);
    setEditCategoryName('');
  };

  const updateStoryCategory = (storyId: string, categoryId: string) => {
    const updatedStory = stories.find(s => s.id === storyId);
    if (updatedStory) {
      updatedStory.category = categoryId;
      localStorage.setItem(storyId, JSON.stringify(updatedStory));
      setStories(prev => prev.map(s => s.id === storyId ? { ...s, category: categoryId } : s));
    }
    setEditingStoryCategory(null);
  };

  const handleDeleteStory = (storyId: string) => {
    localStorage.removeItem(storyId);
    setStories(prev => prev.filter(s => s.id !== storyId));
    setDeleteStory(null);
  };

  const loadStories = async () => {
    try {
      const allStories: Story[] = [];
      const processedIds = new Set<string>();
      
      // Load from localStorage for now
      const savedStories = localStorage.getItem('selfq-stories');
      if (savedStories) {
        const parsed = JSON.parse(savedStories);
        parsed.forEach((story: Story) => {
          if (!processedIds.has(story.id)) {
            allStories.push(story);
            processedIds.add(story.id);
          }
        });
      }
      
      // Also check for individual story saves
      const keys = Object.keys(localStorage);
      const storyKeys = keys.filter(key => key.startsWith('story-'));
      
      storyKeys.forEach(key => {
        try {
          const story = JSON.parse(localStorage.getItem(key) || '{}');
          if (story.id && !processedIds.has(story.id)) {
            allStories.push(story);
            processedIds.add(story.id);
          }
        } catch {
          // Skip invalid stories
        }
      });
      
      setStories(allStories);
    } catch (error) {
      console.error('Failed to load stories:', error);
    }
  };

  const filteredStories = stories.filter(story => {
    const matchesTab = activeTab === 'personal' ? !story.sharedFrom : story.sharedFrom;
    const matchesCategory = activeCategory === 'all' || story.category === activeCategory;
    const matchesSearch = story.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         story.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="Ceritamu - selfQ"
        description="Tulis dan kelola cerita pribadi di selfQ"
        keywords="cerita, menulis, story, selfq"
      />
      
      <Navigation />

      <div className="main-with-sidebar">
        {/* Mobile Header */}
        <header className="clean-nav sticky top-0 z-30 md:hidden">
          <div className="container flex items-center justify-between h-16 px-4">
            <div className="flex items-center gap-3">
              <img src="/images/logo/logo.png" alt="selfQ Logo" className="w-8 h-8 rounded-xl" />
              <h1 className="text-lg font-bold">Ceritamu</h1>
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
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/stories/new')}>
                    <Plus className="w-4 h-4 mr-2" />
                    Tulis Cerita
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setIsReceiveStoryOpen(true)}>
                    <Download className="w-4 h-4 mr-2" />
                    Terima Cerita
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </header>
        {/* Tab Navigation */}
        <div className="border-b border-white/20 backdrop-blur-2xl bg-white/60 dark:bg-gray-900/60 sticky top-16 md:top-0 z-20">
          <div className="container px-4 md:px-6">
            <div className="flex justify-center">
              <div className="tab-nav max-w-md w-full">
                <button
                  onClick={() => setActiveTab('personal')}
                  className={`tab-item flex-1 text-center ${activeTab === 'personal' ? 'active' : ''}`}
                >
                  Pribadi
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

        {/* Search & Filter */}
        <div className="container px-4 md:px-6 py-6">
          <div className="glass-card p-6 mb-6">
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari cerita..."
                  className="glass-input pl-12"
                />
              </div>
              
              {/* Filter Button */}
              <button className="glass-button">
                <Filter className="w-5 h-5" />
                Filter
              </button>
            </div>
          </div>

          {/* Categories */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3 px-1">
              <h3 className="text-sm font-medium text-muted-foreground">Kategori Cerita:</h3>
              <button
                onClick={() => setManageCategoriesOpen(true)}
                className="text-xs text-primary hover:underline flex items-center gap-1"
              >
                <FolderEdit className="w-3 h-3" />
                Kelola Kategori
              </button>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={cn(
                    'glass-button whitespace-nowrap transition-all duration-300',
                    activeCategory === category.id
                      ? `${category.color} text-white shadow-lg`
                      : 'hover:bg-white/50'
                  )}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          {/* Stories Grid */}
          <div className="space-y-6 pb-32 md:pb-6">
            <AnimatePresence mode="popLayout">
              {filteredStories.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="col-span-full text-center py-20"
                >
                  <div className="soft-card text-center">
                    <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">
                      {activeTab === 'shared' ? 'Belum ada cerita yang dibagikan' : 'Belum ada cerita'}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                      {activeTab === 'shared' 
                        ? 'Terima cerita dari teman atau komunitas'
                        : 'Mulai menulis cerita pertama Anda'
                      }
                    </p>
                    <div className="flex gap-3 justify-center">
                      {activeTab === 'shared' ? (
                        <button
                          onClick={() => setIsReceiveStoryOpen(true)}
                          className="flex pill-button bg-gradient-to-r from-green-500 to-emerald-500 text-white"
                        >
                          <Download className="w-5 h-5 mr-2" />
                          Terima Cerita
                        </button>
                      ) : (
                        <button
                          onClick={() => navigate('/stories/new')}
                          className="flex pill-button bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                        >
                          <Plus className="w-5 h-5 mr-2" />
                          Tulis Cerita
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ) : (
                filteredStories.map((story) => (
                  <motion.article
                    key={story.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="soft-card cursor-pointer group"
                    onClick={() => navigate(`/stories/view/${story.id}`)}
                  >
                    {/* Story Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h2 className="font-bold text-xl mb-2 group-hover:text-purple-600 transition-colors line-clamp-2">
                          {story.title}
                        </h2>
                        {story.synopsis && (
                          <p className="text-gray-600 dark:text-gray-400 line-clamp-2 mb-3">
                            {story.synopsis}
                          </p>
                        )}
                      </div>
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button
                            onClick={(e) => e.stopPropagation()}
                            className="p-2 rounded-full hover:bg-secondary transition-colors"
                          >
                            <MoreHorizontal className="w-5 h-5 text-muted-foreground" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/stories/edit/${story.id}`);
                            }}
                          >
                            <Edit3 className="w-4 h-4 mr-2" />
                            Edit Cerita
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation();
                              setCategoryPickerStory(story);
                            }}
                          >
                            <FolderPlus className="w-4 h-4 mr-2" />
                            Tambah Kategori
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation();
                              setShareStory(story);
                            }}
                          >
                            <Share2 className="w-4 h-4 mr-2" />
                            Bagikan Cerita
                          </DropdownMenuItem>
                          {!story.sharedFrom && (
                            <>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setDeleteStory(story);
                                }}
                                className="text-destructive focus:text-destructive"
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Hapus Cerita
                              </DropdownMenuItem>
                            </>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    {/* Story Content Preview */}
                    <div className="mb-4">
                      <p className="text-gray-700 dark:text-gray-300 line-clamp-3 leading-relaxed">
                        {story.content}
                      </p>
                    </div>

                    {/* Story Meta */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        {editingStoryCategory === story.id ? (
                          <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                            {categories.filter(c => c.id !== 'all').map((cat) => (
                              <button
                                key={cat.id}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  updateStoryCategory(story.id, cat.id);
                                }}
                                className={cn(
                                  'px-3 py-1 rounded-full text-xs font-medium transition-all backdrop-blur-xl border border-white/20',
                                  story.category === cat.id 
                                    ? 'bg-primary/20 text-primary border-primary/30' 
                                    : 'bg-white/30 dark:bg-gray-800/30 hover:bg-white/50 dark:hover:bg-gray-700/50'
                                )}
                              >
                                {cat.name}
                              </button>
                            ))}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setEditingStoryCategory(null);
                              }}
                              className="px-2 py-1 rounded-full text-xs backdrop-blur-xl bg-white/30 dark:bg-gray-800/30 border border-white/20 hover:bg-white/50 dark:hover:bg-gray-700/50"
                            >
                              ✕
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingStoryCategory(story.id);
                            }}
                            className="px-3 py-1 rounded-full text-xs font-medium backdrop-blur-xl bg-white/30 dark:bg-gray-800/30 border border-white/20 hover:bg-white/50 dark:hover:bg-gray-700/50 transition-all"
                            title="Klik untuk ubah kategori"
                          >
                            {categories.find(c => c.id === story.category)?.name || story.category} ▼
                          </button>
                        )}
                        
                        {story.isDraft && (
                          <span className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                            Draft
                          </span>
                        )}
                        {story.sharedFrom && (
                          <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                            Dari {story.sharedFrom.name}
                          </span>
                        )}
                      </div>
                      
                      <button className="pill-button bg-gradient-to-r from-blue-500 to-purple-500 text-white text-sm px-4 py-2">
                        Baca Selengkapnya
                      </button>
                    </div>

                    {/* Story Stats */}
                    <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{story.wordCount.toLocaleString()} kata</span>
                        </div>
                      </div>
                      
                      <div className="text-xs">
                        {new Date(story.updatedAt).toLocaleDateString('id-ID')}
                      </div>
                    </div>
                  </motion.article>
                ))
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <FloatingMenu
        onCompose={() => setIsComposeOpen(true)}
        onReceiveShare={() => setIsReceiveShareOpen(true)}
      />

      <ComposeModal
        isOpen={isComposeOpen}
        onClose={() => setIsComposeOpen(false)}
        onSubmit={async () => {}}
      />

      <ReceiveStoryModal
        isOpen={isReceiveStoryOpen}
        onClose={() => setIsReceiveStoryOpen(false)}
        onSuccess={loadStories}
      />

      <ShareStoryModal
        isOpen={!!shareStory}
        onClose={() => setShareStory(null)}
        story={shareStory!}
      />

      {deleteStory && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card w-full max-w-md"
          >
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-2">Hapus Cerita</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Yakin hapus "{deleteStory.title}"? Tidak bisa dibatalkan.
              </p>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setDeleteStory(null)}
                  className="glass-button border border-gray-300 dark:border-gray-600"
                >
                  Batal
                </button>
                <button
                  onClick={() => handleDeleteStory(deleteStory.id)}
                  className="glass-button bg-red-500 text-white"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Hapus
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Category Picker Modal */}
      {categoryPickerStory && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card w-full max-w-md"
          >
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-2">Pilih Kategori</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Pilih kategori untuk "{categoryPickerStory.title}"
              </p>
              <div className="space-y-2 mb-6">
                {categories.filter(c => c.id !== 'all').map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => {
                      updateStoryCategory(categoryPickerStory.id, cat.id);
                      setCategoryPickerStory(null);
                    }}
                    className={cn(
                      'w-full px-4 py-3 rounded-lg text-left transition-all backdrop-blur-xl border',
                      categoryPickerStory.category === cat.id
                        ? 'bg-primary/20 text-primary border-primary/30 font-medium'
                        : 'bg-white/30 dark:bg-gray-800/30 border-white/20 hover:bg-white/50 dark:hover:bg-gray-700/50'
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <div className={cn('w-3 h-3 rounded-full', cat.color)}></div>
                      {cat.name}
                    </div>
                  </button>
                ))}
              </div>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setCategoryPickerStory(null)}
                  className="glass-button border border-gray-300 dark:border-gray-600"
                >
                  Batal
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Manage Categories Modal */}
      {manageCategoriesOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card w-full max-w-md max-h-[80vh] overflow-y-auto"
          >
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-2">Kelola Kategori</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Tambah, edit, atau hapus kategori cerita
              </p>
              
              {/* Add New Category */}
              <div className="mb-4 p-3 rounded-lg bg-white/30 dark:bg-gray-800/30 border border-white/20">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addCategory()}
                    placeholder="Nama kategori baru..."
                    className="glass-input text-sm flex-1"
                  />
                  <button
                    onClick={addCategory}
                    className="glass-button bg-primary text-white px-3"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Category List */}
              <div className="space-y-2 mb-6">
                {categories.filter(c => c.id !== 'all').map((cat) => (
                  <div
                    key={cat.id}
                    className="flex items-center gap-2 p-3 rounded-lg bg-white/30 dark:bg-gray-800/30 border border-white/20"
                  >
                    <div className={cn('w-3 h-3 rounded-full flex-shrink-0', cat.color)}></div>
                    
                    {editingCategory === cat.id ? (
                      <>
                        <input
                          type="text"
                          value={editCategoryName}
                          onChange={(e) => setEditCategoryName(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && updateCategory(cat.id, editCategoryName)}
                          className="glass-input text-sm flex-1 py-1"
                          autoFocus
                        />
                        <button
                          onClick={() => updateCategory(cat.id, editCategoryName)}
                          className="p-1 hover:bg-green-500/20 rounded"
                        >
                          <Check className="w-4 h-4 text-green-600" />
                        </button>
                        <button
                          onClick={() => {
                            setEditingCategory(null);
                            setEditCategoryName('');
                          }}
                          className="p-1 hover:bg-red-500/20 rounded"
                        >
                          <X className="w-4 h-4 text-red-600" />
                        </button>
                      </>
                    ) : (
                      <>
                        <span className="flex-1 text-sm font-medium">{cat.name}</span>
                        {cat.isCustom && (
                          <>
                            <button
                              onClick={() => {
                                setEditingCategory(cat.id);
                                setEditCategoryName(cat.name);
                              }}
                              className="p-1 hover:bg-blue-500/20 rounded"
                            >
                              <Edit3 className="w-4 h-4 text-blue-600" />
                            </button>
                            <button
                              onClick={() => deleteCategory(cat.id)}
                              className="p-1 hover:bg-red-500/20 rounded"
                            >
                              <Trash2 className="w-4 h-4 text-red-600" />
                            </button>
                          </>
                        )}
                        {!cat.isCustom && (
                          <span className="text-xs text-muted-foreground">Default</span>
                        )}
                      </>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => {
                    setManageCategoriesOpen(false);
                    setEditingCategory(null);
                    setEditCategoryName('');
                    setNewCategoryName('');
                  }}
                  className="glass-button bg-primary text-white"
                >
                  Selesai
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}