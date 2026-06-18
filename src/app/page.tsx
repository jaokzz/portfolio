import Navbar from "@/components/navbar";
import AetherFlowHero from "@/components/ui/aether-flow-hero";
import LazySections from "@/components/lazy-sections";

export default function Home() {
  return (
    <main className="relative">
      <Navbar />
      <AetherFlowHero />
      <LazySections />
    </main>
  );
}
