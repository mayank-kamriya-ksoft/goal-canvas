import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { SEO } from "@/components/seo/SEO";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { 
  Plus, 
  Briefcase, 
  GraduationCap, 
  Heart, 
  Wallet, 
  Star,
  Trash2,
  Edit3,
  Loader2,
  FolderOpen
} from "lucide-react";
import { toast } from "sonner";

interface VisionBoard {
  id: string;
  title: string;
  category: string;
  created_at: string;
  updated_at: string;
}

const categoryIcons: Record<string, React.ElementType> = {
  career: Briefcase,
  education: GraduationCap,
  health: Heart,
  finance: Wallet,
  personal: Star,
};

const categoryColors: Record<string, string> = {
  career: "bg-category-career",
  education: "bg-category-education",
  health: "bg-category-health",
  finance: "bg-category-finance",
  personal: "bg-category-personal",
};

export default function MyBoards() {
  const { user, session, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [boards, setBoards] = useState<VisionBoard[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [authLoading, user, navigate]);

  useEffect(() => {
    const fetchBoards = async () => {
      if (!session?.token) return;

      try {
        const { data, error } = await supabase.functions.invoke("vision-boards", {
          body: { action: "list", token: session.token },
        });

        if (error) throw error;
        setBoards(data.boards || []);
      } catch (err) {
        console.error("Failed to fetch boards:", err);
        toast.error("Failed to load your boards");
      } finally {
        setIsLoading(false);
      }
    };

    if (session?.token) {
      fetchBoards();
    }
  }, [session]);

  const handleDelete = async (boardId: string) => {
    if (!session?.token) return;

    setDeletingId(boardId);
    try {
      const { error } = await supabase.functions.invoke("vision-boards", {
        body: { action: "delete", token: session.token, boardId },
      });

      if (error) throw error;
      setBoards(boards.filter((b) => b.id !== boardId));
      toast.success("Board deleted");
    } catch (err) {
      console.error("Failed to delete board:", err);
      toast.error("Failed to delete board");
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  if (authLoading || isLoading) {
    return (
      <Layout>
        <SEO title="My Vision Boards" description="View and manage your saved vision boards." />
        <div className="min-h-[60vh] flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <SEO
        title="My Vision Boards"
        description="View and manage your saved vision boards. Edit, download, or create new boards."
      />

      <section className="section-padding">
        <div className="container-wide">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-display font-bold text-foreground">
                My Vision Boards
              </h1>
              <p className="text-muted-foreground mt-1">
                {boards.length} board{boards.length !== 1 ? "s" : ""} saved
              </p>
            </div>
            <Link to="/create">
              <Button variant="hero" size="lg">
                <Plus className="h-5 w-5" />
                Create New Board
              </Button>
            </Link>
          </div>

          {/* Boards Grid */}
          {boards.length === 0 ? (
            <div className="card-elevated p-12 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-secondary flex items-center justify-center">
                <FolderOpen className="h-8 w-8 text-muted-foreground" />
              </div>
              <h2 className="text-xl font-display font-semibold text-foreground mb-2">
                No boards yet
              </h2>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Start creating your first vision board to visualize your goals and dreams.
              </p>
              <Link to="/create">
                <Button variant="hero" size="lg">
                  <Plus className="h-5 w-5" />
                  Create Your First Board
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {boards.map((board) => {
                const IconComponent = categoryIcons[board.category] || Star;
                const colorClass = categoryColors[board.category] || "bg-category-personal";

                return (
                  <div
                    key={board.id}
                    className="card-elevated group overflow-hidden hover:shadow-lg transition-all duration-300"
                  >
                    {/* Preview placeholder */}
                    <div className="h-40 bg-canvas relative">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className={`w-16 h-16 rounded-full ${colorClass} flex items-center justify-center`}>
                          <IconComponent className="h-8 w-8 text-white" />
                        </div>
                      </div>
                      {/* Hover overlay */}
                      <div className="absolute inset-0 bg-foreground/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                        <Link to={`/create?board=${board.id}`}>
                          <Button variant="secondary" size="sm">
                            <Edit3 className="h-4 w-4" />
                            Edit
                          </Button>
                        </Link>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(board.id)}
                          disabled={deletingId === board.id}
                        >
                          {deletingId === board.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                          Delete
                        </Button>
                      </div>
                    </div>

                    {/* Info */}
                    <div className="p-4">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="font-semibold text-foreground line-clamp-1">
                            {board.title}
                          </h3>
                          <p className="text-sm text-muted-foreground capitalize">
                            {board.category}
                          </p>
                        </div>
                        <div className={`w-3 h-3 rounded-full ${colorClass} flex-shrink-0 mt-1.5`} />
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">
                        Updated {formatDate(board.updated_at)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}
