import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import arTranslations from './locales/ar.json';
import enTranslations from './locales/en.json';

// تحديد اللغات المدعومة
const supportedLanguages = ['ar', 'en'];
const defaultLanguage = 'ar'; // العربية كلغة افتراضية

// استرجاع اللغة المحفوظة أو استخدام العربية كافتراضية
const savedLanguage = localStorage.getItem('orecoin-language');
const browserLanguage = navigator.language.split('-')[0];
const initialLanguage = savedLanguage || (supportedLanguages.includes(browserLanguage) ? browserLanguage : defaultLanguage);

// موارد الترجمة
const resources = {
  ar: {
    translation: arTranslations,
  },
  en: {
    translation: enTranslations,
  },
};

// تهيئة i18next
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: defaultLanguage,
    debug: false,
    
    interpolation: {
      escapeValue: false, // React يتولى الحماية من XSS
    },

    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      lookupLocalStorage: 'orecoin-language',
      caches: ['localStorage'],
    },

    // دعم RTL للعربية
    react: {
      useSuspense: false,
    },
  });

// دالة لتغيير اللغة وحفظها
export const changeLanguage = async (language: string) => {
  await i18n.changeLanguage(language);
  localStorage.setItem('orecoin-language', language);
  
  // تحديث اتجاه الصفحة
  document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  document.documentElement.lang = language;
};

// تهيئة الاتجاه عند بدء التطبيق
if (typeof window !== 'undefined') {
  document.documentElement.dir = initialLanguage === 'ar' ? 'rtl' : 'ltr';
  document.documentElement.lang = initialLanguage;
}

export default i18n;
