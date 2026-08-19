"use client";

import { useState } from "react";

const fieldClass =
  "w-full bg-transparent border-b border-white/15 py-2 text-[#ededeb] " +
  "placeholder:text-white/25 focus:outline-none focus:border-white/60 " +
  "transition-colors";

// Native <select> needs appearance reset + a custom chevron so it reads like
// the underlined text inputs on the dark backdrop.
const selectClass =
  `${fieldClass} appearance-none pr-7 cursor-pointer ` +
  "[&>option]:bg-[#0e0f12] [&>option]:text-[#ededeb]";

const labelStyle: React.CSSProperties = {
  fontFamily: "Arial, Helvetica, sans-serif",
  textTransform: "uppercase",
  letterSpacing: "0.2em",
};

const EVENT_TYPES = [
  "Club night",
  "Festival",
  "Private party",
  "Corporate event",
  "Wedding",
  "Tour",
  "Other",
];

type Status = "idle" | "sending" | "sent" | "error";

export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(data)),
      });
      if (!res.ok) throw new Error(`Request failed: ${res.status}`);
      setStatus("sent");
      form.reset();
    } catch {
      setStatus("error");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      {/* All short fields share one two-column grid (stacked on mobile) so the
          form stays compact instead of one tall stack. */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-7 gap-y-5">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="cf-name" className="text-[0.65rem] opacity-50" style={labelStyle}>
            Name
          </label>
          <input
            id="cf-name"
            name="name"
            type="text"
            autoComplete="name"
            required
            placeholder="Your name"
            className={fieldClass}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="cf-email" className="text-[0.65rem] opacity-50" style={labelStyle}>
            Email
          </label>
          <input
            id="cf-email"
            name="email"
            type="email"
            autoComplete="email"
            required
            placeholder="you@email.com"
            className={fieldClass}
          />
        </div>

        <div className="flex flex-col gap-1.5 relative">
          <label htmlFor="cf-event-type" className="text-[0.65rem] opacity-50" style={labelStyle}>
            Event type
          </label>
          <select
            id="cf-event-type"
            name="eventType"
            defaultValue=""
            className={selectClass}
          >
            <option value="" disabled>
              Select…
            </option>
            {EVENT_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          <span
            aria-hidden
            className="pointer-events-none absolute right-1 bottom-2.5 text-white/40"
          >
            ▾
          </span>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="cf-date" className="text-[0.65rem] opacity-50" style={labelStyle}>
            Date
          </label>
          <input
            id="cf-date"
            name="date"
            type="date"
            className={`${selectClass} [&::-webkit-calendar-picker-indicator]:invert`}
          />
        </div>

        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <label htmlFor="cf-artist" className="text-[0.65rem] opacity-50" style={labelStyle}>
            Artist / act
          </label>
          <input
            id="cf-artist"
            name="artist"
            type="text"
            placeholder="Who's playing?"
            className={fieldClass}
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="cf-message" className="text-[0.65rem] opacity-50" style={labelStyle}>
          Message
        </label>
        <textarea
          id="cf-message"
          name="message"
          rows={4}
          required
          placeholder="Tell me about the night…"
          className={`${fieldClass} resize-none`}
        />
      </div>

      <div className="flex items-center gap-5 pt-2">
        <button
          type="submit"
          disabled={status === "sending"}
          className="group inline-flex items-center gap-3 border border-white/20 px-7 py-3 text-sm uppercase tracking-[0.2em] hover:border-white/70 hover:bg-white/5 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70 disabled:opacity-40 disabled:cursor-default"
          style={{ fontFamily: "Arial, Helvetica, sans-serif" }}
        >
          {status === "sending" ? "Sending…" : "Send"}
          <span className="transition-transform duration-300 group-hover:translate-x-1">
            →
          </span>
        </button>
        {status === "sent" && (
          <span
            className="text-[0.65rem] opacity-60"
            style={labelStyle}
            role="status"
          >
            Sent — talk soon.
          </span>
        )}
        {status === "error" && (
          <span
            className="text-[0.65rem] text-red-400/80"
            style={labelStyle}
            role="status"
          >
            Something went wrong — try again.
          </span>
        )}
      </div>
    </form>
  );
}
