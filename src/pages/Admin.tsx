import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { LogOut, Mail, Phone, MessageSquare, Trash2, CheckCircle, UserPlus, FolderKanban, Edit, Plus } from "lucide-react";
import { Session } from "@supabase/supabase-js";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  status: string;
  created_at: string;
}

interface FeaturedProject {
  id: string;
  title: string;
  description: string;
  tags: string[];
  status: string;
  display_order: number;
}

const Admin = () => {
  const navigate = useNavigate();
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [newAdminEmail, setNewAdminEmail] = useState("");
  const [newAdminPassword, setNewAdminPassword] = useState("");
  const [isCreatingAdmin, setIsCreatingAdmin] = useState(false);
  const [projects, setProjects] = useState<FeaturedProject[]>([]);
  const [editingProject, setEditingProject] = useState<FeaturedProject | null>(null);
  const [isAddingProject, setIsAddingProject] = useState(false);
  const [projectForm, setProjectForm] = useState({
    title: "",
    description: "",
    tags: "",
    status: "",
    display_order: 0,
  });

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
    } else if (session === null && !loading) {
      navigate("/auth");
    }
  }, [session, navigate, loading]);

  const checkAdminRole = async () => {
    try {
      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", session?.user?.id)
        .eq("role", "admin")
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setIsAdmin(true);
        fetchMessages();
        fetchProjects();
      } else {
        toast.error("You don't have admin access");
        navigate("/");
      }
    } catch (error) {
      console.error("Error checking admin role:", error);
      toast.error("Failed to verify admin access");
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase
        .from("contact_messages")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error("Error fetching messages:", error);
      toast.error("Failed to load messages");
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const updateMessageStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase
        .from("contact_messages")
        .update({ status })
        .eq("id", id);

      if (error) throw error;
      toast.success("Status updated");
      fetchMessages();
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status");
    }
  };

  const deleteMessage = async (id: string) => {
    try {
      const { error } = await supabase
        .from("contact_messages")
        .delete()
        .eq("id", id);

      if (error) throw error;
      toast.success("Message deleted");
      fetchMessages();
    } catch (error) {
      console.error("Error deleting message:", error);
      toast.error("Failed to delete message");
    }
  };

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase
        .from("featured_projects")
        .select("*")
        .order("display_order", { ascending: true });

      if (error) throw error;
      setProjects(data || []);
    } catch (error) {
      console.error("Error fetching projects:", error);
      toast.error("Failed to load projects");
    }
  };

  const handleProjectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const projectData = {
        title: projectForm.title,
        description: projectForm.description,
        tags: projectForm.tags.split(",").map((tag) => tag.trim()),
        status: projectForm.status,
        display_order: projectForm.display_order,
      };

      if (editingProject) {
        const { error } = await supabase
          .from("featured_projects")
          .update(projectData)
          .eq("id", editingProject.id);

        if (error) throw error;
        toast.success("Project updated successfully");
      } else {
        const { error } = await supabase
          .from("featured_projects")
          .insert(projectData);

        if (error) throw error;
        toast.success("Project added successfully");
      }

      setProjectForm({ title: "", description: "", tags: "", status: "", display_order: 0 });
      setEditingProject(null);
      setIsAddingProject(false);
      fetchProjects();
    } catch (error: any) {
      console.error("Error saving project:", error);
      toast.error(error.message || "Failed to save project");
    }
  };

  const handleEditProject = (project: FeaturedProject) => {
    setEditingProject(project);
    setProjectForm({
      title: project.title,
      description: project.description,
      tags: project.tags.join(", "),
      status: project.status,
      display_order: project.display_order,
    });
    setIsAddingProject(true);
  };

  const handleDeleteProject = async (id: string) => {
    try {
      const { error } = await supabase
        .from("featured_projects")
        .delete()
        .eq("id", id);

      if (error) throw error;
      toast.success("Project deleted successfully");
      fetchProjects();
    } catch (error: any) {
      console.error("Error deleting project:", error);
      toast.error(error.message || "Failed to delete project");
    }
  };

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreatingAdmin(true);

    try {
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: newAdminEmail,
        password: newAdminPassword,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
        },
      });

      if (signUpError) throw signUpError;

      if (signUpData.user) {
        const { error: roleError } = await supabase
          .from("user_roles")
          .insert({
            user_id: signUpData.user.id,
            role: "admin",
          });

        if (roleError) throw roleError;

        toast.success("New admin created successfully");
        setNewAdminEmail("");
        setNewAdminPassword("");
      }
    } catch (error: any) {
      console.error("Error creating admin:", error);
      toast.error(error.message || "Failed to create admin");
    } finally {
      setIsCreatingAdmin(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-xl">Loading...</div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background/95 to-muted/30">
      <div className="container mx-auto px-6 py-12">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">
              Admin <span className="text-gradient">Dashboard</span>
            </h1>
            <p className="text-muted-foreground">Manage contact messages and site activities</p>
          </div>
          <Button onClick={handleSignOut} variant="outline" className="gap-2">
            <LogOut className="w-4 h-4" />
            Sign Out
          </Button>
        </div>

        <div className="grid gap-6">
          <Card className="glass-card p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <FolderKanban className="w-6 h-6 text-primary" />
                Featured Projects ({projects.length})
              </h2>
              <Button
                onClick={() => {
                  setIsAddingProject(!isAddingProject);
                  setEditingProject(null);
                  setProjectForm({ title: "", description: "", tags: "", status: "", display_order: 0 });
                }}
                className="gap-2"
              >
                <Plus className="w-4 h-4" />
                {isAddingProject ? "Cancel" : "Add Project"}
              </Button>
            </div>

            {isAddingProject && (
              <form onSubmit={handleProjectSubmit} className="space-y-4 mb-6 p-4 border rounded-lg bg-muted/30">
                <h3 className="text-lg font-semibold">
                  {editingProject ? "Edit Project" : "Add New Project"}
                </h3>
                <div>
                  <Label htmlFor="projectTitle">Title</Label>
                  <Input
                    id="projectTitle"
                    value={projectForm.title}
                    onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                    required
                    placeholder="E-Commerce Platform"
                  />
                </div>
                <div>
                  <Label htmlFor="projectDescription">Description</Label>
                  <Textarea
                    id="projectDescription"
                    value={projectForm.description}
                    onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                    required
                    placeholder="Full-featured online store..."
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="projectTags">Tags (comma-separated)</Label>
                  <Input
                    id="projectTags"
                    value={projectForm.tags}
                    onChange={(e) => setProjectForm({ ...projectForm, tags: e.target.value })}
                    required
                    placeholder="React, Node.js, MongoDB"
                  />
                </div>
                <div>
                  <Label htmlFor="projectStatus">Status</Label>
                  <Input
                    id="projectStatus"
                    value={projectForm.status}
                    onChange={(e) => setProjectForm({ ...projectForm, status: e.target.value })}
                    required
                    placeholder="Deployed"
                  />
                </div>
                <div>
                  <Label htmlFor="projectOrder">Display Order</Label>
                  <Input
                    id="projectOrder"
                    type="number"
                    value={projectForm.display_order}
                    onChange={(e) => setProjectForm({ ...projectForm, display_order: parseInt(e.target.value) })}
                    required
                    placeholder="0"
                  />
                </div>
                <Button type="submit" className="gap-2">
                  {editingProject ? "Update Project" : "Add Project"}
                </Button>
              </form>
            )}

            {projects.length === 0 ? (
              <p className="text-center text-muted-foreground py-12">No projects yet</p>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {projects.map((project) => (
                  <Card key={project.id} className="p-4 border-border/50">
                    <div className="space-y-3">
                      <div className="flex justify-between items-start">
                        <h3 className="text-lg font-semibold">{project.title}</h3>
                        <Badge>{project.status}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{project.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {project.tags.map((tag, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex gap-2 pt-2">
                        <Button
                          size="sm"
                          onClick={() => handleEditProject(project)}
                          variant="outline"
                          className="gap-2"
                        >
                          <Edit className="w-4 h-4" />
                          Edit
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button size="sm" variant="destructive" className="gap-2">
                              <Trash2 className="w-4 h-4" />
                              Delete
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Project</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete this project? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDeleteProject(project.id)}>
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </Card>

          <Card className="glass-card p-6">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <UserPlus className="w-6 h-6 text-primary" />
              Add New Admin
            </h2>
            <form onSubmit={handleCreateAdmin} className="space-y-4 max-w-md">
              <div>
                <Label htmlFor="adminEmail">Email</Label>
                <Input
                  id="adminEmail"
                  type="email"
                  value={newAdminEmail}
                  onChange={(e) => setNewAdminEmail(e.target.value)}
                  required
                  placeholder="admin@example.com"
                />
              </div>
              <div>
                <Label htmlFor="adminPassword">Password</Label>
                <Input
                  id="adminPassword"
                  type="password"
                  value={newAdminPassword}
                  onChange={(e) => setNewAdminPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  minLength={6}
                />
              </div>
              <Button type="submit" disabled={isCreatingAdmin} className="gap-2">
                <UserPlus className="w-4 h-4" />
                {isCreatingAdmin ? "Creating..." : "Create Admin"}
              </Button>
            </form>
          </Card>

          <Card className="glass-card p-6">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <MessageSquare className="w-6 h-6 text-primary" />
              Contact Messages ({messages.length})
            </h2>

            {messages.length === 0 ? (
              <p className="text-center text-muted-foreground py-12">No messages yet</p>
            ) : (
              <div className="space-y-4">
                {messages.map((message) => (
                  <Card key={message.id} className="p-6 border-border/50">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-semibold">{message.name}</h3>
                        <div className="flex flex-wrap gap-3 mt-2 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Mail className="w-4 h-4" />
                            {message.email}
                          </span>
                          {message.phone && (
                            <span className="flex items-center gap-1">
                              <Phone className="w-4 h-4" />
                              {message.phone}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={message.status === "new" ? "default" : "secondary"}>
                          {message.status}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {new Date(message.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <p className="text-muted-foreground mb-4 whitespace-pre-wrap">
                      {message.message}
                    </p>

                    <div className="flex gap-2">
                      {message.status === "new" && (
                        <Button
                          size="sm"
                          onClick={() => updateMessageStatus(message.id, "read")}
                          variant="outline"
                          className="gap-2"
                        >
                          <CheckCircle className="w-4 h-4" />
                          Mark as Read
                        </Button>
                      )}
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button size="sm" variant="destructive" className="gap-2">
                            <Trash2 className="w-4 h-4" />
                            Delete
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Message</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete this message? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => deleteMessage(message.id)}>
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Admin;
