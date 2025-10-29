import { Card } from "@/components/ui/card";
import { Code2, Smartphone, Zap, Shield, Layers, Rocket, Palette } from "lucide-react";

const Services = () => {
  const services = [
    {
      icon: Code2,
      title: "Web Development",
      description: "Custom web applications built with cutting-edge technologies for optimal performance and user experience.",
      features: ["React & Next.js", "Full-stack Solutions", "Responsive Design"],
    },
    {
      icon: Smartphone,
      title: "Mobile Development",
      description: "Native and cross-platform mobile apps that deliver seamless experiences on iOS and Android.",
      features: ["React Native", "iOS & Android", "App Store Deployment"],
    },
    {
      icon: Zap,
      title: "Rapid Prototyping",
      description: "Quick MVP development to validate your ideas and bring your vision to life in record time.",
      features: ["Fast Delivery", "Iterative Process", "Market Ready"],
    },
    {
      icon: Shield,
      title: "Quality Assurance",
      description: "Comprehensive testing and quality control to ensure your product is bug-free and production-ready.",
      features: ["Automated Testing", "Security Audits", "Performance Optimization"],
    },
    {
      icon: Layers,
      title: "Full-Stack Solutions",
      description: "Complete end-to-end development from backend infrastructure to polished frontend interfaces.",
      features: ["Database Design", "API Development", "Cloud Deployment"],
    },
    {
      icon: Rocket,
      title: "Deployment & Scaling",
      description: "Launch your product with confidence and scale seamlessly as your user base grows.",
      features: ["CI/CD Pipeline", "Cloud Infrastructure", "Performance Monitoring"],
    },
    {
      icon: Palette,
      title: "Graphic Design",
      description: "Eye-catching visual designs that capture your brand identity and engage your audience across all platforms.",
      features: ["Brand Identity & Logos", "UI/UX Design", "Marketing Materials"],
    },
  ];

  return (
    <section id="services" className="py-32 relative">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold">
            Our <span className="text-gradient">Services</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Comprehensive development solutions tailored to your needs
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <Card
                key={index}
                className="glass-card p-8 hover:border-primary/50 transition-all duration-300 group hover:scale-105"
              >
                <div className="space-y-4">
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <Icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold">{service.title}</h3>
                  <p className="text-muted-foreground">{service.description}</p>
                  <ul className="space-y-2 pt-4">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-sm text-foreground/80">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary mr-2"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Services;
