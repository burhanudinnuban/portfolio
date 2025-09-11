"use client";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Calendar, MapPin } from "lucide-react";

export function Experience() {
  const experiences = [
    {
      title: "DevSecOps (Ahli Muda Bidang IT)",
      company: "PT. Waskita Karya (Persero) Tbk",
      location: "East Jakarta, Indonesia",
      period: "Sep 2024 - Present",
      description:
        "Leading and managing mobile and web application projects over 25 applications, ensuring robust DevSecOps practices and secure deployments.",
      achievements: [
        "Led development of mobile and web applications",
        "Built CI/CD pipelines with vulnerability scanning (GitLab & SonarQube)",
        "Migrated VM and databases to new servers",
        "Implemented Docker containerization",
        "Developed server & DB monitoring with Prometheus and Grafana",
        "Improved security for servers, mobile apps, and web apps",
        "Migrated systems to automation",
        "Solved technical issues and optimized architecture"
      ],
      technologies: [
        "React Native",
        "React.js",
        "Spring Boot",
        "Laravel",
        "CodeIgniter",
        "ASP.NET Core",
        "DevOps",
        "Grafana",
        "SonarQube",
        "Prometheus",
        "Git",
        "CI/CD"
      ]
    },
    {
      title: "Developer Specialist",
      company: "PT. Eka Boga Inti (HokBen)",
      location: "Ciracas, Jakarta, Indonesia",
      period: "May 2022 - Sep 2024",
      description:
        "Worked as a Specialist Developer managing multiple projects, leading teams, and improving system architecture.",
      achievements: [
        "Managed projects and led development teams",
        "Solved bugs and technical challenges",
        "Improved technology stack and system architecture"
      ],
      technologies: [
        "MongoDB",
        "Express.js",
        "React.js",
        "React Native",
        "Node.js",
        "Docker",
        "AWS EC2",
        "AWS ECS",
        "AWS S3",
        "AWS ECR",
        "Firebase",
        "Heroku",
        "Microsoft Dynamics ERP",
        "JavaScript"
      ]
    },
    {
      title: "React Native Developer",
      company: "Indocyber Global Teknologi (SERA Astra)",
      location: "Jakarta, Indonesia",
      period: "Aug 2021 - Jul 2022",
      description:
        "Enhanced and maintained the Trac To Go app (iOS & Android) with React Native, focusing on performance and scalability.",
      achievements: [
        "Implemented CI/CD pipelines",
        "Upgraded packages to latest versions",
        "Introduced Atomic Design for modular UI",
        "Improved app performance and fixed bugs",
        "Developed new features for iOS & Android"
      ],
      technologies: ["React Native", "CI/CD", "Atomic Design", "JavaScript", "TypeScript"]
    },
    {
      title: "Information Technology Consultant",
      company: "GenIO",
      location: "Jakarta, Indonesia",
      period: "Feb 2020 - Aug 2021",
      description:
        "Developed mobile and web applications for various clients, integrating features and maintaining systems.",
      achievements: [
        "Built IndiHome Smart app features with Xcode",
        "Developed Genioo Marketplace and Sipitung apps using React Native",
        "Managed deployments with cPanel & CodeIgniter",
        "Integrated MySQL databases for backend services"
      ],
      technologies: [
        "React Native",
        "Xcode (Swift)",
        "CodeIgniter",
        "MySQL",
        "cPanel",
        "PHP",
        "JavaScript"
      ]
    },
    {
      title: "Mobile Application Developer (Android)",
      company: "PT. Multi Inti Digital Bisnis",
      location: "Sudirman, Jakarta, Indonesia",
      period: "Aug 2019 - Mar 2020",
      description:
        "Developed Android applications to support waste management and recycling programs.",
      achievements: [
        "Built Bank Sampah (Waste Bank) app with Android Studio (Java)",
        "Implemented real-time user registration and tracking",
        "Added reward system for recycling engagement"
      ],
      technologies: ["Java", "Android Studio", "GitHub"]
    }
  ];

  const education = [
    {
      degree: "Bachelor of Information Systems (S1)",
      school: "Gunadarma University",
      location: "Depok, Indonesia",
      period: "2016 - 2020",
      achievements: ["Focused on information systems and applied computer science projects"]
    }
  ];

  return (
    <section id="experience" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4">Experience</Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Professional Journey
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            A track record of delivering secure, scalable, and innovative solutions across industries.
          </p>
        </div>

        <div className="space-y-8 mb-16">
          <h3 className="text-2xl font-semibold mb-8">Work Experience</h3>
          {experiences.map((exp, index) => (
            <Card key={index} className="relative">
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <CardTitle className="text-xl mb-2">{exp.title}</CardTitle>
                    <div className="space-y-1">
                      <p className="font-semibold text-primary">{exp.company}</p>
                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {exp.period}
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {exp.location}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">{exp.description}</p>

                <div>
                  <h4 className="font-semibold mb-2">Key Achievements:</h4>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    {exp.achievements.map((achievement, achIndex) => (
                      <li key={achIndex}>{achievement}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Technologies:</h4>
                  <div className="flex flex-wrap gap-2">
                    {exp.technologies.map((tech, techIndex) => (
                      <Badge key={techIndex} variant="secondary" className="text-xs">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="space-y-8">
          <h3 className="text-2xl font-semibold">Education</h3>
          {education.map((edu, index) => (
            <Card key={index}>
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <CardTitle className="text-xl mb-2">{edu.degree}</CardTitle>
                    <div className="space-y-1">
                      <p className="font-semibold text-primary">{edu.school}</p>
                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {edu.period}
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {edu.location}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  {edu.achievements.map((achievement, achIndex) => (
                    <li key={achIndex}>{achievement}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
