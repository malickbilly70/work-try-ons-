import React from 'react';
import { ArrowRight, Github, Linkedin, Mail, Sparkles, MapPin, Terminal, Download } from 'lucide-react';
import { PERSONAL_DATA } from '../../data/personalData';

export default function Hero() {
  const scrollToContact = (e) => {
    e.preventDefault();
    document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToProjects = (e) => {
    e.preventDefault();
    document.querySelector('#projects')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="hero" className="relative pt-12 pb-20 sm:pt-20 sm:pb-28 overflow-hidden">
      {/* Subtle background glow decorative elements */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-mb-blue/10 dark:bg-mb-blue/15 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-1/3 -right-20 w-80 h-80 bg-indigo-500/10 dark:bg-indigo-500/15 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16">

          {/* Main Hero Copy */}
          <div className="flex-1 text-center lg:text-left space-y-6 max-w-3xl">
            {/* Status pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 dark:bg-mb-surface border border-slate-200 dark:border-mb-border text-xs sm:text-sm font-medium text-slate-700 dark:text-mb-textLight shadow-sm">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <span>{PERSONAL_DATA.availability}</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.15]">
              Hi, I'm <span className="text-transparent bg-clip-text bg-gradient-to-r from-mb-blue via-blue-500 to-indigo-500">{PERSONAL_DATA.name}</span>
            </h1>

            {/* Sub-headline / Role */}
            <p className="text-xl sm:text-2xl font-semibold text-slate-800 dark:text-slate-200">
              {PERSONAL_DATA.title}
            </p>

            {/* Tagline / Bio intro */}
            <p className="text-base sm:text-lg text-slate-600 dark:text-mb-textMuted leading-relaxed max-w-2xl mx-auto lg:mx-0">
              {PERSONAL_DATA.tagline}
            </p>

            {/* Location indicator */}
            <div className="flex items-center justify-center lg:justify-start gap-2 text-sm text-slate-500 dark:text-slate-400 font-medium">
              <MapPin className="w-4 h-4 text-mb-blue" />
              <span>{PERSONAL_DATA.location}</span>
            </div>

            {/* Call to action buttons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 sm:gap-4 pt-2">
              <a
                href="#projects"
                onClick={scrollToProjects}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-mb-blue hover:bg-mb-accentHover text-white font-semibold text-sm shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5"
              >
                <span>View My Work</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <a
                href="#contact"
                onClick={scrollToContact}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-slate-300 dark:border-mb-border bg-white dark:bg-mb-surface hover:bg-slate-50 dark:hover:bg-mb-surfaceLight text-slate-800 dark:text-white font-semibold text-sm shadow-sm transition-all transform hover:-translate-y-0.5"
              >
                <Mail className="w-4 h-4 text-mb-blue" />
                <span>Get in Touch</span>
              </a>
            </div>

            {/* Social Channels */}
            <div className="pt-3 flex items-center justify-center lg:justify-start gap-3 text-slate-600 dark:text-mb-textMuted">
              <span className="text-xs font-semibold tracking-wider uppercase text-slate-400 dark:text-slate-500 mr-2">
                Follow & Connect:
              </span>
              <a
                href={PERSONAL_DATA.socials.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub Profile"
                className="p-2 rounded-lg bg-slate-100 dark:bg-mb-surface hover:text-mb-blue dark:hover:text-white transition-colors"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href={PERSONAL_DATA.socials.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn Profile"
                className="p-2 rounded-lg bg-slate-100 dark:bg-mb-surface hover:text-mb-blue dark:hover:text-white transition-colors"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href={`mailto:${PERSONAL_DATA.socials.email}`}
                aria-label="Direct Email"
                className="p-2 rounded-lg bg-slate-100 dark:bg-mb-surface hover:text-mb-blue dark:hover:text-white transition-colors"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Interactive Code / Founder Card Showcase */}
          <div className="w-full lg:w-[460px] flex-shrink-0">
            <div className="relative rounded-2xl border border-slate-200 dark:border-mb-border bg-white dark:bg-mb-surface shadow-xl overflow-hidden p-6">

              {/* Window Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-mb-border/80 text-xs font-mono text-slate-500 dark:text-mb-textMuted">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500" />
                  <div className="w-3 h-3 rounded-full bg-amber-500" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500" />
                  <span className="ml-2 font-medium">malickbilly.config.ts</span>
                </div>
                <Terminal className="w-4 h-4 text-mb-blue" />
              </div>

              {/* Code Snippet Box */}
              <div className="pt-4 font-mono text-xs sm:text-sm space-y-2 text-slate-700 dark:text-slate-300">
                <p>
                  <span className="text-purple-600 dark:text-purple-400">const</span>{' '}
                  <span className="text-blue-600 dark:text-blue-400">developer</span> = &#123;
                </p>
                <p className="pl-4">
                  <span className="text-slate-500">name:</span>{' '}
                  <span className="text-emerald-600 dark:text-emerald-400">"{PERSONAL_DATA.name}"</span>,
                </p>
                <p className="pl-4">
                  <span className="text-slate-500">roles:</span> [
                  <span className="text-emerald-600 dark:text-emerald-400">"Software Engineer"</span>,{' '}
                  <span className="text-emerald-600 dark:text-emerald-400">"Founder"</span>],
                </p>
                <p className="pl-4">
                  <span className="text-slate-500">coreFocus:</span>{' '}
                  <span className="text-emerald-600 dark:text-emerald-400">
                    "High-Availability Systems & Modern Web"
                  </span>,
                </p>
                <p className="pl-4">
                  <span className="text-slate-500">passions:</span> [
                  <span className="text-amber-600 dark:text-amber-400">"Clean Code"</span>,{' '}
                  <span className="text-amber-600 dark:text-amber-400">"Product Growth"</span>,{' '}
                  <span className="text-amber-600 dark:text-amber-400">"Scalability"</span>],
                </p>
                <p className="pl-4">
                  <span className="text-slate-500">currentStatus:</span>{' '}
                  <span className="text-blue-600 dark:text-blue-400">"Building & Innovating"</span>
                </p>
                <p>&#125;;</p>
              </div>

              {/* Key Stats Counter Grid */}
              <div className="mt-6 pt-5 border-t border-slate-100 dark:border-mb-border grid grid-cols-2 gap-4">
                {PERSONAL_DATA.stats.map((stat, i) => (
                  <div key={i} className="bg-slate-50 dark:bg-mb-surfaceLight/50 p-3 rounded-xl border border-slate-200/60 dark:border-mb-border/60">
                    <div className="text-2xl font-black text-mb-blue dark:text-white">
                      {stat.value}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-mb-textMuted font-medium mt-0.5">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
