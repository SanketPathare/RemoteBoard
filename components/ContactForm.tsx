"use client";

const fieldCls =
  "w-full rounded-md border border-[#EAEAEA] bg-white px-3 py-2.5 text-sm text-black placeholder:text-[#999999] focus:border-[#0070F3] focus:outline-none focus:ring-4 focus:ring-[#0070F3]/15 dark:border-[#333333] dark:bg-black dark:text-white";

const labelCls = "mb-1.5 block text-sm font-medium text-black dark:text-white";

export function ContactForm() {
  return (
    <form
      aria-label="Contact form (opens your email app)"
      className="glass-card card-sheen mt-6 rounded-lg border border-[#EAEAEA] p-5 sm:p-6 dark:border-[#333333]"
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
        className="mt-4 min-h-[48px] rounded-md bg-black px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#333333] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0070F3] dark:bg-white dark:text-black dark:hover:bg-[#EAEAEA]"
      >
        Open in email app
      </button>
      <p className="mt-2 font-mono text-[11px] leading-5 text-[#999999]">
        nothing stored · opens your mail client · replace hello@example.com before deploying
      </p>
    </form>
  );
}
