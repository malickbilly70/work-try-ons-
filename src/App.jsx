import React, { useState, useEffect } from 'react';
import Navbar from './components/portfolio/Navbar';
import Hero from './components/portfolio/Hero';
import About from './components/portfolio/About';
import Skills from './components/portfolio/Skills';
import Projects from './components/portfolio/Projects';
import Experience from './components/portfolio/Experience';
import Contact from './components/portfolio/Contact';
import Footer from './components/portfolio/Footer';

export default function App() {
  // Theme state: dark / light with localStorage persistence
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('personal_theme');
    if (saved) return saved;
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  });

  // Sync theme with HTML document class
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('personal_theme', theme);
  }, [theme]);

  const handleThemeToggle = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-mb-dark text-slate-900 dark:text-mb-white transition-colors duration-200 selection:bg-mb-blue selection:text-white flex flex-col justify-between font-sans">
      {/* Sticky Navigation Bar */}
      <Navbar theme={theme} onThemeToggle={handleThemeToggle} />

      {/* Main Sections */}
      <main className="flex-grow">
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Experience />
        <Contact />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
