import type { User } from './types';

const USER_KEY = 'selfq-user';
const THEME_KEY = 'selfq-theme';
const ONBOARDED_KEY = 'selfq-onboarded';
const TERMS_KEY = 'selfq-terms-accepted';

// Legacy keys for migration
const LEGACY_USER_KEY = 'selfx-user';
const LEGACY_THEME_KEY = 'selfx-theme';
const LEGACY_ONBOARDED_KEY = 'selfx-onboarded';
const LEGACY_TERMS_KEY = 'selfx-terms-accepted';

// Auto-migrate from legacy keys
function migrateLegacyData(): void {
  if (typeof window === 'undefined') return;
  
  // Migrate user
  const legacyUser = localStorage.getItem(LEGACY_USER_KEY);
  if (legacyUser && !localStorage.getItem(USER_KEY)) {
    localStorage.setItem(USER_KEY, legacyUser);
  }
  
  // Migrate theme
  const legacyTheme = localStorage.getItem(LEGACY_THEME_KEY);
  if (legacyTheme && !localStorage.getItem(THEME_KEY)) {
    localStorage.setItem(THEME_KEY, legacyTheme);
  }
  
  // Migrate onboarded
  const legacyOnboarded = localStorage.getItem(LEGACY_ONBOARDED_KEY);
  if (legacyOnboarded && !localStorage.getItem(ONBOARDED_KEY)) {
    localStorage.setItem(ONBOARDED_KEY, legacyOnboarded);
  }
  
  // Migrate terms
  const legacyTerms = localStorage.getItem(LEGACY_TERMS_KEY);
  if (legacyTerms && !localStorage.getItem(TERMS_KEY)) {
    localStorage.setItem(TERMS_KEY, legacyTerms);
  }
}

// Run migration on module load
migrateLegacyData();

export function getUser(): User | null {
  const data = localStorage.getItem(USER_KEY);
  if (!data) return null;
  try {
    return JSON.parse(data) as User;
  } catch {
    return null;
  }
}

export function setUser(user: User): void {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function updateUser(updates: Partial<User>): User | null {
  const current = getUser();
  if (!current) return null;
  
  const updated = { ...current, ...updates };
  
  // Ensure avatar is properly stored
  if (updates.avatar !== undefined) {
    updated.avatar = updates.avatar;
  }
  
  setUser(updated);
  
  // Force localStorage sync
  try {
    localStorage.setItem(USER_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error('Failed to save user data:', error);
    return null;
  }
  
  return updated;
}

export function clearUser(): void {
  localStorage.removeItem(USER_KEY);
}

export function getTheme(): 'light' | 'dark' {
  const stored = localStorage.getItem(THEME_KEY);
  if (stored === 'light' || stored === 'dark') return stored;
  // Check system preference
  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return 'light';
}

export function setTheme(theme: 'light' | 'dark'): void {
  localStorage.setItem(THEME_KEY, theme);
  applyTheme(theme);
  // Force storage sync and DOM update
  requestAnimationFrame(() => {
    localStorage.setItem(THEME_KEY, theme);
    applyTheme(theme);
  });
}

export function applyTheme(theme: 'light' | 'dark'): void {
  const root = document.documentElement;
  if (theme === 'dark') {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
}

export function initTheme(): void {
  const theme = getTheme();
  applyTheme(theme);
  // Force apply theme on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => applyTheme(theme));
  }
}

// Onboarding status
export function hasOnboarded(): boolean {
  return localStorage.getItem(ONBOARDED_KEY) === 'true';
}

export function isOnboarded(): boolean {
  return hasOnboarded();
}

export function setOnboarded(value: boolean): void {
  localStorage.setItem(ONBOARDED_KEY, value ? 'true' : 'false');
}

// Terms acceptance
export function hasAcceptedTerms(): boolean {
  return localStorage.getItem(TERMS_KEY) === 'true';
}

export function setTermsAccepted(value: boolean): void {
  localStorage.setItem(TERMS_KEY, value ? 'true' : 'false');
}
