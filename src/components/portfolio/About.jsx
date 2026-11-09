import React from 'react';
import { Rocket, ShieldCheck, Cpu, Target, Award, Users } from 'lucide-react';
import { PERSONAL_DATA } from '../../data/personalData';

export default function About() {
  const highlights = [
    {
      icon: Cpu,
      title: 'Systems & Architecture',
      description: 'Designing resilient microservices, robust APIs, and cloud-native distributed infrastructure built for zero downtime.'
    },
    {
      icon: Rocket,
      title: 'Founder & Venture Mindset',
      description: 'Bridging technical execution with product-market fit, sustainable unit economics, and rapid iterative prototyping.'
    },
    {
      icon: ShieldCheck,
      title: 'Security & Quality First',
      description: 'Emphasizing high test coverage, strict type safety, data integrity, and strict adherence to enterprise security best practices.'
    },
    {
      icon: Users,
      title: 'Collaborative Leadership',
      description: 'Mentoring engineering talent, running transparent agile sprints, and fostering inclusive engineering cultures.'
    }
  ];

  return (
    <section id="about" className="py-20 bg-slate-100/60 dark:bg-mb-surface/40 border-y border-slate-200/80 dark:border-mb-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-mb-blue">
            Background & Philosophy
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
            About Me
          </h2>
          <div className="w-16 h-1 bg-mb-blue mx-auto rounded-full" />
        </div>

        {/* Narrative Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

          {/* Bio Story */}
          <div className="lg:col-span-7 space-y-5">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white leading-snug">
              Passionate engineer building technology solutions that bridge complex problems and effortless user experiences.
            </h3>

            {PERSONAL_DATA.bio.map((paragraph, idx) => (
              <p key={idx} className="text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                {paragraph}
              </p>
            ))}

            <div className="pt-2 flex flex-wrap gap-3">
              <span className="px-3.5 py-1.5 rounded-full bg-blue-100 dark:bg-mb-blue/20 text-mb-blue font-medium text-xs">
                #FullStackEngineering
              </span>
              <span className="px-3.5 py-1.5 rounded-full bg-blue-100 dark:bg-mb-blue/20 text-mb-blue font-medium text-xs">
                #StartupFounder
              </span>
              <span className="px-3.5 py-1.5 rounded-full bg-blue-100 dark:bg-mb-blue/20 text-mb-blue font-medium text-xs">
                #CloudArchitecture
              </span>
              <span className="px-3.5 py-1.5 rounded-full bg-blue-100 dark:bg-mb-blue/20 text-mb-blue font-medium text-xs">
                #DistributedSystems
              </span>
            </div>
          </div>

          {/* Pillars Cards */}
          <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
            {highlights.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="p-5 rounded-xl border border-slate-200 dark:border-mb-border bg-white dark:bg-mb-surface hover:border-mb-blue/50 dark:hover:border-mb-blue/50 shadow-sm transition-all"
                >
                  <div className="flex items-start gap-4">
                    <div className="p-2.5 rounded-lg bg-mb-blue/10 text-mb-blue flex-shrink-0">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900 dark:text-white text-base">
                        {item.title}
                      </h4>
                      <p className="text-xs sm:text-sm text-slate-600 dark:text-mb-textMuted mt-1 leading-normal">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
}
