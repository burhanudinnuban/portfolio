
'use client';
import { useEffect, useState } from 'react';
import openInNewTab from '../utils/openInNewTab';
import { Button } from './ui/button';
import { Separator } from './ui/separator';
import { Github, Linkedin, Mail, Heart } from 'lucide-react';

interface SocialLink {
  icon: string;
  url: string;
}

interface QuickLink {
  href: string;
  label: string;
}

interface FooterData {
  logo: {
    initials: string;
    name: string;
  };
  description: string;
  socialLinks: SocialLink[];
  quickLinks: QuickLink[];
  contactInfo: {
    title: string;
    email: string;
    phone: string;
    location: string;
  };
  copyright: {
    builtWith: string;
    freelance: string;
  };
}

export function Footer() {
  const [footerData, setFooterData] = useState<FooterData | null>(null);
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    fetch('/api/footer')
      .then((res) => res.json())
      .then((data) => {
        setFooterData(data);
      });
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (!footerData) {
    return <div>Loading...</div>;
  }

  const getIcon = (icon: string) => {
    switch (icon) {
      case 'Github':
        return <Github className="h-5 w-5" />;
      case 'Linkedin':
        return <Linkedin className="h-5 w-5" />;
      case 'Mail':
        return <Mail className="h-5 w-5" />;
      default:
        return null;
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
                <span className="text-primary-foreground font-medium">{footerData.logo.initials}</span>
              </div>
              <span className="text-lg font-medium">{footerData.logo.name}</span>
            </div>
            <p className="text-muted-foreground">{footerData.description}</p>
            <div className="flex space-x-2">
              {footerData.socialLinks.map((link, index) => (
                <Button key={index} variant="ghost" size="icon" onClick={() => openInNewTab(link.url)}>
                  {getIcon(link.icon)}
                </Button>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-semibold">Quick Links</h3>
            <nav className="flex flex-col space-y-2">
              {footerData.quickLinks.map((link) => (
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
            <h3 className="font-semibold">{footerData.contactInfo.title}</h3>
            <div className="space-y-2 text-muted-foreground">
              <p>{footerData.contactInfo.email}</p>
              <p>{footerData.contactInfo.phone}</p>
              <p>{footerData.contactInfo.location}</p>
            </div>
            <Button onClick={scrollToTop} variant="outline">
              Back to Top
            </Button>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <span>© {currentYear} {footerData.logo.name}. Built with</span>
            <Heart className="h-4 w-4 text-red-500" />
            <span>using {footerData.copyright.builtWith}</span>
          </div>
          <div className="text-sm text-muted-foreground">
            {footerData.copyright.freelance}
          </div>
        </div>
      </div>
    </footer>
  );
}
