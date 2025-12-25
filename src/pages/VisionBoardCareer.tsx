import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { SEO } from "@/components/seo/SEO";
import { Button } from "@/components/ui/button";
import { ArrowRight, Briefcase, TrendingUp, Users, Award, Target, CheckCircle2 } from "lucide-react";

const careerGoals = [
  "Get promoted to management",
  "Transition to a new industry",
  "Start your own business",
  "Increase income by 50%",
  "Develop leadership skills",
  "Build a professional network",
  "Achieve work-life balance",
  "Complete professional certification",
];

const benefits = [
  {
    icon: Target,
    title: "Clarify Career Direction",
    description: "Define exactly where you want to be in 1, 5, or 10 years professionally.",
  },
  {
    icon: TrendingUp,
    title: "Track Progress",
    description: "Visualize milestones and celebrate achievements along your career journey.",
  },
  {
    icon: Users,
    title: "Stay Motivated",
    description: "Daily visual reminders keep you focused during challenging times.",
  },
  {
    icon: Award,
    title: "Make Better Decisions",
    description: "When opportunities arise, your vision board helps you evaluate alignment with goals.",
  },
];

const faqs = [
  {
    question: "What should I include in a career vision board?",
    answer: "Include images representing your dream job or workplace, salary goals, skills you want to develop, industry role models, work-life balance visuals, and specific career milestones like promotions or certifications.",
  },
  {
    question: "How can a vision board help my career?",
    answer: "A career vision board keeps your professional goals visible and top-of-mind, helping you stay motivated, make aligned decisions, and notice opportunities that match your aspirations. It's a planning tool that combines goal-setting with daily visualization.",
  },
  {
    question: "How often should I update my career vision board?",
    answer: "Review your career vision board quarterly. Update it when you achieve goals, when your priorities shift, or when you discover new aspirations. Annual comprehensive reviews are also recommended.",
  },
];

export default function VisionBoardCareer() {
  return (
    <Layout>
      <SEO
        title="Career Vision Board: Visualize Your Professional Success"
        description="Create a career vision board to plan promotions, salary goals, skill development, and professional milestones. Free tool with templates and examples for career planning."
        keywords="career vision board, professional vision board, job goals visualization, career planning tool, work vision board, promotion goals"
      />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,hsl(215_70%_55%/0.1),transparent_50%)]" />
        <div className="container-wide relative section-padding">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-category-career/10 text-category-career text-sm font-medium mb-6">
                <Briefcase className="h-4 w-4" />
                Career Focus
              </div>
              <h1 className="text-4xl sm:text-5xl font-display font-bold text-foreground mb-6">
                Create Your Career Vision Board
              </h1>
              <p className="text-lg sm:text-xl text-muted-foreground mb-8">
                Visualize your professional journey. Plan promotions, skill
                development, salary goals, and career milestones with a
                personalized career vision board.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/create">
                  <Button variant="hero" size="lg">
                    Create Career Board
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/examples">
                  <Button variant="hero-outline" size="lg">
                    View Examples
                  </Button>
                </Link>
              </div>
            </div>

            <div className="relative">
              <div className="aspect-square rounded-2xl bg-gradient-to-br from-category-career/10 to-secondary overflow-hidden shadow-xl">
                <div className="absolute inset-6 grid grid-cols-3 gap-3">
                  <div className="col-span-2 row-span-2 bg-category-career/20 rounded-xl flex items-center justify-center">
                    <TrendingUp className="h-20 w-20 text-category-career/40" />
                  </div>
                  <div className="bg-primary/10 rounded-xl" />
                  <div className="bg-accent/10 rounded-xl" />
                  <div className="col-span-2 bg-muted/50 rounded-xl" />
                  <div className="bg-category-finance/10 rounded-xl" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What is a Career Vision Board */}
      <section className="section-padding">
        <div className="container-narrow prose-custom">
          <h2>What is a Career Vision Board?</h2>
          <p>
            A career vision board is a visual representation of your professional
            goals, aspirations, and the path you want your career to take. It
            combines images, words, and graphics that represent your ideal job,
            workplace culture, salary expectations, skills you want to develop,
            and milestones you want to achieve.
          </p>
          <p>
            Unlike general goal-setting, a career vision board engages your visual
            memory and creativity. By creating a tangible representation of your
            professional dreams, you create a daily reminder that keeps you focused
            and motivated, even when faced with challenges or setbacks.
          </p>
          <p>
            Career vision boards are used by professionals at all levels—from
            recent graduates planning their first job to executives mapping their
            path to C-suite positions. They're effective because they combine
            concrete goal-setting with the power of visualization.
          </p>
        </div>
      </section>

      {/* Common Career Goals */}
      <section className="section-padding bg-secondary/30">
        <div className="container-wide">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-foreground mb-4">
              Common Career Goals to Include
            </h2>
            <p className="text-lg text-muted-foreground">
              Here are popular goals that professionals include on their career
              vision boards.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {careerGoals.map((goal, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-4 rounded-lg bg-surface border border-border"
              >
                <CheckCircle2 className="h-5 w-5 text-category-career flex-shrink-0" />
                <span className="text-foreground">{goal}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="section-padding">
        <div className="container-wide">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-foreground mb-4">
              Why Create a Career Vision Board?
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <div key={index} className="card-elevated p-6 text-center">
                <div className="w-12 h-12 rounded-lg bg-category-career/10 flex items-center justify-center mx-auto mb-4">
                  <benefit.icon className="h-6 w-6 text-category-career" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {benefit.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section-padding bg-secondary/30">
        <div className="container-narrow">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-foreground mb-4">
              Career Vision Board FAQ
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
      <section className="section-padding bg-category-career text-primary-foreground">
        <div className="container-wide text-center">
          <h2 className="text-3xl sm:text-4xl font-display font-bold mb-4">
            Start Planning Your Career Today
          </h2>
          <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto mb-8">
            Create your free career vision board and take the first step toward
            your professional goals.
          </p>
          <Link to="/create">
            <Button
              variant="secondary"
              size="xl"
              className="text-foreground font-semibold"
            >
              Create Career Vision Board
              <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>
    </Layout>
  );
}
