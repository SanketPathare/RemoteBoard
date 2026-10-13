"use client";

import { useEffect, useRef, useState, useId } from "react";
import { Check, ChevronDown, X } from "lucide-react";

export interface SelectOption {
  value: string;
  label: string;
  badge?: string | number;
}

interface CustomSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  title?: string;
  prefixLabel?: string;
  placeholder?: string;
  align?: "left" | "right";
  className?: string;
  triggerClassName?: string;
  menuClassName?: string;
  id?: string;
  "aria-label"?: string;
}

export function CustomSelect({
  value,
  onChange,
  options,
  title,
  prefixLabel,
  placeholder = "Select option",
  align = "right",
  className = "",
  triggerClassName = "",
  menuClassName = "",
  id,
  "aria-label": ariaLabel,
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const generatedId = useId();
  const selectId = id || generatedId;

  const selectedOption = options.find((opt) => opt.value === value);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Keyboard navigation
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (!isOpen) {
      if (event.key === "ArrowDown" || event.key === "ArrowUp" || event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        setIsOpen(true);
        const idx = options.findIndex((opt) => opt.value === value);
        setHighlightedIndex(idx >= 0 ? idx : 0);
      }
      return;
    }

    switch (event.key) {
      case "Escape":
      case "Tab":
        event.preventDefault();
        setIsOpen(false);
        triggerRef.current?.focus();
        break;
      case "ArrowDown":
        event.preventDefault();
        setHighlightedIndex((prev) => (prev + 1) % options.length);
        break;
      case "ArrowUp":
        event.preventDefault();
        setHighlightedIndex((prev) => (prev - 1 + options.length) % options.length);
        break;
      case "Enter":
      case " ":
        event.preventDefault();
        if (highlightedIndex >= 0 && highlightedIndex < options.length) {
          onChange(options[highlightedIndex].value);
          setIsOpen(false);
          triggerRef.current?.focus();
        }
        break;
    }
  };

  return (
    <div
      ref={containerRef}
      className={`relative inline-block ${className}`}
      onKeyDown={handleKeyDown}
    >
      {/* ── Trigger Button ── */}
      <button
        ref={triggerRef}
        id={selectId}
        type="button"
        onClick={() => {
          setIsOpen((prev) => !prev);
          const idx = options.findIndex((opt) => opt.value === value);
          setHighlightedIndex(idx >= 0 ? idx : 0);
        }}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={ariaLabel || title || prefixLabel || "Select"}
        className={`inline-flex h-11 min-w-[170px] select-none items-center justify-between gap-2.5 rounded-xl border border-neutral-300 bg-white px-3.5 text-xs font-medium text-neutral-900 shadow-sm transition-all duration-150 hover:border-neutral-400 hover:bg-neutral-50 focus:border-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900 dark:border-[#333] dark:bg-[#111] dark:text-white dark:hover:border-[#555] dark:hover:bg-[#161616] dark:focus:border-white dark:focus:ring-white ${
          isOpen ? "border-neutral-900 bg-neutral-50 ring-1 ring-neutral-900 dark:border-white dark:bg-[#161616] dark:ring-white" : ""
        } ${triggerClassName}`}
      >
        <span className="flex items-center gap-1.5 truncate">
          {prefixLabel && (
            <span className="font-mono text-[11px] text-neutral-500 dark:text-[#888]">{prefixLabel}</span>
          )}
          <span className="truncate text-neutral-900 dark:text-white">
            {selectedOption ? selectedOption.label : placeholder}
          </span>
        </span>
        <ChevronDown
          className={`h-3.5 w-3.5 shrink-0 text-neutral-500 transition-transform duration-200 dark:text-[#888] ${
            isOpen ? "rotate-180 text-neutral-900 dark:text-white" : ""
          }`}
          aria-hidden
        />
      </button>

      {/* ── Custom Popover Menu (Matching Screenshot 2) ── */}
      {isOpen && (
        <div
          ref={menuRef}
          role="listbox"
          aria-labelledby={selectId}
          tabIndex={-1}
          className={`absolute ${
            align === "left" ? "left-0" : "right-0"
          } top-full z-50 mt-2 w-64 max-w-[calc(100vw-32px)] rounded-2xl border border-neutral-200 bg-white p-2.5 shadow-2xl shadow-neutral-900/10 ring-1 ring-black/5 animate-in fade-in-0 zoom-in-95 duration-100 dark:border-[#262626] dark:bg-[#0f0f0f] dark:shadow-black/90 dark:ring-white/5 ${menuClassName}`}
        >
          {/* Header with Uppercase Title and Close Button */}
          <div className="mb-1.5 flex items-center justify-between border-b border-neutral-100 px-2 pb-2 pt-0.5 dark:border-[#222]">
            <span className="font-mono text-[10px] font-semibold uppercase tracking-widest text-neutral-500 dark:text-[#737373]">
              {title || prefixLabel || "Select Option"}
            </span>
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                triggerRef.current?.focus();
              }}
              className="rounded p-1 text-neutral-400 transition hover:bg-neutral-100 hover:text-neutral-900 dark:text-[#737373] dark:hover:bg-[#202020] dark:hover:text-white"
              aria-label="Close options"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Options List with Custom Sleek Scrollbar */}
          <div className="custom-scrollbar max-h-60 space-y-1 overflow-y-auto pr-1">
            {options.map((opt, idx) => {
              const isSelected = opt.value === value;
              const isHighlighted = idx === highlightedIndex;

              return (
                <button
                  key={opt.value}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => {
                    onChange(opt.value);
                    setIsOpen(false);
                    triggerRef.current?.focus();
                  }}
                  onMouseEnter={() => setHighlightedIndex(idx)}
                  className={`group flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-medium text-left transition ${
                    isSelected
                      ? "bg-neutral-900 text-white shadow-sm dark:bg-[#242424] dark:text-white"
                      : isHighlighted
                      ? "bg-neutral-100 text-neutral-900 dark:bg-[#1c1c1c] dark:text-white"
                      : "text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900 dark:text-[#cfcfcf] dark:hover:bg-[#1a1a1a] dark:hover:text-white"
                  }`}
                >
                  <span className="truncate">{opt.label}</span>
                  <div className="ml-2 flex items-center gap-1.5 shrink-0">
                    {opt.badge !== undefined && (
                      <span className="rounded bg-neutral-100 px-1.5 py-0.5 font-mono text-[10px] text-neutral-600 dark:bg-[#1a1a1a] dark:text-[#888] dark:group-hover:text-[#aaa]">
                        {opt.badge}
                      </span>
                    )}
                    {isSelected && (
                      <Check className="h-3.5 w-3.5 text-white" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
