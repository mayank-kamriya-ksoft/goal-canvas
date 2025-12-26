import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { SEO } from "@/components/seo/SEO";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  CheckCircle2,
  Lightbulb,
  Target,
  Image,
  Type,
  Download,
  Eye,
} from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Define Your Goals",
    icon: Target,
    description:
      "Start by identifying what you truly want to achieve. Break down your big dreams into specific, actionable goals across different life areas—career, health, finances, relationships, and personal growth.",
    tips: [
      "Write down 3-5 main goals you want to focus on",
      "Make goals specific and measurable when possible",
      "Consider both short-term (1 year) and long-term (5+ years) aspirations",
      "Think about why each goal matters to you personally",
    ],
  },
  {
    number: "02",
    title: "Gather Visual Inspiration",
    icon: Image,
    description:
      "Collect images that represent your goals and aspirations. These can include photos of places you want to visit, career milestones, lifestyle images, or anything that evokes the feeling of achieving your dreams.",
    tips: [
      "Search for royalty-free images that resonate with your goals",
      "Include images that trigger positive emotions",
      "Choose quality over quantity—select the most meaningful visuals",
      "Consider adding photos of role models or mentors",
    ],
  },
  {
    number: "03",
    title: "Add Meaningful Text",
    icon: Type,
    description:
      "Complement your images with powerful words. Add goal statements, motivational quotes, affirmations, and specific targets that will keep you focused and inspired when you look at your board.",
    tips: [
      "Write goals in present tense as if already achieved",
      "Include specific numbers and dates where relevant",
      "Add quotes that personally motivate you",
      "Use action-oriented language",
    ],
  },
  {
    number: "04",
    title: "Design Your Layout",
    icon: Lightbulb,
    description:
      "Arrange your elements thoughtfully on the canvas. Create a visual hierarchy that draws attention to your most important goals. Use colors and spacing to organize different life areas.",
    tips: [
      "Place your biggest goal prominently in the center or top",
      "Group related goals together",
      "Leave some white space for visual breathing room",
      "Create visual flow that guides the eye naturally",
    ],
  },
  {
    number: "05",
    title: "Download & Display",
    icon: Download,
    description:
      "Export your finished vision board and put it somewhere you'll see it every day. Regular visualization helps reinforce your commitment and keeps your goals top of mind.",
    tips: [
      "Set your vision board as your phone or computer wallpaper",
      "Print and frame it for your home office or bedroom",
      "Review your board every morning as part of your routine",
      "Update your board as you achieve goals and set new ones",
    ],
  },
];

const bestPractices = [
  {
    title: "Be Specific",
    description:
      "Vague goals lead to vague results. Instead of 'be healthier,' specify 'run a 5K by June' or 'cook healthy meals 5 days a week.'",
  },
  {
    title: "Focus on Feelings",
    description:
      "Choose images and words that evoke how you want to feel when you achieve your goals—confident, peaceful, accomplished, free.",
  },
  {
    title: "Review Regularly",
    description:
      "A vision board isn't a one-time project. Schedule weekly reviews to reconnect with your goals and track progress.",
  },
  {
    title: "Take Action",
    description:
      "Vision boards are planning tools, not magic. Each goal on your board should have associated action steps you're actively working on.",
  },
  {
    title: "Stay Flexible",
    description:
      "Goals can evolve as you grow. Don't be afraid to update your vision board to reflect new priorities and achievements.",
  },
  {
    title: "Make It Personal",
    description:
      "Your vision board should reflect YOUR authentic dreams, not what others expect from you. Be honest with yourself.",
  },
];

const faqs = [
  {
    question: "How often should I look at my vision board?",
    answer:
      "For best results, view your vision board at least once daily—ideally as part of your morning routine. This consistent visualization helps reinforce your goals and keeps them at the forefront of your mind throughout the day. Many people find it helpful to spend 2-5 minutes each morning focusing on their board and imagining achieving each goal.",
  },
  {
    question: "Should I include images of things I already have?",
    answer:
      "While vision boards primarily focus on future goals, including a few images of current blessings or achievements can create a sense of gratitude and momentum. However, the majority of your board should represent aspirations and goals you're actively working toward.",
  },
  {
    question: "How many goals should I include?",
    answer:
      "Quality matters more than quantity. Focus on 5-10 meaningful goals across different life areas. Too many goals can dilute focus and make your board feel overwhelming. You can always create multiple boards for different life areas if you have many aspirations.",
  },
  {
    question: "Can vision boards really help achieve goals?",
    answer:
      "Vision boards are goal-planning and motivation tools, not guarantees. They work by keeping your goals visible and top-of-mind, which research suggests can enhance motivation, help you notice relevant opportunities, and maintain focus during challenges. Success still requires consistent action toward your goals.",
  },
  {
    question: "What's the difference between a digital and physical vision board?",
    answer:
      "Digital vision boards offer flexibility (easy editing, anywhere access, multiple copies) while physical boards provide a tactile, permanent presence. Many people use both—a digital board they can view on devices, and a printed version for their workspace or bedroom.",
  },
];

