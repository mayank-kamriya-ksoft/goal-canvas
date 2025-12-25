import { Layout } from "@/components/layout/Layout";
import { SEO } from "@/components/seo/SEO";

export default function Disclaimer() {
  return (
    <Layout>
      <SEO title="Disclaimer - VisionBoard" description="Important disclaimer about VisionBoard's vision board tool and goal visualization." />
      <section className="section-padding">
        <div className="container-narrow prose-custom">
          <h1>Disclaimer</h1>
          <h2>Educational and Planning Tool</h2>
          <p>VisionBoard is a goal-planning and visualization tool designed to help users organize and focus on their aspirations. It is intended for educational and motivational purposes only.</p>
          <h2>No Guaranteed Results</h2>
          <p>Creating a vision board does not guarantee achievement of any goals. Success depends on individual effort, circumstances, and consistent action. We make no claims about specific outcomes.</p>
          <h2>Not Professional Advice</h2>
          <p>Content on this website is not professional advice. For career, financial, health, or educational decisions, consult qualified professionals.</p>
          <h2>User-Generated Content</h2>
          <p>Images and content uploaded by users are their responsibility. We do not endorse user-generated content.</p>
        </div>
      </section>
    </Layout>
  );
}
