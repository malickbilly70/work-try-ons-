import React from 'react';

export default function MBGlobalLogo({ className = "w-10 h-10", showSlogan = false, textClassName = "" }) {
  return (
    <div className="flex items-center gap-3">
      {/* Official MB Global SVG Geometry */}
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`${className} flex-shrink-0 transition-transform hover:scale-105`}
      >
        <rect width="100" height="100" rx="22" fill="#3878bc" />
        <path
          d="M24 72V28H38L50 48L62 28H76V72H64V44L52 64H48L36 44V72H24Z"
          fill="#FFFFFF"
        />
        <circle cx="80" cy="20" r="8" fill="#FFFFFF" opacity="0.9" />
      </svg>

      <div className="flex flex-col">
        <span className={`font-heading font-black text-xl tracking-tight leading-none text-mb-white dark:text-mb-white text-mb-dark ${textClassName}`}>
          MB GLOBAL
        </span>
        {showSlogan && (
          <span className="text-[10px] tracking-wider uppercase font-semibold text-mb-blue dark:text-mb-blue mt-0.5">
            Building Tomorrow, Today.
          </span>
        )}
      </div>
    </div>
  );
}
