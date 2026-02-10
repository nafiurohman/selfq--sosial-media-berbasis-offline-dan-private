// SEO Configuration for selfQ
export const seoConfig = {
  defaultTitle: 'selfQ - Ruang Pribadimu, Tanpa Tekanan | Bezn Project',
  titleTemplate: '%s | selfQ - Bezn Project',
  defaultDescription: 'selfQ adalah ruang pribadi untuk mengungkapkan perasaan yang sebenarnya dari diri sendiri. Tempat aman tanpa tekanan sosial, di mana kamu bebas mengekspresikan diri apa adanya. 100% offline dengan enkripsi AES-256. Gratis selamanya.',
  siteUrl: 'https://selfq.bezn.web.id',
  siteName: 'selfQ by Bezn Project',
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
    logo: 'https://selfq.bezn.web.id/images/logo/logo.png',
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
    title: 'selfQ - Ruang Pribadimu, Tanpa Tekanan | Bezn Project',
    description: 'selfQ adalah ruang pribadi untuk mengungkapkan perasaan yang sebenarnya dari diri sendiri. Tempat aman tanpa tekanan sosial, di mana kamu bebas mengekspresikan diri apa adanya. 100% offline dengan enkripsi AES-256.',
    keywords: 'ruang pribadi, tempat curhat, ekspresikan diri, platform offline, enkripsi data, PWA Indonesia, bezn project, selfq, aplikasi aman, offline first, privacy focused, diary digital, jurnal pribadi',
    path: '/'
  },
  about: {
    title: 'Tentang selfQ - Ruang Pribadi untuk Mengekspresikan Diri',
    description: 'Pelajari lebih lanjut tentang selfQ, ruang pribadi yang 100% offline. Kenapa pilih selfQ? Privasi terjamin, enkripsi kuat, tanpa server.',
    keywords: 'tentang selfq, privacy by design, enkripsi AES-256, ruang pribadi offline, bezn project, tempat aman ekspresikan diri',
    path: '/about'
  },
  faq: {
    title: 'FAQ - Pertanyaan yang Sering Diajukan tentang selfQ',
    description: 'Temukan jawaban untuk pertanyaan umum tentang selfQ. Cara backup, restore, keamanan data, fitur offline, dan troubleshooting.',
    keywords: 'FAQ selfq, pertanyaan selfq, cara backup selfq, keamanan data, troubleshooting, panduan selfq',
    path: '/faq'
  },
  help: {
    title: 'Pusat Bantuan selfQ - Panduan Ruang Pribadi Digital',
    description: 'Panduan lengkap menggunakan selfQ. Tutorial backup, restore, fitur lengkap, tips & trik, dan solusi masalah umum.',
    keywords: 'bantuan selfq, panduan selfq, tutorial selfq, cara menggunakan selfq, tips ruang pribadi digital',
    path: '/help'
  },
  privacy: {
    title: 'Kebijakan Privasi selfQ - Komitmen Privasi Anda',
    description: 'Kebijakan privasi selfQ yang transparan. Bagaimana kami melindungi data Anda dengan enkripsi AES-256 dan prinsip privacy by design.',
    keywords: 'kebijakan privasi selfq, perlindungan data, enkripsi, privacy by design, GDPR compliance',
    path: '/privacy'
  },
  terms: {
    title: 'Syarat & Ketentuan selfQ - Aturan Penggunaan',
    description: 'Syarat dan ketentuan penggunaan selfQ. Hak dan kewajiban pengguna, batasan layanan, dan ketentuan hukum.',
    keywords: 'syarat ketentuan selfq, aturan penggunaan, terms of service, hak pengguna',
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
      name: 'selfQ',
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
            name: 'Apakah selfQ benar-benar offline?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Ya, selfQ 100% offline setelah instalasi. Semua data disimpan di perangkat Anda dan tidak memerlukan koneksi internet untuk berfungsi.'
            }
          },
          {
            '@type': 'Question',
            name: 'Bagaimana keamanan data di selfQ?',
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