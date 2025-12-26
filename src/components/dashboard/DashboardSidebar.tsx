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
  X,
  Users,
  Building,
  Home,
  Leaf,
  Trophy,
  Plane,
  Palette,
  User,
  LayoutGrid,
  Sparkles,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  SidebarHeader,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";

const navItems = [
  { title: "My Boards", href: "/my-boards", icon: LayoutDashboard },
  { title: "Templates", href: "/templates", icon: Grid3X3 },
  { title: "Settings", href: "/settings", icon: Settings },
];

// Board categories (for My Boards)
const boardCategories = [
  { id: "career", label: "Career", icon: Briefcase, color: "bg-category-career" },
  { id: "education", label: "Education", icon: GraduationCap, color: "bg-category-education" },
  { id: "health", label: "Health", icon: Heart, color: "bg-category-health" },
  { id: "finance", label: "Finance", icon: Wallet, color: "bg-category-finance" },
  { id: "personal", label: "Personal", icon: Star, color: "bg-category-personal" },
];

// Template categories (for Templates page)
const templateCategories = [
  { id: "career", label: "Career", icon: Briefcase, color: "bg-amber-500" },
  { id: "health", label: "Health", icon: Heart, color: "bg-rose-500" },
  { id: "relationships", label: "Relationships", icon: Users, color: "bg-pink-500" },
  { id: "finance", label: "Finance", icon: Wallet, color: "bg-emerald-500" },
  { id: "personal", label: "Personal", icon: User, color: "bg-violet-500" },
  { id: "business", label: "Business", icon: Building, color: "bg-blue-500" },
  { id: "students", label: "Students", icon: GraduationCap, color: "bg-indigo-500" },
  { id: "family", label: "Family", icon: Home, color: "bg-orange-500" },
  { id: "wellness", label: "Wellness", icon: Leaf, color: "bg-green-500" },
  { id: "success", label: "Success", icon: Trophy, color: "bg-yellow-500" },
  { id: "travel", label: "Travel", icon: Plane, color: "bg-sky-500" },
  { id: "creativity", label: "Creativity", icon: Palette, color: "bg-purple-500" },
];

interface DashboardSidebarProps {
  selectedCategory?: string | null;
  onCategoryChange?: (category: string | null) => void;
  selectedTemplateCategory?: string | null;
  onTemplateCategoryChange?: (category: string | null) => void;
}

