'use client';

import { useState } from 'react';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { ScrollArea } from './ui/scroll-area';
import { Code, Zap, Users, Lock, BookOpen, LucideIcon } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { IMGBirthday } from '../assets/images';
import aboutData from '../data/about.json';

const iconMap: { [key: string]: LucideIcon } = {
  Code,
  Lock,
  Zap,
  Users,
};

export function About() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <section id="about" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4">{aboutData.badge}</Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            {aboutData.title}
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {aboutData.description}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-semibold">{aboutData.journey.title}</h3>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <BookOpen className="mr-2 h-4 w-4" />
                      Read More
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl max-h-[80vh]">
                    <DialogHeader>
                      <DialogTitle>{aboutData.journey.title}</DialogTitle>
                    </DialogHeader>
                    <ScrollArea className="h-[60vh] pr-4">
                      <div className="space-y-4">
                        {aboutData.journey.full.map((paragraph, index) => (
                          <p key={index} className="text-muted-foreground leading-relaxed">
                            {paragraph}
                          </p>
                        ))}
                      </div>
                    </ScrollArea>
                  </DialogContent>
                </Dialog>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                {aboutData.journey.short}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {aboutData.highlights.map((item, index) => {
                const Icon = iconMap[item.icon];
                return(
                <Card key={index} className="p-4">
                  <CardContent className="p-0">
                    {Icon && <Icon className="h-8 w-8 text-primary mb-2" />}
                    <h4 className="font-semibold mb-1">{item.title}</h4>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </CardContent>
                </Card>
              )})}
            </div>
          </div>

          <div className="relative hover:scale-105">
            <ImageWithFallback
              src={IMGBirthday.src}
              alt={aboutData.image.alt}
              className="w-full h-96 object-cover rounded-2xl shadow-lg"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent rounded-2xl"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
