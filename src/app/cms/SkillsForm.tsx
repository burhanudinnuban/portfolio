
'use client';
import { useEffect, useState } from 'react';
import { useForm, SubmitHandler, useFieldArray } from 'react-hook-form';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Trash2 } from 'lucide-react';
import { Textarea } from '../components/ui/textarea';

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

export function SkillsForm() {
  const [skillsData, setSkillsData] = useState<SkillsData | null>(null);
  const { register, handleSubmit, control, setValue } = useForm<SkillsData>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'skills',
  });

  useEffect(() => {
    fetch('/api/skills')
      .then((res) => res.json())
      .then((data) => {
        setSkillsData(data);
        setValue('badge', data.badge);
        setValue('title', data.title);
        setValue('description', data.description);
        setValue('skills', data.skills);
      });
  }, [setValue]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0];
    if (file) {
      const formData = new FormData();
      formData.append('file', file);
      const response = await fetch('/api/upload', { method: 'POST', body: formData });
      const result = await response.json();
      setValue(`skills.${index}.icon`, result.path);
    }
  };

  const onSubmit: SubmitHandler<SkillsData> = async (data) => {
    await fetch('/api/skills', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    alert('Skills section updated successfully!');
  };

  if (!skillsData) {
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
        <Label>Skills</Label>
        {fields.map((field, index) => (
          <div key={field.id} className="flex items-center gap-4 py-2">
            <Input {...register(`skills.${index}.name`)} placeholder="Skill Name" />
            <div className="flex flex-col">
              <Input type="file" onChange={(e) => handleFileChange(e, index)} />
              <img src={skillsData.skills[index].icon} alt={skillsData.skills[index].name} className="w-10 h-10" />
            </div>
            <Button type="button" variant="destructive" size="icon" onClick={() => remove(index)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
        <Button type="button" onClick={() => append({ name: '', icon: '' })}>
          Add Skill
        </Button>
      </div>

      <Button type="submit">Save</Button>
    </form>
  );
}
