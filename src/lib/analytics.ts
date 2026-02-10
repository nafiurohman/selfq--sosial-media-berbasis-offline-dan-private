// Privacy-focused analytics for selfQ
// This module provides basic usage analytics without compromising user privacy

interface AnalyticsEvent {
  event: string;
  category: string;
  action: string;
  label?: string;
  value?: number;
  timestamp: number;
}

class PrivacyAnalytics {
  private events: AnalyticsEvent[] = [];
  private sessionId: string;
  private startTime: number;
  
  constructor() {
    this.sessionId = this.generateSessionId();
    this.startTime = Date.now();
    this.initPerformanceMonitoring();
  }
  
  private generateSessionId(): string {
    return 'session_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
  }
  
  // Track page views (no personal data)
  trackPageView(page: string) {
    this.trackEvent({
      event: 'page_view',
      category: 'navigation',
      action: 'view',
      label: page,
      timestamp: Date.now()
    });
  }
  
  // Track user interactions (no personal data)
  trackInteraction(action: string, category: string = 'interaction', label?: string) {
    this.trackEvent({
      event: 'user_interaction',
      category,
      action,
      label,
      timestamp: Date.now()
    });
  }
  
  // Track performance metrics
  trackPerformance(metric: string, value: number, category: string = 'performance') {
    this.trackEvent({
      event: 'performance',
      category,
      action: metric,
      value,
      timestamp: Date.now()
    });
  }
  
  // Track errors (no personal data, only error types)
  trackError(error: string, category: string = 'error') {
    this.trackEvent({
      event: 'error',
      category,
      action: 'error_occurred',
      label: error,
      timestamp: Date.now()
    });
  }
  
  private trackEvent(event: AnalyticsEvent) {
    // Only store locally, never send to external servers
    this.events.push(event);
    
    // Keep only last 100 events to prevent memory issues\n    if (this.events.length > 100) {\n      this.events = this.events.slice(-100);\n    }\n    \n    // Optional: Log to console in development\n    if (process.env.NODE_ENV === 'development') {\n      console.log('Analytics Event:', event);\n    }\n  }\n  \n  // Get anonymized usage statistics\n  getUsageStats() {\n    const now = Date.now();\n    const sessionDuration = now - this.startTime;\n    \n    const stats = {\n      sessionDuration: Math.round(sessionDuration / 1000), // in seconds\n      totalEvents: this.events.length,\n      pageViews: this.events.filter(e => e.event === 'page_view').length,\n      interactions: this.events.filter(e => e.event === 'user_interaction').length,\n      errors: this.events.filter(e => e.event === 'error').length,\n      mostVisitedPages: this.getMostVisitedPages(),\n      commonActions: this.getCommonActions()\n    };\n    \n    return stats;\n  }\n  \n  private getMostVisitedPages() {\n    const pageViews = this.events.filter(e => e.event === 'page_view');\n    const pageCounts: { [key: string]: number } = {};\n    \n    pageViews.forEach(event => {\n      if (event.label) {\n        pageCounts[event.label] = (pageCounts[event.label] || 0) + 1;\n      }\n    });\n    \n    return Object.entries(pageCounts)\n      .sort(([,a], [,b]) => b - a)\n      .slice(0, 5)\n      .map(([page, count]) => ({ page, count }));\n  }\n  \n  private getCommonActions() {\n    const interactions = this.events.filter(e => e.event === 'user_interaction');\n    const actionCounts: { [key: string]: number } = {};\n    \n    interactions.forEach(event => {\n      if (event.action) {\n        actionCounts[event.action] = (actionCounts[event.action] || 0) + 1;\n      }\n    });\n    \n    return Object.entries(actionCounts)\n      .sort(([,a], [,b]) => b - a)\n      .slice(0, 5)\n      .map(([action, count]) => ({ action, count }));\n  }\n  \n  // Performance monitoring\n  private initPerformanceMonitoring() {\n    // Monitor Core Web Vitals\n    if (typeof window !== 'undefined' && 'performance' in window) {\n      // Largest Contentful Paint (LCP)\n      new PerformanceObserver((entryList) => {\n        const entries = entryList.getEntries();\n        const lastEntry = entries[entries.length - 1];\n        this.trackPerformance('lcp', Math.round(lastEntry.startTime));\n      }).observe({ entryTypes: ['largest-contentful-paint'] });\n      \n      // First Input Delay (FID)\n      new PerformanceObserver((entryList) => {\n        const entries = entryList.getEntries();\n        entries.forEach(entry => {\n          this.trackPerformance('fid', Math.round(entry.processingStart - entry.startTime));\n        });\n      }).observe({ entryTypes: ['first-input'] });\n      \n      // Cumulative Layout Shift (CLS)\n      let clsValue = 0;\n      new PerformanceObserver((entryList) => {\n        const entries = entryList.getEntries();\n        entries.forEach(entry => {\n          if (!entry.hadRecentInput) {\n            clsValue += entry.value;\n          }\n        });\n        this.trackPerformance('cls', Math.round(clsValue * 1000) / 1000);\n      }).observe({ entryTypes: ['layout-shift'] });\n      \n      // Time to First Byte (TTFB)\n      window.addEventListener('load', () => {\n        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;\n        if (navigation) {\n          const ttfb = navigation.responseStart - navigation.requestStart;\n          this.trackPerformance('ttfb', Math.round(ttfb));\n        }\n      });\n    }\n  }\n  \n  // Clear all analytics data (for privacy)\n  clearData() {\n    this.events = [];\n    console.log('Analytics data cleared');\n  }\n}\n\n// Create singleton instance\nexport const analytics = new PrivacyAnalytics();\n\n// React hook for easy usage\nexport const useAnalytics = () => {\n  const trackPageView = (page: string) => analytics.trackPageView(page);\n  const trackClick = (element: string) => analytics.trackInteraction('click', 'ui', element);\n  const trackFeatureUse = (feature: string) => analytics.trackInteraction('feature_use', 'app', feature);\n  const trackError = (error: string) => analytics.trackError(error);\n  \n  return {\n    trackPageView,\n    trackClick,\n    trackFeatureUse,\n    trackError,\n    getStats: () => analytics.getUsageStats(),\n    clearData: () => analytics.clearData()\n  };\n};