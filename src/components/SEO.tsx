import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { seoConfig, pageConfigs, generateStructuredData } from '@/lib/seo';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
}

export const SEO: React.FC<SEOProps> = ({
  title,
  description,
  keywords,
  image,
  url,
  type = 'website'
}) => {
  const location = useLocation();
  
  useEffect(() => {
    // Determine page type based on pathname
    const pathname = location.pathname;
    let pageType: keyof typeof pageConfigs = 'home';
    
    if (pathname.includes('/about')) pageType = 'about';
    else if (pathname.includes('/faq')) pageType = 'faq';
    else if (pathname.includes('/help')) pageType = 'help';
    else if (pathname.includes('/privacy')) pageType = 'privacy';
    else if (pathname.includes('/terms')) pageType = 'terms';
    
    const config = pageConfigs[pageType];
    
    // Set document title
    const finalTitle = title || config.title;
    document.title = finalTitle;
    
    // Set meta description
    const finalDescription = description || config.description;
    updateMetaTag('description', finalDescription);
    
    // Set meta keywords
    const finalKeywords = keywords || config.keywords;
    updateMetaTag('keywords', finalKeywords);
    
    // Set canonical URL
    const finalUrl = url || `${seoConfig.siteUrl}${config.path}`;
    updateLinkTag('canonical', finalUrl);
    
    // Set Open Graph tags
    updateMetaProperty('og:title', finalTitle);
    updateMetaProperty('og:description', finalDescription);
    updateMetaProperty('og:url', finalUrl);
    updateMetaProperty('og:type', type);
    updateMetaProperty('og:site_name', seoConfig.siteName);
    updateMetaProperty('og:locale', 'id_ID');
    
    const finalImage = image || `${seoConfig.siteUrl}${seoConfig.images.default}`;
    updateMetaProperty('og:image', finalImage);
    updateMetaProperty('og:image:width', '1200');
    updateMetaProperty('og:image:height', '630');
    updateMetaProperty('og:image:alt', finalTitle);
    
    // Set Twitter Card tags
    updateMetaName('twitter:card', 'summary_large_image');
    updateMetaName('twitter:title', finalTitle);
    updateMetaName('twitter:description', finalDescription);
    updateMetaName('twitter:image', image || `${seoConfig.siteUrl}${seoConfig.images.twitter}`);
    updateMetaName('twitter:image:alt', finalTitle);
    updateMetaName('twitter:creator', seoConfig.social.twitter);
    updateMetaName('twitter:site', seoConfig.social.twitter);
    
    // Set robots meta
    updateMetaName('robots', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');
    
    // Set language and author
    updateMetaName('language', 'Indonesian');
    updateMetaName('author', seoConfig.organization.name);
    
    // Add structured data
    const structuredData = generateStructuredData(pageType);
    updateStructuredData(structuredData);
    
  }, [location.pathname, title, description, keywords, image, url, type]);
  
  return null;
};

// Helper functions
const updateMetaTag = (name: string, content: string) => {
  let element = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement;
  if (!element) {
    element = document.createElement('meta');
    element.name = name;
    document.head.appendChild(element);
  }
  element.content = content;
};

const updateMetaProperty = (property: string, content: string) => {
  let element = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement;
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute('property', property);
    document.head.appendChild(element);
  }
  element.content = content;
};

const updateMetaName = (name: string, content: string) => {
  let element = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement;
  if (!element) {
    element = document.createElement('meta');
    element.name = name;
    document.head.appendChild(element);
  }
  element.content = content;
};

const updateLinkTag = (rel: string, href: string) => {
  let element = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement;
  if (!element) {
    element = document.createElement('link');
    element.rel = rel;
    document.head.appendChild(element);
  }
  element.href = href;
};

const updateStructuredData = (data: any) => {
  // Remove existing structured data
  const existing = document.querySelector('script[type="application/ld+json"][data-dynamic="true"]');
  if (existing) {
    existing.remove();
  }
  
  // Add new structured data
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.setAttribute('data-dynamic', 'true');
  script.textContent = JSON.stringify(data);
  document.head.appendChild(script);
};