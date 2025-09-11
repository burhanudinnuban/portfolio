"use client";
import openInNewTab from "../utils/openInNewTab";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { Github, Linkedin, Mail, Heart } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const quickLinks = [
    { href: "#about", label: "About" },
    { href: "#skills", label: "Skills" },
    { href: "#experience", label: "Experience" },
    { href: "#projects", label: "Projects" },
    { href: "#contact", label: "Contact" },
  ];

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer className="bg-card border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Brand & Description */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <span className="text-primary-foreground font-medium">BN</span>
              </div>
              <span className="text-lg font-medium">Burhanudin Nuban</span>
            </div>
            <p className="text-muted-foreground">
              Full Stack Developer passionate about creating exceptional digital experiences 
              with clean code, thoughtful design, secure web & mobile application, and automation CI/CD.
            </p>
            <div className="flex space-x-2">
              <Button variant="ghost" size="icon" onClick={() =>
                openInNewTab(
                  "https://drive.google.com/file/d/1NoC0exQqmJ2Troq9mur6CP6T328FYBDZ/view?usp=sharing"
                )
              }>
                <Github className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() =>
                openInNewTab(
                  `https://www.linkedin.com/in/burhanudin-nuban-264b2a97/`
                )
              }>
                <Linkedin className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() =>
                openInNewTab(
                  `mailto:burhanudinnuban@gmail.com?subject=NewJobs!&body=Halo Burhan, are you open oppurtunity now?.`
                )
              }>
                <Mail className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-semibold">Quick Links</h3>
            <nav className="flex flex-col space-y-2">
              {quickLinks.map((link) => (
                <button
                  key={link.href}
                  onClick={() => scrollToSection(link.href)}
                  className="text-muted-foreground hover:text-foreground transition-colors text-left"
                >
                  {link.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="font-semibold">Get in Touch</h3>
            <div className="space-y-2 text-muted-foreground">
              <p>burhanudinnuban@gmail.com</p>
              <p>(+62) 8211-8992-254</p>
              <p>Jakarta, Indonesia</p>
            </div>
            <Button onClick={scrollToTop} variant="outline">
              Back to Top
            </Button>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <span>© {currentYear} Burhanudin Nuban. Built with</span>
            <Heart className="h-4 w-4 text-red-500" />
            <span>using React & Tailwind CSS</span>
          </div>
          <div className="text-sm text-muted-foreground">
            Available for freelance work
          </div>
        </div>
      </div>
    </footer>
  );
}