import React from 'react';
import { Globe } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';

const LanguageSwitcher: React.FC = () => {
  const { currentLanguage, switchLanguage, t } = useLanguage();

  return (
    <button
      onClick={switchLanguage}
      className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 
                 transition-all duration-200 text-white/90 hover:text-white"
      title={t('language.switchTo', { language: currentLanguage === 'ar' ? t('language.english') : t('language.arabic') })}
    >
      <Globe size={18} />
      <span className="text-sm font-medium">
        {currentLanguage === 'ar' ? t('language.arabic') : t('language.english')}
      </span>
      <span className="text-xs opacity-75">
        ({currentLanguage === 'ar' ? 'EN' : 'ع'})
      </span>
    </button>
  );
};

export default LanguageSwitcher;
