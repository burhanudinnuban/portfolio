
'use client';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';

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

export function Testimonials() {
  const [testimonialsData, setTestimonialsData] = useState<TestimonialsData | null>(null);

  useEffect(() => {
    fetch('/api/testimonials')
      .then((res) => res.json())
      .then((data) => {
        setTestimonialsData(data);
      });
  }, []);

  if (!testimonialsData) {
    return <div>Loading...</div>;
  }

  return (
    <section id="testimonials" className="py-12 md:py-24">
      <div className="container mx-auto">
        <div className="text-center">
          <Badge>{testimonialsData.badge}</Badge>
          <h2 className="text-3xl font-bold mt-4">{testimonialsData.title}</h2>
          <p className="text-muted-foreground mt-2">{testimonialsData.description}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
          {testimonialsData.testimonials.map((testimonial, index) => (
            <Card key={index}>
              <CardHeader className='flex flex-row gap-4 items-center'>
                <img src={testimonial.avatar} alt={testimonial.author} className='w-12 h-12 rounded-full' />
                <div className='flex flex-col'>
                    <CardTitle>{testimonial.author}</CardTitle>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </CardHeader>
              <CardContent>
                <p>"{testimonial.quote}"</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
