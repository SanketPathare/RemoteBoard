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
      <p className="font-mono text-xs text-[#999999]">$ contact</p>
      <h1 className="headline mt-2 text-3xl font-extrabold text-black sm:text-4xl dark:text-white">Get in touch</h1>
      <p className="mt-3 leading-7 text-[#666666] dark:text-[#888888]">
        Questions about a listing? Note that RemoteBoard doesn’t employ the
        posters and can’t accept applications — please apply on the original
        provider page linked from each job card. For site issues, source
        corrections, or takedown requests, email us:
      </p>
      <a
        href="mailto:hello@example.com?subject=RemoteBoard%20feedback"
        className="mt-6 inline-flex min-h-[48px] items-center gap-2 rounded-md bg-black px-5 py-3 text-sm font-medium text-white transition hover:bg-[#333333] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0070F3] dark:bg-white dark:text-black dark:hover:bg-[#EAEAEA]"
      >
        <Mail className="h-4 w-4" aria-hidden /> hello@example.com
      </a>
      <ContactForm />
    </div>
  );
}
