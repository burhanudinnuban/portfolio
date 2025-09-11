"use client";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Github, Linkedin, Mail, Download } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { IMGBurhan } from "../assets/images";
import openInNewTab from "../utils/openInNewTab";

export function Hero() {
  const scrollToContact = () => {
    const element = document.querySelector("#contact");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted/30 pt-16">
      <div className="container mx-auto px-4 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <Badge variant="secondary" className="w-fit">
                Available for new opportunities
              </Badge>
              <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                Full Stack Developer &{" "}
                <span className="text-primary">DevSecOps Engineer</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl">
                Hi, my name is Burhanudin Nuban, a 27-year-old Fullstack Developer & DevSecOps Engineer with more than 6 years of hands-on experience in software engineering. I am deeply passionate about designing and implementing secure, scalable, and high-performing systems that seamlessly integrate development, security, and operations.
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
              <Button onClick={scrollToContact} size="lg">
                <Mail className=
                "mr-2 h-4 w-4" />
                Get In Touch
              </Button>
              <Button variant="outline" size="lg" onClick={()=>openInNewTab(
                  "https://drive.google.com/file/d/1YwqVJBH_cag6efGsUbthj730Fv0agwNU/view?usp=drive_link"
                )}>
                <Download className="mr-2 h-4 w-4" />
                Download CV
              </Button>
            </div>

            <div className="flex space-x-4">
              <Button variant="ghost" size="icon">
                <Github className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <Linkedin className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <Mail className="h-5 w-5" />
              </Button>
            </div>
          </div>

          <div className="relative">
            <div className="relative w-full max-w-md mx-auto">
              <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary/60 rounded-2xl transform rotate-6"></div>
              <ImageWithFallback
                src={IMGBurhan.src} 
                alt="Professional burhan photoshot"
                className="relative z-10 w-full h-96 object-cover rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}