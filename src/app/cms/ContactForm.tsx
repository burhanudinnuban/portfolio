
'use client';
import { useEffect, useState } from 'react';
import { useForm, SubmitHandler, useFieldArray, UseFormRegister } from 'react-hook-form';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { Trash2 } from 'lucide-react';

interface SocialLink {
  name: string;
  url: string;
}

interface ContactData {
  badge: string;
  title: string;
  description: string;
  form: {
    namePlaceholder: string;
    emailPlaceholder: string;
    messagePlaceholder: string;
    submitButton: string;
  };
  social: {
    title: string;
    links: SocialLink[];
  };
}

export function ContactForm() {
  const [data, setData] = useState<ContactData | null>(null);
  const { register, handleSubmit, control, setValue } = useForm<ContactData>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'social.links',
  });

  useEffect(() => {
    fetch('/api/contact')
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        setValue('badge', data.badge);
        setValue('title', data.title);
        setValue('description', data.description);
        setValue('form.namePlaceholder', data.form.namePlaceholder);
        setValue('form.emailPlaceholder', data.form.emailPlaceholder);
        setValue('form.messagePlaceholder', data.form.messagePlaceholder);
        setValue('form.submitButton', data.form.submitButton);
        setValue('social.title', data.social.title);
        setValue('social.links', data.social.links);
      });
  }, [setValue]);

  const onSubmit: SubmitHandler<ContactData> = async (data) => {
    await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    alert('Contact section updated successfully!');
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

      <div className="space-y-2 border p-4 rounded-md">
        <h3 className="text-lg font-medium">Form Placeholders</h3>
        <div className="space-y-2">
          <Label htmlFor="form.namePlaceholder">Name Placeholder</Label>
          <Input id="form.namePlaceholder" {...register('form.namePlaceholder')} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="form.emailPlaceholder">Email Placeholder</Label>
          <Input id="form.emailPlaceholder" {...register('form.emailPlaceholder')} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="form.messagePlaceholder">Message Placeholder</Label>
          <Input id="form.messagePlaceholder" {...register('form.messagePlaceholder')} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="form.submitButton">Submit Button Text</Label>
          <Input id="form.submitButton" {...register('form.submitButton')} />
        </div>
      </div>

      <div className="space-y-2 border p-4 rounded-md">
          <h3 className="text-lg font-medium">Social Links</h3>
          <div className="space-y-2">
            <Label htmlFor="social.title">Social Title</Label>
            <Input id="social.title" {...register('social.title')} />
          </div>
        {fields.map((field, index) => (
          <div key={field.id} className="flex items-center gap-2">
            <Input {...register(`social.links.${index}.name`)} placeholder="Name" />
            <Input {...register(`social.links.${index}.url`)} placeholder="URL" />
            <Button type="button" variant="destructive" size="icon" onClick={() => remove(index)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
        <Button type="button" size="sm" onClick={() => append({ name: '', url: '' })}>
          Add Social Link
        </Button>
      </div>

      <Button type="submit">Save</Button>
    </form>
  );
}
