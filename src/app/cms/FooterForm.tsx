
'use client';
import { useEffect, useState } from 'react';
import { useForm, SubmitHandler, useFieldArray } from 'react-hook-form';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Trash2 } from 'lucide-react';

interface SocialLink {
  icon: string;
  url: string;
}

interface QuickLink {
  href: string;
  label: string;
}

interface FooterData {
  logo: {
    initials: string;
    name: string;
  };
  description: string;
  socialLinks: SocialLink[];
  quickLinks: QuickLink[];
  contactInfo: {
    title: string;
    email: string;
    phone: string;
    location: string;
  };
  copyright: {
    builtWith: string;
    freelance: string;
  };
}

export function FooterForm() {
  const [footerData, setFooterData] = useState<FooterData | null>(null);
  const { register, handleSubmit, control, setValue } = useForm<FooterData>();
  const { fields: socialLinksFields, append: appendSocialLink, remove: removeSocialLink } = useFieldArray({
    control,
    name: 'socialLinks',
  });
  const { fields: quickLinksFields, append: appendQuickLink, remove: removeQuickLink } = useFieldArray({
    control,
    name: 'quickLinks',
  });

  useEffect(() => {
    fetch('/api/footer')
      .then((res) => res.json())
      .then((data) => {
        setFooterData(data);
        setValue('logo', data.logo);
        setValue('description', data.description);
        setValue('socialLinks', data.socialLinks);
        setValue('quickLinks', data.quickLinks);
        setValue('contactInfo', data.contactInfo);
        setValue('copyright', data.copyright);
      });
  }, [setValue]);

  const onSubmit: SubmitHandler<FooterData> = async (data) => {
    await fetch('/api/footer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    alert('Footer section updated successfully!');
  };

  if (!footerData) {
    return <div>Loading...</div>;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Logo */}
      <div className="space-y-2 border p-4 rounded-md">
        <Label>Logo</Label>
        <Input {...register('logo.initials')} placeholder="Initials" />
        <Input {...register('logo.name')} placeholder="Name" />
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label>Description</Label>
        <Input {...register('description')} />
      </div>

      {/* Social Links */}
      <div className="space-y-2 border p-4 rounded-md">
        <Label>Social Links</Label>
        {socialLinksFields.map((field, index) => (
          <div key={field.id} className="flex items-center gap-2">
            <Input {...register(`socialLinks.${index}.icon`)} placeholder="Icon (e.g., Github, Linkedin)" />
            <Input {...register(`socialLinks.${index}.url`)} placeholder="URL" />
            <Button type="button" variant="destructive" size="icon" onClick={() => removeSocialLink(index)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
        <Button type="button" onClick={() => appendSocialLink({ icon: '', url: '' })}>
          Add Social Link
        </Button>
      </div>

      {/* Quick Links */}
      <div className="space-y-2 border p-4 rounded-md">
        <Label>Quick Links</Label>
        {quickLinksFields.map((field, index) => (
          <div key={field.id} className="flex items-center gap-2">
            <Input {...register(`quickLinks.${index}.href`)} placeholder="Href (e.g., #about)" />
            <Input {...register(`quickLinks.${index}.label`)} placeholder="Label (e.g., About)" />
            <Button type="button" variant="destructive" size="icon" onClick={() => removeQuickLink(index)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
        <Button type="button" onClick={() => appendQuickLink({ href: '', label: '' })}>
          Add Quick Link
        </Button>
      </div>

      {/* Contact Info */}
      <div className="space-y-2 border p-4 rounded-md">
          <Label>Contact Info</Label>
          <Input {...register('contactInfo.title')} placeholder="Title" />
          <Input {...register('contactInfo.email')} placeholder="Email" />
          <Input {...register('contactInfo.phone')} placeholder="Phone" />
          <Input {...register('contactInfo.location')} placeholder="Location" />
      </div>

      {/* Copyright */}
      <div className="space-y-2 border p-4 rounded-md">
          <Label>Copyright</Label>
          <Input {...register('copyright.builtWith')} placeholder="Built With" />
          <Input {...register('copyright.freelance')} placeholder="Freelance" />
      </div>

      <Button type="submit">Save</Button>
    </form>
  );
}
