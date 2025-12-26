import { useEffect, useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { SEO } from "@/components/seo/SEO";
import { VisionCanvas } from "@/components/canvas/VisionCanvas";
import { getTemplateById } from "@/services/templatesService";
import { VisionBoardTemplate } from "@/types/templates";
import { Briefcase, GraduationCap, Heart, Wallet, Star, Info, Loader2, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

const categories = [
  { id: "career", label: "Career", icon: Briefcase, color: "bg-category-career" },
  { id: "education", label: "Education", icon: GraduationCap, color: "bg-category-education" },
  { id: "health", label: "Health", icon: Heart, color: "bg-category-health" },
  { id: "finance", label: "Finance", icon: Wallet, color: "bg-category-finance" },
  { id: "personal", label: "Personal", icon: Star, color: "bg-category-personal" },
];

// Legacy templates for backward compatibility
const legacyTemplates = [
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
  const templateId = searchParams.get("templateId"); // New DB template
  const legacyTemplateId = searchParams.get("template"); // Legacy template
  const boardId = searchParams.get("board");
  
  const [dbTemplate, setDbTemplate] = useState<VisionBoardTemplate | null>(null);
  const [isLoadingTemplate, setIsLoadingTemplate] = useState(false);
  const [boardTitle, setBoardTitle] = useState("Untitled Board");
  const [selectedCategory, setSelectedCategory] = useState<string>("personal");
  
  // Fetch DB template if templateId is provided
  useEffect(() => {
    if (!templateId) {
      setDbTemplate(null);
      return;
    }
    
    const loadTemplate = async () => {
      setIsLoadingTemplate(true);
      try {
        const template = await getTemplateById(templateId);
        setDbTemplate(template);
        if (template) {
          setBoardTitle(template.name);
        }
      } catch (error) {
        console.error("Failed to load template:", error);
      } finally {
        setIsLoadingTemplate(false);
      }
    };
    
    loadTemplate();
  }, [templateId]);
  
  // Legacy template support
  const legacyTemplate = useMemo(() => {
    if (!legacyTemplateId) return null;
    const found = legacyTemplates.find(t => t.id === parseInt(legacyTemplateId)) || null;
    if (found) {
      setBoardTitle(found.title);
    }
    return found;
  }, [legacyTemplateId]);

  // Determine which template to use
  const activeTemplate = dbTemplate || legacyTemplate;
  const templateCategory = dbTemplate?.category || legacyTemplate?.category || "personal";

  // Set initial category from template
  useEffect(() => {
    setSelectedCategory(templateCategory);
  }, [templateCategory]);

  const handleTitleChange = (newTitle: string) => {
    setBoardTitle(newTitle);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  const currentCategory = categories.find(c => c.id === selectedCategory) || categories[4];

  return (
    <Layout hideFooter useEditorHeader boardTitle={boardTitle} onTitleChange={handleTitleChange}>
      <SEO
        title="Create Your Free Vision Board Online"
        description="Design your personalized digital vision board with our free drag-and-drop tool. Add images, goals, and inspirational text. Download as PNG, JPG, or PDF."
        keywords="create vision board, free vision board maker, online vision board tool, digital goal board creator"
      />

      <div className="h-[calc(100vh-4rem)] flex flex-col">
        {/* Category Bar */}
        <div className="flex items-center justify-between gap-4 px-4 py-3 bg-surface border-b border-border">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">
              Category:
            </span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <div className={`w-3 h-3 rounded-full ${currentCategory.color}`} />
                  {currentCategory.label}
                  <ChevronDown className="h-4 w-4 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48 bg-popover">
                {categories.map((cat) => {
                  const Icon = cat.icon;
                  return (
                    <DropdownMenuItem
                      key={cat.id}
                      onClick={() => handleCategoryChange(cat.id)}
                      className={`gap-2 cursor-pointer ${selectedCategory === cat.id ? "bg-accent" : ""}`}
                    >
                      <div className={`w-3 h-3 rounded-full ${cat.color}`} />
                      <Icon className="h-4 w-4" />
                      {cat.label}
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground">
            <Info className="h-4 w-4" />
            <span>Your board is private and secure</span>
          </div>
        </div>

        {/* Canvas Area */}
        <div className="flex-1 p-4 bg-canvas">
          {isLoadingTemplate ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto mb-4" />
                <p className="text-muted-foreground">Loading template...</p>
              </div>
            </div>
          ) : (
            <VisionCanvas 
              template={legacyTemplate} 
              dbTemplate={dbTemplate}
              boardId={boardId}
              initialCategory={templateCategory}
              externalTitle={boardTitle}
              onTitleChange={handleTitleChange}
              externalCategory={selectedCategory}
              onCategoryChange={handleCategoryChange}
            />
          )}
        </div>
      </div>
    </Layout>
  );
}
