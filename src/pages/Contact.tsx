import { Layout } from "@/components/layout/Layout";
import { SEO } from "@/components/seo/SEO";
import { Button } from "@/components/ui/button";
import { Mail, MessageSquare } from "lucide-react";

export default function Contact() {
  return (
    <Layout>
      <SEO
        title="Contact Us - VisionBoard"
        description="Get in touch with the VisionBoard team. We're here to help with questions about our vision board tool, feedback, or partnership inquiries."
      />
      <section className="section-padding">
        <div className="container-narrow">
          <h1 className="text-4xl font-display font-bold text-foreground mb-6">Contact Us</h1>
          <p className="text-lg text-muted-foreground mb-8">Have questions or feedback? We'd love to hear from you.</p>
          <div className="card-elevated p-8">
            <form className="space-y-6">
              <div><label className="block text-sm font-medium text-foreground mb-2">Name</label><input type="text" className="w-full px-4 py-3 rounded-lg border border-input bg-background focus:ring-2 focus:ring-ring" /></div>
              <div><label className="block text-sm font-medium text-foreground mb-2">Email</label><input type="email" className="w-full px-4 py-3 rounded-lg border border-input bg-background focus:ring-2 focus:ring-ring" /></div>
              <div><label className="block text-sm font-medium text-foreground mb-2">Message</label><textarea rows={5} className="w-full px-4 py-3 rounded-lg border border-input bg-background focus:ring-2 focus:ring-ring" /></div>
              <Button variant="hero" size="lg">Send Message</Button>
            </form>
          </div>
        </div>
      </section>
    </Layout>
  );
}
