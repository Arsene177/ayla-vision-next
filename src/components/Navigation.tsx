import { Button } from "@/components/ui/button";
import { Menu, X, Shield } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";

const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (session?.user) {
      checkAdminRole();
    } else {
      setIsAdmin(false);
    }
  }, [session]);

  const checkAdminRole = async () => {
    try {
      const { data } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", session?.user?.id)
        .eq("role", "admin")
        .maybeSingle();

      setIsAdmin(!!data);
    } catch (error) {
      console.error("Error checking admin role:", error);
      setIsAdmin(false);
    }
  };

  const scrollToSection = (id: string) => {
    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    } else {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
    setIsOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-border/30">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 
            className="text-2xl font-bold text-gradient cursor-default select-none"
            onDoubleClick={() => navigate("/auth")}
            title="AYLIA"
          >
            AYLIA
          </h1>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <button
              onClick={() => scrollToSection("services")}
              className="text-foreground/80 hover:text-foreground transition-colors"
            >
              Services
            </button>
            <button
              onClick={() => scrollToSection("projects")}
              className="text-foreground/80 hover:text-foreground transition-colors"
            >
              Projects
            </button>
            <button
              onClick={() => scrollToSection("campus")}
              className="text-foreground/80 hover:text-foreground transition-colors"
            >
              Campus
            </button>
            <button
              onClick={() => scrollToSection("contact")}
              className="text-foreground/80 hover:text-foreground transition-colors"
            >
              Contact
            </button>
            {isAdmin && (
              <Button
                onClick={() => navigate("/admin")}
                variant="outline"
                className="gap-2 glow-purple"
              >
                <Shield className="w-4 h-4" />
                Admin
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-foreground"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden mt-4 space-y-4 animate-slide-in">
            <button
              onClick={() => scrollToSection("services")}
              className="block w-full text-left text-foreground/80 hover:text-foreground transition-colors py-2"
            >
              Services
            </button>
            <button
              onClick={() => scrollToSection("projects")}
              className="block w-full text-left text-foreground/80 hover:text-foreground transition-colors py-2"
            >
              Projects
            </button>
            <button
              onClick={() => scrollToSection("campus")}
              className="block w-full text-left text-foreground/80 hover:text-foreground transition-colors py-2"
            >
              Campus
            </button>
            <button
              onClick={() => scrollToSection("contact")}
              className="block w-full text-left text-foreground/80 hover:text-foreground transition-colors py-2"
            >
              Contact
            </button>
            {isAdmin && (
              <Button
                onClick={() => {
                  navigate("/admin");
                  setIsOpen(false);
                }}
                variant="outline"
                className="w-full gap-2"
              >
                <Shield className="w-4 h-4" />
                Admin Panel
              </Button>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
