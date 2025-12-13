import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import { changeLanguage } from '../i18n';

export const useLanguage = () => {
  const { i18n, t } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language || 'ar');
  const [isRTL, setIsRTL] = useState(currentLanguage === 'ar');

  useEffect(() => {
    const updateLanguageState = () => {
      setCurrentLanguage(i18n.language);
      setIsRTL(i18n.language === 'ar');
    };

    // تحديث الحالة عند تغيير اللغة
    i18n.on('languageChanged', updateLanguageState);
    
    // تحديث الاتجاه
    document.documentElement.dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = i18n.language;

    return () => {
      i18n.off('languageChanged', updateLanguageState);
    };
  }, [i18n]);

  const switchLanguage = async () => {
    const newLanguage = currentLanguage === 'ar' ? 'en' : 'ar';
    await changeLanguage(newLanguage);
    setCurrentLanguage(newLanguage);
  };

  const setLanguage = async (language: string) => {
    await changeLanguage(language);
    setCurrentLanguage(language);
  };

  return {
    currentLanguage,
    isRTL,
    t,
    switchLanguage,
    setLanguage,
    isArabic: currentLanguage === 'ar',
    isEnglish: currentLanguage === 'en'
  };
};
