import React from 'react';
import { useLanguage } from '../hooks/useLanguage';

const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage, isRTL } = useLanguage();

  const toggleLanguage = () => {
    const newLanguage = language === 'en' ? 'ar' : 'en';
    setLanguage(newLanguage);
  };

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
      title={language === 'en' ? 'Switch to Arabic' : 'التغيير إلى الإنجليزية'}
    >
      <span className={`text-sm ${isRTL ? 'font-arabic' : 'font-latin'}`}>
        {language === 'en' ? 'العربية' : 'English'}
      </span>
      <span className="text-gray-400">|</span>
      <span className="text-xs">
        {language.toUpperCase()}
      </span>
    </button>
  );
};

export default LanguageSwitcher;