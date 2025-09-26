
'use client';
import { useEffect, useState } from 'react';
import { useForm, SubmitHandler, useFieldArray } from 'react-hook-form';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { Trash2 } from 'lucide-react';

interface Testimonial {
  author: string;
  role: string;
  quote: string;
  avatar: string;
}

interface TestimonialsData {
  badge: string;
  title: string;
  description: string;
  testimonials: Testimonial[];
}

export function TestimonialsForm() {
  const [testimonialsData, setTestimonialsData] = useState<TestimonialsData | null>(null);
  const { register, handleSubmit, control, setValue } = useForm<TestimonialsData>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'testimonials',
  });

  useEffect(() => {
    fetch('/api/testimonials')
      .then((res) => res.json())
      .then((data) => {
        setTestimonialsData(data);
        setValue('badge', data.badge);
        setValue('title', data.title);
        setValue('description', data.description);
        setValue('testimonials', data.testimonials);
      });
  }, [setValue]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0];
    if (file) {
      const formData = new FormData();
      formData.append('file', file);
      const response = await fetch('/api/upload', { method: 'POST', body: formData });
      const result = await response.json();
      setValue(`testimonials.${index}.avatar`, result.path);
    }
  };

  const onSubmit: SubmitHandler<TestimonialsData> = async (data) => {
    await fetch('/api/testimonials', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    alert('Testimonials section updated successfully!');
  };

  if (!testimonialsData) {
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
        <Label>Testimonials</Label>
        {fields.map((field, index) => (
          <div key={field.id} className="space-y-2 border p-4 rounded-md">
            <Input {...register(`testimonials.${index}.author`)} placeholder="Author" />
            <Input {...register(`testimonials.${index}.role`)} placeholder="Role" />
            <Textarea {...register(`testimonials.${index}.quote`)} placeholder="Quote" />
            <div className="flex flex-col">
              <Input type="file" onChange={(e) => handleFileChange(e, index)} />
              <img src={testimonialsData.testimonials[index].avatar} alt={testimonialsData.testimonials[index].author} className="w-20 h-20 rounded-full"/>
            </div>
            <Button type="button" variant="destructive" onClick={() => remove(index)}>
              Remove Testimonial
            </Button>
          </div>
        ))}
        <Button type="button" onClick={() => append({ author: '', role: '', quote: '', avatar: '' })}>
          Add Testimonial
        </Button>
      </div>

      <Button type="submit">Save</Button>
    </form>
  );
}
