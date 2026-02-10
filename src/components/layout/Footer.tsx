import { Link } from 'react-router-dom';
import { ExternalLink } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-border bg-card mt-auto">
      <div className="container px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          {/* Left side - Links */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground">
            <Link to="/terms" className="hover:text-foreground transition-colors">
              Ketentuan Layanan
            </Link>
            <span className="hidden sm:inline">•</span>
            <Link to="/privacy" className="hover:text-foreground transition-colors">
              Kebijakan Privasi
            </Link>
            <span className="hidden sm:inline">•</span>
            <Link to="/help" className="hover:text-foreground transition-colors">
              Pusat Bantuan
            </Link>
          </div>

          {/* Right side - Credits */}
          <div className="text-center md:text-right text-sm text-muted-foreground">
            <p>
              by{' '}
              <a
                href="https://beznproject.web.id"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-foreground hover:text-primary transition-colors inline-flex items-center gap-1"
              >
                bezn project
                <ExternalLink className="w-3 h-3" />
              </a>
            </p>
            <p className="mt-1">
              Developer:{' '}
              <a
                href="https://nafiurohman.pages.dev"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-foreground hover:text-primary transition-colors inline-flex items-center gap-1"
              >
                M. Nafiurohman
                <ExternalLink className="w-3 h-3" />
              </a>
            </p>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-border/50 text-center text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} selfQ - Ruang pribadi, Tanpa tekanan.</p>
        </div>
      </div>
    </footer>
  );
}
