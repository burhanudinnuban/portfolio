
'use client';
import { useEffect, useState } from 'react';
import { Badge } from './ui/badge';

interface ExperienceItem {
  title: string;
  company: string;
  location: string;
  period: string;
  description: string;
  achievements: string[];
  technologies: string[];
}

interface EducationItem {
  degree: string;
  school: string;
  location: string;
  period: string;
}

interface ExperienceData {
  badge: string;
  title: string;
  description: string;
  experience: ExperienceItem[];
  education: EducationItem[];
}

export function Experience() {
  const [experienceData, setExperienceData] = useState<ExperienceData | null>(null);

  useEffect(() => {
    fetch('/api/experience')
      .then((res) => res.json())
      .then((data) => {
        setExperienceData(data);
      });
  }, []);

  if (!experienceData) {
    return <div>Loading...</div>;
  }

  return (
    <section id="experience" className="py-12 md:py-24">
      <div className="container mx-auto">
        <div className="text-center">
          <Badge>{experienceData.badge}</Badge>
          <h2 className="text-3xl font-bold mt-4">{experienceData.title}</h2>
          <p className="text-muted-foreground mt-2">{experienceData.description}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
          <div>
            <h3 className="text-2xl font-bold mb-4">Work Experience</h3>
            {experienceData.experience.map((item, index) => (
              <div key={index} className="mb-6">
                <h4 className="text-xl font-bold">{item.title}</h4>
                <p className="text-lg font-semibold">{item.company} | {item.location}</p>
                <p className="text-sm text-muted-foreground">{item.period}</p>
                <p className="mt-2">{item.description}</p>
                <ul className="list-disc list-inside mt-2">
                  {item.achievements.map((achievement, i) => (
                    <li key={i}>{achievement}</li>
                  ))}
                </ul>
                <div className="mt-2">
                  {item.technologies.map((tech, i) => (
                    <Badge key={i} className="mr-2">{tech}</Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div>
            <h3 className="text-2xl font-bold mb-4">Education</h3>
            {experienceData.education.map((item, index) => (
              <div key={index} className="mb-6">
                <h4 className="text-xl font-bold">{item.degree}</h4>
                <p className="text-lg font-semibold">{item.school} | {item.location}</p>
                <p className="text-sm text-muted-foreground">{item.period}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
