import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Github, Linkedin, Mail, Download } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

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
                <span className="text-primary">DevSecOps Developer</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl">
                Hi, my name is Burhanudin Nuban, a 27-year-old Fullstack Developer and DevSecOps Engineer with over 6 years of professional experience in software engineering. I am passionate about building secure, scalable, and efficient systems that align development, security, and operations. I specialize in end-to-end development using modern technologies such as ReactJS, React Native, Laravel, .NET, and Spring Boot, and I work fluently in Linux environments. On the DevSecOps side, I implement Wazuh for threat detection, and use Grafana, Prometheus, and alert monitoring servers to maintain real-time system health and security awareness. Known for being highly adaptive, I thrive in dynamic environments and quickly learn new tools and technologies. I consistently deliver robust and secure systems by combining software development expertise with strong DevSecOps principles, secure CI/CD automation, and proactive infrastructure monitoring.
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
              <Button onClick={scrollToContact} size="lg">
                <Mail className="mr-2 h-4 w-4" />
                Get In Touch
              </Button>
              <Button variant="outline" size="lg">
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
                src="https://images.unsplash.com/photo-1576558656222-ba66febe3dec?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBoZWFkc2hvdCUyMHBvcnRyYWl0fGVufDF8fHx8MTc1NzUyOTgzMHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Professional headshot"
                className="relative z-10 w-full h-96 object-cover rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}