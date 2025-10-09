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
import projectsData from "../data/project.json";

const imageMap: { [key: string]: { src: string } } = {
  IMGWaskita,
  IMGHokben,
  IMGTrac,
  IMGProSpark,
  IMGSipitung,
  IMGIndiHome,
  IMGGenioo,
  IMGERecycle,
};

export function Projects() {

  const featuredProjects = projectsData.items.filter((project) => project.featured);
  const otherProjects = projectsData.items.filter((project) => !project.featured);

  return (
    <section id="projects" className="py-20 bg-background">
    <div className="container mx-auto px-4">
      <div className="text-center mb-16">
        <Badge variant="outline" className="mb-4 text-primary border-primary">
          {projectsData.badge}
        </Badge>
        <h2 className="text-4xl md:text-5xl font-extrabold mb-6 text-primary">
          {projectsData.title}
        </h2>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          {projectsData.description}
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
              <CarouselItem style={{ width: 400 }} key={project.id} className="basis-1/2 md:basis-1/3 lg:basis-1/4">
                <div className="p-1">
                  <Card  className="h-full overflow-hidden transform transition-all duration-500 ease-in-out hover:scale-105 hover:shadow-2xl bg-card">
                    <div className="w-full h-64 overflow-hidden">
                      <ImageWithFallback
                        src={imageMap[project.image].src}
                        alt={project.title}
                        className="w-full h-full object-cover"
						width={350}
						height={350}
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
            {projectsData.otherProjectsTitle}
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
                <CarouselItem style={{ width: 400 }} key={project.id} className="basis-1/2 md:basis-1/3 lg:basis-1/4">
                  <div className="p-1">
                    <Card className="h-full overflow-hidden transform transition-all duration-500 ease-in-out hover:scale-105 hover:shadow-2xl bg-card">
                      <div className="w-full h-64 overflow-hidden">
                        <ImageWithFallback
                          src={imageMap[project.image].src}
                          alt={project.title}
                          className="w-full h-full object-cover"
                          width={350}
                          height={350}
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
