import { useCallback, useState } from "react";
import Contacts from "./components/Contacts";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Hero from "./components/Hero";
import LeadModal from "./components/LeadModal";
import MobileBottomBar from "./components/MobileBottomBar";
import Production from "./components/Production";
import ProjectLightbox from "./components/ProjectLightbox";
import Team from "./components/Team";
import { ToastProvider } from "./components/Toast";
import Quiz from "./components/quiz/Quiz";

export default function App() {
  const [leadOpen, setLeadOpen] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const scrollTo = useCallback((id: "quiz" | "footer") => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  return (
    <ToastProvider>
      <div className="relative min-h-full bg-ink">
        <Header onOpenLead={() => setLeadOpen(true)} onScrollTo={scrollTo} onOpenProjects={() => setLightboxOpen(true)} />
        <main>
          <Hero onCalc={() => scrollTo("quiz")} onProjects={() => setLeadOpen(true)} />
          <Quiz />
          <Production onOpenLead={() => setLeadOpen(true)} />
          <Team />
          <Contacts onOpenLead={() => setLeadOpen(true)} />
        </main>
        <Footer onOpenLead={() => setLeadOpen(true)} />
        <MobileBottomBar onCalc={() => scrollTo("quiz")} />
        <LeadModal open={leadOpen} onClose={() => setLeadOpen(false)} />
        <ProjectLightbox open={lightboxOpen} onClose={() => setLightboxOpen(false)} />
      </div>
    </ToastProvider>
  );
}
