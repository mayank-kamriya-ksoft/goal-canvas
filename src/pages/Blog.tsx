import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { SEO } from "@/components/seo/SEO";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar, Clock, Tag } from "lucide-react";

const blogPosts = [
  {
    slug: "complete-guide-to-vision-boards",
    title: "The Complete Guide to Vision Boards: Everything You Need to Know",
    excerpt: "Learn what vision boards are, how they work, and why they're effective tools for goal planning and motivation. A comprehensive introduction for beginners.",
    category: "Getting Started",
    readTime: "8 min read",
    date: "2024-12-20",
  },
  {
    slug: "vision-board-vs-goal-setting",
    title: "Vision Boards vs Traditional Goal Setting: What Works Better?",
    excerpt: "Compare the benefits of visual goal representation with traditional written goals. Discover why combining both approaches yields the best results.",
    category: "Tips & Strategies",
    readTime: "6 min read",
    date: "2024-12-18",
  },
  {
    slug: "how-to-stay-motivated",
    title: "How to Stay Motivated: Using Your Vision Board Daily",
    excerpt: "Practical tips for incorporating your vision board into your daily routine. Learn how to maximize its effectiveness through consistent visualization.",
    category: "Productivity",
    readTime: "5 min read",
    date: "2024-12-15",
  },
  {
    slug: "choosing-images-for-vision-board",
    title: "How to Choose the Right Images for Your Vision Board",
    excerpt: "Not all images are created equal. Learn the psychology behind effective vision board imagery and how to select visuals that truly resonate with your goals.",
    category: "Design Tips",
    readTime: "7 min read",
    date: "2024-12-12",
  },
  {
    slug: "digital-vs-physical-vision-boards",
    title: "Digital vs Physical Vision Boards: Pros and Cons",
    excerpt: "Should you create a digital or physical vision board? We break down the advantages of each format to help you choose the right approach.",
    category: "Getting Started",
    readTime: "5 min read",
    date: "2024-12-10",
  },
  {
    slug: "vision-board-mistakes-to-avoid",
    title: "5 Common Vision Board Mistakes (And How to Fix Them)",
    excerpt: "Are you making these common vision board mistakes? Learn what to avoid and how to create a more effective visual goal representation.",
    category: "Tips & Strategies",
    readTime: "6 min read",
    date: "2024-12-08",
  },
];

const categories = [
  { name: "All Posts", count: 6 },
  { name: "Getting Started", count: 2 },
  { name: "Tips & Strategies", count: 2 },
  { name: "Productivity", count: 1 },
  { name: "Design Tips", count: 1 },
];

export default function Blog() {
  return (
    <Layout>
      <SEO
        title="Vision Board Blog: Tips, Guides & Inspiration"
        description="Explore articles about vision board creation, goal setting strategies, productivity tips, and inspiration for achieving your dreams. Free resources for personal development."
        keywords="vision board tips, goal setting blog, personal development articles, vision board guide, productivity tips, motivation blog"
      />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero" />
        <div className="container-wide relative section-padding">
          <div className="max-w-3xl">
            <h1 className="text-4xl sm:text-5xl font-display font-bold text-foreground mb-6">
              Resources & Insights
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground">
              Tips, guides, and inspiration to help you create effective vision
              boards and achieve your goals.
            </p>
          </div>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="section-padding">
        <div className="container-wide">
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <aside className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                <div className="card-elevated p-6">
                  <h3 className="font-semibold text-foreground mb-4">Categories</h3>
                  <ul className="space-y-2">
                    {categories.map((cat) => (
                      <li key={cat.name}>
                        <button className="flex items-center justify-between w-full py-2 px-3 rounded-lg text-sm text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors">
                          <span>{cat.name}</span>
                          <span className="text-xs bg-secondary px-2 py-1 rounded-full">
                            {cat.count}
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="card-elevated p-6 bg-primary/5">
                  <h3 className="font-semibold text-foreground mb-2">
                    Ready to Start?
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Put what you've learned into practice with our free vision board creator.
                  </p>
                  <Link to="/create">
                    <Button variant="hero" size="sm" className="w-full">
                      Create Board
                    </Button>
                  </Link>
                </div>
              </div>
            </aside>

            {/* Posts */}
            <div className="lg:col-span-3">
              <div className="grid sm:grid-cols-2 gap-6">
                {blogPosts.map((post) => (
                  <article
                    key={post.slug}
                    className="card-elevated overflow-hidden group"
                  >
                    {/* Placeholder Image */}
                    <div className="aspect-video bg-gradient-to-br from-secondary to-muted" />

                    <div className="p-6">
                      <div className="flex items-center gap-3 mb-3 text-xs text-muted-foreground">
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-secondary rounded-full">
                          <Tag className="h-3 w-3" />
                          {post.category}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {post.readTime}
                        </span>
                      </div>

                      <h2 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">
                        {post.title}
                      </h2>

                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                        {post.excerpt}
                      </p>

                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          {new Date(post.date).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                        <span className="text-sm font-medium text-primary group-hover:underline">
                          Read more →
                        </span>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-secondary/30">
        <div className="container-wide text-center">
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-foreground mb-4">
            Ready to Apply What You've Learned?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Start creating your personalized vision board today. It's free, private, and takes just minutes to get started.
          </p>
          <Link to="/create">
            <Button variant="hero" size="xl">
              Create Your Vision Board
              <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>
    </Layout>
  );
}
