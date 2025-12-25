import { Layout } from "@/components/layout/Layout";
import { SEO } from "@/components/seo/SEO";
import { VisionCanvas } from "@/components/canvas/VisionCanvas";
import { Button } from "@/components/ui/button";
import { Briefcase, GraduationCap, Heart, Wallet, Star, Info } from "lucide-react";

const categories = [
  { id: "career", label: "Career", icon: Briefcase, color: "bg-category-career" },
  { id: "education", label: "Education", icon: GraduationCap, color: "bg-category-education" },
  { id: "health", label: "Health", icon: Heart, color: "bg-category-health" },
  { id: "finance", label: "Finance", icon: Wallet, color: "bg-category-finance" },
  { id: "personal", label: "Personal", icon: Star, color: "bg-category-personal" },
];

export default function CreateBoard() {
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
          <VisionCanvas />
        </div>
      </div>
    </Layout>
  );
}
