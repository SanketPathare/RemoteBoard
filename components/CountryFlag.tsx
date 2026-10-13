import React from "react";

export type FlagSize = "xs" | "sm" | "md" | "lg" | "xl";

interface CountryFlagProps {
  code?: string;
  slug?: string;
  size?: FlagSize;
  className?: string;
}

const SIZE_MAP: Record<FlagSize, string> = {
  xs: "w-4 h-3 rounded-[2px]",
  sm: "w-5 h-3.5 rounded-[3px]",
  md: "w-7 h-5 rounded-[4px]",
  lg: "w-10 h-7 rounded-md",
  xl: "w-14 h-10 rounded-lg",
};

export function CountryFlag({
  code = "",
  slug = "",
  size = "md",
  className = "",
}: CountryFlagProps) {
  const normalizedKey = (code || slug).toUpperCase();
  const sizeClass = SIZE_MAP[size] || SIZE_MAP.md;

  // Render SVG flag based on ISO code or slug
  const renderFlag = () => {
    switch (normalizedKey) {
      // ── United States ──
      case "US":
      case "UNITED-STATES":
      case "USA":
        return (
          <svg viewBox="0 0 60 40" className="h-full w-full object-cover">
            {/* 13 stripes */}
            <rect width="60" height="40" fill="#B22234" />
            <path d="M0 3.08h60M0 9.23h60M0 15.38h60M0 21.54h60M0 27.69h60M0 33.85h60" stroke="#FFFFFF" strokeWidth="3.08" />
            {/* Canton */}
            <rect width="24" height="21.54" fill="#3C3B6E" />
            {/* Stars grid representation */}
            <g fill="#FFFFFF">
              <circle cx="4" cy="3.5" r="1.1" />
              <circle cx="8" cy="3.5" r="1.1" />
              <circle cx="12" cy="3.5" r="1.1" />
              <circle cx="16" cy="3.5" r="1.1" />
              <circle cx="20" cy="3.5" r="1.1" />
              <circle cx="6" cy="7.2" r="1.1" />
              <circle cx="10" cy="7.2" r="1.1" />
              <circle cx="14" cy="7.2" r="1.1" />
              <circle cx="18" cy="7.2" r="1.1" />
              <circle cx="4" cy="10.8" r="1.1" />
              <circle cx="8" cy="10.8" r="1.1" />
              <circle cx="12" cy="10.8" r="1.1" />
              <circle cx="16" cy="10.8" r="1.1" />
              <circle cx="20" cy="10.8" r="1.1" />
              <circle cx="6" cy="14.4" r="1.1" />
              <circle cx="10" cy="14.4" r="1.1" />
              <circle cx="14" cy="14.4" r="1.1" />
              <circle cx="18" cy="14.4" r="1.1" />
              <circle cx="4" cy="18" r="1.1" />
              <circle cx="8" cy="18" r="1.1" />
              <circle cx="12" cy="18" r="1.1" />
              <circle cx="16" cy="18" r="1.1" />
              <circle cx="20" cy="18" r="1.1" />
            </g>
          </svg>
        );

      // ── United Kingdom ──
      case "GB":
      case "UK":
      case "UNITED-KINGDOM":
        return (
          <svg viewBox="0 0 60 40" className="h-full w-full object-cover">
            <rect width="60" height="40" fill="#012169" />
            {/* White diagonal saltire */}
            <path d="M0 0l60 40m0-40L0 40" stroke="#FFFFFF" strokeWidth="6.5" />
            {/* Red diagonal saltire */}
            <path d="M0 0l60 40m0-40L0 40" stroke="#C8102E" strokeWidth="3" />
            {/* White cross */}
            <path d="M30 0v40M0 20h60" stroke="#FFFFFF" strokeWidth="11" />
            {/* Red cross */}
            <path d="M30 0v40M0 20h60" stroke="#C8102E" strokeWidth="6.5" />
          </svg>
        );

      // ── Germany ──
      case "DE":
      case "GERMANY":
        return (
          <svg viewBox="0 0 60 40" className="h-full w-full object-cover">
            <rect width="60" height="13.33" fill="#000000" />
            <rect y="13.33" width="60" height="13.33" fill="#DD0000" />
            <rect y="26.66" width="60" height="13.34" fill="#FFCE00" />
          </svg>
        );

      // ── India ──
      case "IN":
      case "INDIA":
        return (
          <svg viewBox="0 0 60 40" className="h-full w-full object-cover">
            {/* Saffron */}
            <rect width="60" height="13.33" fill="#FF9933" />
            {/* White */}
            <rect y="13.33" width="60" height="13.33" fill="#FFFFFF" />
            {/* Green */}
            <rect y="26.66" width="60" height="13.34" fill="#138808" />
            {/* Ashoka Chakra */}
            <g transform="translate(30, 20)">
              <circle r="5" fill="none" stroke="#000080" strokeWidth="0.8" />
              <circle r="1" fill="#000080" />
              {/* Radiating spokes */}
              {[...Array(12)].map((_, i) => (
                <line
                  key={i}
                  x1="-5"
                  y1="0"
                  x2="5"
                  y2="0"
                  stroke="#000080"
                  strokeWidth="0.5"
                  transform={`rotate(${i * 15})`}
                />
              ))}
            </g>
          </svg>
        );

      // ── Canada ──
      case "CA":
      case "CANADA":
        return (
          <svg viewBox="0 0 60 40" className="h-full w-full object-cover">
            <rect width="15" height="40" fill="#FF0000" />
            <rect x="15" width="30" height="40" fill="#FFFFFF" />
            <rect x="45" width="15" height="40" fill="#FF0000" />
            {/* Iconic Maple Leaf */}
            <g transform="translate(30, 20) scale(0.65)" fill="#FF0000">
              <path d="M0 13l-1-7-3 2 1-4-4 2 2-5-5-1 3-3-4-2 6-2-2-4 6 2 1-7 2 7 6-2-2 4 6 2-4 2 3 3-5 1 2 5-4-2 1 4-3-2z" />
            </g>
          </svg>
        );

      // ── Netherlands ──
      case "NL":
      case "NETHERLANDS":
        return (
          <svg viewBox="0 0 60 40" className="h-full w-full object-cover">
            <rect width="60" height="13.33" fill="#AE1C28" />
            <rect y="13.33" width="60" height="13.33" fill="#FFFFFF" />
            <rect y="26.66" width="60" height="13.34" fill="#21468B" />
          </svg>
        );

      // ── France ──
      case "FR":
      case "FRANCE":
        return (
          <svg viewBox="0 0 60 40" className="h-full w-full object-cover">
            <rect width="20" height="40" fill="#002395" />
            <rect x="20" width="20" height="40" fill="#FFFFFF" />
            <rect x="40" width="20" height="40" fill="#ED2939" />
          </svg>
        );

      // ── Switzerland ──
      case "CH":
      case "SWITZERLAND":
        return (
          <svg viewBox="0 0 60 40" className="h-full w-full object-cover">
            <rect width="60" height="40" fill="#DA291C" />
            <rect x="26" y="10" width="8" height="20" fill="#FFFFFF" />
            <rect x="18" y="16" width="24" height="8" fill="#FFFFFF" />
          </svg>
        );

      // ── Australia ──
      case "AU":
      case "AUSTRALIA":
        return (
          <svg viewBox="0 0 60 40" className="h-full w-full object-cover">
            <rect width="60" height="40" fill="#00008B" />
            {/* Union Jack in Canton */}
            <g transform="scale(0.5)">
              <rect width="60" height="40" fill="#012169" />
              <path d="M0 0l60 40m0-40L0 40" stroke="#FFFFFF" strokeWidth="6.5" />
              <path d="M0 0l60 40m0-40L0 40" stroke="#C8102E" strokeWidth="3" />
              <path d="M30 0v40M0 20h60" stroke="#FFFFFF" strokeWidth="11" />
              <path d="M30 0v40M0 20h60" stroke="#C8102E" strokeWidth="6.5" />
            </g>
            {/* Commonwealth Star */}
            <polygon
              points="15,26 16.5,29 19.5,27.5 18,30.5 21,32 17.5,33 18,36 15,34 12,36 12.5,33 9,32 12,30.5 10.5,27.5 13.5,29"
              fill="#FFFFFF"
              transform="scale(0.85) translate(2, 2)"
            />
            {/* Southern Cross stars */}
            <circle cx="45" cy="8" r="1.4" fill="#FFFFFF" />
            <circle cx="52" cy="15" r="1.4" fill="#FFFFFF" />
            <circle cx="45" cy="32" r="1.4" fill="#FFFFFF" />
            <circle cx="38" cy="18" r="1.4" fill="#FFFFFF" />
            <circle cx="48" cy="22" r="1" fill="#FFFFFF" />
          </svg>
        );

      // ── Poland ──
      case "PL":
      case "POLAND":
        return (
          <svg viewBox="0 0 60 40" className="h-full w-full object-cover">
            <rect width="60" height="20" fill="#FFFFFF" />
            <rect y="20" width="60" height="20" fill="#DC143C" />
          </svg>
        );

      // ── Ireland ──
      case "IE":
      case "IRELAND":
        return (
          <svg viewBox="0 0 60 40" className="h-full w-full object-cover">
            <rect width="20" height="40" fill="#169B62" />
            <rect x="20" width="20" height="40" fill="#FFFFFF" />
            <rect x="40" width="20" height="40" fill="#FF883E" />
          </svg>
        );

      // ── Sweden ──
      case "SE":
      case "SWEDEN":
        return (
          <svg viewBox="0 0 60 40" className="h-full w-full object-cover">
            <rect width="60" height="40" fill="#006AA7" />
            <rect x="18" width="8" height="40" fill="#FECC00" />
            <rect y="16" width="60" height="8" fill="#FECC00" />
          </svg>
        );

      // ── Singapore ──
      case "SG":
      case "SINGAPORE":
        return (
          <svg viewBox="0 0 60 40" className="h-full w-full object-cover">
            <rect width="60" height="20" fill="#ED2939" />
            <rect y="20" width="60" height="20" fill="#FFFFFF" />
            <circle cx="12" cy="10" r="5" fill="#FFFFFF" />
            <circle cx="13.8" cy="10" r="4.3" fill="#ED2939" />
            <circle cx="15.5" cy="7.5" r="0.75" fill="#FFFFFF" />
            <circle cx="18" cy="8.8" r="0.75" fill="#FFFFFF" />
            <circle cx="17.5" cy="11.8" r="0.75" fill="#FFFFFF" />
            <circle cx="14.8" cy="12.5" r="0.75" fill="#FFFFFF" />
            <circle cx="14" cy="9.5" r="0.75" fill="#FFFFFF" />
          </svg>
        );

      // ── Spain ──
      case "ES":
      case "SPAIN":
        return (
          <svg viewBox="0 0 60 40" className="h-full w-full object-cover">
            <rect width="60" height="10" fill="#AA151B" />
            <rect y="10" width="60" height="20" fill="#F1BF00" />
            <rect y="30" width="60" height="10" fill="#AA151B" />
            {/* Simplified crest */}
            <rect x="12" y="16" width="6" height="8" rx="2" fill="#AA151B" stroke="#000" strokeWidth="0.5" />
            <circle cx="15" cy="14" r="1.5" fill="#AA151B" />
          </svg>
        );

      // ── Japan ──
      case "JP":
      case "JAPAN":
        return (
          <svg viewBox="0 0 60 40" className="h-full w-full object-cover">
            <rect width="60" height="40" fill="#FFFFFF" />
            <circle cx="30" cy="20" r="12" fill="#BC002D" />
          </svg>
        );

      // ── Brazil ──
      case "BR":
      case "BRAZIL":
        return (
          <svg viewBox="0 0 60 40" className="h-full w-full object-cover">
            <rect width="60" height="40" fill="#009739" />
            <polygon points="30,4 54,20 30,36 6,20" fill="#FEDD00" />
            <circle cx="30" cy="20" r="8" fill="#012169" />
            <path d="M22.5 21.5c4-3 11-3 15 0" stroke="#FFFFFF" strokeWidth="1.2" fill="none" />
          </svg>
        );

      // ── Mexico ──
      case "MX":
      case "MEXICO":
        return (
          <svg viewBox="0 0 60 40" className="h-full w-full object-cover">
            <rect width="20" height="40" fill="#006847" />
            <rect x="20" width="20" height="40" fill="#FFFFFF" />
            <rect x="40" width="20" height="40" fill="#CE1126" />
            {/* Eagle crest */}
            <circle cx="30" cy="20" r="4.5" fill="#785025" />
            <path d="M27 23c2 2 4 2 6 0" stroke="#006847" strokeWidth="1" fill="none" />
          </svg>
        );

      // ── Israel ──
      case "IL":
      case "ISRAEL":
        return (
          <svg viewBox="0 0 60 40" className="h-full w-full object-cover">
            <rect width="60" height="40" fill="#FFFFFF" />
            <rect y="5" width="60" height="5" fill="#0038B8" />
            <rect y="30" width="60" height="5" fill="#0038B8" />
            {/* Star of David */}
            <g stroke="#0038B8" strokeWidth="1.2" fill="none" transform="translate(30, 20)">
              <polygon points="0,-7 6,4 -6,4" />
              <polygon points="0,7 6,-4 -6,-4" />
            </g>
          </svg>
        );

      // ── United Arab Emirates ──
      case "AE":
      case "UAE":
      case "UNITED-ARAB-EMIRATES":
        return (
          <svg viewBox="0 0 60 40" className="h-full w-full object-cover">
            <rect width="60" height="13.33" fill="#00732F" />
            <rect y="13.33" width="60" height="13.33" fill="#FFFFFF" />
            <rect y="26.66" width="60" height="13.34" fill="#000000" />
            <rect width="15" height="40" fill="#FF0000" />
          </svg>
        );

      // ── New Zealand ──
      case "NZ":
      case "NEW-ZEALAND":
        return (
          <svg viewBox="0 0 60 40" className="h-full w-full object-cover">
            <rect width="60" height="40" fill="#00247D" />
            {/* Union Jack in Canton */}
            <g transform="scale(0.5)">
              <rect width="60" height="40" fill="#012169" />
              <path d="M0 0l60 40m0-40L0 40" stroke="#FFFFFF" strokeWidth="6.5" />
              <path d="M0 0l60 40m0-40L0 40" stroke="#C8102E" strokeWidth="3" />
              <path d="M30 0v40M0 20h60" stroke="#FFFFFF" strokeWidth="11" />
              <path d="M30 0v40M0 20h60" stroke="#C8102E" strokeWidth="6.5" />
            </g>
            {/* Red stars with white borders */}
            <g fill="#CC142B" stroke="#FFFFFF" strokeWidth="0.6">
              <polygon points="45,6 46,9 49,9 46.5,11 47.5,14 45,12 42.5,14 43.5,11 41,9 44,9" />
              <polygon points="52,14 53,16.5 56,16.5 53.5,18 54.5,21 52,19.5 49.5,21 50.5,18 48,16.5 51,16.5" />
              <polygon points="45,30 46,32.5 49,32.5 46.5,34 47.5,37 45,35.5 42.5,37 43.5,34 41,32.5 44,32.5" />
              <polygon points="38,17 39,19.2 41.5,19.2 39.5,20.5 40.2,23 38,21.8 35.8,23 36.5,20.5 34.5,19.2 37,19.2" />
            </g>
          </svg>
        );

      // ── Worldwide (Globe) ──
      case "WW":
      case "WORLDWIDE":
      default:
        return (
          <svg viewBox="0 0 60 40" className="h-full w-full object-cover">
            {/* Deep space blue background */}
            <rect width="60" height="40" fill="#08182B" />
            {/* Global sphere */}
            <circle cx="30" cy="20" r="14" fill="#0D2847" stroke="#1E4976" strokeWidth="0.8" />
            {/* Latitude and Longitude grid */}
            <ellipse cx="30" cy="20" rx="14" ry="6" fill="none" stroke="#2563EB" strokeWidth="0.6" strokeDasharray="1.5 1" opacity="0.7" />
            <ellipse cx="30" cy="20" rx="6" ry="14" fill="none" stroke="#2563EB" strokeWidth="0.6" strokeDasharray="1.5 1" opacity="0.7" />
            <line x1="16" y1="20" x2="44" y2="20" stroke="#06B6D4" strokeWidth="0.7" opacity="0.6" />
            <line x1="30" y1="6" x2="30" y2="34" stroke="#06B6D4" strokeWidth="0.7" opacity="0.6" />
            {/* Continents stylized vectors in emerald/cyan */}
            <path
              d="M23 15c1-2 3-1 4-3 1 1 3 0 4 2 2 0 3 2 1 4-1 2-4 3-6 2-2 1-3-1-3-3v-2z"
              fill="#10B981"
              opacity="0.85"
            />
            <path
              d="M33 22c2-1 4 0 5 2 0 2-3 4-4 4-2-1-3-3-1-6z"
              fill="#10B981"
              opacity="0.85"
            />
            <circle cx="30" cy="20" r="14" fill="none" stroke="#38BDF8" strokeWidth="1" opacity="0.9" />
          </svg>
        );
    }
  };

  return (
    <div
      className={`relative inline-flex shrink-0 items-center justify-center overflow-hidden border border-white/20 shadow-sm ring-1 ring-black/20 ${sizeClass} ${className}`}
      aria-hidden
    >
      {renderFlag()}
    </div>
  );
}
