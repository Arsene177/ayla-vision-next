import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink } from "lucide-react";

const Projects = () => {
  const projects = [
    {
      title: "E-Commerce Platform",
      description: "Full-featured online store with payment integration and inventory management",
      tags: ["React", "Node.js", "Stripe", "MongoDB"],
      status: "Deployed",
    },
    {
      title: "Healthcare Management System",
      description: "Patient management and appointment scheduling system for medical clinics",
      tags: ["React Native", "Firebase", "TypeScript"],
      status: "In Production",
    },
    {
      title: "Social Media Dashboard",
      description: "Analytics and management tool for multiple social media platforms",
      tags: ["Next.js", "PostgreSQL", "TailwindCSS"],
      status: "Deployed",
    },
    {
      title: "Real Estate Marketplace",
      description: "Property listing and search platform with virtual tours",
      tags: ["React", "Express", "AWS", "Three.js"],
      status: "Deployed",
    },
    {
      title: "Educational Learning App",
      description: "Interactive learning platform with gamification and progress tracking",
      tags: ["React Native", "Supabase", "Redux"],
      status: "In Production",
    },
    {
      title: "Fitness Tracking App",
      description: "Personal fitness tracker with workout plans and nutrition guidance",
      tags: ["Flutter", "Node.js", "MongoDB"],
      status: "Deployed",
    },
  ];

  return (
    <section id="projects" className="py-32 bg-muted/30">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold">
            Featured <span className="text-gradient">Projects</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Showcasing our expertise through successful client projects
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <Card
              key={index}
              className="glass-card p-6 hover:border-primary/50 transition-all duration-300 group hover:scale-105 cursor-pointer"
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <h3 className="text-xl font-bold group-hover:text-primary transition-colors">
                    {project.title}
                  </h3>
                  <ExternalLink className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                <p className="text-muted-foreground text-sm">{project.description}</p>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag, idx) => (
                    <Badge
                      key={idx}
                      variant="secondary"
                      className="bg-primary/10 text-primary border-primary/20"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
                <div className="pt-2">
                  <Badge className="bg-secondary/20 text-secondary border-secondary/20">
                    {project.status}
                  </Badge>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-muted-foreground">
            And 3 more exciting projects in development...
          </p>
        </div>
      </div>
    </section>
  );
};

export default Projects;
