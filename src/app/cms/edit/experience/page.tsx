
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

const fileName = "experience.json";

interface ExperienceItem {
  position: string;
  company: string;
  startDate: string;
  endDate: string;
  description: string;
} 

interface ExperienceData {
  title: string;
  work:{ title: string; experiences: ExperienceItem[];};
  
}

export default function EditExperiencePage() {
  const [experienceData, setExperienceData] = useState<ExperienceData>({ title: '', work: { title: '', experiences: [] } });
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
        setExperienceData(data);
      } catch (error) {
        console.error("Error fetching experience data:", error);
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
        body: JSON.stringify(experienceData),
      });
      if (!response.ok) throw new Error('Failed to save data');
      toast.success("Success!", { description: "Experience section updated." });
    } catch (error) {
      console.error("Error saving experience data:", error);
      toast.error("Error", { description: "Failed to save data." });
    } finally {
      setIsSaving(false);
    }
  };

  const handleMainTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setExperienceData(prev => ({ ...prev, title: e.target.value }));
  };

  const handleExperienceChange = (index: number, field: keyof ExperienceItem, value: string) => {
    const updatedExperiences = [...experienceData.work.experiences];
    updatedExperiences[index][field] = value;
    setExperienceData(prev => ({ ...prev, work: { ...prev.work, experiences: updatedExperiences } }));
  };

  const addExperience = () => {
    setExperienceData(prev => ({
      ...prev,
      work: {
        ...prev.work,
        experiences: [...prev.work.experiences, { position: '', company: '', startDate: '', endDate: '', description: '' }]
      }
    }));
  };

  const removeExperience = (index: number) => {
    const updatedExperiences = experienceData.work.experiences.filter((_, i) => i !== index);
    setExperienceData(prev => ({ ...prev, work: { ...prev.work, experiences: updatedExperiences } }));
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
            <CardTitle className="text-2xl font-bold">Edit Experience Section</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {isLoading ? (
              <div className="flex justify-center items-center h-48"><Loader2 className="h-8 w-8 animate-spin text-gray-500" /></div>
            ) : (
              <div className="space-y-8">
                 <div className="space-y-2">
                  <Label htmlFor="main-title" className="font-semibold text-gray-700">Section Title</Label>
                  <Input id="main-title" value={experienceData.title || ''} onChange={handleMainTitleChange} />
                </div>

                {experienceData.work.experiences.map((exp, index) => (
                  <div key={index} className="border p-4 rounded-lg relative bg-gray-50">
                     <Button variant="ghost" size="icon" className="absolute top-2 right-2 text-gray-500 hover:text-red-500" onClick={() => removeExperience(index)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="space-y-2">
                        <Label>Position</Label>
                        <Input value={exp.position} onChange={e => handleExperienceChange(index, 'position', e.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <Label>Company</Label>
                        <Input value={exp.company} onChange={e => handleExperienceChange(index, 'company', e.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <Label>Start Date</Label>
                        <Input value={exp.startDate} onChange={e => handleExperienceChange(index, 'startDate', e.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <Label>End Date</Label>
                        <Input value={exp.endDate} onChange={e => handleExperienceChange(index, 'endDate', e.target.value)} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Description</Label>
                      <Textarea value={exp.description} onChange={e => handleExperienceChange(index, 'description', e.target.value)} rows={3} />
                    </div>
                  </div>
                ))}

                <Button variant="outline" onClick={addExperience} className="mt-4 w-full">
                  <Plus className="mr-2 h-4 w-4" /> Add Experience
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
