import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { PageTransition } from "@/components/motion/PageTransition";
import { Mascot } from "@/components/quirk/Mascot";
import { CursorThread } from "@/components/quirk/CursorThread";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <CursorThread />
      <Nav />
      <PageTransition>{children}</PageTransition>
      <Footer />
      <Mascot />
    </>
  );
}
