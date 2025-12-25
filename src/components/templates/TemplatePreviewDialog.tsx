import { VisionBoardTemplate, TEMPLATE_CATEGORIES } from "@/types/templates";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Quote, Image, Type } from "lucide-react";

interface TemplatePreviewDialogProps {
  template: VisionBoardTemplate | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (template: VisionBoardTemplate) => void;
}

export function TemplatePreviewDialog({ 
  template, 
  open, 
  onOpenChange, 
  onSelect 
}: TemplatePreviewDialogProps) {
  if (!template) return null;

  const category = TEMPLATE_CATEGORIES.find(c => c.id === template.category);
  const layout = template.layout_data;

  const styleGradients: Record<string, string> = {
    modern: 'from-slate-900 via-slate-800 to-slate-700',
    minimal: 'from-gray-100 via-white to-gray-50',
    vibrant: 'from-purple-500 via-pink-500 to-orange-400',
    classic: 'from-amber-100 via-stone-200 to-amber-50',
  };
  
  const gradient = styleGradients[template.style] || styleGradients.modern;
  const isLight = ['minimal', 'classic'].includes(template.style);

  // Count items by type
  const itemCounts = layout.items?.reduce((acc, item) => {
    acc[item.type] = (acc[item.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>) || {};

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <DialogTitle>{template.name}</DialogTitle>
            {category && (
              <div className={`w-3 h-3 rounded-full ${category.color}`} />
            )}
          </div>
          {template.description && (
            <DialogDescription>{template.description}</DialogDescription>
          )}
        </DialogHeader>

        {/* Preview area */}
        <div className={`aspect-video rounded-lg bg-gradient-to-br ${gradient} p-6 relative overflow-hidden`}>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className={`text-center ${isLight ? 'text-foreground' : 'text-white'}`}>
              <Sparkles className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p className="text-lg font-medium opacity-70">Template Preview</p>
            </div>
          </div>
          
          {/* Show sample layout items */}
          <div className="relative z-10 grid grid-cols-4 gap-2 h-full opacity-40">
            {layout.items?.slice(0, 8).map((item, i) => (
              <div 
                key={i}
                className={`rounded ${isLight ? 'bg-black/10' : 'bg-white/20'} flex items-center justify-center`}
              >
                {item.type === 'image' && <Image className="h-6 w-6 opacity-50" />}
                {item.type === 'text' && <Type className="h-6 w-6 opacity-50" />}
                {item.type === 'quote' && <Quote className="h-6 w-6 opacity-50" />}
              </div>
            ))}
          </div>
        </div>

        {/* Template info */}
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline">{template.style} style</Badge>
          {itemCounts.image && (
            <Badge variant="secondary" className="gap-1">
              <Image className="h-3 w-3" />
              {itemCounts.image} images
            </Badge>
          )}
          {itemCounts.quote && (
            <Badge variant="secondary" className="gap-1">
              <Quote className="h-3 w-3" />
              {itemCounts.quote} quotes
            </Badge>
          )}
          {itemCounts.text && (
            <Badge variant="secondary" className="gap-1">
              <Type className="h-3 w-3" />
              {itemCounts.text} text blocks
            </Badge>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={() => {
            onSelect(template);
            onOpenChange(false);
          }}>
            Use This Template
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
