
"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Textarea } from "../../../components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { ArrowLeft, Loader2, Plus, Trash2 } from 'lucide-react';
import { toast } from "sonner";

const fileName = "project.json";

interface ProjectItem {
  title: string;
  description: string;
  image: string;
  liveLink: string;
  sourceLink: string;
}

interface ProjectData {
  title: string;
  projects: ProjectItem[];
}

export default function EditProjectsPage() {
  const [projectsData, setProjectsData] = useState<ProjectData>({ title: '', projects: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/data?file=${fileName}`);
        if (!response.ok) throw new Error('Failed to fetch data');
        const data = await response.json();
        setProjectsData(data);
      } catch (error) {
        console.error("Error fetching projects data:", error);
        toast.error("Error", { description: "Failed to load data." });
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const response = await fetch(`/api/data?file=${fileName}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(projectsData),
      });
      if (!response.ok) throw new Error('Failed to save data');
      toast.success("Success!", { description: "Projects section updated." });
    } catch (error) {
      console.error("Error saving projects data:", error);
      toast.error("Error", { description: "Failed to save data." });
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleMainTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProjectsData(prev => ({ ...prev, title: e.target.value }));
  };

  const handleProjectChange = (index: number, field: keyof ProjectItem, value: string) => {
    const updatedProjects = [...projectsData.projects];
    updatedProjects[index][field] = value;
    setProjectsData(prev => ({ ...prev, projects: updatedProjects }));
  };

  const addProject = () => {
    setProjectsData(prev => ({
      ...prev,
      projects: [...prev.projects, { title: '', description: '', image: '', liveLink: '', sourceLink: '' }]
    }));
  };

  const removeProject = (index: number) => {
    const updatedProjects = projectsData.projects.filter((_, i) => i !== index);
    setProjectsData(prev => ({ ...prev, projects: updatedProjects }));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <Button variant="outline" onClick={() => router.push('/cms')} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>
        <Card className="shadow-lg border-0 rounded-2xl">
          <CardHeader className="bg-gray-800 text-white p-6 rounded-t-2xl">
            <CardTitle className="text-2xl font-bold">Edit Projects Section</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {isLoading ? (
              <div className="flex justify-center items-center h-48"><Loader2 className="h-8 w-8 animate-spin text-gray-500" /></div>
            ) : (
              <div className="space-y-8">
                <div className="space-y-2">
                  <Label htmlFor="main-title" className="font-semibold text-gray-700">Section Title</Label>
                  <Input id="main-title" value={projectsData.title || ''} onChange={handleMainTitleChange} />
                </div>

                {projectsData.projects.map((proj, index) => (
                  <div key={index} className="border p-4 rounded-lg relative bg-gray-50">
                    <Button variant="ghost" size="icon" className="absolute top-2 right-2 text-gray-500 hover:text-red-500" onClick={() => removeProject(index)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Title</Label>
                        <Input value={proj.title} onChange={e => handleProjectChange(index, 'title', e.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <Label>Description</Label>
                        <Textarea value={proj.description} onChange={e => handleProjectChange(index, 'description', e.target.value)} rows={3} />
                      </div>
                       <div className="space-y-2">
                        <Label>Image URL</Label>
                        <Input value={proj.image} onChange={e => handleProjectChange(index, 'image', e.target.value)} />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Live Link</Label>
                          <Input value={proj.liveLink} onChange={e => handleProjectChange(index, 'liveLink', e.target.value)} />
                        </div>
                        <div className="space-y-2">
                          <Label>Source Link</Label>
                          <Input value={proj.sourceLink} onChange={e => handleProjectChange(index, 'sourceLink', e.target.value)} />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                <Button variant="outline" onClick={addProject} className="mt-4 w-full">
                  <Plus className="mr-2 h-4 w-4" /> Add Project
                </Button>

                <Button onClick={handleSave} disabled={isSaving} className="w-full mt-6">
                  {isSaving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</> : 'Save All Changes'}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
