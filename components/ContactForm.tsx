"use client";

const fieldCls =
  "w-full rounded-md border border-[#404040] bg-[#080808] px-3 py-2.5 text-sm text-white placeholder:text-[#737373] focus:border-[#a3a3a3] focus:outline-none focus:ring-4 focus:ring-white/10";

const labelCls = "mb-1.5 block text-sm font-medium text-white";

export function ContactForm() {
  return (
    <form
      aria-label="Contact form (opens your email app)"
      className="glass-card card-sheen mt-6 rounded-xl border border-[#262626] p-5 sm:p-6"
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
        className="mt-4 min-h-[48px] rounded-md bg-white px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-[#d4d4d4]"
      >
        Open in email app
      </button>
      <p className="mt-2 text-[11px] leading-5 text-[#737373]">
        nothing stored · opens your mail client · replace hello@example.com before deploying
      </p>
    </form>
  );
}
