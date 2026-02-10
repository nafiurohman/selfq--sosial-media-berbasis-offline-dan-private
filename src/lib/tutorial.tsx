import { createContext, useContext, useState, ReactNode } from 'react';

export interface TutorialStep {
  id: string;
  title: string;
  description: string;
  target: string;
  position: 'top' | 'bottom' | 'left' | 'right' | 'center';
  action?: 'click' | 'none';
  page: string;
}

export const tutorialSteps: TutorialStep[] = [
  {
    id: 'welcome',
    title: 'Selamat Datang di selfQ! 🎉',
    description: 'Mari kita mulai tur singkat untuk mengenal fitur-fitur utama selfQ. Klik "Selanjutnya" untuk melanjutkan.',
    target: 'body',
    position: 'center',
    action: 'none',
    page: '/feed'
  },
  {
    id: 'compose-button',
    title: 'Buat Post Baru',
    description: 'Klik tombol + ini untuk membuat post baru. Anda bisa menulis teks, menambahkan foto, atau video.',
    target: '[data-tutorial="compose-button"]',
    position: 'left',
    action: 'none',
    page: '/feed'
  },
  {
    id: 'navigation',
    title: 'Menu Navigasi',
    description: 'Gunakan menu ini untuk berpindah antar halaman: Feed, Pencarian, Bookmark, Cerita, dan Profil.',
    target: '[data-tutorial="navigation"]',
    position: 'bottom',
    action: 'none',
    page: '/feed'
  },
  {
    id: 'post-card',
    title: 'Kartu Post',
    description: 'Ini adalah post Anda. Anda bisa like, komentar, bookmark, atau bagikan post.',
    target: '[data-tutorial="post-card"]',
    position: 'top',
    action: 'none',
    page: '/feed'
  },
  {
    id: 'post-actions',
    title: 'Aksi Post',
    description: 'Klik icon komentar untuk menambah komentar, heart untuk like, bookmark untuk simpan, dan share untuk bagikan.',
    target: '[data-tutorial="post-actions"]',
    position: 'top',
    action: 'none',
    page: '/feed'
  },
  {
    id: 'post-options',
    title: 'Opsi Post',
    description: 'Klik titik tiga ini untuk edit atau hapus post Anda.',
    target: '[data-tutorial="post-options"]',
    position: 'left',
    action: 'none',
    page: '/feed'
  },
  {
    id: 'profile-edit',
    title: 'Edit Profil',
    description: 'Klik tombol Edit untuk mengubah nama, bio, dan foto profil Anda.',
    target: '[data-tutorial="profile-edit"]',
    position: 'left',
    action: 'none',
    page: '/profile'
  },
  {
    id: 'profile-avatar',
    title: 'Foto Profil',
    description: 'Klik icon kamera untuk mengganti foto profil Anda.',
    target: '[data-tutorial="profile-avatar"]',
    position: 'right',
    action: 'none',
    page: '/profile'
  },
  {
    id: 'profile-stats',
    title: 'Statistik Anda',
    description: 'Lihat total post, likes, komentar, dan media yang Anda miliki.',
    target: '[data-tutorial="profile-stats"]',
    position: 'bottom',
    action: 'none',
    page: '/profile'
  },
  {
    id: 'stories-create',
    title: 'Tulis Cerita',
    description: 'Klik tombol ini untuk mulai menulis cerita panjang dengan editor lengkap.',
    target: '[data-tutorial="stories-create"]',
    position: 'bottom',
    action: 'none',
    page: '/stories'
  },
  {
    id: 'stories-category',
    title: 'Kategori Cerita',
    description: 'Kelola kategori cerita Anda. Tambah, edit, atau hapus kategori sesuai kebutuhan.',
    target: '[data-tutorial="stories-category"]',
    position: 'bottom',
    action: 'none',
    page: '/stories'
  },
  {
    id: 'settings-theme',
    title: 'Ubah Tema',
    description: 'Toggle ini untuk beralih antara mode terang dan gelap.',
    target: '[data-tutorial="settings-theme"]',
    position: 'left',
    action: 'none',
    page: '/settings'
  },
  {
    id: 'settings-export',
    title: 'Backup Data',
    description: 'Klik untuk mengekspor semua data Anda dalam file terenkripsi. Simpan file ini di tempat aman!',
    target: '[data-tutorial="settings-export"]',
    position: 'left',
    action: 'none',
    page: '/settings'
  },
  {
    id: 'settings-import',
    title: 'Restore Data',
    description: 'Gunakan ini untuk mengimpor data dari file backup yang sudah Anda simpan.',
    target: '[data-tutorial="settings-import"]',
    position: 'left',
    action: 'none',
    page: '/settings'
  },
  {
    id: 'complete',
    title: 'Tutorial Selesai! 🎊',
    description: 'Anda sudah mengenal fitur-fitur utama selfQ. Selamat menulis dan dokumentasikan momen Anda!',
    target: 'body',
    position: 'center',
    action: 'none',
    page: '/feed'
  }
];

interface TutorialContextType {
  isActive: boolean;
  currentStep: number;
  startTutorial: () => void;
  nextStep: () => void;
  previousStep: () => void;
  skipTutorial: () => void;
  completeTutorial: () => void;
}

const TutorialContext = createContext<TutorialContextType | undefined>(undefined);

export function TutorialProvider({ children }: { children: ReactNode }) {
  const [isActive, setIsActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const startTutorial = () => {
    setIsActive(true);
    setCurrentStep(0);
  };

  const nextStep = () => {
    setCurrentStep((prev) => Math.min(prev + 1, tutorialSteps.length - 1));
  };

  const previousStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const skipTutorial = () => {
    setIsActive(false);
    setCurrentStep(0);
  };

  const completeTutorial = () => {
    setIsActive(false);
    setCurrentStep(0);
  };

  return (
    <TutorialContext.Provider
      value={{
        isActive,
        currentStep,
        startTutorial,
        nextStep,
        previousStep,
        skipTutorial,
        completeTutorial,
      }}
    >
      {children}
    </TutorialContext.Provider>
  );
}

export function useTutorialStore() {
  const context = useContext(TutorialContext);
  if (!context) {
    throw new Error('useTutorialStore must be used within TutorialProvider');
  }
  return context;
}
