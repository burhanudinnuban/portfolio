
'use client';
import { useEffect, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';

interface HeroData {
  name: string;
  title: string;
  description: string;
  callToAction: string;
  profilePicture: string;
}

export function HeroForm() {
  const [heroData, setHeroData] = useState<HeroData | null>(null);
  const { register, handleSubmit, setValue } = useForm<HeroData>();

  useEffect(() => {
    fetch('/api/hero')
      .then((res) => res.json())
      .then((data) => {
        setHeroData(data);
        setValue('name', data.name);
        setValue('title', data.title);
        setValue('description', data.description);
        setValue('callToAction', data.callToAction);
        setValue('profilePicture', data.profilePicture);
      });
  }, [setValue]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      setValue('profilePicture', result.path);
    }
  };

  const onSubmit: SubmitHandler<HeroData> = async (data) => {
    await fetch('/api/hero', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    alert('Hero section updated successfully!');
  };

  if (!heroData) {
    return <div>Loading...</div>;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input id="name" {...register('name')} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input id="title" {...register('title')} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" {...register('description')} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="callToAction">Call to Action</Label>
        <Input id="callToAction" {...register('callToAction')} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="profilePicture">Profile Picture</Label>
        <Input id="profilePicture" type="file" onChange={handleFileUpload} />
        {heroData.profilePicture && (
          <img src={heroData.profilePicture} alt="Profile Picture" className="w-32 h-32 object-cover rounded-full mt-2" />
        )}
      </div>
      <Button type="submit">Save</Button>
    </form>
  );
}
