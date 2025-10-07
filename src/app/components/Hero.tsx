"use client";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Github, Linkedin, Mail, Download } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { IMGBurhan } from "../assets/images";
import openInNewTab from "../utils/openInNewTab";
import heroData from "../data/hero.json";

export function Hero() {
  const scrollToContact = () => {
    const element = document.querySelector("#contact");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-100 to-teal-100 pt-16 animate-background-pan">
      <div className="container mx-auto px-4 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <Badge variant="secondary" className="w-fit shadow-md">
                Available for new opportunities
              </Badge>
              <h1 className="text-4xl md:text-6xl font-bold leading-tight text-gray-800">
                {heroData.title.split('&')[0]}&{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500">{heroData.title.split('&')[1]}</span>
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl">
                {heroData.description}
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
              <Button variant={"secondary"} onClick={scrollToContact} size="lg" className="bg-gradient-to-r from-blue-500 to-purple-500 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                <Mail className="mr-2 h-4 w-4" />
                {heroData.callToAction}
              </Button>
              <Button variant="outline" size="lg" onClick={()=>openInNewTab(
                  "https://drive.google.com/file/d/1YwqVJBH_cag6efGsUbthj730Fv0agwNU/view?usp=drive_link"
                )} className="shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                <Download className="mr-2 h-4 w-4" />
                Download CV
              </Button>
            </div>

            <div className="flex space-x-4">
              <Button variant="ghost" size="icon" className="text-gray-600 hover:text-blue-500 transition-colors">
                <Github className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-gray-600 hover:text-blue-500 transition-colors">
                <Linkedin className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-gray-600 hover:text-purple-500 transition-colors">
                <Mail className="h-5 w-5" />
              </Button>
            </div>
          </div>

          <div className="relative">
            <div className="relative w-full max-w-md mx-auto">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl transform rotate-6 animate-pulse"></div>
              <ImageWithFallback
                src={IMGBurhan.src} 
                alt={`Professional ${heroData.name} photoshot`}
                className="relative z-10 w-full h-96 object-cover rounded-2xl shadow-2xl transform hover:scale-105 transition-transform duration-300"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
