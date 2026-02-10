import { Link, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Home, ArrowLeft } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { getUser } from '@/lib/storage';

export default function NotFound() {
  const location = useLocation();
  const user = getUser();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-primary/5 via-background to-primary/5">
      <Navbar showHelp showBack isLoggedIn={!!user} />

      <main className="flex-1 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', damping: 10 }}
            className="text-8xl font-bold text-primary mb-4"
          >
            404
          </motion.div>
          
          <h1 className="text-2xl font-bold mb-2">
            Halaman Tidak Ditemukan
          </h1>
          
          <p className="text-muted-foreground mb-8">
            Maaf, halaman yang kamu cari tidak ada atau telah dipindahkan.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              variant="outline"
              onClick={() => window.history.back()}
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Kembali
            </Button>
            
            <Button asChild className="gap-2">
              <Link to={user ? '/feed' : '/'}>
                <Home className="w-4 h-4" />
                {user ? 'Ke Feed' : 'Ke Beranda'}
              </Link>
            </Button>
          </div>

          <p className="text-xs text-muted-foreground mt-8">
            URL: {location.pathname}
          </p>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
