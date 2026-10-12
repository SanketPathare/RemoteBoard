import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-4 py-24 text-center sm:px-6">
      <p className="font-mono text-xs text-[#0070f3]">404</p>
      <h1 className="headline mt-4 text-3xl font-extrabold text-white">Page not found</h1>
      <p className="mt-3 text-sm leading-6 text-[#555]">
        The page (or expired job filing) you&apos;re looking for doesn&apos;t exist.
      </p>
      <Link
        href="/jobs"
        className="mt-8 inline-flex min-h-[48px] items-center rounded-xl bg-white px-6 py-2.5 text-sm font-medium text-black transition hover:bg-[#e8e8e8] focus-visible:outline-2 focus-visible:outline-[#0070f3]"
      >
        Browse current jobs
      </Link>
    </div>
  );
}
