"use client";
import { useState } from "react";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { ScrollArea } from "./ui/scroll-area";
import { Code, Palette, Zap, Users, Lock, BookOpen } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { IMGBirthday } from "../assets/images";

export function About() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const highlights = [
    {
      icon: Code,
      title: "Clean Code",
      description: "Writing maintainable, scalable, and efficient code"
    },
    {
      icon: Lock,
      title: "Problem Solving",
      description: "Give the best solution for all problems"
    },
    {
      icon: Zap,
      title: "Performance",
      description: "Optimizing applications for speed and efficiency"
    },
    {
      icon: Users,
      title: "Collaboration",
      description: "Working effectively with cross-functional teams"
    }
  ];

  const shortJourney = "I started my professional career in 2019 as a Mobile Android Developer and have since evolved into a DevSecOps and Fullstack Engineer with over 6 years of experience. Currently, I work at PT. Waskita Karya (Persero) Tbk, leading vendor collaborations and ensuring security and scalability in enterprise systems.";

  const fullJourney = (
    <div className="space-y-4">
      <p className="text-muted-foreground leading-relaxed">
        I started my professional career in 2019 as a Mobile Android Developer at PT. Multi Digital Bisnis, where I built a waste management application using Android Studio (Java). This project, which integrated real-time registration, trash point tracking, and rewards, gave me my first hands-on experience in creating mobile solutions with real social impact.
      </p>
      <p className="text-muted-foreground leading-relaxed">
        In 2020, I joined PT. Generasi Informasi Optima (GenIO) as a React Native Developer. There, I expanded into cross-platform mobile development, using React Native, Flutter, and even native iOS with Swift. I worked on projects like Genioo mobile apps and middleware systems, while also deepening my knowledge in APIs, databases, and automated testing. This role was pivotal in shaping me into a more versatile developer.
      </p>
      <p className="text-muted-foreground leading-relaxed">
        By 2021, I moved to PT. Serasi Autoraya (SERA), part of the Astra Group, as a React Native Developer. I was entrusted to lead and manage mobile app projects, taking ownership of development, debugging, and feature delivery across mobile, web, and backend. My ability to deliver end-to-end solutions solidified my transition into a fullstack developer.
      </p>
      <p className="text-muted-foreground leading-relaxed">
        In 2022, I took on a bigger challenge at PT. Eka Bogainti (HokBen) as a Developer Specialist. Here, I managed and enhanced over 24 enterprise applications — from HRIS and Risk Management to Internal Audit and Vendor Tender platforms. I implemented DevSecOps practices, setting up secure CI/CD pipelines, integrating Wazuh for threat detection, and monitoring with Grafana and Prometheus. This role allowed me to bridge development with security and operations, making me not just a developer, but also a DevSecOps practitioner.
      </p>
      <p className="text-muted-foreground leading-relaxed">
        Today, I work at PT. Waskita Karya (Persero) Tbk, one of Indonesia's leading state-owned construction enterprises, as a DevSecOps and Fullstack Engineer. I lead vendor collaborations, oversee software quality, and ensure security and scalability in every system I touch.
      </p>
    </div>
  );

  return (
    <section id="about" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4">About Me</Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Passionate about creating amazing digital experiences
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            With over 6 years of experience in mobile and web development, I specialize in building secure, scalable, and high-performing systems with expertise in ReactJS, React Native, Laravel, .NET, and Spring Boot. On the DevSecOps side, I leverage Wazuh for threat detection, Grafana/Prometheus for real-time monitoring, and BurpSuite for black-box security testing. Highly adaptive and quick to master new technologies, I thrive in dynamic environments and consistently deliver robust, secure, and efficient solutions.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-semibold">My Journey</h3>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <BookOpen className="mr-2 h-4 w-4" />
                      Read More
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl max-h-[80vh]">
                    <DialogHeader>
                      <DialogTitle>My Professional Journey</DialogTitle>
                    </DialogHeader>
                    <ScrollArea className="h-[60vh] pr-4">
                      {fullJourney}
                    </ScrollArea>
                  </DialogContent>
                </Dialog>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                {shortJourney}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {highlights.map((item, index) => (
                <Card key={index} className="p-4">
                  <CardContent className="p-0">
                    <item.icon className="h-8 w-8 text-primary mb-2" />
                    <h4 className="font-semibold mb-1">{item.title}</h4>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div className="relative">
            <ImageWithFallback
              src={IMGBirthday.src}
              alt="My Birthday from PT.Waskita Karya"
              className="w-full h-96 object-cover rounded-2xl shadow-lg"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent rounded-2xl"></div>
          </div>
        </div>
      </div>
    </section>
  );
}