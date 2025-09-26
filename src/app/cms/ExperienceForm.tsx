
'use client';
import { useEffect, useState } from 'react';
import { useForm, SubmitHandler, useFieldArray, UseFormRegister } from 'react-hook-form';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { Trash2 } from 'lucide-react';

interface ExperienceItem {
  title: string;
  company: string;
  period: string;
  location: string;
  description: string;
  achievements: { value: string }[];
  technologies: { value: string }[];
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

interface ApiExperienceData {
  badge: string;
  title: string;
  description: string;
  experience: {
    title: string;
    company: string;
    period: string;
    location: string;
    description: string;
    achievements: string[];
    technologies: string[];
  }[];
  education: EducationItem[];
}

export function ExperienceForm() {
  const [data, setData] = useState<ApiExperienceData | null>(null);
  const { register, handleSubmit, control, setValue } = useForm<ExperienceData>();
  const { fields: experienceFields, append: appendExperience, remove: removeExperience } = useFieldArray({
    control,
    name: 'experience',
  });
  const { fields: educationFields, append: appendEducation, remove: removeEducation } = useFieldArray({
    control,
    name: 'education',
  });

  useEffect(() => {
    fetch('/api/experience')
      .then((res) => res.json())
      .then((data: ApiExperienceData) => {
        setData(data);
        setValue('badge', data.badge);
        setValue('title', data.title);
        setValue('description', data.description);
        const transformedExperience = data.experience.map(exp => ({
          ...exp,
          achievements: exp.achievements.map(a => ({ value: a })),
          technologies: exp.technologies.map(t => ({ value: t }))
        }));
        setValue('experience', transformedExperience);
        setValue('education', data.education);
      });
  }, [setValue]);

  const onSubmit: SubmitHandler<ExperienceData> = async (data) => {
    const originalData = {
      ...data,
      experience: data.experience.map(exp => ({
        ...exp,
        achievements: exp.achievements.map(a => a.value),
        technologies: exp.technologies.map(t => t.value)
      }))
    };
    await fetch('/api/experience', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(originalData),
    });
    alert('Experience section updated successfully!');
  };

  if (!data) {
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
        <h3 className="text-xl font-semibold">Work Experience</h3>
        {experienceFields.map((field, index) => (
          <div key={field.id} className="space-y-2 border p-4 rounded-md">
            <Input {...register(`experience.${index}.title`)} placeholder="Title" />
            <Input {...register(`experience.${index}.company`)} placeholder="Company" />
            <Input {...register(`experience.${index}.period`)} placeholder="Period" />
            <Input {...register(`experience.${index}.location`)} placeholder="Location" />
            <Textarea {...register(`experience.${index}.description`)} placeholder="Description" />
            <div className="pl-4">
                <Label>Achievements</Label>
                <StringArray control={control} register={register} name={`experience.${index}.achievements`} />
            </div>
            <div className="pl-4">
                <Label>Technologies</Label>
                <StringArray control={control} register={register} name={`experience.${index}.technologies`} />
            </div>
            <Button type="button" variant="destructive" onClick={() => removeExperience(index)}>
              Remove Experience
            </Button>
          </div>
        ))}
        <Button type="button" onClick={() => appendExperience({ title: '', company: '', period: '', location: '', description: '', achievements: [], technologies: [] })}>
          Add Experience
        </Button>
      </div>

      <div>
        <h3 className="text-xl font-semibold">Education</h3>
        {educationFields.map((field, index) => (
          <div key={field.id} className="space-y-2 border p-4 rounded-md">
            <Input {...register(`education.${index}.degree`)} placeholder="Degree" />
            <Input {...register(`education.${index}.school`)} placeholder="School" />
            <Input {...register(`education.${index}.location`)} placeholder="Location" />
            <Input {...register(`education.${index}.period`)} placeholder="Period" />
            <Button type="button" variant="destructive" onClick={() => removeEducation(index)}>
              Remove Education
            </Button>
          </div>
        ))}
        <Button type="button" onClick={() => appendEducation({ degree: '', school: '', location: '', period: '' })}>
          Add Education
        </Button>
      </div>

      <Button type="submit">Save</Button>
    </form>
  );
}

function StringArray({ control, register, name }: { control: any, register: UseFormRegister<any>, name: string }) {
    const { fields, append, remove } = useFieldArray({
        control,
        name
    });

    return (
        <div className="space-y-2">
            {fields.map((field, index) => (
                <div key={field.id} className="flex items-center gap-2">
                    <Input {...register(`${name}.${index}.value` as const)} />
                    <Button type="button" variant="destructive" size="icon" onClick={() => remove(index)}>
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            ))}
            <Button type="button" size="sm" onClick={() => append({ value: '' })}>
                Add Item
            </Button>
        </div>
    )
}
