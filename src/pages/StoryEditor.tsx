import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft,
  Save,
  Eye,
  Settings,
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  List,
  Quote,
  Undo,
  Redo,
  Type,
  FileText,
  Clock,
  Target,
  Users,
  Lightbulb,
  BookOpen,
  Palette,
  Download,
  Moon,
  Sun,
  Share2,
  MoreVertical
} from 'lucide-react';
import { SEO } from '@/components/SEO';
import { cn } from '@/lib/utils';
import { toast } from '@/lib/toast';
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
  synopsis: string;
  category: string;
  wordCount: number;
  characterCount: number;
  createdAt: string;
  updatedAt: string;
  isDraft: boolean;
}

interface Character {
  id: string;
  name: string;
  description: string;
  traits: string[];
}

const categories = [
  { id: 'senang', name: 'Senang', color: 'bg-green-500' },
  { id: 'sedih', name: 'Sedih', color: 'bg-blue-500' },
  { id: 'romance', name: 'Romance', color: 'bg-pink-500' },
  { id: 'horror', name: 'Horror', color: 'bg-red-500' },
  { id: 'fantasy', name: 'Fantasy', color: 'bg-purple-500' },
  { id: 'drama', name: 'Drama', color: 'bg-yellow-500' },
  { id: 'comedy', name: 'Comedy', color: 'bg-green-500' },
  { id: 'mystery', name: 'Mystery', color: 'bg-indigo-500' },
];

const storyPrompts = [
  "Seseorang menemukan surat lama yang mengubah hidupnya...",
  "Di tengah hujan deras, dua orang asing bertemu di halte bus...",
  "Sebuah kafe tua menyimpan rahasia yang tak terduga...",
  "Ketika bangun tidur, dunia sudah berubah total...",
  "Sebuah foto lama membawa kenangan yang terlupakan...",
];

