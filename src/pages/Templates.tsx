import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { SEO } from "@/components/seo/SEO";
import { TemplateGallery } from "@/components/templates/TemplateGallery";

export default function Templates() {
  return (
    <DashboardLayout>
      <SEO
        title="Free Vision Board Templates - Professional Designs for Every Goal"
        description="Browse 48+ free professional vision board templates for career, health, finance, relationships, and more. Start with a beautiful design and customize it to match your dreams."
        keywords="vision board templates, free vision board designs, goal board templates, dream board layouts"
      />

      <div className="container py-12">
        <div className="max-w-3xl mb-10">
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            Vision Board Templates
          </h1>
          <p className="text-xl text-muted-foreground">
            Choose from our collection of professionally designed templates. 
            Each template includes inspiring layouts, images, and quotes to help you 
            visualize your goals and dreams.
          </p>
        </div>

        <TemplateGallery />
      </div>
    </DashboardLayout>
  );
}
