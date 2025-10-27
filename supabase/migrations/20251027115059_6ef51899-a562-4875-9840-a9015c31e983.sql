-- Create the update_updated_at_column function if it doesn't exist
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create featured_projects table
CREATE TABLE public.featured_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  tags TEXT[] NOT NULL DEFAULT '{}',
  status TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.featured_projects ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Anyone can view featured projects"
  ON public.featured_projects
  FOR SELECT
  USING (true);

CREATE POLICY "Admins can insert featured projects"
  ON public.featured_projects
  FOR INSERT
  WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update featured projects"
  ON public.featured_projects
  FOR UPDATE
  USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete featured projects"
  ON public.featured_projects
  FOR DELETE
  USING (has_role(auth.uid(), 'admin'));

-- Add trigger for updated_at
CREATE TRIGGER update_featured_projects_updated_at
  BEFORE UPDATE ON public.featured_projects
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert initial data
INSERT INTO public.featured_projects (title, description, tags, status, display_order) VALUES
  ('E-Commerce Platform', 'Full-featured online store with payment integration and inventory management', ARRAY['React', 'Node.js', 'Stripe', 'MongoDB'], 'Deployed', 1),
  ('Healthcare Management System', 'Patient management and appointment scheduling system for medical clinics', ARRAY['React Native', 'Firebase', 'TypeScript'], 'In Production', 2),
  ('Social Media Dashboard', 'Analytics and management tool for multiple social media platforms', ARRAY['Next.js', 'PostgreSQL', 'TailwindCSS'], 'Deployed', 3),
  ('Real Estate Marketplace', 'Property listing and search platform with virtual tours', ARRAY['React', 'Express', 'AWS', 'Three.js'], 'Deployed', 4),
  ('Educational Learning App', 'Interactive learning platform with gamification and progress tracking', ARRAY['React Native', 'Supabase', 'Redux'], 'In Production', 5),
  ('Fitness Tracking App', 'Personal fitness tracker with workout plans and nutrition guidance', ARRAY['Flutter', 'Node.js', 'MongoDB'], 'Deployed', 6);