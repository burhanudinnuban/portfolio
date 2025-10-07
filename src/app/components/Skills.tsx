'use client';
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import skillsDataJson from "../data/skill.json";

interface Skill {
  name: string;
  level: number;
}

interface SkillCategory {
  title: string;
  skills: Skill[];
}

interface SkillsData {
  badge: string;
  title: string;
  description: string;
  skillCategories: SkillCategory[];
  technologies: string[];
}

const skillsData: SkillsData = skillsDataJson;

export function Skills() {

  return (
    <section id="skills" className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4">{skillsData.badge}</Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            {skillsData.title}
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {skillsData.description}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {skillsData.skillCategories.map((category, index) => (
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
              {skillsData.technologies.map((tech, index) => (
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
