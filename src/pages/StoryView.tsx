import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft,
  Edit3,
  Share2,
  Clock,
  Eye,
  Heart,
  BookOpen
} from 'lucide-react';
import { Navigation } from '@/components/Navigation';
import { ShareStoryModal } from '@/components/ShareStoryModal';
import { SEO } from '@/components/SEO';
import { cn } from '@/lib/utils';

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

const categories = [
  { id: 'romance', name: 'Romance', color: 'bg-pink-500' },
  { id: 'horror', name: 'Horror', color: 'bg-red-500' },
  { id: 'fantasy', name: 'Fantasy', color: 'bg-purple-500' },
  { id: 'drama', name: 'Drama', color: 'bg-yellow-500' },
  { id: 'comedy', name: 'Comedy', color: 'bg-green-500' },
  { id: 'mystery', name: 'Mystery', color: 'bg-indigo-500' },
];

export default function StoryView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [story, setStory] = useState<Story | null>(null);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStory();
  }, [id]);

  const loadStory = async () => {
    try {
      if (!id) return;
      
      // Try to load from localStorage
      const storyData = localStorage.getItem(`story-${id}`) || localStorage.getItem(id);
      if (storyData) {
        const parsed = JSON.parse(storyData);
        setStory(parsed);
        
        // Update view count
        const updatedStory = {
          ...parsed,
          views: (parsed.views || 0) + 1
        };
        localStorage.setItem(`story-${id}`, JSON.stringify(updatedStory));
        setStory(updatedStory);
      }
    } catch (error) {
      console.error('Failed to load story:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = () => {
    navigate(`/stories/edit/${id}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900">
        <Navigation />
        <div className="main-with-sidebar">
          <div className="container px-4 md:px-6 py-8">
            <div className="glass-card p-8 animate-pulse">
              <div className="h-8 bg-muted rounded w-3/4 mb-4" />
              <div className="h-4 bg-muted rounded w-1/2 mb-6" />
              <div className="space-y-3">
                <div className="h-4 bg-muted rounded" />
                <div className="h-4 bg-muted rounded" />
                <div className="h-4 bg-muted rounded w-5/6" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!story) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900">
        <Navigation />
        <div className="main-with-sidebar">
          <div className="container px-4 md:px-6 py-8">
            <div className="text-center py-20">
              <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">Cerita tidak ditemukan</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Cerita yang Anda cari mungkin telah dihapus atau tidak ada
              </p>
              <button
                onClick={() => navigate('/stories')}
                className="glass-button bg-gradient-to-r from-purple-500 to-pink-500 text-white"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Kembali ke Cerita
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const categoryInfo = categories.find(c => c.id === story.category);

  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title={story.title ? `${story.title} - selfX` : 'Cerita - selfX'}
        description={story.synopsis || story.content.substring(0, 160)}
        keywords={`cerita, ${story.category}, selfx`}
      />
      
      <Navigation />

      <div className="main-with-sidebar">
        {/* Header */}
        <header className="sticky top-0 z-30 backdrop-blur-xl bg-white/70 dark:bg-gray-900/70 border-b border-white/20">
          <div className="container px-4 md:px-6 py-4">
            <div className="flex items-center justify-between">
              <button
                onClick={() => navigate('/stories')}
                className="glass-button"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Kembali
              </button>
              
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsShareOpen(true)}
                  className="glass-button border border-gray-300 dark:border-gray-600"
                >
                  <Share2 className="w-5 h-5 mr-2" />
                  Bagikan
                </button>
                
                {!story.sharedFrom && (
                  <button
                    onClick={handleEdit}
                    className="glass-button bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                  >
                    <Edit3 className="w-5 h-5 mr-2" />
                    Edit
                  </button>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="container px-4 md:px-6 py-8 pb-32 md:pb-8">
          <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-8 md:p-12"
          >
            {/* Story Header */}
            <header className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                {categoryInfo && (
                  <span className={cn(
                    'px-3 py-1 rounded-full text-xs font-medium text-white',
                    categoryInfo.color
                  )}>
                    {categoryInfo.name}
                  </span>
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
              
              <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
                {story.title}
              </h1>
              
              {story.synopsis && (
                <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed mb-6 p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 border-l-4 border-purple-500">
                  {story.synopsis}
                </p>
              )}
              
              {/* Story Meta */}
              <div className="flex items-center gap-6 text-sm text-gray-500 dark:text-gray-400 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{story.wordCount.toLocaleString()} kata</span>
                </div>
                <div className="flex items-center gap-1">
                  <BookOpen className="w-4 h-4" />
                  <span>{story.characterCount.toLocaleString()} karakter</span>
                </div>
                <div className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  <span>{Math.ceil(story.wordCount / 200)} menit baca</span>
                </div>
                <div className="text-xs">
                  {new Date(story.updatedAt).toLocaleDateString('id-ID', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
              </div>
            </header>

            {/* Story Content */}
            <div className="prose prose-lg dark:prose-invert max-w-none">
              {story.content.split('\n').map((paragraph, index) => (
                <p key={index} className="mb-6 leading-relaxed text-gray-800 dark:text-gray-200">
                  {paragraph || '\u00A0'}
                </p>
              ))}
            </div>
          </motion.article>
        </main>
      </div>

      {/* Share Modal */}
      <ShareStoryModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        story={story}
      />
    </div>
  );
}