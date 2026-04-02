
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

const fileName = "skill.json";

interface Skill {
  name: string;
  level: number;
}

interface SkillCategory {
  title: string;
  skills: Skill[];
}

interface SkillsData {
  badge: string;
  title: string;
  description: string;
  skillCategories: SkillCategory[];
  technologies: string[];
}

export default function EditSkillsPage() {
  const [skillsData, setSkillsData] = useState<SkillsData>({ badge: '', title: '', description: '', skillCategories: [], technologies: [] });
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
        setSkillsData(data);
      } catch (error) {
        console.error("Error fetching skills data:", error);
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
        body: JSON.stringify(skillsData, null, 2),
      });
      if (!response.ok) throw new Error('Failed to save data');
      toast.success("Success!", { description: "Skills section updated." });
    } catch (error) {
      console.error("Error saving skills data:", error);
      toast.error("Error", { description: "Failed to save data." });
    } finally {
      setIsSaving(false);
    }
  };

  const handleMainChange = (field: keyof SkillsData, value: string) => {
    setSkillsData(prev => ({ ...prev, [field]: value }));
  };

  const handleCategoryChange = (catIndex: number, value: string) => {
    const updatedCategories = [...skillsData.skillCategories];
    updatedCategories[catIndex].title = value;
    setSkillsData(prev => ({ ...prev, skillCategories: updatedCategories }));
  };

  const handleSkillChange = (catIndex: number, skillIndex: number, field: keyof Skill, value: string | number) => {
    const updatedCategories = [...skillsData.skillCategories];
    (updatedCategories[catIndex].skills[skillIndex] as any)[field] = value;
    setSkillsData(prev => ({ ...prev, skillCategories: updatedCategories }));
  };

  const addCategory = () => {
    setSkillsData(prev => ({
      ...prev,
      skillCategories: [...prev.skillCategories, { title: '', skills: [] }]
    }));
  };

  const removeCategory = (catIndex: number) => {
    const updatedCategories = skillsData.skillCategories.filter((_, i) => i !== catIndex);
    setSkillsData(prev => ({ ...prev, skillCategories: updatedCategories }));
  };

  const addSkill = (catIndex: number) => {
    const updatedCategories = [...skillsData.skillCategories];
    updatedCategories[catIndex].skills.push({ name: '', level: 0 });
    setSkillsData(prev => ({ ...prev, skillCategories: updatedCategories }));
  };

  const removeSkill = (catIndex: number, skillIndex: number) => {
    const updatedSkills = skillsData.skillCategories[catIndex].skills.filter((_, i) => i !== skillIndex);
    const updatedCategories = [...skillsData.skillCategories];
    updatedCategories[catIndex].skills = updatedSkills;
    setSkillsData(prev => ({ ...prev, skillCategories: updatedCategories }));
  };
  
  const handleTechChange = (index: number, value: string) => {
    const updatedTech = [...skillsData.technologies];
    updatedTech[index] = value;
    setSkillsData(prev => ({...prev, technologies: updatedTech}));
  }
  
  const addTechnology = () => {
    setSkillsData(prev => ({...prev, technologies: [...prev.technologies, '']}))
  }

  const removeTechnology = (index: number) => {
    const updatedTech = skillsData.technologies.filter((_, i) => i !== index);
    setSkillsData(prev => ({...prev, technologies: updatedTech}));
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <Button variant="outline" onClick={() => router.push('/cms')} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>
        <Card className="shadow-lg border-0 rounded-2xl">
          <CardHeader className="bg-gray-800 text-white p-6 rounded-t-2xl">
            <CardTitle className="text-2xl font-bold">Edit Skills Section</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {isLoading ? (
              <div className="flex justify-center items-center h-48"><Loader2 className="h-8 w-8 animate-spin text-gray-500" /></div>
            ) : (
              <div className="space-y-8">
                <div className="space-y-2">
                  <Label className="font-semibold text-gray-700">Badge</Label>
                  <Input value={skillsData.badge || ''} onChange={e => handleMainChange('badge', e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label className="font-semibold text-gray-700">Title</Label>
                  <Input value={skillsData.title || ''} onChange={e => handleMainChange('title', e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label className="font-semibold text-gray-700">Description</Label>
                  <Textarea value={skillsData.description || ''} onChange={e => handleMainChange('description', e.target.value)} rows={3} />
                </div>

                <div className="space-y-6">
                  <h3 className="text-xl font-bold text-gray-800 border-b pb-2">Skill Categories</h3>
                  {skillsData.skillCategories.map((cat, catIndex) => (
                    <div key={catIndex} className="border p-4 rounded-lg bg-gray-50 relative">
                       <Button variant="ghost" size="icon" className="absolute top-2 right-2 text-gray-500 hover:text-red-500" onClick={() => removeCategory(catIndex)}>
                         <Trash2 className="h-4 w-4" />
                       </Button>
                      <div className="space-y-2 mb-4">
                        <Label>Category Title</Label>
                        <Input value={cat.title} onChange={e => handleCategoryChange(catIndex, e.target.value)} />
                      </div>
                      
                      <h4 className="font-semibold text-gray-700 mb-2">Skills</h4>
                      <div className="space-y-4">
                        {cat.skills.map((skill, skillIndex) => (
                          <div key={skillIndex} className="flex items-center gap-4 p-2 rounded-md bg-white border">
                            <Input placeholder="Skill Name" value={skill.name} onChange={e => handleSkillChange(catIndex, skillIndex, 'name', e.target.value)} className="flex-grow"/>
                            <Input type="number" placeholder="Level" value={skill.level} onChange={e => handleSkillChange(catIndex, skillIndex, 'level', parseInt(e.target.value) || 0)} className="w-24" />
                            <Button variant="ghost" size="icon" onClick={() => removeSkill(catIndex, skillIndex)} className="text-gray-500 hover:text-red-500">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                      <Button variant="outline" size="sm" onClick={() => addSkill(catIndex)} className="mt-4">
                        <Plus className="mr-2 h-4 w-4" /> Add Skill
                      </Button>
                    </div>
                  ))}
                   <Button variant="outline" onClick={addCategory} className="mt-4 w-full">
                     <Plus className="mr-2 h-4 w-4" /> Add Category
                   </Button>
                </div>
                
                <div className="space-y-6">
                    <h3 className="text-xl font-bold text-gray-800 border-b pb-2">Technologies</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {skillsData.technologies.map((tech, index) => (
                             <div key={index} className="flex items-center gap-2">
                                <Input value={tech} onChange={(e) => handleTechChange(index, e.target.value)}/>
                                <Button variant="ghost" size="icon" onClick={() => removeTechnology(index)} className="text-gray-500 hover:text-red-500">
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                             </div>
                        ))}
                    </div>
                     <Button variant="outline" onClick={addTechnology} className="mt-4 w-full">
                       <Plus className="mr-2 h-4 w-4" /> Add Technology
                     </Button>
                </div>

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
