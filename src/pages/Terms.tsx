import { Layout } from "@/components/layout/Layout";
import { SEO } from "@/components/seo/SEO";

export default function Terms() {
  return (
    <Layout>
      <SEO title="Terms & Conditions - VisionBoard" description="Read the terms and conditions for using VisionBoard's free digital vision board creation tool." />
      <section className="section-padding">
        <div className="container-narrow prose-custom">
          <h1>Terms & Conditions</h1>
          <p><em>Last updated: December 2024</em></p>
          <h2>Acceptance of Terms</h2>
          <p>By using VisionBoard, you agree to these terms. If you disagree, please do not use our service.</p>
          <h2>Service Description</h2>
          <p>VisionBoard provides a free digital tool for creating visual representations of personal goals. The service is provided "as is" without warranties.</p>
          <h2>User Responsibilities</h2>
          <p>Users are responsible for the content they upload. Do not upload illegal, offensive, or copyrighted content without permission.</p>
          <h2>Intellectual Property</h2>
          <p>You retain ownership of content you create. Vision boards you create are yours to download and use.</p>
          <h2>Limitation of Liability</h2>
          <p>VisionBoard is not liable for any damages arising from use of our service. We do not guarantee achievement of goals visualized.</p>
        </div>
      </section>
    </Layout>
  );
}
