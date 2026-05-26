'use client';

import React, { createContext, useContext, useSyncExternalStore } from 'react';
import { translations, Language, TranslationKey } from '@/utils/translations';

const STORAGE_KEY = 'app-language';
const CHANGE_EVENT = 'app-language-change';

function subscribe(callback: () => void) {
  window.addEventListener(CHANGE_EVENT, callback);
  return () => window.removeEventListener(CHANGE_EVENT, callback);
}

function getSnapshot(): Language {
  const saved = localStorage.getItem(STORAGE_KEY) as Language;
  return saved === 'en' || saved === 'et' ? saved : 'et';
}

function getServerSnapshot(): Language {
  return 'et';
}

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey, params?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const language = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  );

  const setLanguage = (lang: Language) => {
    localStorage.setItem(STORAGE_KEY, lang);
    window.dispatchEvent(new Event(CHANGE_EVENT));
  };

  const t = (key: TranslationKey, params?: Record<string, string | number>) => {
    const text = translations[language][key] || key;
    if (!params) return text;

    return Object.entries(params).reduce((acc, [paramKey, paramValue]) => {
      return acc.replace(new RegExp(`{${paramKey}}`, 'g'), String(paramValue));
    }, text);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
