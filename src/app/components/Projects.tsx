"use client";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { ExternalLink, Github } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { IMGERecycle, IMGGenioo, IMGHokben, IMGIndiHome, IMGProSpark, IMGSipitung, IMGTrac, IMGWaskita } from "../assets/images";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "./ui/carousel";
import Autoplay from "embla-carousel-autoplay";

export function Projects() {
  const projects = [
    {
      id: 0,
      title: "Waskita Karya Corporate Website",
      description:
        "The official corporate website of PT Waskita Karya (Persero) Tbk. Contributed as Fullstack & DevSecOps Engineer ensuring performance, scalability, and security.",
      image: IMGWaskita,
      technologies: ["Next.js", "React", "Laravel", "Linux", "CI/CD"],
      liveUrl: "https://www.waskita.co.id",
      githubUrl: "#",
      featured: true,
    },
    {
      id: 1,
      title: "HokBen Mobile and Website Company",
      description:
        "The HokBen mobile app for Android and iOS. Contributed as a React Native Developer integrating with Spring Boot backend.",
      image: IMGHokben,
      technologies: ["React Native", "JavaScript", "Spring Boot"],
      liveUrl: "https://www.hokben.co.id",
      githubUrl: "#",
      featured: true,
    },
    {
      id: 2,
      title: "Trac To Go Mobile",
      description:
        "Rental service mobile app (iOS & Android). Implemented CI/CD, performance improvements, new features, and bug fixes.",
      image: IMGTrac,
      technologies: ["React Native", "JavaScript", "CI/CD"],
      liveUrl: "https://www.trac.astra.co.id/",
      githubUrl: "#",
      featured: true,
    },
    {
      id: 3,
      title: "ProSpark - Transforms Learning",
      description:
        "Learning platform mobile app for Android & iOS. Worked as a React Native Developer delivering features and improvements.",
      image: IMGProSpark,
      technologies: ["React Native", "JavaScript"],
      liveUrl: "https://www.prospark.co",
      githubUrl: "#",
      featured: false,
    },
    {
      id: 4,
      title: "Task Management Tool",
      description:
        "Mobile app for Android & iOS. Contributed as a React Native Developer building features and integrations.",
      image: IMGSipitung,
      technologies: ["React Native", "JavaScript"],
      liveUrl: "https://sipitung.co.id",
      githubUrl: "#",
      featured: false,
    },
    {
      id: 5,
      title: "IndiHome Smart",
      description:
        "iOS mobile app for smart home services. Contributed as an iOS Native Developer using Swift 5 and Xcode.",
      image: IMGIndiHome,
      technologies: ["Swift 5", "Xcode", "iOS"],
      liveUrl: "https://smart.indihome.co.id/smartcam-pro/",
      githubUrl: "#",
      featured: false,
    },
    {
      id: 6,
      title: "Genioo",
      description:
        "E-commerce mobile app for Android. Worked as Fullstack Developer with React Native, CodeIgniter, and MySQL.",
      image: IMGGenioo,
      technologies: ["React Native", "CodeIgniter", "MySQL"],
      liveUrl: "https://genio.co.id",
      githubUrl: "#",
      featured: false,
    },
    {
      id: 7,
      title: "E-Recycle",
      description:
        "Mobile recycling app for Android & iOS. Developed using Android Studio and Java, focusing on eco-friendly waste management.",
      image: IMGERecycle,
      technologies: ["Java", "Android Studio"],
      liveUrl: "https://erecycle.id",
      githubUrl: "#",
      featured: false,
    },
    {
      id: 8,
      title: "Admin SiPitung Dashboard",
      description:
        "Web-based dashboard to manage users and monitor activities for SiPitung. Developed as a React JS Developer.",
      image: IMGSipitung,
      technologies: ["React.js", "JavaScript"],
      liveUrl: "http://admin.sipitung.co.id",
      githubUrl: "#",
      featured: false,
    },

  ];

  const featuredProjects = projects.filter((project) => project.featured);
  const otherProjects = projects.filter((project) => !project.featured);

  return (
    <section id="projects" className="py-20 bg-background">
    <div className="container mx-auto px-4">
      <div className="text-center mb-16">
        <Badge variant="outline" className="mb-4 text-primary border-primary">
          Portfolio
        </Badge>
        <h2 className="text-4xl md:text-5xl font-extrabold mb-6 text-primary">
          Featured Projects
        </h2>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          A showcase of my real-world projects, demonstrating expertise in
          full-stack development and modern technologies.
        </p>
      </div>

      {/* Featured Projects Carousel */}
      <div className="mb-24">
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          plugins={[
            Autoplay({
              delay: 2000,
              stopOnInteraction: false,
            }),
          ]}
          className="w-full"
        >
          <CarouselContent>
            {featuredProjects.map((project) => (
              <CarouselItem key={project.id} className="basis-1/2 md:basis-1/3 lg:basis-1/4">
                <div className="p-1">
                  <Card style={{ width: 530 }} className="h-full overflow-hidden transform transition-all duration-500 ease-in-out hover:scale-105 hover:shadow-2xl bg-card">
                    <div className="w-full h-64 overflow-hidden">
                      <ImageWithFallback
                        src={typeof project.image === "string" ? project.image : project.image.src}
                        alt={project.title}
                        className="w-full h-full object-cover"
						width={400}
						height={400}
                      />
                    </div>
                    <CardHeader>
                      <CardTitle className="text-xl font-bold">
                        {project.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm text-muted-foreground line-clamp-3">
                        {project.description}
                      </p>

                      <div className="flex flex-wrap gap-2">
                        {project.technologies.map((tech, techIndex) => (
                          <Badge
                            key={techIndex}
                            variant="secondary"
                            className="text-xs"
                          >
                            {tech}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex gap-4 pt-4">
                        <Button size="sm" asChild>
                          <a
                            href={project.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <ExternalLink className="mr-2 h-4 w-4" />
                            Live Demo
                          </a>
                        </Button>
                        <Button variant="outline" size="sm" asChild>
                          <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Github className="mr-2 h-4 w-4" />
                            Source Code
                          </a>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>

        {/* Other Projects */}
        <div>
          <h3 className="text-3xl font-bold mb-12 text-center text-primary">
            Other Notable Projects
          </h3>
          <Carousel
            opts={{
              align: "start",
              loop: true,
              dragFree: true,
            }}
            plugins={[
              Autoplay({
                delay: 2500,
                stopOnInteraction: false,
              }),
            ]}
            className="w-full"
          >
            <CarouselContent>
              {otherProjects.map((project) => (
                <CarouselItem key={project.id} className="basis-1/2 md:basis-1/3 lg:basis-1/4">
                  <div className="p-1">
                    <Card style={{ width: 530 }} className="h-full overflow-hidden transform transition-all duration-500 ease-in-out hover:scale-105 hover:shadow-2xl bg-card">
                      <div className="w-full h-64 overflow-hidden">
                        <ImageWithFallback
                          src={typeof project.image === "string" ? project.image : project.image.src}
                          alt={project.title}
                          className="w-full h-full object-cover"
						  width={400}
						  height={400}
                        />
                      </div>
                      <CardHeader>
                        <CardTitle className="text-xl font-bold">{project.title}</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <p className="text-sm text-muted-foreground line-clamp-3">
                          {project.description}
                        </p>

                        <div className="flex flex-wrap gap-2">
                          {project.technologies.slice(0, 4).map((tech, techIndex) => (
                            <Badge
                              key={techIndex}
                              variant="secondary"
                              className="text-xs"
                            >
                              {tech}
                            </Badge>
                          ))}
                          {project.technologies.length > 4 && (
                            <Badge variant="secondary" className="text-xs">
                              +{project.technologies.length - 4} more
                            </Badge>
                          )}
                        </div>

                        <div className="flex gap-2 pt-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="w-full"
                            asChild
                          >
                            <a
                              href={project.liveUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <ExternalLink className="mr-2 h-4 w-4" />
                              Demo
                            </a>
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="w-full"
                            asChild
                          >
                            <a
                              href={project.githubUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <Github className="mr-2 h-4 w-4" />
                              Code
                            </a>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
      </div>
    </section>
  );
}
