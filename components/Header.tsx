import React from 'react';
import LanguageSwitcher from './LanguageSwitcher';

type Language = "vi" | "en";

interface HeaderProps {
  t: any;
  language: Language;
  setLanguage: (lang: Language) => void;
}

const Header: React.FC<HeaderProps> = ({ t, language, setLanguage }) => {
  return (
    <header className="text-center mb-8">
      <div className="flex justify-center items-center gap-4 mb-4">
        <h1 className="text-4xl sm:text-5xl font-bold text-white">
          {t.title}
        </h1>
        <LanguageSwitcher language={language} setLanguage={setLanguage} />
      </div>
      <p className="mt-2 text-lg text-slate-400 max-w-3xl mx-auto">
        {t.description}
      </p>
    </header>
  );
};

export default Header;
