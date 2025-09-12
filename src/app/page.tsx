import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { About } from "./components/About";
import { Skills } from "./components/Skills";
import { Experience } from "./components/Experience";
import { Projects } from "./components/Projects";
import { Contact } from "./components/Contact";
import { Footer } from "./components/Footer";
import { Certificates } from "./components/Certificates";
import { Toaster } from "./components/ui/sonner";

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-r from-rose-100 to-teal-100 animate-background-pan">
      <Header />
      
      <main>
        <Hero />
        <About />
        <Skills />
        <Experience />
        <Projects />
        {/* <Certificates /> */}
        <Contact />
      </main>
      
      <Footer />
      <Toaster />
    </div>
  );
}
