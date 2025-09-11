"use client";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";

export function Skills() {
  const skillCategories = [
    {
      title: "Frontend & Mobile Development",
      skills: [
        { name: "React / Next.js", level: 95 },
        { name: "React Native", level: 95 },
        { name: "Flutter", level: 70 },
        { name: "HTML5 / CSS3 / Tailwind CSS", level: 90 },
        { name: "JavaScript / TypeScript", level: 90 }
      ]
    },
    {
      title: "Backend & API Development",
      skills: [
        { name: "Node.js / Express.js", level: 85 },
        { name: "Laravel / CodeIgniter", level: 90 },
        { name: ".NET Core", level: 80 },
        { name: "Spring Boot", level: 80 },
        { name: "RESTful APIs", level: 90 }
      ]
    },
    {
      title: "DevSecOps & Infrastructure",
      skills: [
        { name: "Docker / Containers", level: 80 },
        { name: "AWS (EC2, RDS, S3, ECS, ECR)", level: 75 },
        { name: "Linux (Ubuntu, Kali)", level: 90 },
        { name: "CI/CD (GitLab, Jenkins, Vercel, Firebase)", level: 85 },
        { name: "Monitoring (Prometheus, Grafana, Wazuh)", level: 85 }
      ]
    }
  ];

  const technologies = [
    // Frontend & Mobile
    "ReactJS", "React Native", "Next.js", "Flutter", "Vue.js", "Tailwind CSS",
    "HTML5", "CSS3", "JavaScript", "TypeScript",
    // Backend
    "Node.js", "Express.js", "Laravel", "CodeIgniter", ".NET Core", "Spring Boot",
    "PHP", "Java", "REST APIs", "GraphQL",
    // Databases
    "PostgreSQL", "MySQL", "MongoDB", "NoSQL", "Redis",
    // DevSecOps & Infra
    "Docker", "Kubernetes", "AWS (EC2, RDS, S3, ECS, ECR)", "Firebase", "Heroku",
    "CI/CD Pipelines", "Git / GitHub / GitLab", "Jenkins",
    "Prometheus", "Grafana", "Wazuh", "SonarQube", "Burp Suite",
    // Tools
    "Linux (Ubuntu, Kali)", "Adobe Illustrator", "Figma", "Xcode", "Android Studio"
  ];

  return (
    <section id="skills" className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4">Skills & Expertise</Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Technical Skills & Proficiencies
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            A comprehensive toolkit of modern technologies, frameworks, and DevSecOps practices to deliver secure and scalable systems.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {skillCategories.map((category, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="text-xl">{category.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {category.skills.map((skill, skillIndex) => (
                  <div key={skillIndex} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">{skill.name}</span>
                      <span className="text-sm text-muted-foreground">{skill.level}%</span>
                    </div>
                    <Progress value={skill.level} className="h-2" />
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Technologies & Tools</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {technologies.map((tech, index) => (
                <Badge key={index} variant="secondary" className="text-sm">
                  {tech}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
