
'use client';
import { useEffect, useState } from 'react';
import { useForm, SubmitHandler, useFieldArray } from 'react-hook-form';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Trash2 } from 'lucide-react';

interface NavItem {
  href: string;
  label: string;
}

interface HeaderData {
  logo: {
    initials: string;
    name: string;
  };
  navItems: NavItem[];
}

export function HeaderForm() {
  const [headerData, setHeaderData] = useState<HeaderData | null>(null);
  const { register, handleSubmit, control, setValue } = useForm<HeaderData>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'navItems',
  });

  useEffect(() => {
    fetch('/api/header')
      .then((res) => res.json())
      .then((data) => {
        setHeaderData(data);
        setValue('logo', data.logo);
        setValue('navItems', data.navItems);
      });
  }, [setValue]);

  const onSubmit: SubmitHandler<HeaderData> = async (data) => {
    await fetch('/api/header', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    alert('Header section updated successfully!');
  };

  if (!headerData) {
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

      {/* Nav Items */}
      <div className="space-y-2 border p-4 rounded-md">
        <Label>Nav Items</Label>
        {fields.map((field, index) => (
          <div key={field.id} className="flex items-center gap-2">
            <Input {...register(`navItems.${index}.href`)} placeholder="Href (e.g., #about)" />
            <Input {...register(`navItems.${index}.label`)} placeholder="Label (e.g., About)" />
            <Button type="button" variant="destructive" size="icon" onClick={() => remove(index)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
        <Button type="button" onClick={() => append({ href: '', label: '' })}>
          Add Nav Item
        </Button>
      </div>

      <Button type="submit">Save</Button>
    </form>
  );
}
