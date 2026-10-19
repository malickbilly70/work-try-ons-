import React from 'react';
import { Sun, Moon, Languages, Shield, Calendar } from 'lucide-react';
import MBGlobalLogo from './MBGlobalLogo';
import { TRANSLATIONS } from '../utils/translations';

export default function Header({
  lang,
  onLanguageChange,
  theme,
  onThemeToggle,
  route,
  onNavigate
}) {
  const t = TRANSLATIONS[lang] || TRANSLATIONS.EN;

  return (
    <header className="border-b border-mb-border dark:border-mb-border bg-white dark:bg-mb-dark/90 backdrop-blur-md sticky top-0 z-40 transition-colors duration-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col sm:flex-row justify-between items-center gap-3">
        {/* Left: Official Logo + Slogan */}
        <div className="cursor-pointer" onClick={() => onNavigate('/')}>
          <MBGlobalLogo className="w-10 h-10" showSlogan={true} />
        </div>

        {/* Right: Controls & Portal Switcher */}
        <div className="flex items-center gap-3">
          {/* Language Switcher */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-mb-surface p-1 rounded-xl border border-slate-200 dark:border-mb-border text-xs font-semibold">
            <Languages className="w-3.5 h-3.5 text-mb-blue ml-1.5" />
            <button
              onClick={() => onLanguageChange('EN')}
              className={`px-2 py-1 rounded-lg transition ${
                lang === 'EN'
                  ? 'bg-mb-blue text-white shadow-sm font-bold'
                  : 'text-slate-600 dark:text-mb-textMuted hover:text-mb-blue'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => onLanguageChange('SW')}
              className={`px-2 py-1 rounded-lg transition ${
                lang === 'SW'
                  ? 'bg-mb-blue text-white shadow-sm font-bold'
                  : 'text-slate-600 dark:text-mb-textMuted hover:text-mb-blue'
              }`}
            >
              SW
            </button>
          </div>

          {/* Theme Switcher */}
          <button
            onClick={onThemeToggle}
            aria-label="Toggle Theme"
            className="p-2 rounded-xl bg-slate-100 dark:bg-mb-surface border border-slate-200 dark:border-mb-border text-slate-700 dark:text-mb-textLight hover:text-mb-blue transition flex items-center justify-center"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-mb-blue" />
            )}
          </button>

          {/* Direct Route Indicator */}
          {route === '/admin' ? (
            <button
              onClick={() => onNavigate('/')}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-mb-surface text-mb-textLight border border-mb-border hover:bg-mb-surfaceLight transition flex items-center gap-1.5"
            >
              <Calendar className="w-3.5 h-3.5 text-mb-blue" />
              {t.clientPortal}
            </button>
          ) : (
            <button
              onClick={() => onNavigate('/admin')}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-mb-surface text-mb-textLight border border-mb-border hover:bg-mb-surfaceLight transition flex items-center gap-1.5"
            >
              <Shield className="w-3.5 h-3.5 text-mb-blue" />
              {t.adminPortal}
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
