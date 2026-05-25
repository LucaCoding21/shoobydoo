export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="w-full bg-[#0e0f12] text-[#ededeb] border-t border-white/10">
      <div className="w-full px-[4vw] py-10 flex flex-col items-center gap-6 sm:flex-row sm:justify-between sm:items-center">
        <span
          className="text-lg select-none sm:flex-1 sm:text-left"
          style={{
            fontFamily: "var(--font-fraunces), Georgia, serif",
            fontWeight: 400,
            fontVariationSettings: "'opsz' 144, 'SOFT' 100",
            textTransform: "uppercase",
            letterSpacing: "0.12em",
          }}
        >
          Shoobydoo
        </span>

        <span
          className="text-xs opacity-60 sm:flex-1 sm:text-center"
          style={{
            fontFamily: "Arial, Helvetica, sans-serif",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
          }}
        >
          © {year} Shoobydoo
        </span>

        <nav
          aria-label="Social links"
          className="flex items-center gap-6 text-xs sm:flex-1 sm:justify-end"
          style={{
            fontFamily: "Arial, Helvetica, sans-serif",
            textTransform: "uppercase",
            letterSpacing: "0.2em",
          }}
        >
          <a
            href="https://instagram.com/shoobydoo"
            target="_blank"
            rel="noopener noreferrer"
            className="opacity-70 hover:opacity-100 transition-opacity"
          >
            Instagram
          </a>
          <a
            href="https://tiktok.com/@shoobydoo"
            target="_blank"
            rel="noopener noreferrer"
            className="opacity-70 hover:opacity-100 transition-opacity"
          >
            TikTok
          </a>
          <a
            href="mailto:hello@shoobydoo.com"
            className="opacity-70 hover:opacity-100 transition-opacity"
          >
            Email
          </a>
        </nav>
      </div>
    </footer>
  );
}
