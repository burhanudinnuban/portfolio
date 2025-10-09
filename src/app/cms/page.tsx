
"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from '../components/ui/button';
import { Home, User, Briefcase, Code, Mail, LogOut } from 'lucide-react';

export default function CMSDashboard() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/cms/login');
    }
  }, [router]);

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/cms/login');
  };

  const menuItems = [
    { path: '/cms/edit/hero', label: 'Hero Section', icon: Home, description: 'Edit the main title and description' },
    { path: '/cms/edit/about', label: 'About Section', icon: User, description: 'Update your bio and skills' },
    { path: '/cms/edit/experience', label: 'Experience', icon: Briefcase, description: 'Manage your work history' },
    { path: '/cms/edit/projects', label: 'Projects', icon: Code, description: 'Showcase your work' },
    { path: '/cms/edit/contact', label: 'Contact', icon: Mail, description: 'Update contact information' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <Card className="overflow-hidden shadow-lg border-0 rounded-2xl">
          <CardHeader className="bg-gray-800 text-white flex flex-row items-center justify-between p-6">
            <CardTitle className="text-2xl font-bold">CMS Dashboard</CardTitle>
            <Button variant="ghost" onClick={handleLogout} className="text-white hover:bg-gray-700">
              <LogOut className="mr-2 h-5 w-5" />
              Logout
            </Button>
          </CardHeader>
          <CardContent className="p-6">
            <p className="text-gray-600 mb-8 text-center">Welcome! Select a section to manage its content.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {menuItems.map((item) => (
                <div
                  key={item.path}
                  onClick={() => handleNavigation(item.path)}
                  className="group bg-white p-6 rounded-lg shadow-md hover:shadow-xl hover:scale-105 transition-transform duration-300 cursor-pointer border border-gray-200"
                >
                  <div className="flex items-center justify-center mb-4">
                     <item.icon className="h-12 w-12 text-gray-500 group-hover:text-blue-500 transition-colors" />
                  </div>
                  <h3 className="text-lg font-semibold text-center mb-1 text-gray-800">{item.label}</h3>
                  <p className="text-sm text-gray-500 text-center">{item.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
