import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Search, Bookmark, User, Settings, ChevronDown, BookOpen } from 'lucide-react';
import { getUser } from '@/lib/storage';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { FloatingMenu } from '@/components/FloatingMenu';
import { cn } from '@/lib/utils';

interface NavigationProps {
  onCompose?: () => void;
  onReceiveShare?: () => void;
}

export function Navigation({ onCompose, onReceiveShare }: NavigationProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const user = getUser();

  const navItems = [
    { id: 'home', label: 'Home', icon: Home, path: '/feed' },
    { id: 'search', label: 'Cari', icon: Search, action: 'search' },
    { id: 'stories', label: 'Cerita', icon: BookOpen, path: '/stories' },
    { id: 'bookmarks', label: 'Simpan', icon: Bookmark, path: '/bookmarks' },
    { id: 'profile', label: 'Profile', icon: User, path: '/profile' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      {/* Desktop Sidebar */}
      <nav className="desktop-sidebar">
        {/* User Profile */}
        {user && (
          <div className="mb-3">
            <div className="text-center p-6">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center shadow-lg mx-auto mb-4">
                {user.avatar ? (
                  <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover rounded-full" />
                ) : (
                  <span className="text-white font-semibold text-2xl">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              <div>
                <p className="font-semibold text-gray-800 dark:text-gray-200">{user.name}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">@{user.name.toLowerCase().replace(/\s+/g, '')}</p>
              </div>
            </div>
          </div>
        )}

        {/* Logo 
        <div className="flex items-center gap-3 mb-8">
          <img src="/images/logo/logo.png" alt="selfX Logo" className="w-10 h-10 rounded-2xl shadow-sm" />
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">selfX</h1>
        </div>
        */}

        {/* Navigation Items */}
        <div className="space-y-2 flex-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            if (item.action === 'search') {
              return (
                <button
                  key={item.id}
                  onClick={() => navigate('/search')}
                  className={cn(
                    'w-full flex items-center gap-4 px-6 py-4 rounded-3xl transition-all duration-200 font-medium',
                    location.pathname === '/search'
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800/50 hover:text-gray-800 dark:hover:text-gray-200'
                  )}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </button>
              );
            }
            return (
              <button
                key={item.id}
                onClick={() => navigate(item.path!)}
                className={cn(
                  'w-full flex items-center gap-4 px-6 py-4 rounded-3xl transition-all duration-200 font-medium',
                  isActive(item.path!)
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800/50 hover:text-gray-800 dark:hover:text-gray-200'
                )}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </button>
            );
          })}
          
          <button
            onClick={() => navigate('/settings')}
            className={cn(
              'w-full flex items-center gap-4 px-6 py-4 rounded-3xl transition-all duration-200 font-medium',
              isActive('/settings')
                ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800/50 hover:text-gray-800 dark:hover:text-gray-200'
            )}
          >
            <Settings className="w-5 h-5" />
            <span>Pengaturan</span>
          </button>
        </div>
      </nav>

      {/* Mobile Bottom Navigation */}
      <nav className="bottom-nav">
        <button
          onClick={() => navigate('/feed')}
          className={cn(
            'bottom-nav-item',
            isActive('/feed') && 'active'
          )}
        >
          <Home className="w-5 h-5" />
          <span className="bottom-nav-label">Home</span>
        </button>
        
        <button
          onClick={() => navigate('/search')}
          className={cn(
            'bottom-nav-item',
            location.pathname === '/search' && 'active'
          )}
        >
          <Search className="w-5 h-5" />
          <span className="bottom-nav-label">Search</span>
        </button>
        
        <button
          onClick={() => navigate('/stories')}
          className={cn(
            'bottom-nav-item',
            isActive('/stories') && 'active'
          )}
        >
          <BookOpen className="w-5 h-5" />
          <span className="bottom-nav-label">Cerita</span>
        </button>
        
        <button
          onClick={() => navigate('/bookmarks')}
          className={cn(
            'bottom-nav-item',
            isActive('/bookmarks') && 'active'
          )}
        >
          <Bookmark className="w-5 h-5" />
          <span className="bottom-nav-label">Simpan</span>
        </button>
        
        <button
          onClick={() => navigate('/profile')}
          className={cn(
            'bottom-nav-item',
            isActive('/profile') && 'active'
          )}
        >
          <User className="w-5 h-5" />
          <span className="bottom-nav-label">Profile</span>
        </button>
      </nav>

      {/* Mobile FAB */}
      {onCompose && onReceiveShare && (
        <FloatingMenu 
          onCompose={onCompose}
          onReceiveShare={onReceiveShare}
        />
      )}
    </>
  );
}