export function DashboardSidebar({ 
  selectedCategory, 
  onCategoryChange,
  selectedTemplateCategory,
  onTemplateCategoryChange,
}: DashboardSidebarProps) {
  const location = useLocation();
  const { state } = useSidebar();
  const { user, logout } = useAuth();
  const isCollapsed = state === "collapsed";

  const isActive = (href: string) => location.pathname === href;
  const isOnMyBoards = location.pathname === "/my-boards";
  const isOnTemplates = location.pathname === "/templates";

  const handleLogout = async () => {
    await logout();
  };

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border h-screen">
      {/* Logo Header */}
      <SidebarHeader className="border-b border-sidebar-border p-4">
        <div className="flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-2 text-lg font-display font-semibold text-foreground transition-colors hover:text-primary"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground flex-shrink-0">
              <Sparkles className="h-5 w-5" />
            </div>
            {!isCollapsed && <span>VisionBoard</span>}
          </Link>
          <SidebarTrigger className="ml-auto" />
        </div>
      </SidebarHeader>

      <SidebarContent>
        {/* Quick Actions */}
        <SidebarGroup>
          {!isCollapsed && (
            <SidebarGroupLabel className="text-xs uppercase tracking-wider text-muted-foreground">
              Quick Actions
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Create New Board">
                  <Link to="/create" className="gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                      <Plus className="h-4 w-4" />
                    </div>
                    {!isCollapsed && (
                      <span className="font-medium">Create New Board</span>
                    )}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Navigation */}
        <SidebarGroup>
          {!isCollapsed && (
            <SidebarGroupLabel className="text-xs uppercase tracking-wider text-muted-foreground">
              Navigation
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(item.href)}
                    tooltip={item.title}
                  >
                    <Link to={item.href} className="gap-3">
                      <item.icon className="h-5 w-5" />
                      {!isCollapsed && <span>{item.title}</span>}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Board Category Filters (My Boards page) */}
        {isOnMyBoards && (
          <SidebarGroup>
            {!isCollapsed && (
              <div className="flex items-center justify-between px-2 mb-2">
                <SidebarGroupLabel className="text-xs uppercase tracking-wider text-muted-foreground p-0">
                  Categories
                </SidebarGroupLabel>
                {selectedCategory && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 px-2 text-xs"
                    onClick={() => onCategoryChange?.(null)}
                  >
                    <X className="h-3 w-3 mr-1" />
                    Clear
                  </Button>
                )}
              </div>
            )}
            <SidebarGroupContent>
              <SidebarMenu>
                {boardCategories.map((category) => (
                  <SidebarMenuItem key={category.id}>
                    <SidebarMenuButton
                      tooltip={category.label}
                      isActive={selectedCategory === category.id}
                      onClick={() =>
                        onCategoryChange?.(
                          selectedCategory === category.id ? null : category.id
                        )
                      }
                      className="gap-3 cursor-pointer"
                    >
                      <div
                        className={cn(
                          "flex h-6 w-6 items-center justify-center rounded-md",
                          category.color
                        )}
                      >
                        <category.icon className="h-3.5 w-3.5 text-white" />
                      </div>
                      {!isCollapsed && <span>{category.label}</span>}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {/* Template Category Filters (Templates page) */}
        {isOnTemplates && (
          <SidebarGroup>
            {!isCollapsed && (
              <div className="flex items-center justify-between px-2 mb-2">
                <SidebarGroupLabel className="text-xs uppercase tracking-wider text-muted-foreground p-0">
                  Filter Templates
                </SidebarGroupLabel>
                {selectedTemplateCategory && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 px-2 text-xs"
                    onClick={() => onTemplateCategoryChange?.(null)}
                  >
                    <X className="h-3 w-3 mr-1" />
                    Clear
                  </Button>
                )}
              </div>
            )}
            <SidebarGroupContent>
              <SidebarMenu>
                {/* All Categories option */}
                <SidebarMenuItem>
                  <SidebarMenuButton
                    tooltip="All Categories"
                    isActive={!selectedTemplateCategory}
                    onClick={() => onTemplateCategoryChange?.(null)}
                    className="gap-3 cursor-pointer"
                  >
                    <div className="flex h-6 w-6 items-center justify-center rounded-md bg-muted">
                      <LayoutGrid className="h-3.5 w-3.5 text-muted-foreground" />
                    </div>
                    {!isCollapsed && <span>All Categories</span>}
                  </SidebarMenuButton>
                </SidebarMenuItem>
                {templateCategories.map((category) => (
                  <SidebarMenuItem key={category.id}>
                    <SidebarMenuButton
                      tooltip={category.label}
                      isActive={selectedTemplateCategory === category.id}
                      onClick={() =>
                        onTemplateCategoryChange?.(
                          selectedTemplateCategory === category.id ? null : category.id
                        )
                      }
                      className="gap-3 cursor-pointer"
                    >
                      <div
                        className={cn(
                          "flex h-6 w-6 items-center justify-center rounded-md",
                          category.color
                        )}
                      >
                        <category.icon className="h-3.5 w-3.5 text-white" />
                      </div>
                      {!isCollapsed && <span>{category.label}</span>}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      {/* User Footer */}
      <SidebarFooter className="border-t border-sidebar-border p-4">
        {user ? (
          <div className={cn("flex items-center", isCollapsed ? "justify-center" : "gap-3")}>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary flex-shrink-0">
              <User className="h-4 w-4" />
            </div>
            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {user.email}
                </p>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  <LogOut className="h-3 w-3" />
                  Sign Out
                </button>
              </div>
            )}
          </div>
        ) : (
          !isCollapsed && (
            <Link to="/auth">
              <Button variant="outline" size="sm" className="w-full">
                Sign In
              </Button>
            </Link>
          )
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