export default function StoryEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = id && id !== 'new';
  
  const [story, setStory] = useState<Story>({
    id: id || 'new',
    title: '',
    content: '',
    synopsis: '',
    category: 'senang',
    wordCount: 0,
    characterCount: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isDraft: true,
  });
  
  const [characters, setCharacters] = useState<Character[]>([]);
  const [activeTab, setActiveTab] = useState<'write' | 'characters' | 'outline' | 'settings'>('write');
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [autoSaveStatus, setAutoSaveStatus] = useState<'saved' | 'saving' | 'unsaved'>('saved');
  const [showPrompts, setShowPrompts] = useState(false);
  
  const contentRef = useRef<HTMLTextAreaElement>(null);
  const autoSaveRef = useRef<NodeJS.Timeout>();

  // Load existing story if editing
  useEffect(() => {
    if (isEditMode && id) {
      console.log('Loading story with ID:', id);
      const storyData = localStorage.getItem(`story-${id}`);
      console.log('Found story data:', storyData);
      
      if (storyData) {
        try {
          const parsed = JSON.parse(storyData);
          console.log('Parsed story:', parsed);
          setStory({
            ...parsed,
            id: id // Ensure ID matches the URL parameter
          });
        } catch (error) {
          console.error('Failed to parse story:', error);
        }
      } else {
        console.log('No story data found, checking alternative keys');
        // Try alternative storage keys
        const altData = localStorage.getItem(id);
        if (altData) {
          try {
            const parsed = JSON.parse(altData);
            setStory({
              ...parsed,
              id: id
            });
          } catch (error) {
            console.error('Failed to parse alternative story:', error);
          }
        }
      }
    }
  }, [id, isEditMode]);

  // Auto-save functionality
  useEffect(() => {
    if (autoSaveRef.current) {
      clearTimeout(autoSaveRef.current);
    }
    
    setAutoSaveStatus('unsaved');
    
    autoSaveRef.current = setTimeout(() => {
      setAutoSaveStatus('saving');
      // Simulate save
      setTimeout(() => {
        setAutoSaveStatus('saved');
        // Save to localStorage or database
        const storyId = story.id === 'new' ? `story-${Date.now()}` : story.id;
        const updatedStory = { ...story, id: storyId };
        localStorage.setItem(storyId, JSON.stringify(updatedStory));
        if (story.id === 'new') {
          setStory(updatedStory);
        }
      }, 500);
    }, 2000);

    return () => {
      if (autoSaveRef.current) {
        clearTimeout(autoSaveRef.current);
      }
    };
  }, [story.content, story.title, story.synopsis]);

  // Update word and character count
  useEffect(() => {
    const wordCount = story.content.trim().split(/\s+/).filter(word => word.length > 0).length;
    const characterCount = story.content.length;
    
    setStory(prev => ({
      ...prev,
      wordCount,
      characterCount,
      updatedAt: new Date().toISOString(),
    }));
  }, [story.content]);

  const handleSave = () => {
    setAutoSaveStatus('saving');
    
    // Generate proper ID if new story
    const storyId = story.id === 'new' ? `story-${Date.now()}` : story.id;
    const updatedStory = {
      ...story,
      id: storyId,
      updatedAt: new Date().toISOString()
    };
    
    // Save to localStorage
    localStorage.setItem(storyId, JSON.stringify(updatedStory));
    
    setTimeout(() => {
      setAutoSaveStatus('saved');
      toast.success('Cerita berhasil disimpan');
      // Navigate back to stories page
      navigate('/stories');
    }, 500);
  };

  const downloadStory = (format: 'docx' | 'pdf') => {
    const content = `${story.title}\n\n${story.synopsis ? story.synopsis + '\n\n' : ''}${story.content}`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${story.title || 'Untitled'}.${format === 'docx' ? 'txt' : 'txt'}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success(`Cerita diunduh sebagai ${format.toUpperCase()}`);
  };

  const insertPrompt = (prompt: string) => {
    const textarea = contentRef.current;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newContent = story.content.substring(0, start) + prompt + story.content.substring(end);
      setStory(prev => ({ ...prev, content: newContent }));
      setShowPrompts(false);
    }
  };

  const formatText = (format: string) => {
    const textarea = contentRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = story.content.substring(start, end);
    
    let formattedText = selectedText;
    switch (format) {
      case 'bold':
        formattedText = `**${selectedText}**`;
        break;
      case 'italic':
        formattedText = `*${selectedText}*`;
        break;
      case 'underline':
        formattedText = `_${selectedText}_`;
        break;
    }
    
    const newContent = story.content.substring(0, start) + formattedText + story.content.substring(end);
    setStory(prev => ({ ...prev, content: newContent }));
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title={story.title ? `${story.title} - Editor` : 'Editor Cerita - selfQ'}
        description="Editor cerita dengan fitur lengkap untuk menulis"
      />

      {/* Header */}
      <header className="sticky top-0 z-30 backdrop-blur-xl bg-white/70 dark:bg-gray-900/70 border-b border-white/20">
        <div className="flex items-center justify-between px-4 md:px-6 py-3">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/stories')}
              className="glass-button p-2"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={story.title}
                onChange={(e) => setStory(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Judul cerita..."
                className="glass-input text-lg font-semibold bg-transparent border-none focus:ring-0 p-0 min-w-0 w-auto"
                style={{ width: `${Math.max(story.title.length, 15)}ch` }}
              />
              
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span className={cn(
                  'flex items-center gap-1',
                  autoSaveStatus === 'saved' && 'text-green-600',
                  autoSaveStatus === 'saving' && 'text-yellow-600',
                  autoSaveStatus === 'unsaved' && 'text-red-600'
                )}>
                  <div className={cn(
                    'w-2 h-2 rounded-full',
                    autoSaveStatus === 'saved' && 'bg-green-500',
                    autoSaveStatus === 'saving' && 'bg-yellow-500 animate-pulse',
                    autoSaveStatus === 'unsaved' && 'bg-red-500'
                  )} />
                  {autoSaveStatus === 'saved' && 'Tersimpan'}
                  {autoSaveStatus === 'saving' && 'Menyimpan...'}
                  {autoSaveStatus === 'unsaved' && 'Belum tersimpan'}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Desktop buttons */}
            <div className="hidden md:flex items-center gap-1">
              <button
                onClick={() => downloadStory('docx')}
                className="glass-button p-2"
                title="Download as DOCX"
              >
                <Download className="w-5 h-5" />
              </button>
              
              <button
                onClick={() => {}}
                className="glass-button p-2"
                title="Share Story"
              >
                <Share2 className="w-5 h-5" />
              </button>
              
              <button
                onClick={() => setIsPreviewMode(!isPreviewMode)}
                className={cn(
                  'glass-button',
                  isPreviewMode && 'bg-purple-500 text-white'
                )}
              >
                <Eye className="w-5 h-5" />
                <span className="hidden sm:inline">Preview</span>
              </button>
              
              <button
                onClick={handleSave}
                className="glass-button bg-gradient-to-r from-purple-500 to-pink-500 text-white"
              >
                <Save className="w-5 h-5" />
                <span className="hidden sm:inline">Simpan</span>
              </button>
            </div>
            
            {/* Mobile dropdown menu */}
            <div className="md:hidden">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="glass-button p-2">
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handleSave}>
                    <Save className="w-4 h-4 mr-2" />
                    Simpan
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setIsPreviewMode(!isPreviewMode)}>
                    <Eye className="w-4 h-4 mr-2" />
                    {isPreviewMode ? 'Edit Mode' : 'Preview'}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => downloadStory('docx')}>
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => {}}>
                    <Share2 className="w-4 h-4 mr-2" />
                    Bagikan
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-73px)]">
        {/* Mobile Category Selector - Only visible on mobile when in settings tab */}
        {activeTab === 'settings' && (
          <div className="lg:hidden fixed inset-x-0 top-16 z-20 bg-background/95 backdrop-blur-xl border-b border-white/20 p-4">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Palette className="w-4 h-4" />
              Pilih Kategori Cerita
            </h3>
            <div className="grid grid-cols-2 gap-2 mb-2">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setStory(prev => ({ ...prev, category: cat.id }))}
                  className={cn(
                    'p-2 rounded-lg text-sm font-medium transition-all',
                    story.category === cat.id
                      ? `${cat.color} text-white`
                      : 'bg-white/50 dark:bg-gray-800/50 hover:bg-white/70'
                  )}
                >
                  {cat.name}
                </button>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">
              Terpilih: <span className="font-medium">{categories.find(c => c.id === story.category)?.name}</span>
            </p>
          </div>
        )}
        {/* Sidebar */}
        <aside className="w-80 border-r border-white/20 backdrop-blur-xl bg-white/50 dark:bg-gray-900/50 hidden lg:block">
          <div className="p-6">
            {/* Tab Navigation */}
            <div className="flex gap-1 mb-6 p-1 bg-white/50 dark:bg-gray-800/50 rounded-2xl">
              {[
                { id: 'write', icon: Type, label: 'Tulis' },
                { id: 'characters', icon: Users, label: 'Karakter' },
                { id: 'outline', icon: FileText, label: 'Outline' },
                { id: 'settings', icon: Settings, label: 'Setting' },
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={cn(
                      'flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-sm font-medium transition-all',
                      activeTab === tab.id
                        ? 'bg-white dark:bg-gray-700 shadow-lg text-purple-600 dark:text-purple-400'
                        : 'text-gray-600 dark:text-gray-400 hover:text-purple-600'
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="hidden xl:inline">{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Tab Content */}
            <div className="space-y-4">
              {activeTab === 'write' && (
                <div className="space-y-4">
                  {/* Word Count */}
                  <div className="glass-card p-4">
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <Target className="w-4 h-4" />
                      Statistik
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Kata:</span>
                        <span className="font-medium">{story.wordCount.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Karakter:</span>
                        <span className="font-medium">{story.characterCount.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Estimasi baca:</span>
                        <span className="font-medium">{Math.ceil(story.wordCount / 200)} menit</span>
                      </div>
                    </div>
                  </div>

                  {/* Story Prompts */}
                  <div className="glass-card p-4">
                    <button
                      onClick={() => setShowPrompts(!showPrompts)}
                      className="w-full flex items-center justify-between font-semibold mb-3"
                    >
                      <div className="flex items-center gap-2">
                        <Lightbulb className="w-4 h-4" />
                        Ide Cerita
                      </div>
                    </button>
                    
                    <AnimatePresence>
                      {showPrompts && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="space-y-2"
                        >
                          {storyPrompts.map((prompt, index) => (
                            <button
                              key={index}
                              onClick={() => insertPrompt(prompt)}
                              className="w-full text-left p-3 rounded-xl bg-white/50 dark:bg-gray-800/50 hover:bg-white/70 dark:hover:bg-gray-700/50 text-sm transition-colors"
                            >
                              {prompt}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              )}

              {activeTab === 'characters' && (
                <div className="space-y-4">
                  {/* Add Character */}
                  <div className="glass-card p-4">
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      Karakter
                    </h3>
                    <div className="space-y-3">
                      {characters.map((char) => (
                        <div key={char.id} className="p-3 bg-white/30 rounded-lg">
                          <h4 className="font-medium">{char.name}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{char.description}</p>
                          <div className="flex gap-1 mt-2">
                            {char.traits.map((trait, i) => (
                              <span key={i} className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded">
                                {trait}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                      <button
                        onClick={() => {
                          const name = prompt('Nama karakter:');
                          const description = prompt('Deskripsi karakter:');
                          if (name && description) {
                            setCharacters(prev => [...prev, {
                              id: Date.now().toString(),
                              name,
                              description,
                              traits: []
                            }]);
                          }
                        }}
                        className="w-full p-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-400 transition-colors text-gray-600 hover:text-purple-600"
                      >
                        + Tambah Karakter
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'outline' && (
                <div className="space-y-4">
                  {/* Story Outline */}
                  <div className="glass-card p-4">
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      Outline Cerita
                    </h3>
                    <textarea
                      value={story.synopsis}
                      onChange={(e) => setStory(prev => ({ ...prev, synopsis: e.target.value }))}
                      placeholder="Tulis outline/kerangka cerita Anda di sini...\n\nContoh:\n- Pembukaan: Perkenalan tokoh utama\n- Konflik: Masalah yang dihadapi\n- Klimaks: Puncak ketegangan\n- Resolusi: Penyelesaian masalah"
                      className="glass-input resize-none h-64"
                    />
                  </div>
                  
                  {/* Chapter Planning */}
                  <div className="glass-card p-4">
                    <h3 className="font-semibold mb-3">Perencanaan Bab</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Target kata per bab:</span>
                        <span className="font-medium">1,000 - 2,000</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Estimasi total bab:</span>
                        <span className="font-medium">{Math.ceil(story.wordCount / 1500)} bab</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Progress saat ini:</span>
                        <span className="font-medium">{story.wordCount > 1500 ? '1' : '0'} bab selesai</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {activeTab === 'settings' && (
                <div className="space-y-4">
                  {/* Category */}
                  <div className="glass-card p-4">
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <Palette className="w-4 h-4" />
                      Pilih Kategori Cerita
                    </h3>
                    <div className="grid grid-cols-2 gap-2">
                      {categories.map((cat) => (
                        <button
                          key={cat.id}
                          onClick={() => setStory(prev => ({ ...prev, category: cat.id }))}
                          className={cn(
                            'p-2 rounded-lg text-sm font-medium transition-all',
                            story.category === cat.id
                              ? `${cat.color} text-white`
                              : 'bg-white/50 dark:bg-gray-800/50 hover:bg-white/70'
                          )}
                        >
                          {cat.name}
                        </button>
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Kategori terpilih: <span className="font-medium">{categories.find(c => c.id === story.category)?.name}</span>
                    </p>
                  </div>

                  {/* Synopsis */}
                  <div className="glass-card p-4">
                    <h3 className="font-semibold mb-3">Sinopsis</h3>
                    <textarea
                      value={story.synopsis}
                      onChange={(e) => setStory(prev => ({ ...prev, synopsis: e.target.value }))}
                      placeholder="Ringkasan cerita..."
                      className="glass-input resize-none h-24"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </aside>

        {/* Main Editor */}
        <main className={cn(
          "flex-1 flex flex-col",
          activeTab === 'settings' && "lg:mt-0 mt-32" // Add top margin on mobile when category selector is shown
        )}>
          {/* Toolbar */}
          <div className="border-b border-white/20 backdrop-blur-xl bg-white/50 dark:bg-gray-900/50 p-4">
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => formatText('bold')}
                className="glass-button p-2"
                title="Bold"
              >
                <Bold className="w-4 h-4" />
              </button>
              <button
                onClick={() => formatText('italic')}
                className="glass-button p-2"
                title="Italic"
              >
                <Italic className="w-4 h-4" />
              </button>
              <button
                onClick={() => formatText('underline')}
                className="glass-button p-2"
                title="Underline"
              >
                <Underline className="w-4 h-4" />
              </button>
              
              <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-2" />
              
              <button className="glass-button p-2" title="Align Left">
                <AlignLeft className="w-4 h-4" />
              </button>
              <button className="glass-button p-2" title="Align Center">
                <AlignCenter className="w-4 h-4" />
              </button>
              <button className="glass-button p-2" title="Align Right">
                <AlignRight className="w-4 h-4" />
              </button>
              
              <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-2" />
              
              <button className="glass-button p-2" title="List">
                <List className="w-4 h-4" />
              </button>
              <button className="glass-button p-2" title="Quote">
                <Quote className="w-4 h-4" />
              </button>
              
              <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-2" />
              
              <button className="glass-button p-2" title="Undo">
                <Undo className="w-4 h-4" />
              </button>
              <button className="glass-button p-2" title="Redo">
                <Redo className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Editor Content */}
          <div className="flex-1 p-6">
            {isPreviewMode ? (
              <div className="glass-card p-8 h-full overflow-y-auto">
                <h1 className="text-3xl font-bold mb-4">{story.title || 'Untitled'}</h1>
                {story.synopsis && (
                  <p className="text-gray-600 dark:text-gray-400 italic mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
                    {story.synopsis}
                  </p>
                )}
                <div className="prose prose-lg dark:prose-invert max-w-none">
                  {story.content.split('\n').map((paragraph, index) => (
                    <p key={index} className="mb-4 leading-relaxed">
                      {paragraph || '\u00A0'}
                    </p>
                  ))}
                </div>
              </div>
            ) : (
              <textarea
                ref={contentRef}
                value={story.content}
                onChange={(e) => setStory(prev => ({ ...prev, content: e.target.value }))}
                placeholder="Mulai menulis cerita Anda di sini..."
                className="w-full h-full resize-none bg-transparent border-none focus:outline-none text-lg leading-relaxed p-8 glass-card"
                style={{ fontFamily: 'Georgia, serif' }}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}