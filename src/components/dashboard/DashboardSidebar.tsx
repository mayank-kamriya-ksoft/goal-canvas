import { useState } from "react";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import {
  LayoutDashboard,
  Grid3X3,
  Settings,
  Plus,
  ChevronLeft,
  ChevronRight,
  Briefcase,
  GraduationCap,
  Heart,
  Wallet,
  Star,
  Filter,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";

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

interface DashboardSidebarProps {
  selectedCategory?: string | null;
  onCategoryChange?: (category: string | null) => void;
}

export function DashboardSidebar({ selectedCategory, onCategoryChange }: DashboardSidebarProps) {
  const location = useLocation();
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  const isActive = (href: string) => location.pathname === href;

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      <SidebarHeader className="border-b border-sidebar-border p-4">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <span className="font-display font-semibold text-sidebar-foreground">
              Dashboard
            </span>
          )}
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

        {/* Category Filters */}
        {location.pathname === "/my-boards" && (
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
                {categories.map((category) => (
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
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-4">
        {!isCollapsed && (
          <p className="text-xs text-muted-foreground text-center">
            Vision Board Creator
          </p>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
