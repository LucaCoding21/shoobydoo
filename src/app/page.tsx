import Link from "next/link";
import HeroSequence from "@/components/HeroSequence";
import Preloader from "@/components/Preloader";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0e0f12]">
      {/* The visual identity is the animated hero, so the page's h1 is
          screen-reader / crawler text rather than displayed type. */}
      <h1 className="sr-only">
        Shoobydoo, concert and live music photographer in Vancouver, BC
      </h1>
      <Preloader />
      <HeroSequence />

      {/* Crawlable intro — the only plain text on an otherwise image-led page.
          Sits between the photo grid and the footer, styled like the About
          page's small sans body copy. */}
      <section className="px-[6vw] pb-[14vh] pt-[6vh]">
        <p
          className="mx-auto max-w-[62ch] text-center text-[0.85rem] leading-relaxed opacity-60"
          style={{ fontFamily: "Arial, Helvetica, sans-serif" }}
        >
          Shoobydoo is a concert and live music photographer based in
          Vancouver, BC, shooting festival main stages, club shows, and the
          small rooms in between. Every gallery above was photographed live,
          from the pit and the crowd. Have a show coming up?{" "}
          <Link
            href="/contact"
            className="underline decoration-white/30 underline-offset-4 transition-colors hover:decoration-white/80"
          >
            Get in touch
          </Link>
          .
        </p>
      </section>
    </main>
  );
}
