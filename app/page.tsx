
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Feather, Heart, Sparkles, Quote } from "lucide-react"
import { connectDB } from "@/lib/db"
import { Shayari, User } from "@/lib/models"
import { LandingHero } from "@/components/landing/landing-hero"
import { LandingFeatures } from "@/components/landing/landing-features"
import { ShayariCard } from "@/components/shayari-card"
import { LandingFooter } from "@/components/landing/landing-footer"

export default async function LandingPage() {
  await connectDB()

  const topShayarisDocs = await Shayari.find()
    .sort({ likes_count: -1 })
    .limit(3)
    .populate({ path: 'user_id', model: User, select: 'username display_name avatar_url' })
    .lean() as any[]

  const topShayaris = topShayarisDocs.map(s => ({
    ...s,
    _id: undefined,
    __v: undefined,
    user_id: s.user_id._id.toString(),
    id: s._id.toString(),
    created_at: s.created_at.toISOString(),
    profiles: {
      id: s.user_id._id.toString(),
      username: s.user_id.username,
      display_name: s.user_id.display_name,
      avatar_url: s.user_id.avatar_url
    },
    likes_count: s.likes_count || 0,
    comments_count: s.comments_count || 0,
    is_liked: false, // Landing page user is guests
    is_saved: false,
  }))
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="h-5 w-5 text-primary-foreground"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 0 1-.923 1.785A5.969 5.969 0 0 0 6 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337Z" />
                </svg>
              </div>
              <span className="font-serif text-xl font-semibold text-foreground">Shayari</span>
            </Link>

            <div className="flex items-center gap-3">
              <Button variant="ghost" asChild>
                <Link href="/auth/login">Sign In</Link>
              </Button>
              <Button asChild>
                <Link href="/auth/sign-up">Get Started</Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main>
        <LandingHero />
        {/* Featured Shayaris */}
        <section className="py-20 md:py-32 relative">
          <div className="container px-4 mx-auto relative z-10">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">
                Loved by Poets Everywhere
              </h2>
              <p className="text-muted-foreground text-lg">
                Discover the most touching verses from our community.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {topShayaris.map((shayari) => (
                <ShayariCard key={shayari.id} shayari={shayari} />
              ))}
            </div>
          </div>
        </section>
        <LandingFeatures />
      </main>

      <LandingFooter />
    </div>
  )
}
