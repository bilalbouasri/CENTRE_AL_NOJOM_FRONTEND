import React, { useState, useEffect } from 'react';
import type { ReactNode } from 'react';

// Import translation files
import enTranslations from '../locales/en.json';
import arTranslations from '../locales/ar.json';

import type { Language } from './LanguageContext.types';
import { LanguageContext } from './LanguageContextInstance';

// Translation resources
const resources = {
  en: enTranslations,
  ar: arTranslations,
};

// Function to get nested translation value
const getNestedValue = (obj: Record<string, unknown>, path: string): string => {
  const keys = path.split('.');
  let result: unknown = obj;
  
  for (const key of keys) {
    if (result && typeof result === 'object' && key in result) {
      result = (result as Record<string, unknown>)[key];
    } else {
      return path; // Return the path if key not found
    }
  }
  
  return typeof result === 'string' ? result : path;
};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    // Get language from localStorage or default to 'en'
    const savedLanguage = localStorage.getItem('language') as Language;
    return savedLanguage || 'en';
  });

  const isRTL = language === 'ar';

  // Translation function
  const t = (key: string): string => {
    const translation = getNestedValue(resources[language], key);
    return translation || key;
  };

  // Update document direction and language when language changes
  useEffect(() => {
    localStorage.setItem('language', language);
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
    
    // Update body class for RTL styling
    if (isRTL) {
      document.body.classList.add('rtl');
      document.body.classList.remove('ltr');
    } else {
      document.body.classList.add('ltr');
      document.body.classList.remove('rtl');
    }
  }, [language, isRTL]);

  const value = {
    language,
    setLanguage,
    t,
    isRTL,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};
