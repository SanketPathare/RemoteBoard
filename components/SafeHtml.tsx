import { sanitizeHtml } from "@/lib/format";

export function SafeHtml({ html, className }: { html: string; className?: string }) {
  return (
    <div
      className={className}
      // Sanitized with an allowlist strip (no event handlers / scripts).
      dangerouslySetInnerHTML={{ __html: sanitizeHtml(html) }}
    />
  );
}
