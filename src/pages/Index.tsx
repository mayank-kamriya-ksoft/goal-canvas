import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { SEO } from "@/components/seo/SEO";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Sparkles,
  Target,
  Download,
  Lock,
  Zap,
  CheckCircle2,
  Users,
  BarChart3,
  BookOpen,
  Briefcase,
  GraduationCap,
  Heart,
  Wallet,
  Star,
} from "lucide-react";

const features = [
  {
    icon: Sparkles,
    title: "Intuitive Creator",
    description:
      "Drag-and-drop interface makes designing your vision board effortless and enjoyable.",
  },
  {
    icon: Download,
    title: "Free Downloads",
    description:
      "Export your vision board as high-quality PNG, JPG, or print-ready PDF—no watermarks.",
  },
  {
    icon: Lock,
    title: "Private & Secure",
    description:
      "Your vision board is created locally and never shared. Your goals stay yours.",
  },
  {
    icon: Zap,
    title: "No Sign-up Required",
    description:
      "Start creating immediately as a guest. Sign up only if you want to save your boards.",
  },
];

const categories = [
  {
    icon: Briefcase,
    title: "Career Goals",
    description: "Visualize your professional aspirations and milestones.",
    href: "/vision-board-career",
    color: "bg-category-career",
  },
  {
    icon: GraduationCap,
    title: "Education",
    description: "Plan academic achievements and learning objectives.",
    href: "/vision-board-students",
    color: "bg-category-education",
  },
  {
    icon: Heart,
    title: "Health & Wellness",
    description: "Focus on physical and mental well-being goals.",
    href: "/create",
    color: "bg-category-health",
  },
  {
    icon: Wallet,
    title: "Financial Goals",
    description: "Map your path to financial security and freedom.",
    href: "/create",
    color: "bg-category-finance",
  },
  {
    icon: Star,
    title: "Personal Growth",
    description: "Develop habits and skills for self-improvement.",
    href: "/create",
    color: "bg-category-personal",
  },
];

const benefits = [
  "Clarify your goals and priorities",
  "Stay motivated through visual reminders",
  "Track progress on multiple life areas",
  "Create actionable steps from abstract ideas",
  "Reduce overwhelm with organized planning",
  "Celebrate milestones along your journey",
];

const faqs = [
  {
    question: "What is a digital vision board?",
    answer:
      "A digital vision board is an online tool that helps you create a visual collage of your goals, dreams, and aspirations. Unlike physical boards, digital vision boards can be easily edited, stored, and accessed from anywhere. They combine images, text, and graphics to represent what you want to achieve in different areas of life.",
  },
  {
    question: "How does a vision board help with achieving goals?",
    answer:
      "Vision boards work by leveraging the power of visualization. When you see your goals represented visually every day, it helps reinforce your intentions and keeps you focused on what matters. Research in psychology suggests that mental visualization can improve motivation, clarify priorities, and help you notice opportunities aligned with your objectives.",
  },
  {
    question: "Is this vision board tool completely free?",
    answer:
      "Yes! Our vision board creator is completely free to use. You can create, customize, and download your vision board without any cost or watermarks. Guest users can create boards instantly, while registered users get the added benefit of saving and managing multiple boards.",
  },
  {
    question: "Do I need to create an account to use the tool?",
    answer:
      "No account is required to create and download a vision board. You can start immediately as a guest. However, if you want to save your boards for future editing or create multiple boards, you can optionally create a free account.",
  },
  {
    question: "Is my vision board private?",
    answer:
      "Absolutely. Your vision board is created securely in your browser. We don't store guest boards on our servers—they exist only during your session. Even for registered users, your boards are private and accessible only to you.",
  },
];

