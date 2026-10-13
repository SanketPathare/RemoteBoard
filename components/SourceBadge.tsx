import { SOURCE_META, type SourceName } from "@/lib/types";

const DOT: Record<SourceName, string> = {
  jobicy:    "source-dot-jobicy",
  himalayas: "source-dot-himalayas",
  arbeitnow: "source-dot-arbeitnow",
  remoteok:  "source-dot-remoteok",
  wwr:       "source-dot-wwr",
};

export function SourceBadge({ source }: { source: SourceName }) {
  return (
    <span
      title={`Original source: ${SOURCE_META[source].label}`}
      className="inline-flex shrink-0 items-center gap-1.5 text-xs text-[#a3a3a3]"
    >
      <span aria-hidden className={`h-1.5 w-1.5 rounded-full ${DOT[source]}`} />
      {SOURCE_META[source].label.toLowerCase()}
    </span>
  );
}
