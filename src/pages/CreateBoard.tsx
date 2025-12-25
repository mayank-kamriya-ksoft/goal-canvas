import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { SEO } from "@/components/seo/SEO";
import { VisionCanvas } from "@/components/canvas/VisionCanvas";
import { Briefcase, GraduationCap, Heart, Wallet, Star, Info } from "lucide-react";

const categories = [
  { id: "career", label: "Career", icon: Briefcase, color: "bg-category-career" },
  { id: "education", label: "Education", icon: GraduationCap, color: "bg-category-education" },
  { id: "health", label: "Health", icon: Heart, color: "bg-category-health" },
  { id: "finance", label: "Finance", icon: Wallet, color: "bg-category-finance" },
  { id: "personal", label: "Personal", icon: Star, color: "bg-category-personal" },
];

const templates = [
  {
    id: 1,
    title: "Career Advancement Board",
    category: "career",
    goals: ["Promotion to Senior Manager", "Lead a team of 10+", "Complete MBA program", "Industry conference speaker"],
  },
  {
    id: 2,
    title: "Academic Success Board",
    category: "education",
    goals: ["Graduate with honors", "Research publication", "Scholarship recipient", "Study abroad semester"],
  },
  {
    id: 3,
    title: "Health & Wellness Board",
    category: "health",
    goals: ["Complete a marathon", "Daily meditation practice", "Balanced nutrition", "8 hours sleep routine"],
  },
  {
    id: 4,
    title: "Financial Freedom Board",
    category: "finance",
    goals: ["Emergency fund complete", "Investment portfolio", "Debt-free living", "Passive income streams"],
  },
  {
    id: 5,
    title: "Personal Growth Board",
    category: "personal",
    goals: ["Learn new language", "Read 24 books/year", "Volunteer monthly", "Master public speaking"],
  },
  {
    id: 6,
    title: "Balanced Life Board",
    category: "personal",
    goals: ["Work-life balance", "Quality family time", "Hobby development", "Travel experiences"],
  },
];

export default function CreateBoard() {
  const [searchParams] = useSearchParams();
  const templateId = searchParams.get("template");
  const boardId = searchParams.get("board");
  
  const template = useMemo(() => {
    if (!templateId) return null;
    return templates.find(t => t.id === parseInt(templateId)) || null;
  }, [templateId]);

  return (
    <Layout hideFooter>
      <SEO
        title="Create Your Free Vision Board Online"
        description="Design your personalized digital vision board with our free drag-and-drop tool. Add images, goals, and inspirational text. Download as PNG, JPG, or PDF."
        keywords="create vision board, free vision board maker, online vision board tool, digital goal board creator"
      />

      <div className="h-[calc(100vh-4rem)] flex flex-col">
        {/* Category Bar */}
        <div className="flex items-center justify-between gap-4 px-4 py-3 bg-surface border-b border-border">
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">
              Category:
            </span>
            {categories.map((cat) => (
              <button
                key={cat.id}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors whitespace-nowrap"
              >
                <div className={`w-3 h-3 rounded-full ${cat.color}`} />
                {cat.label}
              </button>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground">
            <Info className="h-4 w-4" />
            <span>Your board is private and secure</span>
          </div>
        </div>

        {/* Canvas Area */}
        <div className="flex-1 p-4 bg-canvas">
          <VisionCanvas 
            template={template} 
            boardId={boardId}
            initialCategory={template?.category || "personal"}
          />
        </div>
      </div>
    </Layout>
  );
}
