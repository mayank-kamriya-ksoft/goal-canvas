import { Layout } from "@/components/layout/Layout";
import { SEO } from "@/components/seo/SEO";

export default function Privacy() {
  return (
    <Layout>
      <SEO title="Privacy Policy - VisionBoard" description="Read our privacy policy to understand how VisionBoard protects your data and respects your privacy." />
      <section className="section-padding">
        <div className="container-narrow prose-custom">
          <h1>Privacy Policy</h1>
          <p><em>Last updated: December 2024</em></p>
          <h2>Information We Collect</h2>
          <p>For guest users, we do not collect or store any personal data. Vision boards created as a guest exist only in your browser session.</p>
          <p>For registered users, we collect email addresses and store vision board data securely to enable saving and editing features.</p>
          <h2>How We Use Your Information</h2>
          <p>We use collected information solely to provide our vision board service. We do not sell, share, or distribute your personal data to third parties.</p>
          <h2>Data Security</h2>
          <p>All user data is encrypted in transit and at rest. We implement industry-standard security measures to protect your information.</p>
          <h2>Your Rights</h2>
          <p>You may request deletion of your account and all associated data at any time by contacting us.</p>
          <h2>Contact</h2>
          <p>For privacy-related inquiries, please contact us through our contact page.</p>
        </div>
      </section>
    </Layout>
  );
}
