import React from "react";

interface LogoProps {
  size?: "sm" | "md" | "lg";
}

export default function Logo({ size = "md" }: LogoProps) {
  const iconSizes = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-14 h-14",
  };

  const textSizes = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-2xl",
  };

  return (
    <div className="flex items-center gap-3 group">
      <div className={`relative flex items-center justify-center transition-transform duration-300 group-hover:scale-105 ${iconSizes[size]}`}>
        <div className="absolute inset-0 bg-indigo-500/20 rounded-2xl blur-md group-hover:bg-indigo-500/40 transition duration-300"></div>

        <svg
          viewBox="0 0 128 128"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full relative z-10 drop-shadow-md"
        >
          <defs>
            <linearGradient id="cyberIndigoComp" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#818CF8" />
              <stop offset="50%" stopColor="#4F46E5" />
              <stop offset="100%" stopColor="#312E81" />
            </linearGradient>

            <linearGradient id="cyberEmeraldComp" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#34D399" />
              <stop offset="100%" stopColor="#059669" />
            </linearGradient>

            <linearGradient id="glassFacetComp" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.05" />
            </linearGradient>
          </defs>

          <path
            d="M64 16L100 32V68C100 88 64 108 64 108C64 108 28 88 28 68V32L64 16Z"
            fill="url(#cyberIndigoComp)"
            fillOpacity="0.25"
            stroke="url(#cyberIndigoComp)"
            strokeWidth="5"
            strokeLinejoin="round"
          />

          <path
            d="M64 16L100 32V68C100 88 64 108 64 108V16Z"
            fill="url(#glassFacetComp)"
          />

          <path
            d="M50 42V78M50 42H70C76.6274 42 82 47.3726 82 54C82 60.6274 76.6274 66 70 66H50"
            stroke="url(#cyberEmeraldComp)"
            strokeWidth="7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M42 34H86"
            stroke="#F8FAFC"
            strokeWidth="6"
            strokeLinecap="round"
          />

          <circle cx="64" cy="54" r="5" fill="#34D399" />
        </svg>
      </div>

      <div className="flex flex-col">
        <span className={`font-black tracking-tight text-white leading-none ${textSizes[size]}`}>
          Private<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-sky-400 to-emerald-400">Toolbox</span>
        </span>
        <span className="text-[10px] font-semibold tracking-widest text-slate-500 uppercase mt-0.5">
          Client-Side Security
        </span>
      </div>
    </div>
  );
}