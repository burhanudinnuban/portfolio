'use client';
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Mail, Phone, MapPin, Send, LucideIcon } from "lucide-react";
import openInNewTab from "../utils/openInNewTab";
import contactData from "../data/contact.json";
import { useState } from "react";
import { Textarea } from "./ui/textarea";

const iconMap: { [key: string]: LucideIcon } = {
  Mail,
  Phone,
  MapPin,
};

export function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    openInNewTab(`mailto:${contactData.contactInfo.items.find(item => item.icon === 'Mail')?.value}?subject=${formData.subject}&body=${formData.message}`);
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <section id="contact" className="py-20 bg-muted/30 dark:bg-zinc-950/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4">{contactData.badge}</Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            {contactData.title}
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {contactData.description}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-semibold mb-6">{contactData.contactInfo.title}</h3>
              <div className="space-y-4">
                {contactData.contactInfo.items.map((item, index) => {
                  const Icon = iconMap[item.icon];
                  return (
                  <div key={index} className="flex items-center space-x-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                     {Icon && <Icon className="h-5 w-5 text-primary" />}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-gray-100">
                        {item.label}
                      </p>
                      <a
                        href={item.href}
                        className="text-muted-foreground hover:text-primary transition-colors"
                      >
                        {item.value}
                      </a>
                    </div>
                  </div>
                )})}
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-semibold mb-4">{contactData.whyWorkWithMe.title}</h3>
              <div className="space-y-3 text-muted-foreground">
                {contactData.whyWorkWithMe.points.map((point, index) => (
                  <p key={index}>✓ {point}</p>
                ))}
              </div>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>{contactData.form.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">{contactData.form.name}</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder={contactData.form.namePlaceholder}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">{contactData.form.email}</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder={contactData.form.emailPlaceholder}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject">{contactData.form.subject}</Label>
                  <Input
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    placeholder={contactData.form.subjectPlaceholder}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">{contactData.form.message}</Label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder={contactData.form.messagePlaceholder}
                    rows={6}
                    required
                  />
                </div>

                <Button type="submit" className="w-full" size="lg">
                  <Send className="mr-2 h-4 w-4" />
                  {contactData.form.submitButton}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
