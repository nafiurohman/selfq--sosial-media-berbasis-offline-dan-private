import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, HelpCircle, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface NavbarProps {
  showHelp?: boolean;
  showBack?: boolean;
  isLoggedIn?: boolean;
}

export function Navbar({ showHelp = true, showBack = false, isLoggedIn = false }: NavbarProps) {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 w-full glass-nav border-b border-border/50">
      <nav className="container h-14 flex items-center justify-between px-4">
        {showBack ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <button 
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="text-sm font-medium hidden sm:inline">Kembali</span>
              </button>
            </TooltipTrigger>
            <TooltipContent className="hidden md:block">
              <p>Kembali ke halaman sebelumnya</p>
            </TooltipContent>
          </Tooltip>
        ) : (
          <Link to={isLoggedIn ? '/feed' : '/onboarding'} className="flex items-center gap-2">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-md shadow-primary/25"
            >
              <Sparkles className="w-4 h-4 text-primary-foreground" />
            </motion.div>
            <span className="font-bold text-lg">selfQ</span>
          </Link>
        )}

        <div className="flex items-center gap-2">
          {showHelp && (
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => navigate('/help')}
                  className={cn(
                    'flex items-center gap-2 px-3 py-2 rounded-lg text-sm',
                    'hover:bg-secondary transition-colors',
                    location.pathname === '/help' && 'bg-secondary'
                  )}
                >
                  <HelpCircle className="w-4 h-4" />
                  <span className="hidden sm:inline">Bantuan</span>
                </button>
              </TooltipTrigger>
              <TooltipContent className="hidden md:block">
                <p>Lihat pusat bantuan</p>
              </TooltipContent>
            </Tooltip>
          )}
        </div>
      </nav>
    </header>
  );
}