export default function Index() {
  return (
    <Layout>
      <SEO
        title="Free Digital Vision Board Creator - Plan & Visualize Your Goals"
        description="Create a beautiful digital vision board for free. Our intuitive online tool helps you visualize career, education, health, and personal goals. No sign-up required. Download as PNG, JPG, or PDF."
        keywords="digital vision board, online vision board, vision board for goals, free vision board maker, goal visualization tool, vision board for students, career vision board"
        canonical="https://visionboard.app"
      />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,hsl(160_45%_40%/0.08),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,hsl(15_75%_60%/0.06),transparent_50%)]" />

        <div className="container-wide relative section-padding">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6 animate-fade-in">
              <Sparkles className="h-4 w-4" />
              Free Vision Board Tool
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-foreground leading-tight mb-6 animate-fade-in-up">
              Create Your{" "}
              <span className="text-primary">Digital Vision Board</span> and
              Achieve Your Goals
            </h1>

            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 animate-fade-in-up stagger-2">
              A free, intuitive tool to visualize your aspirations. Design
              beautiful vision boards for career, education, health, and
              personal growth—no design skills needed.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up stagger-3">
              <Link to="/create">
                <Button variant="hero" size="xl">
                  Start Creating Now
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Link to="/how-to-create">
                <Button variant="hero-outline" size="xl">
                  Learn How It Works
                </Button>
              </Link>
            </div>

            <p className="mt-6 text-sm text-muted-foreground animate-fade-in-up stagger-4">
              No sign-up required • Free forever • Private & secure
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section-padding bg-secondary/30">
        <div className="container-wide">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-foreground mb-4">
              Everything You Need to Plan Your Future
            </h2>
            <p className="text-lg text-muted-foreground">
              Our vision board tool combines simplicity with powerful features
              to help you stay focused on your goals.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="card-elevated p-6 animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What is a Vision Board Section */}
      <section className="section-padding">
        <div className="container-wide">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-display font-bold text-foreground mb-6">
                What is a Digital Vision Board?
              </h2>
              <div className="prose-custom">
                <p>
                  A digital vision board is a modern, online version of the
                  traditional collage-style vision board. It's a powerful goal-planning
                  tool that helps you create a visual representation of your
                  dreams, goals, and aspirations across different areas of life.
                </p>
                <p>
                  Unlike physical vision boards made with magazines and glue,
                  digital vision boards offer flexibility, easy editing, and the
                  ability to access your board from anywhere. You can add images,
                  inspirational quotes, goal statements, and design elements to
                  create a personalized roadmap for your future.
                </p>
                <p>
                  Vision boards work by keeping your goals visible and top of
                  mind. When you see your aspirations represented visually each
                  day, it helps reinforce your commitment, clarify priorities,
                  and motivate consistent action toward achieving them.
                </p>
              </div>
              <Link to="/how-to-create" className="inline-block mt-6">
                <Button variant="outline" size="lg">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Learn More About Vision Boards
                </Button>
              </Link>
            </div>

            <div className="relative">
              <div className="aspect-[4/3] rounded-2xl bg-gradient-to-br from-secondary to-muted overflow-hidden shadow-xl">
                <div className="absolute inset-4 grid grid-cols-3 gap-3">
                  <div className="col-span-2 row-span-2 bg-primary/20 rounded-xl flex items-center justify-center">
                    <Target className="h-16 w-16 text-primary/50" />
                  </div>
                  <div className="bg-accent/20 rounded-xl" />
                  <div className="bg-category-career/20 rounded-xl" />
                  <div className="bg-category-health/20 rounded-xl" />
                  <div className="col-span-2 bg-category-finance/20 rounded-xl" />
                </div>
              </div>
              <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-primary/10 rounded-full blur-2xl" />
              <div className="absolute -top-4 -left-4 w-32 h-32 bg-accent/10 rounded-full blur-2xl" />
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="section-padding bg-secondary/30">
        <div className="container-wide">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-foreground mb-4">
              Create Vision Boards for Every Goal
            </h2>
            <p className="text-lg text-muted-foreground">
              Whether you're focused on career advancement, academic success, or
              personal well-being, our tool adapts to your needs.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category, index) => (
              <Link
                key={category.title}
                to={category.href}
                className="card-elevated p-6 group animate-fade-in-up hover:-translate-y-1"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div
                  className={`w-12 h-12 rounded-lg ${category.color} flex items-center justify-center mb-4`}
                >
                  <category.icon className="h-6 w-6 text-primary-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                  {category.title}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {category.description}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="section-padding">
        <div className="container-wide">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <div className="grid sm:grid-cols-2 gap-4">
                {benefits.map((benefit, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-4 rounded-lg bg-secondary/50 animate-fade-in"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-foreground">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="order-1 lg:order-2">
              <h2 className="text-3xl sm:text-4xl font-display font-bold text-foreground mb-6">
                Why Use a Vision Board for Goal Planning?
              </h2>
              <div className="prose-custom">
                <p>
                  Vision boards are more than just pretty collages—they're
                  evidence-based tools for clarifying and achieving goals. By
                  creating a visual representation of what you want to achieve,
                  you engage both the creative and logical parts of your brain.
                </p>
                <p>
                  Research in cognitive psychology suggests that visualization
                  techniques can enhance motivation, improve focus, and help
                  identify opportunities aligned with your goals. A vision board
                  serves as a daily reminder of your priorities, helping you
                  make decisions that move you closer to your aspirations.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="section-padding bg-secondary/30">
        <div className="container-wide">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-foreground mb-4">
              Create Your Vision Board in 3 Simple Steps
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Choose Your Focus",
                description:
                  "Decide which area of life you want to focus on—career, education, health, finance, or personal growth.",
              },
              {
                step: "02",
                title: "Add Your Goals",
                description:
                  "Upload images, add text blocks with your goals, and arrange everything on your canvas.",
              },
              {
                step: "03",
                title: "Download & Display",
                description:
                  "Export your finished vision board and place it somewhere you'll see it daily.",
              },
            ].map((item, index) => (
              <div
                key={item.step}
                className="relative text-center animate-fade-in-up"
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground text-2xl font-display font-bold flex items-center justify-center mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  {item.title}
                </h3>
                <p className="text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/create">
              <Button variant="hero" size="xl">
                Start Your Vision Board
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="section-padding">
        <div className="container-narrow">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-foreground mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-muted-foreground">
              Everything you need to know about digital vision boards and our
              free tool.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <details
                key={index}
                className="group card-elevated p-6 [&[open]]:bg-secondary/30"
              >
                <summary className="flex items-center justify-between cursor-pointer list-none">
                  <h3 className="text-lg font-semibold text-foreground pr-4">
                    {faq.question}
                  </h3>
                  <span className="text-primary text-2xl group-open:rotate-45 transition-transform">
                    +
                  </span>
                </summary>
                <p className="mt-4 text-muted-foreground">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="section-padding bg-primary text-primary-foreground">
        <div className="container-wide text-center">
          <h2 className="text-3xl sm:text-4xl font-display font-bold mb-4">
            Ready to Visualize Your Future?
          </h2>
          <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto mb-8">
            Join thousands of people using vision boards to clarify their goals
            and stay motivated. Start creating your free vision board today.
          </p>
          <Link to="/create">
            <Button
              variant="secondary"
              size="xl"
              className="text-foreground font-semibold"
            >
              Create Your Free Vision Board
              <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* FAQ Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqs.map((faq) => ({
              "@type": "Question",
              name: faq.question,
              acceptedAnswer: {
                "@type": "Answer",
                text: faq.answer,
              },
            })),
          }),
        }}
      />
    </Layout>
  );
}
