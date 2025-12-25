import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { SEO } from "@/components/seo/SEO";
import { Button } from "@/components/ui/button";
import { ArrowRight, GraduationCap, BookOpen, Award, Calendar, Target, CheckCircle2 } from "lucide-react";

const studentGoals = [
  "Graduate with honors",
  "Get into dream university",
  "Win scholarship or grant",
  "Complete thesis/dissertation",
  "Study abroad program",
  "Join academic societies",
  "Publish research paper",
  "Secure internship",
];

const benefits = [
  {
    icon: Target,
    title: "Stay Focused",
    description: "Keep academic priorities visible during busy semesters and exam periods.",
  },
  {
    icon: Calendar,
    title: "Plan Long-Term",
    description: "Map out your educational journey from freshman year to graduation and beyond.",
  },
  {
    icon: BookOpen,
    title: "Balance Goals",
    description: "Include academic, extracurricular, and personal development goals.",
  },
  {
    icon: Award,
    title: "Celebrate Progress",
    description: "Track milestones and achievements throughout your academic career.",
  },
];

const faqs = [
  {
    question: "What should students include in their vision board?",
    answer: "Students should include academic goals (GPA targets, graduation), career aspirations, skills to develop, extracurricular achievements, study abroad dreams, scholarship goals, and personal growth objectives.",
  },
  {
    question: "How can a vision board help with academic motivation?",
    answer: "A vision board serves as a daily reminder of why you're putting in the hard work. During challenging times like exam periods or difficult projects, seeing your goals visually can boost motivation and help you push through.",
  },
  {
    question: "Should I create a new vision board each semester?",
    answer: "It depends on your goals. Some students prefer one comprehensive board for their entire degree, while others create semester-specific boards. Consider having a main long-term board and updating it with short-term goals each semester.",
  },
];

export default function VisionBoardStudents() {
  return (
    <Layout>
      <SEO
        title="Vision Board for Students: Academic Goal Planning Tool"
        description="Create a student vision board to visualize academic success, college goals, scholarship aspirations, and personal growth. Free tool for high school and university students."
        keywords="vision board for students, student goal setting, academic vision board, college vision board, student motivation tool, study goals visualization"
      />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_70%,hsl(280_60%_55%/0.1),transparent_50%)]" />
        <div className="container-wide relative section-padding">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-category-education/10 text-category-education text-sm font-medium mb-6">
                <GraduationCap className="h-4 w-4" />
                For Students
              </div>
              <h1 className="text-4xl sm:text-5xl font-display font-bold text-foreground mb-6">
                Student Vision Board for Academic Success
              </h1>
              <p className="text-lg sm:text-xl text-muted-foreground mb-8">
                Visualize your academic journey. Plan for college admissions,
                scholarships, grades, and personal growth with a vision board
                designed for students.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/create">
                  <Button variant="hero" size="lg">
                    Create Student Board
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
              <div className="aspect-square rounded-2xl bg-gradient-to-br from-category-education/10 to-secondary overflow-hidden shadow-xl">
                <div className="absolute inset-6 grid grid-cols-3 gap-3">
                  <div className="col-span-2 row-span-2 bg-category-education/20 rounded-xl flex items-center justify-center">
                    <BookOpen className="h-20 w-20 text-category-education/40" />
                  </div>
                  <div className="bg-primary/10 rounded-xl" />
                  <div className="bg-accent/10 rounded-xl" />
                  <div className="col-span-2 bg-muted/50 rounded-xl" />
                  <div className="bg-category-career/10 rounded-xl" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What is a Student Vision Board */}
      <section className="section-padding">
        <div className="container-narrow prose-custom">
          <h2>What is a Student Vision Board?</h2>
          <p>
            A student vision board is a personalized visual tool that helps
            students—from high school through graduate school—plan and visualize
            their academic and personal goals. It combines images, quotes, and
            goal statements that represent what you want to achieve during your
            educational journey.
          </p>
          <p>
            For students, vision boards can include everything from GPA targets
            and college acceptance dreams to extracurricular achievements, study
            abroad aspirations, and career goals beyond graduation. The visual
            format makes abstract goals feel more concrete and achievable.
          </p>
          <p>
            Whether you're a high school student planning for college, a
            university student working toward graduation, or a graduate student
            pursuing advanced degrees, a vision board helps you stay motivated
            and focused on your educational objectives.
          </p>
        </div>
      </section>

      {/* Common Student Goals */}
      <section className="section-padding bg-secondary/30">
        <div className="container-wide">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-foreground mb-4">
              Popular Goals for Student Vision Boards
            </h2>
            <p className="text-lg text-muted-foreground">
              Here are common academic and personal goals that students include.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {studentGoals.map((goal, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-4 rounded-lg bg-surface border border-border"
              >
                <CheckCircle2 className="h-5 w-5 text-category-education flex-shrink-0" />
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
              Why Students Benefit from Vision Boards
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <div key={index} className="card-elevated p-6 text-center">
                <div className="w-12 h-12 rounded-lg bg-category-education/10 flex items-center justify-center mx-auto mb-4">
                  <benefit.icon className="h-6 w-6 text-category-education" />
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
              Student Vision Board FAQ
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
      <section className="section-padding bg-category-education text-primary-foreground">
        <div className="container-wide text-center">
          <h2 className="text-3xl sm:text-4xl font-display font-bold mb-4">
            Start Your Academic Journey Today
          </h2>
          <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto mb-8">
            Create your free student vision board and visualize your path to
            academic success.
          </p>
          <Link to="/create">
            <Button
              variant="secondary"
              size="xl"
              className="text-foreground font-semibold"
            >
              Create Student Vision Board
              <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>
    </Layout>
  );
}
