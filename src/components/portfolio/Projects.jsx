import React, { useState } from 'react';
import { ExternalLink, Github, FolderGit2, Sparkles, Check, ChevronRight } from 'lucide-react';
import { PERSONAL_DATA } from '../../data/personalData';

export default function Projects() {
  const [filter, setFilter] = useState('All');

  const categories = ['All', 'Featured', 'SaaS / Enterprise', 'DevOps & Cloud', 'Fintech & API', 'AI & Productivity'];

  const filteredProjects = PERSONAL_DATA.projects.filter((p) => {
    if (filter === 'All') return true;
    if (filter === 'Featured') return p.featured;
    return p.category === filter;
  });

  return (
    <section id="projects" className="py-20 bg-slate-100/50 dark:bg-mb-surface/30 border-y border-slate-200/80 dark:border-mb-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-mb-blue">
            Selected Works & Products
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
            Projects & Portfolio
          </h2>
          <div className="w-16 h-1 bg-mb-blue mx-auto rounded-full" />
          <p className="text-sm sm:text-base text-slate-600 dark:text-mb-textMuted">
            Production systems, open source architectures, and software ventures I've built from the ground up.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                filter === cat
                  ? 'bg-mb-blue text-white shadow-sm'
                  : 'bg-white dark:bg-mb-surface border border-slate-200 dark:border-mb-border text-slate-600 dark:text-slate-300 hover:text-mb-blue dark:hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="flex flex-col justify-between rounded-2xl border border-slate-200 dark:border-mb-border bg-white dark:bg-mb-surface overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group"
            >
              {/* Card Header & Content */}
              <div className="p-6 sm:p-8 space-y-4">

                {/* Meta Header */}
                <div className="flex items-center justify-between gap-2">
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-mb-blue/10 text-mb-blue border border-mb-blue/20">
                    {project.category}
                  </span>
                  {project.featured && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-amber-500 bg-amber-500/10 px-2.5 py-1 rounded-full">
                      <Sparkles className="w-3 h-3" /> Featured Project
                    </span>
                  )}
                </div>

                {/* Title */}
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white group-hover:text-mb-blue transition-colors">
                  {project.title}
                </h3>

                {/* Summary */}
                <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                  {project.summary}
                </p>

                {/* Key Technical Highlights */}
                <div className="space-y-2 pt-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    Architecture Highlights
                  </h4>
                  <ul className="space-y-1.5">
                    {project.highlights.map((h, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs sm:text-sm text-slate-600 dark:text-mb-textMuted">
                        <ChevronRight className="w-4 h-4 text-mb-blue flex-shrink-0 mt-0.5" />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Tech Stack Badges */}
                <div className="pt-4 flex flex-wrap gap-1.5">
                  {project.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 dark:bg-mb-surfaceLight text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-mb-border"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

              </div>

              {/* Card Footer / Action Links */}
              <div className="px-6 sm:px-8 py-4 border-t border-slate-100 dark:border-mb-border bg-slate-50/50 dark:bg-mb-surfaceLight/30 flex items-center justify-between">
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-mb-blue dark:hover:text-white transition-colors"
                >
                  <Github className="w-4 h-4" />
                  <span>Source Code</span>
                </a>

                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-mb-blue/10 hover:bg-mb-blue text-mb-blue hover:text-white text-xs sm:text-sm font-semibold transition-all"
                >
                  <span>Live Preview</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
