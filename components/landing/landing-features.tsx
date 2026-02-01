import { Card } from "@/components/ui/card"
import { PenLine, Heart, Users, Bookmark, Globe, Sparkles } from "lucide-react"

const features = [
  {
    icon: PenLine,
    title: "Distraction-Free Writing",
    description: "A beautiful, minimal editor designed for poets. Focus on your words without any clutter.",
  },
  {
    icon: Heart,
    title: "Express Every Emotion",
    description: "Tag your shayaris with moods - romantic, sad, inspirational, philosophical, and more.",
  },
  {
    icon: Users,
    title: "Connect with Poets",
    description: "Follow your favorite poets, engage with their work, and build meaningful connections.",
  },
  {
    icon: Globe,
    title: "Multiple Languages",
    description: "Write in Hindi, Urdu, English, or Punjabi. Poetry knows no language barriers.",
  },
  {
    icon: Bookmark,
    title: "Curate Collections",
    description: "Save shayaris that move you. Build your personal anthology of cherished verses.",
  },
  {
    icon: Sparkles,
    title: "Discover Daily",
    description: "Explore trending shayaris, discover new poets, and find inspiration every day.",
  },
]

export function LandingFeatures() {
  return (
    <section className="relative py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center">
          <h2 className="font-serif text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl text-balance">
            A Platform Built for Poets
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground text-pretty">
            Every feature is thoughtfully designed to help you express, share, and connect through the art of shayari.
          </p>
        </div>

        {/* Features grid */}
        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="group relative overflow-hidden border-border/50 bg-card/50 p-6 backdrop-blur-sm transition-all duration-300 hover:border-primary/30 hover:bg-card"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              
              <div className="relative">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors duration-300 group-hover:bg-primary/20">
                  <feature.icon className="h-6 w-6" />
                </div>
                
                <h3 className="mt-4 font-serif text-xl font-semibold text-foreground">
                  {feature.title}
                </h3>
                
                <p className="mt-2 text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
