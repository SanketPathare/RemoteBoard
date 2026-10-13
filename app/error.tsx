"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto max-w-xl px-4 py-20 text-center sm:px-6">
      <p className="font-mono text-xs text-neutral-500 dark:text-[#999999]">error</p>
      <h1 className="headline mt-2 text-3xl font-extrabold text-neutral-900 dark:text-white">Something went wrong</h1>
      <p className="mt-2 text-sm leading-6 text-neutral-600 dark:text-[#888888]">
        {error.message || "An unexpected error occurred. Providers may be temporarily unreachable."}
      </p>
      <button
        type="button"
        onClick={reset}
        className="mt-6 min-h-[48px] rounded-md bg-neutral-900 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-[#EAEAEA]"
      >
        Try again
      </button>
    </div>
  );
}