export default function HowToCreate() {
  return (
    <Layout>
      <SEO
        title="How to Create a Vision Board: Complete Step-by-Step Guide"
        description="Learn how to create an effective digital vision board with our comprehensive guide. Discover tips for goal visualization, best practices, and step-by-step instructions."
        keywords="how to create vision board, vision board guide, vision board tips, goal visualization, vision board tutorial, make vision board"
      />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero" />
        <div className="container-wide relative section-padding">
          <div className="max-w-3xl">
            <h1 className="text-4xl sm:text-5xl font-display font-bold text-foreground mb-6">
              How to Create an Effective Vision Board
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground mb-8">
              A comprehensive guide to creating a digital vision board that
              helps you clarify, visualize, and achieve your most important
              goals.
            </p>
            <Link to="/create">
              <Button variant="hero" size="lg">
                Start Creating Now
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Introduction */}
      <section className="section-padding">
        <div className="container-wide">
          <div className="max-w-4xl prose-custom">
            <h2>What You'll Learn</h2>
            <p>
              Creating an effective vision board is more than just collecting
              pretty pictures. This guide will walk you through a proven process
              for designing a vision board that serves as a powerful goal-planning
              and motivation tool. Whether you're new to vision boards or looking
              to improve your approach, you'll find actionable insights to create
              a board that truly supports your aspirations.
            </p>
            <p>
              A well-crafted vision board helps you clarify what you really want,
              stay focused on priorities, and maintain motivation when challenges
              arise. Let's explore how to create one that works for you.
            </p>
          </div>
        </div>
      </section>

      {/* Steps */}
      <section className="section-padding bg-secondary/30">
        <div className="container-wide">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-foreground mb-4">
              5 Steps to Create Your Vision Board
            </h2>
          </div>

          <div className="space-y-12">
            {steps.map((step, index) => (
              <div
                key={step.number}
                className="grid lg:grid-cols-2 gap-8 items-start"
              >
                <div
                  className={`${index % 2 === 1 ? "lg:order-2" : ""}`}
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 rounded-xl bg-primary flex items-center justify-center text-primary-foreground font-display font-bold text-xl">
                      {step.number}
                    </div>
                    <h3 className="text-2xl font-display font-bold text-foreground">
                      {step.title}
                    </h3>
                  </div>
                  <p className="text-muted-foreground mb-6">
                    {step.description}
                  </p>
                </div>

                <div
                  className={`card-elevated p-6 ${
                    index % 2 === 1 ? "lg:order-1" : ""
                  }`}
                >
                  <div className="flex items-center gap-2 mb-4">
                    <Lightbulb className="h-5 w-5 text-accent" />
                    <h4 className="font-semibold text-foreground">Pro Tips</h4>
                  </div>
                  <ul className="space-y-3">
                    {step.tips.map((tip, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-muted-foreground">
                          {tip}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Best Practices */}
      <section className="section-padding">
        <div className="container-wide">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-foreground mb-4">
              Vision Board Best Practices
            </h2>
            <p className="text-lg text-muted-foreground">
              Follow these principles to maximize the effectiveness of your
              vision board.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {bestPractices.map((practice, index) => (
              <div key={index} className="card-elevated p-6">
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {practice.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {practice.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section-padding bg-secondary/30" id="faq">
        <div className="container-narrow">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-foreground mb-4">
              Frequently Asked Questions
            </h2>
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

      {/* CTA */}
      <section className="section-padding bg-primary text-primary-foreground">
        <div className="container-wide text-center">
          <h2 className="text-3xl sm:text-4xl font-display font-bold mb-4">
            Ready to Create Your Vision Board?
          </h2>
          <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto mb-8">
            Put these tips into practice with our free, easy-to-use vision board
            creator. No sign-up required.
          </p>
          <Link to="/create">
            <Button
              variant="secondary"
              size="xl"
              className="text-foreground font-semibold"
            >
              Start Creating Now
              <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* HowTo Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "HowTo",
            name: "How to Create a Digital Vision Board",
            description:
              "A step-by-step guide to creating an effective digital vision board for goal planning and visualization.",
            step: steps.map((step, index) => ({
              "@type": "HowToStep",
              position: index + 1,
              name: step.title,
              text: step.description,
            })),
          }),
        }}
      />
    </Layout>
  );
}
