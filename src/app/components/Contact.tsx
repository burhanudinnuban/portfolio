
'use client';
import { useEffect, useState } from 'react';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';

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

export function Contact() {
  const [contactData, setContactData] = useState<ContactData | null>(null);

  useEffect(() => {
    fetch('/api/contact')
      .then((res) => res.json())
      .then((data) => {
        setContactData(data);
      });
  }, []);

  if (!contactData) {
    return <div>Loading...</div>;
  }

  return (
    <section id="contact" className="py-12 md:py-24">
      <div className="container mx-auto">
        <div className="text-center">
          <Badge>{contactData.badge}</Badge>
          <h2 className="text-3xl font-bold mt-4">{contactData.title}</h2>
          <p className="text-muted-foreground mt-2">{contactData.description}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
          <div>
            <form>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input placeholder={contactData.form.namePlaceholder} />
                <Input type="email" placeholder={contactData.form.emailPlaceholder} />
              </div>
              <Textarea placeholder={contactData.form.messagePlaceholder} className="mt-4" />
              <Button type="submit" className="mt-4">{contactData.form.submitButton}</Button>
            </form>
          </div>
          <div className="text-center">
            <h3 className="text-xl font-bold">{contactData.social.title}</h3>
            <div className="flex justify-center gap-4 mt-4">
              {contactData.social.links.map((link, index) => (
                <a key={index} href={link.url} className="text-blue-500">{link.name}</a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
