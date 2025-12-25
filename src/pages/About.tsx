import { Layout } from "@/components/layout/Layout";
import { SEO } from "@/components/seo/SEO";
import { Sparkles, Target, Heart } from "lucide-react";

export default function About() {
  return (
    <Layout>
      <SEO
        title="About Us - VisionBoard"
        description="Learn about VisionBoard, our mission to help people visualize and achieve their goals through free, accessible digital vision board tools."
      />
      <section className="section-padding">
        <div className="container-narrow prose-custom">
          <h1>About VisionBoard</h1>
          <p>VisionBoard was created with a simple mission: to make goal visualization accessible to everyone. We believe that when you can see your goals clearly, you're more likely to achieve them.</p>
          <h2>Our Mission</h2>
          <p>We provide a free, intuitive tool that helps people plan, visualize, and stay focused on personal and professional goals. No complicated features, no hidden costs—just a clean, effective way to create your vision board.</p>
          <h2>Our Values</h2>
          <ul>
            <li><strong>Accessibility:</strong> Everyone deserves access to goal-planning tools</li>
            <li><strong>Privacy:</strong> Your goals are personal—we keep them that way</li>
            <li><strong>Simplicity:</strong> Easy-to-use tools that focus on what matters</li>
          </ul>
        </div>
      </section>
    </Layout>
  );
}
