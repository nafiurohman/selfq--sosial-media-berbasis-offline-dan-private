// SEO Configuration for selfX
export const seoConfig = {
  defaultTitle: 'selfX - Platform Sosial Media Pribadi Offline | Bezn Project',
  titleTemplate: '%s | selfX - Bezn Project',
  defaultDescription: 'Platform sosial media pribadi 100% offline dengan enkripsi AES-256. Berbagi momen tanpa takut data bocor. Gratis, aman, dan sepenuhnya milikmu. PWA ready untuk Android & iOS.',
  siteUrl: 'https://selfx.bezn.web.id',
  siteName: 'selfX by Bezn Project',
  images: {
    default: '/og-image.png',
    twitter: '/twitter-image.png',
    logo: '/logo/logo.png'
  },
  social: {
    twitter: '@beznproject',
    tiktok: '@bezn.project',
    github: 'https://github.com/beznproject',
    email: 'hello@bezn.id'
  },
  organization: {
    name: 'Bezn Project',
    url: 'https://beznproject.web.id',
    logo: 'https://selfx.bezn.web.id/images/logo/logo.png',
    contact: {
      developer: {
        name: 'M. Nafiurohman',
        website: 'https://nafiurohman.pages.dev',
        email: 'nafiurohman25@gmail.com',
        whatsapp: 'https://wa.me/6281358198565',
        github: 'https://github.com/nafiurohman',
        linkedin: 'https://linkedin.com/in/nafiurohman',
        instagram: 'https://instagram.com/nafiurohman_',
        facebook: 'https://facebook.com/nafiurohman25',
        tiktok: 'https://tiktok.com/@nafiurohman_'
      },
      bezn: {
        website: 'https://beznproject.web.id',
        platform: 'https://beznproject.web.id/platform',
        instagram: 'https://instagram.com/bezn.project',
        tiktok: 'https://tiktok.com/@bezn.project'
      }
    }
  }
};

// Page-specific SEO configurations
export const pageConfigs = {
  home: {
    title: 'selfX - Platform Sosial Media Pribadi Offline | Bezn Project',
    description: 'Platform sosial media pribadi 100% offline dengan enkripsi AES-256. Berbagi momen tanpa takut data bocor. Gratis, aman, dan sepenuhnya milikmu.',
    keywords: 'sosial media pribadi, platform offline, enkripsi data, PWA Indonesia, bezn project, selfx, social media aman, offline first, privacy focused, alternatif twitter instagram',
    path: '/'
  },
  about: {
    title: 'Tentang selfX - Platform Sosial Media Pribadi',
    description: 'Pelajari lebih lanjut tentang selfX, platform sosial media pribadi yang 100% offline. Kenapa pilih selfX? Privasi terjamin, enkripsi kuat, tanpa server.',
    keywords: 'tentang selfx, privacy by design, enkripsi AES-256, sosial media offline, bezn project, platform sosial media pribadi',
    path: '/about'
  },
  faq: {
    title: 'FAQ - Pertanyaan yang Sering Diajukan tentang selfX',
    description: 'Temukan jawaban untuk pertanyaan umum tentang selfX. Cara backup, restore, keamanan data, fitur offline, dan troubleshooting.',
    keywords: 'FAQ selfx, pertanyaan selfx, cara backup selfx, keamanan data, troubleshooting, panduan selfx',
    path: '/faq'
  },
  help: {
    title: 'Pusat Bantuan selfX - Panduan Platform Sosial Media Pribadi',
    description: 'Panduan lengkap menggunakan selfX. Tutorial backup, restore, fitur sosial media, tips & trik, dan solusi masalah umum.',
    keywords: 'bantuan selfx, panduan selfx, tutorial selfx, cara menggunakan selfx, tips sosial media pribadi',
    path: '/help'
  },
  privacy: {
    title: 'Kebijakan Privasi selfX - Komitmen Privasi Anda',
    description: 'Kebijakan privasi selfX yang transparan. Bagaimana kami melindungi data Anda dengan enkripsi AES-256 dan prinsip privacy by design.',
    keywords: 'kebijakan privasi selfx, perlindungan data, enkripsi, privacy by design, GDPR compliance',
    path: '/privacy'
  },
  terms: {
    title: 'Syarat & Ketentuan selfX - Aturan Penggunaan',
    description: 'Syarat dan ketentuan penggunaan selfX. Hak dan kewajiban pengguna, batasan layanan, dan ketentuan hukum.',
    keywords: 'syarat ketentuan selfx, aturan penggunaan, terms of service, hak pengguna',
    path: '/terms'
  }
};

// Generate structured data for different page types
export const generateStructuredData = (pageType: keyof typeof pageConfigs) => {
  const config = pageConfigs[pageType];
  const baseUrl = seoConfig.siteUrl;
  
  const baseStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: config.title,
    description: config.description,
    url: `${baseUrl}${config.path}`,
    isPartOf: {
      '@type': 'WebSite',
      name: seoConfig.siteName,
      url: baseUrl
    },
    about: {
      '@type': 'SoftwareApplication',
      name: 'selfX',
      applicationCategory: 'ProductivityApplication',
      operatingSystem: 'Web Browser, Android, iOS'
    },
    publisher: {
      '@type': 'Organization',
      name: seoConfig.organization.name,
      url: seoConfig.organization.url,
      logo: seoConfig.organization.logo
    }
  };

  // Add page-specific structured data
  switch (pageType) {
    case 'faq':
      return {
        ...baseStructuredData,
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'Apakah selfX benar-benar offline?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Ya, selfX 100% offline setelah instalasi. Semua data disimpan di perangkat Anda dan tidak memerlukan koneksi internet untuk berfungsi.'
            }
          },
          {
            '@type': 'Question',
            name: 'Bagaimana keamanan data di selfX?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Data Anda dienkripsi menggunakan AES-256-GCM dengan salt berlapis. Tidak ada server yang menyimpan data Anda, semuanya tersimpan lokal di perangkat.'
            }
          }
        ]
      };
    
    case 'about':
      return {
        ...baseStructuredData,
        '@type': 'AboutPage'
      };
    
    default:
      return baseStructuredData;
  }
};

// SEO Hook for React components
export const useSEO = (pageType: keyof typeof pageConfigs) => {
  const config = pageConfigs[pageType];
  
  return {
    title: config.title,
    description: config.description,
    keywords: config.keywords,
    canonical: `${seoConfig.siteUrl}${config.path}`,
    structuredData: generateStructuredData(pageType)
  };
};

// Meta tags generator
export const generateMetaTags = (pageType: keyof typeof pageConfigs) => {
  const config = pageConfigs[pageType];
  const fullUrl = `${seoConfig.siteUrl}${config.path}`;
  
  return {
    title: config.title,
    description: config.description,
    keywords: config.keywords,
    canonical: fullUrl,
    openGraph: {
      title: config.title,
      description: config.description,
      url: fullUrl,
      type: 'website',
      images: [
        {
          url: `${seoConfig.siteUrl}${seoConfig.images.default}`,
          width: 1200,
          height: 630,
          alt: config.title
        }
      ],
      siteName: seoConfig.siteName
    },
    twitter: {
      card: 'summary_large_image',
      title: config.title,
      description: config.description,
      images: [`${seoConfig.siteUrl}${seoConfig.images.twitter}`],
      creator: seoConfig.social.twitter,
      site: seoConfig.social.twitter
    }
  };
};