import HeroSequence from "@/components/HeroSequence";
import Preloader from "@/components/Preloader";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0e0f12]">
      <Preloader />
      <HeroSequence />
    </main>
  );
}
