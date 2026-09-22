import React from 'react';

interface ClientLogoSvgProps extends React.SVGProps<SVGSVGElement> {
  name: string;
}

export function ClientLogoSvg({ name, className = 'h-8 w-auto', ...props }: ClientLogoSvgProps) {
  const normalized = name.toLowerCase().replace(/[^a-z0-9]/g, '');

  switch (normalized) {
    case 'stryker':
      return (
        <svg
          viewBox="0 0 140 36"
          fill="currentColor"
          className={className}
          aria-label="Stryker"
          {...props}
        >
          {/* Stryker geometric corporate typography */}
          <text
            x="4"
            y="26"
            fontFamily="Arial, Helvetica, sans-serif"
            fontSize="26"
            fontWeight="900"
            letterSpacing="-0.5"
          >
            stryker
          </text>
          <circle cx="118" cy="12" r="3" fill="none" stroke="currentColor" strokeWidth="1.2" />
          <text x="116.5" y="14" fontFamily="sans-serif" fontSize="4.5" fontWeight="bold">
            R
          </text>
        </svg>
      );

    case 'tata':
      return (
        <svg
          viewBox="0 0 130 36"
          fill="currentColor"
          className={className}
          aria-label="Tata"
          {...props}
        >
          {/* Tata emblem: oval with central T stylized curves */}
          <g transform="translate(10, 4)">
            <ellipse cx="14" cy="14" rx="13" ry="13" fill="none" stroke="currentColor" strokeWidth="2.5" />
            <path
              d="M8 8 C14 8, 14 20, 14 22 M20 8 C14 8, 14 20, 14 22 M9 9 L19 9"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </g>
          <text
            x="48"
            y="25"
            fontFamily="'Times New Roman', Georgia, serif"
            fontSize="22"
            fontWeight="bold"
            letterSpacing="2.5"
          >
            TATA
          </text>
        </svg>
      );

    case 'vocera':
      return (
        <svg
          viewBox="0 0 140 36"
          fill="currentColor"
          className={className}
          aria-label="Vocera"
          {...props}
        >
          <text
            x="2"
            y="25"
            fontFamily="'Trebuchet MS', 'Segoe UI', sans-serif"
            fontSize="24"
            fontWeight="300"
            letterSpacing="-0.5"
          >
            vocera
          </text>
          {/* Iconic dual-chevron Vocera V */}
          <path d="M84 7 L98 27 L108 12 L103 12 L97 22 L89 7 Z" fill="#0EA5E9" />
          <path d="M98 27 L114 7 L124 7 L105 27 Z" fill="#F59E0B" />
        </svg>
      );

    case 'bt':
      return (
        <svg
          viewBox="0 0 90 36"
          fill="currentColor"
          className={className}
          aria-label="BT"
          {...props}
        >
          {/* BT circle badge */}
          <circle cx="18" cy="18" r="15" fill="none" stroke="currentColor" strokeWidth="2.5" />
          <text
            x="9"
            y="25"
            fontFamily="Arial, Helvetica, sans-serif"
            fontSize="20"
            fontWeight="bold"
            letterSpacing="-0.5"
          >
            BT
          </text>
        </svg>
      );

    case 'anantasystems':
    case 'ananta':
      return (
        <svg
          viewBox="0 0 150 36"
          fill="currentColor"
          className={className}
          aria-label="Ananta Systems"
          {...props}
        >
          {/* Ananta Greek Alpha / Delta emblem */}
          <g transform="translate(6, 4)">
            <path
              d="M14 2 L26 24 L2 24 Z"
              fill="none"
              stroke="#0EA5E9"
              strokeWidth="3"
              strokeLinejoin="round"
            />
            <circle cx="14" cy="14" r="3.5" fill="#0EA5E9" />
          </g>
          <text
            x="40"
            y="18"
            fontFamily="sans-serif"
            fontSize="13"
            fontWeight="900"
            letterSpacing="1.5"
          >
            ANANTA
          </text>
          <text
            x="40"
            y="28"
            fontFamily="sans-serif"
            fontSize="8"
            fontWeight="600"
            letterSpacing="1.2"
            fill="#44474d"
          >
            SYSTEMS
          </text>
        </svg>
      );

    case 'questlabs':
      return (
        <svg
          viewBox="0 0 140 36"
          fill="currentColor"
          className={className}
          aria-label="QuestLabs"
          {...props}
        >
          {/* Stylized rounded Q with cyan circle */}
          <g transform="translate(4, 5)">
            <circle cx="13" cy="13" r="11" fill="none" stroke="#0284C7" strokeWidth="3.5" />
            <path d="M19 19 L25 25" stroke="#0284C7" strokeWidth="3.5" strokeLinecap="round" />
            <circle cx="13" cy="13" r="4.5" fill="#0284C7" />
          </g>
          <text
            x="36"
            y="24"
            fontFamily="'Segoe UI', Roboto, sans-serif"
            fontSize="20"
            fontWeight="800"
            letterSpacing="-0.5"
          >
            QuestLabs
          </text>
        </svg>
      );

    case 'willware':
      return (
        <svg
          viewBox="0 0 140 36"
          fill="currentColor"
          className={className}
          aria-label="WillWare"
          {...props}
        >
          {/* Dual angled W bars */}
          <g transform="translate(6, 6)">
            <path d="M2 2 L7 20 L12 8 L17 20 L22 2" fill="none" stroke="#0284C7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M9 2 L14 20 L19 8 L24 20 L29 2" fill="none" stroke="#38BDF8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </g>
          <text
            x="42"
            y="19"
            fontFamily="'Segoe UI', sans-serif"
            fontSize="15"
            fontWeight="bold"
            letterSpacing="0.5"
          >
            WillWare
          </text>
          <text
            x="42"
            y="27"
            fontFamily="sans-serif"
            fontSize="5.5"
            fontWeight="600"
            letterSpacing="1"
            fill="#0284C7"
          >
            INNOVATE TO ACCELERATE
          </text>
        </svg>
      );

    case 'menhood':
      return (
        <svg
          viewBox="0 0 140 36"
          fill="currentColor"
          className={className}
          aria-label="Menhood"
          {...props}
        >
          <text
            x="4"
            y="26"
            fontFamily="'Arial Black', Impact, sans-serif"
            fontSize="22"
            fontWeight="900"
            letterSpacing="1"
          >
            M[E]NHOOD
          </text>
          <circle cx="126" cy="10" r="2.5" fill="none" stroke="currentColor" strokeWidth="1" />
        </svg>
      );

    case 'resmerasolutions':
    case 'resmera':
      return (
        <svg
          viewBox="0 0 150 36"
          fill="currentColor"
          className={className}
          aria-label="Resmera Solutions"
          {...props}
        >
          <g transform="translate(6, 6)">
            <path d="M2 4 L12 0 L22 4 L22 16 L12 22 L2 16 Z" fill="#6B21A8" opacity="0.9" />
            <text x="6" y="16" fontFamily="sans-serif" fontSize="11" fontWeight="bold" fill="#ffffff">
              RS
            </text>
          </g>
          <text
            x="36"
            y="23"
            fontFamily="sans-serif"
            fontSize="14"
            fontWeight="700"
            letterSpacing="-0.2"
          >
            Resmera Solutions
          </text>
        </svg>
      );

    case 'squiretechnologies':
    case 'squire':
      return (
        <svg
          viewBox="0 0 160 36"
          fill="currentColor"
          className={className}
          aria-label="Squire Technologies"
          {...props}
        >
          <text
            x="4"
            y="24"
            fontFamily="system-ui, -apple-system, sans-serif"
            fontSize="18"
            fontWeight="400"
            letterSpacing="-0.5"
          >
            <tspan fontWeight="800">squire</tspan> technologies
          </text>
        </svg>
      );

    case 'ananttam':
      return (
        <svg
          viewBox="0 0 130 36"
          fill="currentColor"
          className={className}
          aria-label="Ananttam"
          {...props}
        >
          <g transform="translate(6, 8)">
            <path
              d="M6 10 C2 4, 8 0, 14 0 C20 0, 26 10, 32 10 C38 10, 44 4, 40 0"
              fill="none"
              stroke="#D4AF37"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </g>
          <text
            x="52"
            y="23"
            fontFamily="sans-serif"
            fontSize="13"
            fontWeight="800"
            letterSpacing="2"
          >
            ANANTTAM
          </text>
        </svg>
      );

    default:
      return (
        <span className="text-[17px] font-bold tracking-tight text-[#0B1F3A]/80 hover:text-[#C6963A] transition-colors">
          {name}
        </span>
      );
  }
}
