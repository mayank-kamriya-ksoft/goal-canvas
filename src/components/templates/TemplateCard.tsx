import { VisionBoardTemplate, TEMPLATE_CATEGORIES } from "@/types/templates";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Sparkles } from "lucide-react";

interface TemplateCardProps {
  template: VisionBoardTemplate;
  onSelect: (template: VisionBoardTemplate) => void;
  onPreview: (template: VisionBoardTemplate) => void;
}

export function TemplateCard({ template, onSelect, onPreview }: TemplateCardProps) {
  const category = TEMPLATE_CATEGORIES.find(c => c.id === template.category);
  
  // Generate a preview gradient based on template style
  const styleGradients: Record<string, string> = {
    modern: 'from-slate-900 via-slate-800 to-slate-700',
    minimal: 'from-gray-100 via-white to-gray-50',
    vibrant: 'from-purple-500 via-pink-500 to-orange-400',
    classic: 'from-amber-100 via-stone-200 to-amber-50',
  };
  
  const gradient = styleGradients[template.style] || styleGradients.modern;
  const isLight = ['minimal', 'classic'].includes(template.style);

  return (
    <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-border/50">
      <div className={`relative aspect-[4/3] bg-gradient-to-br ${gradient} overflow-hidden`}>
        {/* Template preview placeholder */}
        <div className="absolute inset-0 p-4 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <Badge 
              variant="secondary" 
              className={`${isLight ? 'bg-white/80 text-foreground' : 'bg-black/30 text-white border-0'} backdrop-blur-sm`}
            >
              {template.style}
            </Badge>
            <Sparkles className={`h-5 w-5 ${isLight ? 'text-amber-500' : 'text-amber-300'}`} />
          </div>
          
          {/* Mini layout preview */}
          <div className="grid grid-cols-3 gap-1.5 opacity-60">
            {[...Array(6)].map((_, i) => (
              <div 
                key={i} 
                className={`aspect-square rounded ${isLight ? 'bg-black/10' : 'bg-white/20'}`}
              />
            ))}
          </div>
        </div>

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
          <Button
            size="sm"
            variant="secondary"
            onClick={() => onPreview(template)}
            className="gap-1.5"
          >
            <Eye className="h-4 w-4" />
            Preview
          </Button>
          <Button
            size="sm"
            onClick={() => onSelect(template)}
          >
            Use Template
          </Button>
        </div>
      </div>

      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="font-semibold text-foreground truncate">{template.name}</h3>
            {template.description && (
              <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                {template.description}
              </p>
            )}
          </div>
          {category && (
            <div className={`w-3 h-3 rounded-full ${category.color} flex-shrink-0 mt-1.5`} />
          )}
        </div>
      </CardContent>
    </Card>
  );
}
