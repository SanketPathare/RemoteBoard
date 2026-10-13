"use client";

const fieldCls =
  "w-full rounded-md border border-neutral-300 bg-neutral-50 px-3 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900/10 dark:border-[#404040] dark:bg-[#080808] dark:text-white dark:placeholder:text-[#737373] dark:focus:border-[#a3a3a3] dark:focus:ring-white/10";

const labelCls = "mb-1.5 block text-sm font-medium text-neutral-800 dark:text-white";

export function ContactForm() {
  return (
    <form
      aria-label="Contact form (opens your email app)"
      className="glass-card card-sheen mt-6 rounded-xl border border-neutral-200 bg-white p-5 sm:p-6 shadow-sm dark:border-[#262626] dark:bg-transparent"
      onSubmit={(e) => {
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        const subject = encodeURIComponent(`RemoteBoard: ${data.get("subject") || "feedback"}`);
        const body = encodeURIComponent(
          `Name: ${data.get("name") || ""}\nEmail: ${data.get("email") || ""}\n\n${data.get("message") || ""}`,
        );
        window.location.href = `mailto:hello@example.com?subject=${subject}&body=${body}`;
      }}
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label htmlFor="c-name" className={labelCls}>
            Name
          </label>
          <input
            id="c-name"
            name="name"
            required
            autoComplete="name"
            className={fieldCls}
          />
        </div>
        <div>
          <label htmlFor="c-email" className={labelCls}>
            Email
          </label>
          <input
            id="c-email"
            name="email"
            type="email"
            required
            autoComplete="email"
            className={fieldCls}
          />
        </div>
      </div>
      <div className="mt-3">
        <label htmlFor="c-subject" className={labelCls}>
          Subject
        </label>
        <input
          id="c-subject"
          name="subject"
          required
          placeholder="Broken Apply link, wrong salary, …"
          className={fieldCls}
        />
      </div>
      <div className="mt-3">
        <label htmlFor="c-message" className={labelCls}>
          Message
        </label>
        <textarea
          id="c-message"
          name="message"
          required
          rows={5}
          placeholder="Which job (paste the URL), and what’s wrong?"
          className={fieldCls}
        />
      </div>
      <button
        type="submit"
        className="mt-4 min-h-[48px] rounded-md bg-neutral-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-[#d4d4d4]"
      >
        Open in email app
      </button>
      <p className="mt-2 text-[11px] leading-5 text-neutral-500 dark:text-[#737373]">
        nothing stored · opens your mail client · replace hello@example.com before deploying
      </p>
    </form>
  );
}
