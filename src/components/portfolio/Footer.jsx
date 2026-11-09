import React from 'react';
import { Github, Linkedin, Mail, Heart, ArrowUp } from 'lucide-react';
import { PERSONAL_DATA } from '../../data/personalData';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-slate-200 dark:border-mb-border bg-white dark:bg-mb-dark py-12 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-slate-100 dark:border-mb-border/80">

          {/* Brand Info */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-mb-blue flex items-center justify-center text-white font-black text-base shadow-sm">
              MB
            </div>
            <div>
              <p className="font-bold text-slate-900 dark:text-white text-base">
                {PERSONAL_DATA.name}
              </p>
              <p className="text-xs text-slate-500 dark:text-mb-textMuted">
                {PERSONAL_DATA.title}
              </p>
            </div>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
            <a
              href={PERSONAL_DATA.socials.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="p-2 rounded-lg hover:text-mb-blue dark:hover:text-white hover:bg-slate-100 dark:hover:bg-mb-surface transition-colors"
            >
              <Github className="w-5 h-5" />
            </a>
            <a
              href={PERSONAL_DATA.socials.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="p-2 rounded-lg hover:text-mb-blue dark:hover:text-white hover:bg-slate-100 dark:hover:bg-mb-surface transition-colors"
            >
              <Linkedin className="w-5 h-5" />
            </a>
            <a
              href={`mailto:${PERSONAL_DATA.socials.email}`}
              aria-label="Email"
              className="p-2 rounded-lg hover:text-mb-blue dark:hover:text-white hover:bg-slate-100 dark:hover:bg-mb-surface transition-colors"
            >
              <Mail className="w-5 h-5" />
            </a>
          </div>

          {/* Back to top button */}
          <button
            onClick={scrollToTop}
            type="button"
            className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-mb-blue dark:hover:text-white transition-colors"
          >
            <span>Back to top</span>
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>

        {/* Copyright notice */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 dark:text-mb-textMuted gap-2">
          <p>&copy; {new Date().getFullYear()} {PERSONAL_DATA.name}. All rights reserved.</p>
          <p className="flex items-center gap-1">
            <span>Built with precision & passion</span>
          </p>
        </div>

      </div>
    </footer>
  );
}
