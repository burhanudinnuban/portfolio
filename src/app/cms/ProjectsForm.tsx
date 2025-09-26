
'use client';
import { useEffect, useState } from 'react';
import { useForm, SubmitHandler, useFieldArray } from 'react-hook-form';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { Trash2 } from 'lucide-react';

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

export function ProjectsForm() {
  const [projectsData, setProjectsData] = useState<ProjectsData | null>(null);
  const { register, handleSubmit, control, setValue } = useForm<ProjectsData>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'projects',
  });

  useEffect(() => {
    fetch('/api/projects')
      .then((res) => res.json())
      .then((data) => {
        setProjectsData(data);
        setValue('badge', data.badge);
        setValue('title', data.title);
        setValue('description', data.description);
        setValue('projects', data.projects);
      });
  }, [setValue]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0];
    if (file) {
      const formData = new FormData();
      formData.append('file', file);
      const response = await fetch('/api/upload', { method: 'POST', body: formData });
      const result = await response.json();
      setValue(`projects.${index}.image`, result.path);
    }
  };

  const onSubmit: SubmitHandler<ProjectsData> = async (data) => {
    await fetch('/api/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    alert('Projects section updated successfully!');
  };

  if (!projectsData) {
    return <div>Loading...</div>;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="badge">Badge</Label>
        <Input id="badge" {...register('badge')} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input id="title" {...register('title')} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" {...register('description')} />
      </div>

      <div>
        <Label>Projects</Label>
        {fields.map((field, index) => (
          <div key={field.id} className="space-y-2 border p-4 rounded-md">
            <Input {...register(`projects.${index}.name`)} placeholder="Project Name" />
            <Textarea {...register(`projects.${index}.description`)} placeholder="Description" />
            <Input {...register(`projects.${index}.tags`)} placeholder="Tags (comma-separated)" />
            <Input {...register(`projects.${index}.liveUrl`)} placeholder="Live Demo URL" />
            <Input {...register(`projects.${index}.sourceUrl`)} placeholder="Source Code URL" />
            <div className="flex flex-col">
                <Input type="file" onChange={(e) => handleFileChange(e, index)} />
                <img src={projectsData.projects[index].image} alt={projectsData.projects[index].name} className="w-40 h-20"/>
            </div>
            <Button type="button" variant="destructive" onClick={() => remove(index)}>
              Remove Project
            </Button>
          </div>
        ))}
        <Button type="button" onClick={() => append({ name: '', description: '', image: '', tags: [], liveUrl: '', sourceUrl: '' })}>
          Add Project
        </Button>
      </div>

      <Button type="submit">Save</Button>
    </form>
  );
}
