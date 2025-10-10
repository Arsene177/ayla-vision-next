import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GraduationCap, Users, Lightbulb, Award, ArrowRight } from "lucide-react";

const Campus = () => {
  const stats = [
    { icon: Users, label: "Students Mentored", value: "50+" },
    { icon: Award, label: "Projects Completed", value: "9+" },
    { icon: Lightbulb, label: "Success Rate", value: "70%" },
  ];

  const benefits = [
    {
      title: "Guided Development",
      description: "Work with experienced mentors who guide you through the entire development process",
    },
    {
      title: "Real-World Projects",
      description: "Build actual products that solve real problems and look great in your portfolio",
    },
    {
      title: "Defense Preparation",
      description: "Get expert assistance in preparing and presenting your project for academic defense",
    },
    {
      title: "Industry Standards",
      description: "Learn professional development practices and industry-standard technologies",
    },
  ];

  return (
    <section id="campus" className="py-32 relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 right-0 w-96 h-96 bg-secondary/10 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16 space-y-4">
          <div className="flex items-center justify-center mb-6">
            <GraduationCap className="w-16 h-16 text-secondary animate-float" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold">
            AYLIA <span className="text-gradient">Campus</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Empowering students to bring their dream projects to life
          </p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-8 mb-16 max-w-4xl mx-auto">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="glass-card p-8 text-center">
                <Icon className="w-10 h-10 text-secondary mx-auto mb-4" />
                <div className="text-4xl font-bold text-gradient mb-2">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </Card>
            );
          })}
        </div>

        {/* Benefits */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {benefits.map((benefit, index) => (
            <Card key={index} className="glass-card p-6 hover:border-secondary/50 transition-all duration-300">
              <h3 className="text-xl font-bold mb-2">{benefit.title}</h3>
              <p className="text-muted-foreground">{benefit.description}</p>
            </Card>
          ))}
        </div>

        {/* CTA */}
        <Card className="glass-card p-8 md:p-12 text-center max-w-3xl mx-auto border-secondary/30">
          <h3 className="text-3xl font-bold mb-4">
            Ready to Build Your Dream Project?
          </h3>
          <p className="text-muted-foreground mb-8 text-lg">
            Join AYLIA Campus and turn your academic project into a professional-grade application
          </p>
          <Button
            size="lg"
            onClick={() => {
              const element = document.getElementById("contact");
              if (element) element.scrollIntoView({ behavior: "smooth" });
            }}
            className="bg-secondary text-secondary-foreground hover:bg-secondary/90 glow-purple group"
          >
            Get Started with Campus
            <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </Card>
      </div>
    </section>
  );
};

export default Campus;
