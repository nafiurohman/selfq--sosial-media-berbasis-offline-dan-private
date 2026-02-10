import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CustomToast, useCustomToast } from "@/components/CustomToast";
import { setToastCallback } from "@/lib/toast";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { preloadCriticalResources, optimizeStorage } from "@/lib/performance";
import { initTheme } from "@/lib/storage";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Feed from "./pages/Feed";
import Search from "./pages/Search";
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";
import Bookmarks from "./pages/Bookmarks";
import Stories from "./pages/Stories";
import StoryEditor from "./pages/StoryEditor";
import StoryView from "./pages/StoryView";
import Onboarding from "./pages/Onboarding";
import CalendarView from "./pages/CalendarView";
import Archive from "./pages/Archive";
import RequestFeature from "./pages/RequestFeature";
import ReportBug from "./pages/ReportBug";
import About from "./pages/About";
import FAQ from "./pages/FAQ";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
    },
  },
});

const App = () => {
  const { toast, showToast, closeToast } = useCustomToast();

  useEffect(() => {
    // Set global toast callback
    setToastCallback(showToast);
    // Initialize theme first
    initTheme();
    
    // Performance optimizations on app start
    preloadCriticalResources();
    optimizeStorage();
    
    // Register service worker for PWA
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('SW registered: ', registration);
        })
        .catch((registrationError) => {
          console.log('SW registration failed: ', registrationError);
        });
    }
  }, [showToast]);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider delayDuration={300}>
        <Toaster />
        <CustomToast
          message={toast.message}
          type={toast.type}
          isOpen={toast.isOpen}
          onClose={closeToast}
        />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/about" element={<About />} />
            <Route path="/help" element={<FAQ />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />
            
            {/* Protected Routes */}
            <Route path="/feed" element={<ProtectedRoute><Feed /></ProtectedRoute>} />
            <Route path="/search" element={<ProtectedRoute><Search /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/bookmarks" element={<ProtectedRoute><Bookmarks /></ProtectedRoute>} />
            <Route path="/stories" element={<ProtectedRoute><Stories /></ProtectedRoute>} />
            <Route path="/stories/new" element={<ProtectedRoute><StoryEditor /></ProtectedRoute>} />
            <Route path="/stories/edit/:id" element={<ProtectedRoute><StoryEditor /></ProtectedRoute>} />
            <Route path="/stories/view/:id" element={<ProtectedRoute><StoryView /></ProtectedRoute>} />
            <Route path="/calendar" element={<ProtectedRoute><CalendarView /></ProtectedRoute>} />
            <Route path="/archive" element={<ProtectedRoute><Archive /></ProtectedRoute>} />
            <Route path="/request-feature" element={<ProtectedRoute><RequestFeature /></ProtectedRoute>} />
            <Route path="/report-bug" element={<ProtectedRoute><ReportBug /></ProtectedRoute>} />
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
