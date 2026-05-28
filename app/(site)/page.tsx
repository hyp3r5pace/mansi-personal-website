import { Hero } from "@/components/home/Hero";
import { FeaturedProjects } from "@/components/home/FeaturedProjects";
import { AboutTeaser } from "@/components/home/AboutTeaser";
import { JournalTeaser } from "@/components/home/JournalTeaser";
import { ContactStrip } from "@/components/home/ContactStrip";
import { Reveal } from "@/components/motion/Reveal";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col">
      <Hero />
      <Reveal>
        <FeaturedProjects />
      </Reveal>
      <Reveal>
        <AboutTeaser />
      </Reveal>
      <Reveal>
        <JournalTeaser />
      </Reveal>
      <Reveal offset={8}>
        <ContactStrip />
      </Reveal>
    </main>
  );
}
