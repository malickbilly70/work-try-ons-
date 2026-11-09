import React, { useState } from 'react';
import { Sun, Moon, Menu, X, Code2, Briefcase, User, Mail, Layers } from 'lucide-react';
import { PERSONAL_DATA } from '../../data/personalData';

export default function Navbar({ theme, onThemeToggle }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'About', href: '#about', icon: User },
    { label: 'Skills', href: '#skills', icon: Code2 },
    { label: 'Projects', href: '#projects', icon: Layers },
    { label: 'Experience', href: '#experience', icon: Briefcase },
    { label: 'Contact', href: '#contact', icon: Mail }
  ];

  const handleNavClick = (href) => {
    setMobileMenuOpen(false);
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-white/80 dark:bg-mb-dark/85 border-b border-slate-200 dark:border-mb-border transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand / Logo */}
        <a
          href="#hero"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex items-center gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-mb-blue rounded-lg px-1 py-0.5"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-mb-blue to-indigo-600 flex items-center justify-center text-white font-black text-lg shadow-md group-hover:scale-105 transition-transform duration-200">
            MB
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-slate-900 dark:text-white leading-tight tracking-tight text-base sm:text-lg group-hover:text-mb-blue transition-colors">
              {PERSONAL_DATA.name}
            </span>
            <span className="text-xs text-slate-500 dark:text-mb-textMuted font-medium">
              Software Engineer & Founder
            </span>
          </div>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(link.href);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-mb-blue dark:hover:text-white hover:bg-slate-100 dark:hover:bg-mb-surface transition-all duration-150"
              >
                <Icon className="w-4 h-4 opacity-70" />
                {link.label}
              </a>
            );
          })}
        </nav>

        {/* Action Controls: Theme Switcher & Contact Button */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={onThemeToggle}
            type="button"
            aria-label="Toggle Theme"
            className="p-2 rounded-lg border border-slate-200 dark:border-mb-border bg-slate-50 dark:bg-mb-surface text-slate-600 dark:text-slate-300 hover:text-mb-blue dark:hover:text-mb-blue hover:border-mb-blue/40 transition-colors duration-150"
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-slate-700" />
            )}
          </button>

          <a
            href="#contact"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick('#contact');
            }}
            className="hidden sm:inline-flex items-center justify-center px-4 py-2 rounded-lg bg-mb-blue hover:bg-mb-accentHover text-white text-sm font-semibold shadow-sm hover:shadow transition-all duration-150"
          >
            Let's Connect
          </a>

          {/* Mobile menu toggle button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            type="button"
            aria-label="Toggle menu"
            className="md:hidden p-2 rounded-lg border border-slate-200 dark:border-mb-border text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-mb-surface"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 dark:border-mb-border bg-white dark:bg-mb-surface px-4 py-4 space-y-2 shadow-lg animate-fadeIn">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(link.href);
                }}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-base font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-mb-surfaceLight hover:text-mb-blue transition-colors"
              >
                <Icon className="w-5 h-5 text-mb-blue" />
                {link.label}
              </a>
            );
          })}
          <div className="pt-2">
            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick('#contact');
              }}
              className="w-full inline-flex items-center justify-center px-4 py-2.5 rounded-lg bg-mb-blue hover:bg-mb-accentHover text-white text-sm font-semibold shadow"
            >
              Let's Connect
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
