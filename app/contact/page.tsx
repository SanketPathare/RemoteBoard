import type { Metadata } from "next";
import { Mail } from "lucide-react";
import { ContactForm } from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact the RemoteBoard maintainers. No accounts — just email.",
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      <p className="font-mono text-xs text-neutral-500 dark:text-[#999999]">$ contact</p>
      <h1 className="headline mt-2 text-3xl font-extrabold text-neutral-900 sm:text-4xl dark:text-white">Get in touch</h1>
      <p className="mt-3 leading-7 text-neutral-600 dark:text-[#888888]">
        Questions about a listing? RemoteBoard can’t accept applications —
        use the Apply button on the job card to continue. For site issues,
        listing corrections, or takedown requests, email us:
      </p>
      <a
        href="mailto:hello@example.com?subject=RemoteBoard%20feedback"
        className="mt-6 inline-flex min-h-[48px] items-center gap-2 rounded-md bg-neutral-900 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-[#d4d4d4]"
      >
        <Mail className="h-4 w-4" aria-hidden /> hello@example.com
      </a>
      <ContactForm />
    </div>
  );
}
