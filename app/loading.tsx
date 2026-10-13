"use client";

import { useEffect, useState } from "react";

const LABELS = [
  "Fetching remote jobs…",
  "Scanning live listings…",
  "Sorting by newest first…",
  "Almost there…",
];

const ICONS = [
  /* Code / Engineering */
  <svg key="code" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>,
  /* Design / Palette */
  <svg key="palette" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden><circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/><circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/><circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/><circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/></svg>,
  /* Marketing / Megaphone */
  <svg key="mega" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="m3 11 19-9-9 19-2-8-8-2z"/></svg>,
  /* Support / Headset */
  <svg key="support" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/></svg>,
  /* Globe / Remote */
  <svg key="globe" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>,
  /* Briefcase / Jobs */
  <svg key="brief" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/><line x1="12" y1="12" x2="12" y2="12"/><line x1="8" y1="12" x2="16" y2="12"/></svg>,
];

export default function Loading() {
  const [labelIdx, setLabelIdx] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const cycle = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setLabelIdx((i) => (i + 1) % LABELS.length);
        setVisible(true);
      }, 300);
    }, 1800);
    return () => clearInterval(cycle);
  }, []);

  return (
    <div
      role="status"
      aria-label="Loading page…"
      className="flex min-h-screen flex-col items-center justify-center gap-8 bg-black"
    >
      <style>{`
        @keyframes spin   { to { transform: rotate(360deg); } }
        @keyframes fadeUp { from { opacity:0; transform:translateY(6px); } to { opacity:1; transform:translateY(0); } }
        @keyframes iconBob {
          0%,100% { opacity:.18; transform:translateY(0)   scale(1);    }
          50%      { opacity:.7;  transform:translateY(-5px) scale(1.08); }
        }
        .ld-icon { animation: iconBob 1.6s ease-in-out infinite; }
        .ld-icon:nth-child(1) { animation-delay: 0s;    }
        .ld-icon:nth-child(2) { animation-delay: 0.2s;  }
        .ld-icon:nth-child(3) { animation-delay: 0.4s;  }
        .ld-icon:nth-child(4) { animation-delay: 0.6s;  }
        .ld-icon:nth-child(5) { animation-delay: 0.8s;  }
        .ld-icon:nth-child(6) { animation-delay: 1.0s;  }
        .ld-label { transition: opacity .3s ease, transform .3s ease; }
        .ld-label-in  { opacity:1; transform:translateY(0);   }
        .ld-label-out { opacity:0; transform:translateY(-6px); }
        @media(prefers-reduced-motion:reduce){
          .ld-icon,.ld-spinner { animation:none!important; opacity:.5!important; }
          .ld-label { transition:none!important; }
        }
      `}</style>

      {/* ── Outer ring + spinner ── */}
      <div style={{ position: "relative", width: 72, height: 72 }}>
        {/* Static track */}
        <div style={{
          position: "absolute", inset: 0, borderRadius: "50%",
          border: "1.5px solid #1f1f1f",
        }} aria-hidden />
        {/* Spinning arc */}
        <div className="ld-spinner" style={{
          position: "absolute", inset: 0, borderRadius: "50%",
          border: "1.5px solid transparent",
          borderTopColor: "#ffffff",
          borderRightColor: "rgba(255,255,255,0.25)",
          animation: "spin 0.9s cubic-bezier(0.6,0.2,0.4,0.8) infinite",
        }} aria-hidden />
        {/* Inner dot */}
        <div style={{
          position: "absolute", inset: 0,
          display: "flex", alignItems: "center", justifyContent: "center",
        }} aria-hidden>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#ffffff", opacity: 0.7 }} />
        </div>
      </div>

      {/* ── Icon wave row ── */}
      <div
        aria-hidden
        style={{ display: "flex", gap: 20, alignItems: "center", color: "#ffffff" }}
      >
        {ICONS.map((icon, i) => (
          <span key={i} className="ld-icon" style={{ display: "flex" }}>
            {icon}
          </span>
        ))}
      </div>

      {/* ── Animated label ── */}
      <div style={{ height: 20, display: "flex", alignItems: "center" }}>
        <p
          className={`ld-label ${visible ? "ld-label-in" : "ld-label-out"} font-mono text-xs text-[#737373]`}
        >
          {LABELS[labelIdx]}
        </p>
      </div>

      <span className="sr-only">Loading page, please wait.</span>
    </div>
  );
}
