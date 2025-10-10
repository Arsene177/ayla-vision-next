import { Code2 } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-border/30 py-12">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <Code2 className="w-6 h-6 text-primary" />
            <span className="text-xl font-bold text-gradient">AYLIA</span>
          </div>
          
          <div className="text-center md:text-left">
            <p className="text-muted-foreground">
              © {new Date().getFullYear()} AYLIA. Building the future, one project at a time.
            </p>
          </div>

          <div className="flex items-center gap-6">
            <a
              href="#services"
              className="text-muted-foreground hover:text-foreground transition-colors text-sm"
            >
              Services
            </a>
            <a
              href="#projects"
              className="text-muted-foreground hover:text-foreground transition-colors text-sm"
            >
              Projects
            </a>
            <a
              href="#campus"
              className="text-muted-foreground hover:text-foreground transition-colors text-sm"
            >
              Campus
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
