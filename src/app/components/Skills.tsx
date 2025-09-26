
'use client';
import { useEffect, useState } from 'react';
import { Badge } from './ui/badge';

interface Skill {
  name: string;
  icon: string;
}

interface SkillsData {
  badge: string;
  title: string;
  description: string;
  skills: Skill[];
}

export function Skills() {
  const [skillsData, setSkillsData] = useState<SkillsData | null>(null);

  useEffect(() => {
    fetch('/api/skills')
      .then((res) => res.json())
      .then((data) => {
        setSkillsData(data);
      });
  }, []);

  if (!skillsData) {
    return <div>Loading...</div>;
  }

  return (
    <section id="skills" className="py-12 md:py-24 bg-muted">
      <div className="container mx-auto">
        <div className="text-center">
          <Badge>{skillsData.badge}</Badge>
          <h2 className="text-3xl font-bold mt-4">{skillsData.title}</h2>
          <p className="text-muted-foreground mt-2">{skillsData.description}</p>
        </div>
        <div className="flex flex-wrap justify-center gap-8 mt-8">
          {skillsData.skills.map((skill, index) => (
            <div key={index} className="flex flex-col items-center gap-2">
              <img src={skill.icon} alt={skill.name} className="w-12 h-12" />
              <p className="font-semibold">{skill.name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
