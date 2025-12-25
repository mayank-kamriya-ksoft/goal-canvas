import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { SEO } from "@/components/seo/SEO";
import { Button } from "@/components/ui/button";
import { ArrowRight, Briefcase, GraduationCap, Heart, Wallet, Star, Eye } from "lucide-react";

const exampleBoards = [
  {
    id: 1,
    title: "Career Advancement Board",
    description: "A vision board focused on professional growth, leadership skills, and career milestones.",
    category: "Career",
    icon: Briefcase,
    color: "bg-category-career",
    goals: ["Promotion to Senior Manager", "Lead a team of 10+", "Complete MBA program", "Industry conference speaker"],
  },
  {
    id: 2,
    title: "Academic Success Board",
    description: "Perfect for students visualizing academic achievements and educational goals.",
    category: "Education",
    icon: GraduationCap,
    color: "bg-category-education",
    goals: ["Graduate with honors", "Research publication", "Scholarship recipient", "Study abroad semester"],
  },
  {
    id: 3,
    title: "Health & Wellness Board",
    description: "Focus on physical fitness, mental well-being, and healthy lifestyle habits.",
    category: "Health",
    icon: Heart,
    color: "bg-category-health",
    goals: ["Complete a marathon", "Daily meditation practice", "Balanced nutrition", "8 hours sleep routine"],
  },
  {
    id: 4,
    title: "Financial Freedom Board",
    description: "Visualize your path to financial security, savings goals, and wealth building.",
    category: "Finance",
    icon: Wallet,
    color: "bg-category-finance",
    goals: ["Emergency fund complete", "Investment portfolio", "Debt-free living", "Passive income streams"],
  },
  {
    id: 5,
    title: "Personal Growth Board",
    description: "A holistic board covering self-improvement, skills development, and life experiences.",
    category: "Personal",
    icon: Star,
    color: "bg-category-personal",
    goals: ["Learn new language", "Read 24 books/year", "Volunteer monthly", "Master public speaking"],
  },
  {
    id: 6,
    title: "Balanced Life Board",
    description: "A comprehensive board combining goals from multiple life areas for overall well-being.",
    category: "Mixed",
    icon: Eye,
    color: "bg-primary",
    goals: ["Work-life balance", "Quality family time", "Hobby development", "Travel experiences"],
  },
];

const tips = [
  {
    title: "Start with One Category",
    description: "If you're new to vision boards, focus on one life area first. Once you've mastered that, expand to other categories.",
  },
  {
    title: "Use High-Quality Images",
    description: "Clear, vibrant images have a stronger visual impact. Avoid blurry or low-resolution photos.",
  },
  {
    title: "Mix Images and Text",
    description: "Combine powerful visuals with specific goal statements for maximum effectiveness.",
  },
  {
    title: "Update Quarterly",
    description: "Review and refresh your board every 3 months to reflect new goals and celebrate achievements.",
  },
];

export default function Examples() {
  return (
    <Layout>
      <SEO
        title="Vision Board Examples & Templates - Get Inspired"
        description="Explore vision board examples for career, education, health, finance, and personal growth. Get inspired by real templates and create your own free vision board."
        keywords="vision board examples, vision board templates, vision board ideas, goal board examples, career vision board, student vision board"
      />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero" />
        <div className="container-wide relative section-padding">
          <div className="max-w-3xl">
            <h1 className="text-4xl sm:text-5xl font-display font-bold text-foreground mb-6">
              Vision Board Examples & Inspiration
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground mb-8">
              Explore different vision board styles and get ideas for your own.
              From career goals to personal wellness, find the inspiration you
              need to get started.
            </p>
            <Link to="/create">
              <Button variant="hero" size="lg">
                Create Your Own
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Examples Grid */}
      <section className="section-padding">
        <div className="container-wide">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {exampleBoards.map((board) => (
              <div
                key={board.id}
                className="card-elevated overflow-hidden group hover:-translate-y-1 transition-all duration-300"
              >
                {/* Preview Area */}
                <div className="aspect-[4/3] bg-gradient-to-br from-secondary to-muted relative overflow-hidden">
                  <div className="absolute inset-4 grid grid-cols-3 gap-2">
                    <div className={`col-span-2 row-span-2 ${board.color}/20 rounded-lg`} />
                    <div className="bg-muted-foreground/10 rounded-lg" />
                    <div className="bg-muted-foreground/10 rounded-lg" />
                    <div className="col-span-2 bg-muted-foreground/10 rounded-lg" />
                    <div className="bg-muted-foreground/10 rounded-lg" />
                  </div>
                  <div className={`absolute top-4 left-4 w-10 h-10 ${board.color} rounded-lg flex items-center justify-center`}>
                    <board.icon className="h-5 w-5 text-primary-foreground" />
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${board.color}/20 text-foreground`}>
                      {board.category}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                    {board.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {board.description}
                  </p>

                  <div className="space-y-2">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      Sample Goals:
                    </p>
                    <ul className="space-y-1">
                      {board.goals.slice(0, 3).map((goal, i) => (
                        <li key={i} className="text-sm text-foreground flex items-center gap-2">
                          <span className={`w-1.5 h-1.5 rounded-full ${board.color}`} />
                          {goal}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Link to={`/create?template=${board.id}`} className="block mt-4">
                    <Button variant="outline" size="sm" className="w-full">
                      Use This Template
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tips Section */}
      <section className="section-padding bg-secondary/30">
        <div className="container-wide">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-foreground mb-4">
              Tips for Creating Your Vision Board
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {tips.map((tip, index) => (
              <div key={index} className="card-elevated p-6">
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {tip.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {tip.description}
                </p>
              </div>
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
            Use these examples as inspiration and build your personalized vision
            board in minutes. It's free and no sign-up required.
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
    </Layout>
  );
}
