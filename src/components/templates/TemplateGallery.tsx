import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { VisionBoardTemplate, TemplateCategoryId, TEMPLATE_CATEGORIES } from "@/types/templates";
import { fetchTemplates } from "@/services/templatesService";
import { CategoryFilter } from "./CategoryFilter";
import { TemplateCard } from "./TemplateCard";
import { TemplatePreviewDialog } from "./TemplatePreviewDialog";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { Sparkles } from "lucide-react";

interface TemplateGalleryProps {
  onSelectTemplate?: (template: VisionBoardTemplate) => void;
}

export function TemplateGallery({ onSelectTemplate }: TemplateGalleryProps) {
  const navigate = useNavigate();
  const [templates, setTemplates] = useState<VisionBoardTemplate[]>([]);
  const [groupedTemplates, setGroupedTemplates] = useState<Record<string, VisionBoardTemplate[]>>({});
  const [selectedCategory, setSelectedCategory] = useState<TemplateCategoryId | 'all'>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [previewTemplate, setPreviewTemplate] = useState<VisionBoardTemplate | null>(null);

  useEffect(() => {
    loadTemplates();
  }, []);

  async function loadTemplates() {
    try {
      setIsLoading(true);
      const response = await fetchTemplates();
      setTemplates(response.templates);
      setGroupedTemplates(response.grouped);
    } catch (error) {
      console.error('Failed to load templates:', error);
      toast.error('Failed to load templates');
    } finally {
      setIsLoading(false);
    }
  }

  function handleSelectTemplate(template: VisionBoardTemplate) {
    if (onSelectTemplate) {
      onSelectTemplate(template);
    } else {
      // Navigate to create page with template data
      navigate(`/create?templateId=${template.id}`);
    }
  }

  const filteredTemplates = selectedCategory === 'all' 
    ? templates 
    : templates.filter(t => t.category === selectedCategory);

  const displayByCategory = selectedCategory === 'all';

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-9 w-28 flex-shrink-0" />
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <Skeleton key={i} className="aspect-[4/3] rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (templates.length === 0) {
    return (
      <div className="text-center py-16">
        <Sparkles className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
        <h3 className="text-xl font-semibold mb-2">No templates available</h3>
        <p className="text-muted-foreground">Templates are being prepared. Check back soon!</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <CategoryFilter 
        selectedCategory={selectedCategory} 
        onCategoryChange={setSelectedCategory} 
      />

      {displayByCategory ? (
        // Show grouped by category
        <div className="space-y-10">
          {TEMPLATE_CATEGORIES.map((category) => {
            const categoryTemplates = groupedTemplates[category.id] || [];
            if (categoryTemplates.length === 0) return null;

            return (
              <section key={category.id}>
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-4 h-4 rounded-full ${category.color}`} />
                  <h2 className="text-xl font-semibold">{category.label}</h2>
                  <span className="text-sm text-muted-foreground">
                    ({categoryTemplates.length} templates)
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {categoryTemplates.map((template) => (
                    <TemplateCard
                      key={template.id}
                      template={template}
                      onSelect={handleSelectTemplate}
                      onPreview={setPreviewTemplate}
                    />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      ) : (
        // Show flat list for single category
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredTemplates.map((template) => (
            <TemplateCard
              key={template.id}
              template={template}
              onSelect={handleSelectTemplate}
              onPreview={setPreviewTemplate}
            />
          ))}
        </div>
      )}

      <TemplatePreviewDialog
        template={previewTemplate}
        open={!!previewTemplate}
        onOpenChange={(open) => !open && setPreviewTemplate(null)}
        onSelect={handleSelectTemplate}
      />
    </div>
  );
}
