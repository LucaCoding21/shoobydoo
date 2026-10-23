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
    </main>
  );
}
