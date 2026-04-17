import { createFileRoute, Link } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { ArrowRight, MapPin, Sparkles, Zap, Shield } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "FlyCab — Autonomous Flying Taxis in Bengaluru" },
      { name: "description", content: "Book autonomous flying taxis across Bengaluru. Skip traffic with AeroLite, AeroPlus & AeroJet tiers." },
    ],
  }),
  component: LandingPage,
});

function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 -z-10"
          style={{ background: "var(--gradient-hero)" }}
        />
        <div className="absolute inset-0 -z-10 opacity-30" style={{
          backgroundImage: "radial-gradient(circle at 20% 30%, oklch(0.78 0.18 210 / 0.4), transparent 40%), radial-gradient(circle at 80% 70%, oklch(0.72 0.22 305 / 0.3), transparent 40%)",
        }} />

        <div className="container mx-auto px-4 py-24 md:py-32">
          <div className="mx-auto max-w-4xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-border/50 bg-card/50 px-4 py-1.5 text-xs font-medium text-muted-foreground backdrop-blur-sm">
              <Sparkles className="h-3 w-3 text-primary" />
              Now flying across Bengaluru
            </div>

            <h1 className="mt-6 text-5xl font-bold tracking-tight md:text-7xl">
              Skip traffic.{" "}
              <span className="bg-gradient-to-r from-primary via-neon to-accent bg-clip-text text-transparent">
                Fly there.
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground md:text-xl">
              FlyCab connects you to a fleet of autonomous flying taxis. Tap two points on the map, choose your tier, and lift off in minutes.
            </p>

            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button asChild size="lg" className="bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-glow hover:opacity-90 animate-pulse-glow">
                <Link to="/auth">
                  Book your first flight <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/auth">Sign in</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid gap-6 md:grid-cols-3">
          {[
            { icon: MapPin, title: "Tap to book", text: "Pick start and end points right on the map. Distance and fare update instantly." },
            { icon: Zap, title: "3 minute lift-off", text: "AeroJet luxury class arrives in minutes. AeroLite economy is always nearby." },
            { icon: Shield, title: "Autonomous & safe", text: "Triple-redundant flight systems. Real-time air traffic coordination." },
          ].map((f) => (
            <div key={f.title} className="group rounded-2xl border border-border/50 bg-card/50 p-6 backdrop-blur-sm transition-all hover:border-primary/40 hover:shadow-glow">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 text-primary">
                <f.icon className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Tiers */}
      <section className="container mx-auto px-4 py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold md:text-4xl">Choose your altitude</h2>
          <p className="mt-3 text-muted-foreground">Three flight tiers, transparent per-km pricing.</p>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {[
            { name: "AeroLite", price: "₹45", desc: "Smart shared flights", speed: "180 km/h" },
            { name: "AeroPlus", price: "₹85", desc: "Comfort & speed", speed: "240 km/h", featured: true },
            { name: "AeroJet", price: "₹150", desc: "Private luxury cabin", speed: "320 km/h" },
          ].map((t) => (
            <div key={t.name} className={`rounded-2xl border p-8 backdrop-blur-sm ${t.featured ? "border-primary/60 bg-card shadow-glow" : "border-border/50 bg-card/50"}`}>
              {t.featured && <div className="mb-3 inline-block rounded-full bg-primary/20 px-3 py-1 text-xs font-semibold text-primary">Most popular</div>}
              <h3 className="text-2xl font-bold">{t.name}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{t.desc}</p>
              <div className="mt-6 flex items-baseline gap-1">
                <span className="text-4xl font-bold">{t.price}</span>
                <span className="text-muted-foreground">/km</span>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">Cruise {t.speed}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-border/40 py-8 text-center text-sm text-muted-foreground">
        <div className="container mx-auto px-4">
          FlyCab · Autonomous Flying Taxis · Bengaluru
        </div>
      </footer>
    </div>
  );
}
