import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Grid3X3,
  Settings,
  Plus,
  Briefcase,
  GraduationCap,
  Heart,
  Wallet,
  Star,
  Menu,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  DrawerClose,
} from "@/components/ui/drawer";
import { cn } from "@/lib/utils";

const navItems = [
  { title: "My Boards", href: "/my-boards", icon: LayoutDashboard },
  { title: "Templates", href: "/templates", icon: Grid3X3 },
  { title: "Settings", href: "/settings", icon: Settings },
];

const categories = [
  { id: "career", label: "Career", icon: Briefcase, color: "bg-category-career" },
  { id: "education", label: "Education", icon: GraduationCap, color: "bg-category-education" },
  { id: "health", label: "Health", icon: Heart, color: "bg-category-health" },
  { id: "finance", label: "Finance", icon: Wallet, color: "bg-category-finance" },
  { id: "personal", label: "Personal", icon: Star, color: "bg-category-personal" },
];

interface DashboardMobileDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedCategory?: string | null;
  onCategoryChange?: (category: string | null) => void;
}

export function DashboardMobileDrawer({
  open,
  onOpenChange,
  selectedCategory,
  onCategoryChange,
}: DashboardMobileDrawerProps) {
  const location = useLocation();
  const isActive = (href: string) => location.pathname === href;
  const showCategories = location.pathname === "/my-boards";

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full shadow-lg border-primary/20 bg-background"
        >
          <Menu className="h-6 w-6" />
        </Button>
      </DrawerTrigger>
      <DrawerContent className="max-h-[85vh]">
        <DrawerHeader className="border-b border-border pb-4">
          <div className="flex items-center justify-between">
            <DrawerTitle className="font-display">Dashboard Menu</DrawerTitle>
            <DrawerClose asChild>
              <Button variant="ghost" size="icon">
                <X className="h-5 w-5" />
              </Button>
            </DrawerClose>
          </div>
        </DrawerHeader>

        <div className="p-4 space-y-6 overflow-y-auto">
          {/* Quick Action */}
          <div>
            <p className="text-xs uppercase tracking-wider text-muted-foreground mb-3">
              Quick Actions
            </p>
            <DrawerClose asChild>
              <Link to="/create">
                <Button variant="hero" className="w-full justify-start gap-3">
                  <Plus className="h-5 w-5" />
                  Create New Board
                </Button>
              </Link>
            </DrawerClose>
          </div>

          {/* Navigation */}
          <div>
            <p className="text-xs uppercase tracking-wider text-muted-foreground mb-3">
              Navigation
            </p>
            <div className="space-y-1">
              {navItems.map((item) => (
                <DrawerClose key={item.href} asChild>
                  <Link to={item.href}>
                    <Button
                      variant={isActive(item.href) ? "secondary" : "ghost"}
                      className={cn(
                        "w-full justify-start gap-3",
                        isActive(item.href) && "bg-secondary"
                      )}
                    >
                      <item.icon className="h-5 w-5" />
                      {item.title}
                    </Button>
                  </Link>
                </DrawerClose>
              ))}
            </div>
          </div>

          {/* Category Filters */}
          {showCategories && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs uppercase tracking-wider text-muted-foreground">
                  Filter by Category
                </p>
                {selectedCategory && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 px-2 text-xs"
                    onClick={() => onCategoryChange?.(null)}
                  >
                    Clear
                  </Button>
                )}
              </div>
              <div className="grid grid-cols-2 gap-2">
                {categories.map((category) => (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? "default" : "outline"}
                    className={cn(
                      "justify-start gap-2",
                      selectedCategory === category.id && "bg-primary"
                    )}
                    onClick={() =>
                      onCategoryChange?.(
                        selectedCategory === category.id ? null : category.id
                      )
                    }
                  >
                    <div
                      className={cn(
                        "flex h-5 w-5 items-center justify-center rounded",
                        category.color
                      )}
                    >
                      <category.icon className="h-3 w-3 text-white" />
                    </div>
                    {category.label}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
