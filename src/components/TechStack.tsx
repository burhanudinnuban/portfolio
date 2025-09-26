import React from 'react';
import Image from 'next/image';

const technologies = [
  { name: 'Next.js', icon: '/icons/nextjs.svg' },
  { name: 'Flutter', icon: '/icons/flutter.svg' },
  { name: 'Vue.js', icon: '/icons/vue.svg' },
  { name: 'Tailwind CSS', icon: '/icons/tailwindcss.svg' },
  { name: 'JavaScript', icon: '/icons/javascript.svg' },
  { name: 'TypeScript', icon: '/icons/typescript.svg' },
  { name: 'Node.js', icon: '/icons/nodejs.svg' },
  { name: 'Laravel', icon: '/icons/laravel.svg' },
  { name: 'Spring Boot', icon: '/icons/springboot.svg' },
  { name: 'PHP', icon: '/icons/php.svg' },
  { name: 'Java', icon: '/icons/java.svg' },
  { name: 'PostgreSQL', icon: '/icons/postgresql.svg' },
  { name: 'MySQL', icon: '/icons/mysql.svg' },
  { name: 'MongoDB', icon: '/icons/mongodb.svg' },
];

const TechStack: React.FC = () => {
  return (
    <section className="py-20">
      <h2 className="text-3xl font-bold text-center mb-10">My Tech Stack</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-8 justify-center">
        {technologies.map((tech) => (
          <div key={tech.name} className="flex flex-col items-center">
            <Image src={tech.icon} alt={tech.name} width={64} height={64} />
            <p className="mt-2">{tech.name}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TechStack;
