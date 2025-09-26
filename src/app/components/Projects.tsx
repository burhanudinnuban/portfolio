
'use client';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';

interface Project {
  name: string;
  description: string;
  image: string;
  tags: string[];
  liveUrl: string;
  sourceUrl: string;
}

interface ProjectsData {
  badge: string;
  title: string;
  description: string;
  projects: Project[];
}

export function Projects() {
  const [projectsData, setProjectsData] = useState<ProjectsData | null>(null);

  useEffect(() => {
    fetch('/api/projects')
      .then((res) => res.json())
      .then((data) => {
        setProjectsData(data);
      });
  }, []);

  if (!projectsData) {
    return <div>Loading...</div>;
  }

  return (
    <section id="projects" className="py-12 md:py-24">
      <div className="container mx-auto">
        <div className="text-center">
          <Badge>{projectsData.badge}</Badge>
          <h2 className="text-3xl font-bold mt-4">{projectsData.title}</h2>
          <p className="text-muted-foreground mt-2">{projectsData.description}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
          {projectsData.projects.map((project, index) => (
            <Card key={index}>
              <img src={project.image} alt={project.name} className="rounded-t-lg" />
              <CardHeader>
                <CardTitle>{project.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{project.description}</p>
                <div className="mt-4">
                  {project.tags.map((tag, i) => (
                    <Badge key={i} variant="secondary" className="mr-2">{tag}</Badge>
                  ))}
                </div>
                <div className="mt-4 flex gap-4">
                  <Button asChild>
                    <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">Live Demo</a>
                  </Button>
                  <Button variant="outline" asChild>
                    <a href={project.sourceUrl} target="_blank" rel="noopener noreferrer">Source Code</a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
