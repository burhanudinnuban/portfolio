
'use client';
import { useEffect, useState } from 'react';
import { Button } from "./ui/button";

interface HeroData {
  name: string;
  title: string;
  description: string;
  callToAction: string;
  profilePicture: string;
}

export function Hero() {
  const [heroData, setHeroData] = useState<HeroData | null>(null);

  useEffect(() => {
    fetch('/api/hero')
      .then((res) => res.json())
      .then((data) => {
        setHeroData(data);
      });
  }, []);

  if (!heroData) {
    return <div>Loading...</div>;
  }

  const scrollToContact = () => {
    const contactSection = document.querySelector('#contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="hero" className="bg-background py-24 sm:py-32">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold">{heroData.name}</h1>
            <h2 className="text-2xl md:text-3xl font-semibold text-primary">{heroData.title}</h2>
            <p className="text-muted-foreground text-lg">
              {heroData.description}
            </p>
            <Button size="lg" onClick={scrollToContact}>
              {heroData.callToAction}
            </Button>
          </div>
          <div className="flex justify-center">
            <img
              src={heroData.profilePicture}
              alt="Burhanudin Nuban"
              className="rounded-full w-64 h-64 md:w-80 md:h-80 object-cover shadow-lg border-4 border-primary"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
