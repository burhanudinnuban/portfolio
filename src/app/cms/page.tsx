'use client';

import { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import app from '../utils/firebase';
import { useRouter } from 'next/navigation';
import { HeroForm } from './HeroForm';
import { SkillsForm } from './SkillsForm';
import { ExperienceForm } from './ExperienceForm';
import { ProjectsForm } from './ProjectsForm';
import { ContactForm } from './ContactForm';
import { FooterForm } from './FooterForm';
import { TestimonialsForm } from './TestimonialsForm';

export default function CmsPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const auth = getAuth(app);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser && currentUser.email === 'burhanudinnuban@gmail.com') {
        setUser(currentUser);
      } else {
        router.push('/');
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [auth, router]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return null; // or a login prompt
  }

  return (
    <div className="container mx-auto px-4 py-24">
      <h1 className="text-4xl font-bold">CMS</h1>
      <p className="text-muted-foreground">Welcome to the Content Management System.</p>
      
      <div className="mt-8 space-y-8">
        <div>
          <h2 className="text-2xl font-semibold">Hero Section</h2>
          <HeroForm />
        </div>
        <div>
          <h2 className="text-2xl font-semibold">Skills Section</h2>
          <SkillsForm />
        </div>
        <div>
          <h2 className="text-2xl font-semibold">Experience Section</h2>
          <ExperienceForm />
        </div>
        <div>
          <h2 className="text-2xl font-semibold">Projects Section</h2>
          <ProjectsForm />
        </div>
        <div>
          <h2 className="text-2xl font-semibold">Testimonials Section</h2>
          <TestimonialsForm />
        </div>
        <div>
          <h2 className="text-2xl font-semibold">Contact Section</h2>
          <ContactForm />
        </div>
        <div>
          <h2 className="text-2xl font-semibold">Footer Section</h2>
          <FooterForm />
        </div>
      </div>
    </div>
  );
}
