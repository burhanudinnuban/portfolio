
"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Textarea } from "../../../components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { ArrowLeft, Loader2 } from 'lucide-react';
import { toast } from "sonner";

const fileName = "contact.json";

export default function EditContactPage() {
  const [contactData, setContactData] = useState({ title: '', description: '', email: '' });
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
        setContactData(data);
      } catch (error) {
        console.error("Error fetching contact data:", error);
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
        body: JSON.stringify(contactData),
      });
      if (!response.ok) throw new Error('Failed to save data');
      toast.success("Success!", { description: "Contact section updated." });
    } catch (error) {
      console.error("Error saving contact data:", error);
      toast.error("Error", { description: "Failed to save data." });
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setContactData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-2xl mx-auto">
        <Button variant="outline" onClick={() => router.push('/cms')} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>
        <Card className="shadow-lg border-0 rounded-2xl">
          <CardHeader className="bg-gray-800 text-white p-6 rounded-t-2xl">
            <CardTitle className="text-2xl font-bold">Edit Contact Section</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {isLoading ? (
              <div className="flex justify-center items-center h-48"><Loader2 className="h-8 w-8 animate-spin text-gray-500" /></div>
            ) : (
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title" className="font-semibold text-gray-700">Title</Label>
                  <Input id="title" name="title" value={contactData.title || ''} onChange={handleChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description" className="font-semibold text-gray-700">Description</Label>
                  <Textarea id="description" name="description" value={contactData.description || ''} onChange={handleChange} rows={4} />
                </div>
                 <div className="space-y-2">
                  <Label htmlFor="email" className="font-semibold text-gray-700">Email</Label>
                  <Input id="email" name="email" type="email" value={contactData.email || ''} onChange={handleChange} />
                </div>
                <Button onClick={handleSave} disabled={isSaving} className="w-full">
                  {isSaving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</> : 'Save Changes'}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
