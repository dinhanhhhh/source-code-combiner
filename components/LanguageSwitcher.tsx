import React from 'react';

type Language = "vi" | "en";

interface LanguageSwitcherProps {
  language: Language;
  setLanguage: (lang: Language) => void;
}

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ language, setLanguage }) => {
  return (
    <div className="flex items-center bg-slate-800 rounded-full p-1 border border-slate-700">
      <button
        onClick={() => setLanguage("vi")}
        className={`px-3 py-1 text-sm font-semibold rounded-full ${
          language === "vi"
            ? "bg-sky-600 text-white"
            : "text-slate-400 hover:bg-slate-700"
        }`}
      >
        VI
      </button>
      <button
        onClick={() => setLanguage("en")}
        className={`px-3 py-1 text-sm font-semibold rounded-full ${
          language === "en"
            ? "bg-sky-600 text-white"
            : "text-slate-400 hover:bg-slate-700"
        }`}
      >
        EN
      </button>
    </div>
  );
};

export default LanguageSwitcher;
