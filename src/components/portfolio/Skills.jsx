import React, { useState } from 'react';
import { CheckCircle2, Code2, Database, Layout, Server, Sparkles, Cpu } from 'lucide-react';
import { PERSONAL_DATA } from '../../data/personalData';

export default function Skills() {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categoryIcons = {
    "Frontend Development": Layout,
    "Backend & Systems": Server,
    "Cloud, DevOps & Infrastructure": Cpu,
    "Databases & Data Modeling": Database,
    "Founder & Leadership": Sparkles
  };

  const categories = ['All', ...PERSONAL_DATA.skills.map((s) => s.category)];

  const displayedSkills =
    selectedCategory === 'All'
      ? PERSONAL_DATA.skills
      : PERSONAL_DATA.skills.filter((s) => s.category === selectedCategory);

  return (
    <section id="skills" className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-mb-blue">
            Technical Proficiency & Expertise
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
            Skills & Core Capabilities
          </h2>
          <div className="w-16 h-1 bg-mb-blue mx-auto rounded-full" />
          <p className="text-sm sm:text-base text-slate-600 dark:text-mb-textMuted">
            A comprehensive overview of my technical stack, system architecture tools, and strategic leadership skills.
          </p>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                selectedCategory === cat
                  ? 'bg-mb-blue text-white shadow-sm'
                  : 'bg-white dark:bg-mb-surface border border-slate-200 dark:border-mb-border text-slate-600 dark:text-slate-300 hover:text-mb-blue dark:hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Categorized Skills Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedSkills.map((categoryGroup, idx) => {
            const Icon = categoryIcons[categoryGroup.category] || Code2;
            return (
              <div
                key={idx}
                className="rounded-2xl border border-slate-200 dark:border-mb-border bg-white dark:bg-mb-surface p-6 shadow-sm hover:shadow-md transition-shadow duration-200"
              >
                <div className="flex items-center gap-3 pb-4 mb-4 border-b border-slate-100 dark:border-mb-border">
                  <div className="p-2.5 rounded-xl bg-mb-blue/10 text-mb-blue">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-base sm:text-lg text-slate-900 dark:text-white">
                    {categoryGroup.category}
                  </h3>
                </div>

                <div className="space-y-3">
                  {categoryGroup.items.map((skill, sIdx) => (
                    <div
                      key={sIdx}
                      className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-mb-surfaceLight/50 border border-slate-100 dark:border-mb-border/40"
                    >
                      <span className="text-sm font-medium text-slate-800 dark:text-slate-200 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        {skill.name}
                      </span>
                      <span className="text-[11px] font-semibold uppercase px-2 py-0.5 rounded bg-slate-200 dark:bg-mb-surface text-slate-600 dark:text-mb-textMuted border border-slate-300/40 dark:border-mb-border">
                        {skill.level}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
