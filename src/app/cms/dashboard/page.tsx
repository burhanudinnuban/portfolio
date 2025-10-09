
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import Link from "next/link";

const sections = [
  { name: "Hero", path: "/cms/edit/hero" },
  { name: "About", path: "/cms/edit/about" },
  { name: "Skills", path: "/cms/edit/skills" },
  { name: "Experience", path: "/cms/edit/experience" },
  { name: "Projects", path: "/cms/edit/projects" },
  { name: "Contact", path: "/cms/edit/contact" },
];

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-muted/30">
      <div className="container mx-auto px-4 py-10">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold">Content Management System</h1>
          <p className="text-lg text-muted-foreground">Welcome to your portfolios CMS. Select a section to edit.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sections.map((section) => (
            <Link href={section.path} key={section.name}>
              <Card className="hover:shadow-lg transition-shadow duration-200 cursor-pointer">
                <CardHeader>
                  <CardTitle>{section.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Edit the {section.name.toLowerCase()} section of your portfolio.</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
