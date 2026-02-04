import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Users, TrendingUp, BookOpen } from 'lucide-react';
import { getUser } from '@/lib/storage';
import type { User } from '@/lib/types';

export function RightPanel() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    setUser(getUser());
  }, []);

  const stories = [
    { id: 1, name: 'Cerita Hari Ini', image: '/images/logo/logo.png', isOwn: true },
    { id: 2, name: 'Inspirasi', image: '/images/logo/logo.png' },
    { id: 3, name: 'Motivasi', image: '/images/logo/logo.png' },
  ];

  const suggestions = [
    { id: 1, name: 'Tips Menulis', category: 'Writing' },
    { id: 2, name: 'Ide Kreatif', category: 'Creative' },
    { id: 3, name: 'Produktivitas', category: 'Lifestyle' },
  ];

  if (!user) return null;

  return (
    <aside className="right-panel">
      {/* Stories Section */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">
          Stories
        </h3>
        <div className="space-y-3">
          {stories.map((story, index) => (
            <motion.div
              key={story.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center gap-3 p-3 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer"
            >
              <div className="story-circle">
                <div className="w-full h-full rounded-xl overflow-hidden">
                  <img 
                    src={story.image} 
                    alt={story.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-800 dark:text-gray-200">
                  {story.name}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {story.isOwn ? 'Cerita Anda' : 'Cerita Terbaru'}
                </p>
              </div>
              {story.isOwn && (
                <Plus className="w-5 h-5 text-blue-500" />
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Trending Topics */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-pink-500" />
          Trending
        </h3>
        <div className="space-y-2">
          {suggestions.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-3 rounded-2xl bg-gradient-to-r from-pink-50/50 to-purple-50/50 dark:from-gray-800/30 dark:to-gray-700/30 hover:shadow-sm transition-all cursor-pointer"
            >
              <p className="font-medium text-gray-800 dark:text-gray-200">
                {item.name}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {item.category}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">
          Quick Actions
        </h3>
        <button className="pill-button w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white">
          <BookOpen className="w-4 h-4 mr-2" />
          Tulis Cerita Baru
        </button>
        <button className="pill-button w-full bg-gradient-to-r from-pink-500 to-rose-500 text-white">
          <Users className="w-4 h-4 mr-2" />
          Jelajahi Komunitas
        </button>
      </div>
    </aside>
  );
}