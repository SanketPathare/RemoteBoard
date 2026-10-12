"use client";

import { useRouter } from "next/navigation";
import { SearchBar } from "./SearchBar";

/** Hero search → navigates to /jobs?q= (server page reads the param). */
export function HomeSearch() {
  const router = useRouter();
  return (
    <SearchBar
      id="hero-search"
      size="hero"
      tone="dark"
      onSearch={(q) =>
        router.push(q ? `/jobs?q=${encodeURIComponent(q)}` : "/jobs")
      }
    />
  );
}
