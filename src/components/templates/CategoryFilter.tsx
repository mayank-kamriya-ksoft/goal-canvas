import { TEMPLATE_CATEGORIES, TemplateCategoryId } from "@/types/templates";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { 
  Briefcase, Heart, Users, Wallet, User, Building, 
  GraduationCap, Home, Leaf, Trophy, Plane, Palette,
  LayoutGrid
} from "lucide-react";

const iconMap = {
  Briefcase,
  Heart,
  Users,
  Wallet,
  User,
  Building,
  GraduationCap,
  Home,
  Leaf,
  Trophy,
  Plane,
  Palette,
};

interface CategoryFilterProps {
  selectedCategory: TemplateCategoryId | 'all';
  onCategoryChange: (category: TemplateCategoryId | 'all') => void;
}

export function CategoryFilter({ selectedCategory, onCategoryChange }: CategoryFilterProps) {
  return (
    <ScrollArea className="w-full whitespace-nowrap">
      <div className="flex gap-2 pb-3">
        <Button
          variant={selectedCategory === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => onCategoryChange('all')}
          className="gap-2 flex-shrink-0"
        >
          <LayoutGrid className="h-4 w-4" />
          All Categories
        </Button>
        
        {TEMPLATE_CATEGORIES.map((category) => {
          const Icon = iconMap[category.icon as keyof typeof iconMap];
          const isSelected = selectedCategory === category.id;
          
          return (
            <Button
              key={category.id}
              variant={isSelected ? 'default' : 'outline'}
              size="sm"
              onClick={() => onCategoryChange(category.id)}
              className="gap-2 flex-shrink-0"
            >
              {Icon && <Icon className="h-4 w-4" />}
              {category.label}
            </Button>
          );
        })}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}
