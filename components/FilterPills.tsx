"use client";

import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown, ChevronLeft, ChevronRight, RotateCcw, X } from "lucide-react";
import type { JobFilters } from "@/lib/filters";

interface FilterPillsProps {
  filters: JobFilters;
  onChange: (f: JobFilters) => void;
  onClear: () => void;
  className?: string;
}

type DropdownId =
  | "pay"
  | "distance"
  | "jobtype"
  | "language"
  | "education"
  | "industry"
  | "date"
  | "board"
  | null;

export function FilterPills({
  filters,
  onChange,
  onClear,
  className = "",
}: FilterPillsProps) {
  const [openDropdown, setOpenDropdown] = useState<DropdownId>(null);
  const [dropdownLeft, setDropdownLeft] = useState<number>(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // Drag-to-scroll state
  const [isDragging, setIsDragging] = useState(false);
  const dragStartX = useRef(0);
  const dragScrollLeft = useRef(0);
  const hasDragged = useRef(false);

  // Monitor scrollability
  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    const hasOverflow = el.scrollWidth > el.clientWidth;
    setCanScrollLeft(el.scrollLeft > 6);
    setCanScrollRight(hasOverflow && el.scrollLeft < el.scrollWidth - el.clientWidth - 6);
  };

  useEffect(() => {
    checkScroll();
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", checkScroll, { passive: true });
    window.addEventListener("resize", checkScroll);
    return () => {
      el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, []);

  // Translate vertical mouse wheel into horizontal scroll for the pills
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const handleWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX) && el.scrollWidth > el.clientWidth) {
        e.preventDefault();
        el.scrollLeft += e.deltaY;
      }
    };
    el.addEventListener("wheel", handleWheel, { passive: false });
    return () => el.removeEventListener("wheel", handleWheel);
  }, []);

  const scrollBy = (offset: number) => {
    scrollRef.current?.scrollBy({ left: offset, behavior: "smooth" });
  };

  // Drag to scroll handlers
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.button !== 0) return; // Only main button
    const el = scrollRef.current;
    if (!el) return;
    dragStartX.current = e.pageX;
    dragScrollLeft.current = el.scrollLeft;
    hasDragged.current = false;
    setIsDragging(true);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    const el = scrollRef.current;
    if (!el) return;
    const delta = e.pageX - dragStartX.current;
    if (Math.abs(delta) > 5) {
      hasDragged.current = true;
    }
    el.scrollLeft = dragScrollLeft.current - delta;
  };

  const handleMouseUpOrLeave = () => {
    if (isDragging) {
      setIsDragging(false);
      setTimeout(() => {
        hasDragged.current = false;
      }, 50);
    }
  };

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpenDropdown(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close on Escape
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpenDropdown(null);
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handlePillClick = (
    id: DropdownId,
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    if (hasDragged.current) return;
    if (openDropdown === id) {
      setOpenDropdown(null);
      return;
    }
    const rect = e.currentTarget.getBoundingClientRect();
    const containerRect = containerRef.current?.getBoundingClientRect();
    if (containerRect) {
      const relLeft = rect.left - containerRect.left;
      const maxLeft = Math.max(8, containerRect.width - 270);
      setDropdownLeft(Math.max(8, Math.min(relLeft, maxLeft)));
    }
    setOpenDropdown(id);
  };

  // ── Options Data ────────────────────────────────────────────────────────────
  const PAY_OPTIONS = [
    { label: "Any pay", min: 0, salaryOnly: false },
    { label: "Pay listed only", min: 0, salaryOnly: true },
    { label: "$50,000+ / yr", min: 50000, salaryOnly: false },
    { label: "$80,000+ / yr", min: 80000, salaryOnly: false },
    { label: "$100,000+ / yr", min: 100000, salaryOnly: false },
    { label: "$150,000+ / yr", min: 150000, salaryOnly: false },
    { label: "$200,000+ / yr", min: 200000, salaryOnly: false },
  ];

  const LOCATION_OPTIONS = [
    { label: "Any location", value: "" },
    { label: "Worldwide / Global", value: "worldwide" },
    { label: "United States", value: "united states" },
    { label: "Europe", value: "europe" },
    { label: "Germany", value: "germany" },
    { label: "United Kingdom", value: "united kingdom" },
    { label: "Canada", value: "canada" },
    { label: "Latin America (LATAM)", value: "latam" },
    { label: "Asia-Pacific", value: "asia" },
  ];

  const JOB_TYPE_OPTIONS = [
    { label: "Any job type", value: "" },
    { label: "Full-time", value: "full-time" },
    { label: "Part-time", value: "part-time" },
    { label: "Contract", value: "contract" },
    { label: "Internship", value: "internship" },
  ];

  const LANGUAGE_OPTIONS = [
    { label: "Any language", value: "" },
    { label: "React", value: "react" },
    { label: "Python", value: "python" },
    { label: "TypeScript", value: "typescript" },
    { label: "JavaScript", value: "javascript" },
    { label: "Node.js", value: "node" },
    { label: "Go (Golang)", value: "golang" },
    { label: "Java", value: "java" },
    { label: "Rust", value: "rust" },
    { label: "Ruby", value: "ruby" },
    { label: "PHP", value: "php" },
    { label: "AWS", value: "aws" },
  ];

  const EDUCATION_OPTIONS = [
    { label: "Any level", value: "" },
    { label: "Entry-level / Junior", value: "junior" },
    { label: "Mid-level", value: "mid" },
    { label: "Senior", value: "senior" },
    { label: "Lead / Principal / Executive", value: "lead" },
  ];

  const INDUSTRY_OPTIONS = [
    { label: "Any industry", value: "" },
    { label: "Engineering", value: "engineering" },
    { label: "Design & UX", value: "design" },
    { label: "Marketing", value: "marketing" },
    { label: "Customer Support", value: "support" },
    { label: "Product & Management", value: "product" },
    { label: "Sales & BD", value: "sales" },
    { label: "DevOps & Cloud", value: "devops" },
    { label: "Data & AI", value: "data" },
  ];

  const DATE_OPTIONS = [
    { label: "Any time", value: "all" },
    { label: "Past 24 hours", value: "24h" },
    { label: "Past 3 days", value: "3d" },
    { label: "Past 7 days", value: "7d" },
    { label: "Past 30 days", value: "30d" },
  ];

  const BOARD_OPTIONS = [
    { label: "All boards", value: "all" },
    { label: "Remote Landers (ATS)", value: "remotelanders" },
    { label: "Remote OK", value: "remoteok" },
    { label: "Startup Jobs", value: "startupjobs" },
    { label: "Remote First", value: "remotefirst" },
    { label: "Jobicy", value: "jobicy" },
    { label: "Himalayas", value: "himalayas" },
    { label: "Arbeitnow", value: "arbeitnow" },
    { label: "We Work Remotely", value: "wwr" },
    { label: "Remotive", value: "remotive" },
  ];

  // ── Active states ──────────────────────────────────────────────────────────
  const isPayActive = filters.salaryOnly || filters.minSalary > 0;
  const isRemoteActive = filters.remoteOnly;
  const isDistanceActive = Boolean(filters.location.trim());
  const isJobTypeActive = Boolean(filters.employmentType.trim());
  const isLanguageActive = Boolean(filters.programmingLanguage.trim());
  const isEducationActive = Boolean(filters.experienceLevel.trim());
  const isIndustryActive = Boolean(filters.category.trim());
  const isDateActive = Boolean(filters.datePosted && filters.datePosted !== "all");
  const isBoardActive = Boolean(filters.source && filters.source !== "all");

  const totalActivePills =
    (isPayActive ? 1 : 0) +
    (isRemoteActive ? 1 : 0) +
    (isDistanceActive ? 1 : 0) +
    (isJobTypeActive ? 1 : 0) +
    (isLanguageActive ? 1 : 0) +
    (isEducationActive ? 1 : 0) +
    (isIndustryActive ? 1 : 0) +
    (isDateActive ? 1 : 0) +
    (isBoardActive ? 1 : 0);

  // Styles matching the screenshot
  const pillBase =
    "inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-[13px] font-medium transition-all select-none whitespace-nowrap cursor-pointer shrink-0";

  const inactivePillCls =
    "border border-[#2a2a2a] bg-[#0c0c0c] text-[#e0e0e0] hover:border-[#484848] hover:bg-[#161616]";

  const activePillCls =
    "border-2 border-white bg-[#1e1e1e] text-white font-semibold shadow-md ring-1 ring-white/20";

  const badgeCls =
    "ml-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-white text-[10px] font-black text-black";

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Left scroll control (desktop) */}
      {canScrollLeft && (
        <div className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 z-20 items-center">
          <div className="pointer-events-none absolute -left-1 h-12 w-14 bg-gradient-to-r from-black via-black/90 to-transparent" />
          <button
            type="button"
            onClick={() => scrollBy(-220)}
            aria-label="Scroll filters left"
            className="relative z-30 flex h-7 w-7 items-center justify-center rounded-full border border-[#333] bg-[#111] text-[#e0e0e0] shadow-md transition hover:border-white hover:bg-[#222] hover:text-white"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Main scrolling container with custom scrollbar, drag-to-scroll & wheel support */}
      <div
        ref={scrollRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUpOrLeave}
        onMouseLeave={handleMouseUpOrLeave}
        className={`custom-scrollbar-x flex w-full items-center gap-2 overflow-x-auto scroll-smooth pb-2 pt-1 px-0.5 select-none ${
          isDragging ? "cursor-grabbing" : "cursor-grab"
        }`}
      >
        {/* 1. Pay */}
        <button
          type="button"
          onClick={(e) => handlePillClick("pay", e)}
          className={`${pillBase} ${isPayActive ? activePillCls : inactivePillCls}`}
          aria-expanded={openDropdown === "pay"}
        >
          <span>Pay</span>
          {isPayActive && <span className={badgeCls}>1</span>}
          <ChevronDown className="h-3.5 w-3.5 opacity-60 ml-0.5" />
        </button>

        {/* 2. Remote (Instant toggle) */}
        <button
          type="button"
          onClick={() => {
            if (hasDragged.current) return;
            onChange({ ...filters, remoteOnly: !filters.remoteOnly });
          }}
          className={`${pillBase} ${isRemoteActive ? activePillCls : inactivePillCls}`}
        >
          <span>Remote</span>
          {isRemoteActive && <span className={badgeCls}>1</span>}
        </button>

        {/* 3. Distance / Location */}
        <button
          type="button"
          onClick={(e) => handlePillClick("distance", e)}
          className={`${pillBase} ${isDistanceActive ? activePillCls : inactivePillCls}`}
          aria-expanded={openDropdown === "distance"}
        >
          <span>Distance</span>
          {isDistanceActive && <span className={badgeCls}>1</span>}
          <ChevronDown className="h-3.5 w-3.5 opacity-60 ml-0.5" />
        </button>

       

        {/* Board / Source */}
        <button
          type="button"
          onClick={(e) => handlePillClick("board", e)}
          className={`${pillBase} ${isBoardActive ? activePillCls : inactivePillCls}`}
          aria-expanded={openDropdown === "board"}
        >
          <span>
            {filters.source === "remotelanders"
              ? "Remote Landers"
              : filters.source === "remoteok"
              ? "Remote OK"
              : filters.source === "startupjobs"
              ? "Startup Jobs"
              : filters.source === "remotefirst"
              ? "Remote First"
              : filters.source && filters.source !== "all"
              ? filters.source
              : "Job board"}
          </span>
          {isBoardActive && <span className={badgeCls}>1</span>}
          <ChevronDown className="h-3.5 w-3.5 opacity-60 ml-0.5" />
        </button>

        {/* 5. Job type */}
        <button
          type="button"
          onClick={(e) => handlePillClick("jobtype", e)}
          className={`${pillBase} ${isJobTypeActive ? activePillCls : inactivePillCls}`}
          aria-expanded={openDropdown === "jobtype"}
        >
          <span>Job type</span>
          {isJobTypeActive && <span className={badgeCls}>1</span>}
          <ChevronDown className="h-3.5 w-3.5 opacity-60 ml-0.5" />
        </button>

        {/* 6. Programming language */}
        <button
          type="button"
          onClick={(e) => handlePillClick("language", e)}
          className={`${pillBase} ${isLanguageActive ? activePillCls : inactivePillCls}`}
          aria-expanded={openDropdown === "language"}
        >
          <span>Programming language</span>
          {isLanguageActive && <span className={badgeCls}>1</span>}
          <ChevronDown className="h-3.5 w-3.5 opacity-60 ml-0.5" />
        </button>

        {/* 7. Education level */}
        <button
          type="button"
          onClick={(e) => handlePillClick("education", e)}
          className={`${pillBase} ${isEducationActive ? activePillCls : inactivePillCls}`}
          aria-expanded={openDropdown === "education"}
        >
          <span>Education level</span>
          {isEducationActive && <span className={badgeCls}>1</span>}
          <ChevronDown className="h-3.5 w-3.5 opacity-60 ml-0.5" />
        </button>

        {/* 8. Industry */}
        <button
          type="button"
          onClick={(e) => handlePillClick("industry", e)}
          className={`${pillBase} ${isIndustryActive ? activePillCls : inactivePillCls}`}
          aria-expanded={openDropdown === "industry"}
        >
          <span>Industry</span>
          {isIndustryActive && <span className={badgeCls}>1</span>}
          <ChevronDown className="h-3.5 w-3.5 opacity-60 ml-0.5" />
        </button>

        {/* 9. Date posted */}
        <button
          type="button"
          onClick={(e) => handlePillClick("date", e)}
          className={`${pillBase} ${isDateActive ? activePillCls : inactivePillCls}`}
          aria-expanded={openDropdown === "date"}
        >
          <span>Date posted</span>
          {isDateActive && <span className={badgeCls}>1</span>}
          <ChevronDown className="h-3.5 w-3.5 opacity-60 ml-0.5" />
        </button>

        {/* Reset button if any filter active */}
        {totalActivePills > 0 && (
          <button
            type="button"
            onClick={() => {
              if (hasDragged.current) return;
              onClear();
            }}
            className="inline-flex shrink-0 items-center gap-1 rounded-full border border-dashed border-[#555] bg-[#111] px-3.5 py-1.5 text-xs font-medium text-[#aaa] transition hover:border-white hover:text-white"
          >
            <RotateCcw className="h-3 w-3" />
            <span>Reset ({totalActivePills})</span>
          </button>
        )}
      </div>

      {/* Right scroll control (desktop) */}
      {canScrollRight && (
        <div className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 z-20 items-center">
          <div className="pointer-events-none absolute -right-1 h-12 w-14 bg-gradient-to-l from-black via-black/90 to-transparent" />
          <button
            type="button"
            onClick={() => scrollBy(220)}
            aria-label="Scroll filters right"
            className="relative z-30 flex h-7 w-7 items-center justify-center rounded-full border border-[#333] bg-[#111] text-[#e0e0e0] shadow-md transition hover:border-white hover:bg-[#222] hover:text-white"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* ── Floating Popover (Rendered OUTSIDE overflow-x-auto to prevent clipping) ── */}
      {openDropdown && (
        <div
          style={{ left: `${dropdownLeft}px` }}
          className="absolute top-full z-50 mt-2.5 w-64 max-w-[calc(100vw-32px)] rounded-2xl border border-[#2a2a2a] bg-[#0d0d0d] p-2 shadow-2xl backdrop-blur-xl ring-1 ring-white/10"
        >
          {/* Header */}
          <div className="mb-1 flex items-center justify-between border-b border-[#222] px-2.5 pb-2 pt-0.5">
            <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-[#888]">
              {openDropdown === "pay" && "Salary minimum"}
              {openDropdown === "distance" && "Location & region"}
              {openDropdown === "jobtype" && "Employment type"}
              {openDropdown === "language" && "Programming language"}
              {openDropdown === "education" && "Seniority & education"}
              {openDropdown === "industry" && "Industry & discipline"}
              {openDropdown === "date" && "Publication date"}
              {openDropdown === "board" && "Job board source"}
            </span>
            <button
              type="button"
              onClick={() => setOpenDropdown(null)}
              className="rounded p-0.5 text-[#666] transition hover:bg-[#222] hover:text-white"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Options */}
          <div className="custom-scrollbar max-h-72 overflow-y-auto space-y-0.5 pr-1">
            {openDropdown === "pay" &&
              PAY_OPTIONS.map((opt) => {
                const isSelected = opt.salaryOnly
                  ? filters.salaryOnly && filters.minSalary === 0
                  : filters.minSalary === opt.min && (!filters.salaryOnly || opt.min > 0);
                return (
                  <button
                    key={opt.label}
                    type="button"
                    onClick={() => {
                      onChange({
                        ...filters,
                        salaryOnly: opt.salaryOnly,
                        minSalary: opt.min,
                      });
                      setOpenDropdown(null);
                    }}
                    className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-medium transition ${
                      isSelected
                        ? "bg-white text-black font-semibold"
                        : "text-[#d4d4d4] hover:bg-[#1a1a1a] hover:text-white"
                    }`}
                  >
                    <span>{opt.label}</span>
                    {isSelected && <Check className="h-3.5 w-3.5" />}
                  </button>
                );
              })}

            {openDropdown === "distance" &&
              LOCATION_OPTIONS.map((opt) => {
                const isSelected =
                  filters.location.toLowerCase() === opt.value.toLowerCase();
                return (
                  <button
                    key={opt.label}
                    type="button"
                    onClick={() => {
                      onChange({ ...filters, location: opt.value });
                      setOpenDropdown(null);
                    }}
                    className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-medium transition ${
                      isSelected
                        ? "bg-white text-black font-semibold"
                        : "text-[#d4d4d4] hover:bg-[#1a1a1a] hover:text-white"
                    }`}
                  >
                    <span>{opt.label}</span>
                    {isSelected && <Check className="h-3.5 w-3.5" />}
                  </button>
                );
              })}

            {openDropdown === "jobtype" &&
              JOB_TYPE_OPTIONS.map((opt) => {
                const isSelected =
                  filters.employmentType.toLowerCase() === opt.value.toLowerCase();
                return (
                  <button
                    key={opt.label}
                    type="button"
                    onClick={() => {
                      onChange({ ...filters, employmentType: opt.value });
                      setOpenDropdown(null);
                    }}
                    className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-medium transition ${
                      isSelected
                        ? "bg-white text-black font-semibold"
                        : "text-[#d4d4d4] hover:bg-[#1a1a1a] hover:text-white"
                    }`}
                  >
                    <span>{opt.label}</span>
                    {isSelected && <Check className="h-3.5 w-3.5" />}
                  </button>
                );
              })}

            {openDropdown === "language" &&
              LANGUAGE_OPTIONS.map((opt) => {
                const isSelected =
                  filters.programmingLanguage.toLowerCase() ===
                  opt.value.toLowerCase();
                return (
                  <button
                    key={opt.label}
                    type="button"
                    onClick={() => {
                      onChange({ ...filters, programmingLanguage: opt.value });
                      setOpenDropdown(null);
                    }}
                    className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-medium transition ${
                      isSelected
                        ? "bg-white text-black font-semibold"
                        : "text-[#d4d4d4] hover:bg-[#1a1a1a] hover:text-white"
                    }`}
                  >
                    <span>{opt.label}</span>
                    {isSelected && <Check className="h-3.5 w-3.5" />}
                  </button>
                );
              })}

            {openDropdown === "education" &&
              EDUCATION_OPTIONS.map((opt) => {
                const isSelected =
                  filters.experienceLevel.toLowerCase() === opt.value.toLowerCase();
                return (
                  <button
                    key={opt.label}
                    type="button"
                    onClick={() => {
                      onChange({ ...filters, experienceLevel: opt.value });
                      setOpenDropdown(null);
                    }}
                    className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-medium transition ${
                      isSelected
                        ? "bg-white text-black font-semibold"
                        : "text-[#d4d4d4] hover:bg-[#1a1a1a] hover:text-white"
                    }`}
                  >
                    <span>{opt.label}</span>
                    {isSelected && <Check className="h-3.5 w-3.5" />}
                  </button>
                );
              })}

            {openDropdown === "industry" &&
              INDUSTRY_OPTIONS.map((opt) => {
                const isSelected =
                  filters.category.toLowerCase() === opt.value.toLowerCase();
                return (
                  <button
                    key={opt.label}
                    type="button"
                    onClick={() => {
                      onChange({ ...filters, category: opt.value });
                      setOpenDropdown(null);
                    }}
                    className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-medium transition ${
                      isSelected
                        ? "bg-white text-black font-semibold"
                        : "text-[#d4d4d4] hover:bg-[#1a1a1a] hover:text-white"
                    }`}
                  >
                    <span>{opt.label}</span>
                    {isSelected && <Check className="h-3.5 w-3.5" />}
                  </button>
                );
              })}

            {openDropdown === "date" &&
              DATE_OPTIONS.map((opt) => {
                const isSelected = (filters.datePosted || "all") === opt.value;
                return (
                  <button
                    key={opt.label}
                    type="button"
                    onClick={() => {
                      onChange({ ...filters, datePosted: opt.value });
                      setOpenDropdown(null);
                    }}
                    className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-medium transition ${
                      isSelected
                        ? "bg-white text-black font-semibold"
                        : "text-[#d4d4d4] hover:bg-[#1a1a1a] hover:text-white"
                    }`}
                  >
                    <span>{opt.label}</span>
                    {isSelected && <Check className="h-3.5 w-3.5" />}
                  </button>
                );
              })}

            {openDropdown === "board" &&
              BOARD_OPTIONS.map((opt) => {
                const isSelected = (filters.source || "all") === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => {
                      onChange({ ...filters, source: opt.value });
                      setOpenDropdown(null);
                    }}
                    className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-medium transition ${
                      isSelected
                        ? "bg-white text-black font-semibold"
                        : "text-[#d4d4d4] hover:bg-[#1a1a1a] hover:text-white"
                    }`}
                  >
                    <span>{opt.label}</span>
                    {isSelected && <Check className="h-3.5 w-3.5" />}
                  </button>
                );
              })}
          </div>
        </div>
      )}
    </div>
  );
}
