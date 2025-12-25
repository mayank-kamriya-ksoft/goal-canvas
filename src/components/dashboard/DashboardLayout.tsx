import { ReactNode, useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { DashboardSidebar } from "./DashboardSidebar";
import { DashboardMobileDrawer } from "./DashboardMobileDrawer";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";

interface DashboardLayoutProps {
  children: ReactNode;
  selectedCategory?: string | null;
  onCategoryChange?: (category: string | null) => void;
  hideFooter?: boolean;
}

export function DashboardLayout({
  children,
  selectedCategory,
  onCategoryChange,
  hideFooter = false,
}: DashboardLayoutProps) {
  const isMobile = useIsMobile();
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  if (isMobile) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <DashboardMobileDrawer
          open={mobileDrawerOpen}
          onOpenChange={setMobileDrawerOpen}
          selectedCategory={selectedCategory}
          onCategoryChange={onCategoryChange}
        />
        <main className="flex-1">{children}</main>
        {!hideFooter && <Footer />}
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <SidebarProvider defaultOpen={true}>
        <div className="flex flex-1 w-full overflow-hidden">
          <DashboardSidebar
            selectedCategory={selectedCategory}
            onCategoryChange={onCategoryChange}
          />
          <SidebarInset className="flex flex-col flex-1 min-w-0 overflow-auto">
            <main className="flex-1 min-w-0">{children}</main>
            {!hideFooter && <Footer />}
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  );
}
