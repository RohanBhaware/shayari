import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Quote } from "lucide-react"

const testimonials = [
  {
    content: "Shayari has become my digital diary. The writing experience is so peaceful, it feels like sitting by a moonlit window with pen and paper.",
    author: "Aisha Khan",
    handle: "@aisha_writes",
    avatar: "AK",
  },
  {
    content: "I found my tribe here. Poets who understand the weight of words, the beauty of silence between verses. This platform is pure magic.",
    author: "Rahul Sharma",
    handle: "@rahul_shayar",
    avatar: "RS",
  },
  {
    content: "The mood tags are brilliant! My sad shayaris find the right audience, and my romantic ones touch the right hearts. Perfect design.",
    author: "Priya Verma",
    handle: "@priya_poetry",
    avatar: "PV",
  },
]

export function LandingTestimonials() {
  return (
    <section className="relative py-24 lg:py-32 bg-card/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center">
          <h2 className="font-serif text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl text-balance">
            Loved by Poets Everywhere
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground text-pretty">
            Join thousands of poets who have found their creative home on Shayari.
          </p>
        </div>

        {/* Testimonials grid */}
        <div className="mt-16 grid gap-8 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <Card
              key={index}
              className="relative border-border/50 bg-card/50 p-8 backdrop-blur-sm"
            >
              <Quote className="absolute top-6 right-6 h-8 w-8 text-primary/20" />
              
              <p className="font-serif text-lg leading-relaxed text-foreground/90 italic">
                &ldquo;{testimonial.content}&rdquo;
              </p>
              
              <div className="mt-6 flex items-center gap-3">
                <Avatar className="h-10 w-10 border border-border">
                  <AvatarFallback className="bg-primary/10 text-primary text-sm font-medium">
                    {testimonial.avatar}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium text-foreground">{testimonial.author}</div>
                  <div className="text-sm text-muted-foreground">{testimonial.handle}</div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-20 text-center">
          <div className="inline-flex flex-col items-center rounded-2xl border border-border/50 bg-card/50 px-12 py-10 backdrop-blur-sm">
            <h3 className="font-serif text-2xl font-semibold text-foreground">
              Ready to Share Your Voice?
            </h3>
            <p className="mt-2 text-muted-foreground">
              Join our community of poets and start your journey today.
            </p>
            <a
              href="/auth/sign-up"
              className="mt-6 inline-flex h-12 items-center justify-center rounded-lg bg-primary px-8 font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Create Your Account
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
