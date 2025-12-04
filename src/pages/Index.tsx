import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { CreatePostModal } from "@/components/CreatePostModal";
import { PostsFeed } from "@/components/PostsFeed";
import { LogOut } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [user, setUser] = useState<any>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setUser(session.user);
      } else {
        navigate("/auth");
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setUser(session.user);
      } else {
        navigate("/auth");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Até logo!",
      description: "Você saiu da sua conta.",
    });
  };

  const handlePostCreated = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background shadow-sm">
        <div className="container flex h-16 items-center justify-between">
          <h1 className="text-2xl font-bold">Blog Comunitário</h1>
          <div className="flex items-center gap-4">
            <CreatePostModal onPostCreated={handlePostCreated} />
            <Button variant="outline" size="icon" onClick={handleLogout}>
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>
      <main className="container pb-12 pt-8">
        <PostsFeed refreshTrigger={refreshTrigger} />
      </main>
    </div>
  );
};

export default Index;
