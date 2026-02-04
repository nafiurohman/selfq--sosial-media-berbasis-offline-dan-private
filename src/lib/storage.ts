import type { User } from './types';

const USER_KEY = 'selfx-user';
const THEME_KEY = 'selfx-theme';
const ONBOARDED_KEY = 'selfx-onboarded';
const TERMS_KEY = 'selfx-terms-accepted';

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
