'use client';
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Carousel, CarouselContent, CarouselItem } from "./ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { ImageWithFallback } from "./figma/ImageWithFallback";

export function Certificates() {
  const certificates = [
    {
      id: 0,
      title: "AWS Certified Solutions Architect",
      issuer: "Amazon Web Services",
      image: "https://images.unsplash.com/photo-1617957718639-68156de3a73c?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      id: 1,
      title: "CompTIA Security+",
      issuer: "CompTIA",
      image: "https://images.unsplash.com/photo-1550684376-efcbd6e3f031?q=80&w=2832&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      id: 2,
      title: "Google Certified Professional Cloud Architect",
      issuer: "Google Cloud",
      image: "https://images.unsplash.com/photo-1557682250-33bd709cbe85?q=80&w=2929&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      id: 3,
      title: "Microsoft Certified: Azure Solutions Architect Expert",
      issuer: "Microsoft",
      image: "https://images.unsplash.com/photo-1557682224-5b8590cd9ec5?q=80&w=2929&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      id: 4,
      title: "Oracle Certified Professional, Java SE 11 Developer",
      issuer: "Oracle",
      image: "https://images.unsplash.com/photo-.com/photo-1519681393784-d120267933ba?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
  ];

  return (
    <section id="certificates" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4">Certificates & Competence</Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            My Certificates & Competencies
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            A collection of my professional certifications and competencies.
          </p>
        </div>
        <Carousel
          opts={{ align: "start", loop: true, dragFree: true }}
          plugins={[Autoplay({ delay: 3000, stopOnInteraction: false })]}
          className="w-full"
        >
          <CarouselContent>
            {certificates.map((certificate) => (
              <CarouselItem key={certificate.id} className="basis-1/2 md:basis-1/3 lg:basis-1/4">
                <div className="p-1">
                  <Card className="h-full overflow-hidden transform transition-all duration-500 ease-in-out hover:scale-105 hover:shadow-2xl bg-card">
                    <div className="w-full h-64 overflow-hidden">
                      <ImageWithFallback
                        src={certificate.image}
                        alt={certificate.title}
                        className="w-full h-full object-cover"
						width={300}
						height={300}
                      />
                    </div>
                    <CardHeader>
                      <CardTitle className="text-xl font-bold">{certificate.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">{certificate.issuer}</p>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </section>
  );
}
