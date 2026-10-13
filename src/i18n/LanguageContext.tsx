import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language } from '../types';
import { translations } from './translations';

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  toggleLang: () => void;
  isRtl: boolean;
  dir: 'rtl' | 'ltr';
  t: (key: keyof typeof translations['en']) => string;
  // Localized field picker with graceful fallback
  getField: <T extends Record<string, any>>(item: T | null | undefined, fieldPrefix: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<Language>(() => {
    const saved = localStorage.getItem('madrasa_lang');
    return saved === 'ur' ? 'ur' : 'en';
  });

  const isRtl = lang === 'ur';
  const dir: 'rtl' | 'ltr' = isRtl ? 'rtl' : 'ltr';

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem('madrasa_lang', newLang);
  };

  const toggleLang = () => {
    setLang(lang === 'en' ? 'ur' : 'en');
  };

  useEffect(() => {
    document.documentElement.dir = dir;
    document.documentElement.lang = lang;
  }, [dir, lang]);

  const t = (key: keyof typeof translations['en']): string => {
    const dict = translations[lang] || translations.en;
    return dict[key] || translations.en[key] || String(key);
  };

  const getField = <T extends Record<string, any>>(item: T | null | undefined, fieldPrefix: string): string => {
    if (!item) return '';
    const localizedKey = `${fieldPrefix}_${lang}`;
    const fallbackKey = `${fieldPrefix}_en`;
    const altFallbackKey = `${fieldPrefix}_ur`;

    const val = item[localizedKey];
    if (val && typeof val === 'string' && val.trim()) {
      return val;
    }
    const fallback = item[fallbackKey];
    if (fallback && typeof fallback === 'string' && fallback.trim()) {
      return fallback;
    }
    const altFallback = item[altFallbackKey];
    if (altFallback && typeof altFallback === 'string') {
      return altFallback;
    }
    return '';
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLang, isRtl, dir, t, getField }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
