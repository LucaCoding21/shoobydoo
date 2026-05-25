"use client";

import { useState } from "react";

// Static-site contact form: on submit it composes a mailto: link and hands off
// to the visitor's email client. No backend required. The sender's name + email
// are folded into the body since a mailto: can't set the From address.
const TO = "hello@shoobydoo.com";

const fieldClass =
  "w-full bg-transparent border-b border-white/15 py-2.5 text-[#ededeb] " +
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

const BUDGETS = [
  "Under $1k",
  "$1k – $3k",
  "$3k – $5k",
  "$5k – $10k",
  "$10k+",
  "Let's discuss",
];

export default function ContactForm() {
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") || "").trim();
    const email = String(data.get("email") || "").trim();
    const subject = String(data.get("subject") || "").trim();
    const eventType = String(data.get("eventType") || "").trim();
    const date = String(data.get("date") || "").trim();
    const artist = String(data.get("artist") || "").trim();
    const budget = String(data.get("budget") || "").trim();
    const message = String(data.get("message") || "").trim();

    const body = [
      message,
      "",
      "Booking details",
      eventType && `Event type: ${eventType}`,
      date && `Date: ${date}`,
      artist && `Artist / act: ${artist}`,
      budget && `Budget: ${budget}`,
      "",
      name && `From: ${name}`,
      email && `Reply to: ${email}`,
    ]
      .filter(Boolean)
      .join("\n");

    const href =
      `mailto:${TO}` +
      `?subject=${encodeURIComponent(subject || `Enquiry from ${name || "the site"}`)}` +
      `&body=${encodeURIComponent(body)}`;

    window.location.href = href;
    setSent(true);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-7">
      <div className="flex flex-col gap-2">
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

      <div className="flex flex-col gap-2">
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

      <div className="flex flex-col gap-2">
        <label htmlFor="cf-subject" className="text-[0.65rem] opacity-50" style={labelStyle}>
          Subject
        </label>
        <input
          id="cf-subject"
          name="subject"
          type="text"
          placeholder="Booking · Press · Collab"
          className={fieldClass}
        />
      </div>

      {/* Booking details — two columns on wider viewports, stacked on mobile. */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-7">
        <div className="flex flex-col gap-2 relative">
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
            className="pointer-events-none absolute right-1 bottom-3 text-white/40"
          >
            ▾
          </span>
        </div>

        <div className="flex flex-col gap-2">
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

        <div className="flex flex-col gap-2">
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

        <div className="flex flex-col gap-2 relative">
          <label htmlFor="cf-budget" className="text-[0.65rem] opacity-50" style={labelStyle}>
            Budget
          </label>
          <select
            id="cf-budget"
            name="budget"
            defaultValue=""
            className={selectClass}
          >
            <option value="" disabled>
              Select…
            </option>
            {BUDGETS.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
          <span
            aria-hidden
            className="pointer-events-none absolute right-1 bottom-3 text-white/40"
          >
            ▾
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="cf-message" className="text-[0.65rem] opacity-50" style={labelStyle}>
          Message
        </label>
        <textarea
          id="cf-message"
          name="message"
          rows={5}
          required
          placeholder="Tell me about the night…"
          className={`${fieldClass} resize-none`}
        />
      </div>

      <div className="flex items-center gap-5 pt-2">
        <button
          type="submit"
          className="group inline-flex items-center gap-3 border border-white/20 px-7 py-3 text-sm uppercase tracking-[0.2em] hover:border-white/70 hover:bg-white/5 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
          style={{ fontFamily: "Arial, Helvetica, sans-serif" }}
        >
          Send
          <span className="transition-transform duration-300 group-hover:translate-x-1">
            →
          </span>
        </button>
        {sent && (
          <span
            className="text-[0.65rem] opacity-60"
            style={labelStyle}
            role="status"
          >
            Opening your mail app…
          </span>
        )}
      </div>
    </form>
  );
}
