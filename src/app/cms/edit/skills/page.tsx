
"use client";
import { useState, useEffect } from "react";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
// import { Label } from "../../../components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";

const fileName = "skill.json";

type Skill = {
  name: string;
  level: number;
};

type SkillCategory = {
  title: string;
  skills: Skill[];
};

type SkillsData = {
  skillCategories: SkillCategory[];
};

export default function EditSkillsPage() {
  const [skillsData, setSkillsData] = useState<SkillsData>({ skillCategories: [] });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(`/api/data?file=${fileName}`);
        const data = await response.json();
        setSkillsData(data);
      } catch (error) {
        console.error("Error fetching skills data:", error);
      }
      setIsLoading(false);
    }
    fetchData();
  }, []);

  const handleSave = async () => {
    try {
      await fetch(`/api/data?file=${fileName}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(skillsData),
      });
      alert("Skills section updated successfully!");
    } catch (error) {
      console.error("Error saving skills data:", error);
      alert("Failed to update skills section.");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, categoryIndex: number, skillIndex: number) => {
    const { name, value } = e.target;
    const updatedSkills = [...skillsData.skillCategories];
    if (name === "name") {
      updatedSkills[categoryIndex].skills[skillIndex].name = value;
    } else if (name === "level") {
      updatedSkills[categoryIndex].skills[skillIndex].level = Number(value);
    }
    setSkillsData({ ...skillsData, skillCategories: updatedSkills });
  };
  
  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-10">
      <Card>
        <CardHeader>
          <CardTitle>Edit Skills Section</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {skillsData.skillCategories && skillsData.skillCategories.map((category: SkillCategory, categoryIndex: number) => (
            <div key={categoryIndex} className="space-y-2">
              <h3 className="text-lg font-semibold">{category.title}</h3>
              {category.skills.map((skill: Skill, skillIndex: number) => (
                <div key={skillIndex} className="grid grid-cols-2 gap-4 items-center">
                  <Input name="name" value={skill.name} onChange={(e) => handleChange(e, categoryIndex, skillIndex)} />
                  <Input name="level" type="number" value={skill.level} onChange={(e) => handleChange(e, categoryIndex, skillIndex)} />
                </div>
              ))}
            </div>
          ))}
          <Button onClick={handleSave}>Save Changes</Button>
        </CardContent>
      </Card>
    </div>
  );
}
