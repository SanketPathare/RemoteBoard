import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-4 py-24 text-center sm:px-6">
      <p className="text-xs font-medium text-[#a3a3a3]">404</p>
      <h1 className="headline mt-4 text-3xl font-extrabold text-white">Page not found</h1>
      <p className="mt-3 text-sm leading-6 text-[#a3a3a3]">
        The page (or expired job listing) you&apos;re looking for doesn&apos;t exist.
      </p>
      <Link
        href="/jobs"
        className="mt-8 inline-flex min-h-[48px] items-center rounded-md bg-white px-6 py-2.5 text-sm font-semibold text-black transition hover:bg-[#d4d4d4]"
      >
        Browse current jobs
      </Link>
    </div>
  );
}
