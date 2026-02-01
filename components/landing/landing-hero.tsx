"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles } from "lucide-react"

const floatingShayaris = [
  { text: "दिल की बात ज़ुबां पे आई", position: "top-32 left-[10%]", delay: "0s" },
  { text: "محبت میں ہار بھی جیت ہے", position: "top-48 right-[15%]", delay: "0.5s" },
  { text: "ख्वाबों की दुनिया में", position: "bottom-40 left-[20%]", delay: "1s" },
  { text: "زندگی ایک سفر ہے", position: "bottom-32 right-[10%]", delay: "1.5s" },
]

export function LandingHero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-background to-background" />
      
      {/* Floating shayari snippets */}
      {floatingShayaris.map((shayari, index) => (
        <div
          key={index}
          className={`absolute ${shayari.position} hidden lg:block opacity-20 font-serif text-lg text-foreground/60 animate-pulse`}
          style={{ animationDelay: shayari.delay, animationDuration: "3s" }}
        >
          {shayari.text}
        </div>
      ))}

      {/* Decorative elements */}
      <div className="absolute top-1/4 left-1/4 h-64 w-64 rounded-full bg-primary/5 blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-accent/5 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-5xl px-4 text-center">
        {/* Badge */}
        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-border/50 bg-card/50 px-4 py-2 backdrop-blur-sm">
          <Sparkles className="h-4 w-4 text-accent" />
          <span className="text-sm text-muted-foreground">Where Words Dance</span>
        </div>

        {/* Main heading */}
        <h1 className="font-serif text-5xl font-bold leading-tight tracking-tight text-foreground sm:text-6xl lg:text-7xl text-balance">
          Express Your Soul
          <br />
          <span className="bg-gradient-to-r from-primary via-primary/80 to-accent bg-clip-text text-transparent">
            Through Poetry
          </span>
        </h1>

        {/* Subheading */}
        <p className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-muted-foreground text-pretty">
          Join a community of poets and dreamers. Share your shayaris, connect with 
          kindred spirits, and let your words touch hearts across the world.
        </p>

        {/* CTA Buttons */}
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button size="lg" className="h-12 px-8 text-base" asChild>
            <Link href="/auth/sign-up">
              Start Writing
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button variant="outline" size="lg" className="h-12 px-8 text-base bg-transparent" asChild>
            <Link href="/explore">Explore Shayaris</Link>
          </Button>
        </div>

        {/* Stats */}
        <div className="mt-20 grid grid-cols-3 gap-8 border-t border-border/30 pt-10">
          <div>
            <div className="font-serif text-3xl font-bold text-foreground">10K+</div>
            <div className="mt-1 text-sm text-muted-foreground">Active Poets</div>
          </div>
          <div>
            <div className="font-serif text-3xl font-bold text-foreground">50K+</div>
            <div className="mt-1 text-sm text-muted-foreground">Shayaris Shared</div>
          </div>
          <div>
            <div className="font-serif text-3xl font-bold text-foreground">100K+</div>
            <div className="mt-1 text-sm text-muted-foreground">Hearts Touched</div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="h-10 w-6 rounded-full border-2 border-muted-foreground/30 p-1">
          <div className="h-2 w-1 mx-auto rounded-full bg-muted-foreground/50 animate-pulse" />
        </div>
      </div>
    </section>
  )
}
