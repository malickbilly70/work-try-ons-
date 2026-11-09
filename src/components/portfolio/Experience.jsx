import React from 'react';
import { Briefcase, Calendar, MapPin, Award, CheckCircle } from 'lucide-react';
import { PERSONAL_DATA } from '../../data/personalData';

export default function Experience() {
  return (
    <section id="experience" className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-mb-blue">
            Career Timeline & Milestones
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
            Experience & Founder Journey
          </h2>
          <div className="w-16 h-1 bg-mb-blue mx-auto rounded-full" />
          <p className="text-sm sm:text-base text-slate-600 dark:text-mb-textMuted">
            Track record of founding ventures, leading engineering squads, and engineering mission-critical software.
          </p>
        </div>

        {/* Timeline Flow */}
        <div className="relative border-l-2 border-slate-200 dark:border-mb-border ml-4 md:ml-32 space-y-12">
          {PERSONAL_DATA.experience.map((exp, idx) => (
            <div key={idx} className="relative pl-8 group">

              {/* Dot Icon marker on line */}
              <div className="absolute -left-[17px] top-1 w-8 h-8 rounded-full bg-white dark:bg-mb-dark border-4 border-mb-blue flex items-center justify-center text-mb-blue shadow group-hover:scale-110 transition-transform">
                <Briefcase className="w-3.5 h-3.5" />
              </div>

              {/* Experience Box Card */}
              <div className="p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-mb-border bg-white dark:bg-mb-surface shadow-sm hover:shadow-md transition-shadow">

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100 dark:border-mb-border/80">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                      {exp.role}
                    </h3>
                    <p className="text-base font-medium text-mb-blue">
                      {exp.company}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-mb-textMuted font-medium">
                    <span className="inline-flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {exp.period}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" />
                      {exp.location}
                    </span>
                  </div>
                </div>

                {/* Description */}
                <p className="pt-4 text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                  {exp.description}
                </p>

                {/* Key Achievements Bullet list */}
                {exp.achievements && exp.achievements.length > 0 && (
                  <div className="mt-4 pt-3 space-y-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                      Key Highlights & Impact
                    </h4>
                    <ul className="space-y-1.5">
                      {exp.achievements.map((ach, aIdx) => (
                        <li key={aIdx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-600 dark:text-mb-textMuted">
                          <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                          <span>{ach}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
