import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Plane, MapPin, ArrowRight } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

export const Route = createFileRoute("/history")({
  head: () => ({
    meta: [
      { title: "Ride history — FlyCab" },
      { name: "description", content: "Your past FlyCab flights." },
    ],
  }),
  component: HistoryPage,
});

type Ride = Tables<"rides">;

const TIER_LABEL: Record<string, string> = {
  economy: "AeroLite",
  premium: "AeroPlus",
  luxury: "AeroJet",
};

function HistoryPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [rides, setRides] = useState<Ride[] | null>(null);

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/auth" });
  }, [user, loading, navigate]);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("rides")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (error) {
          console.error(error);
          setRides([]);
        } else {
          setRides(data ?? []);
        }
      });
  }, [user]);

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto max-w-3xl px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Flight history</h1>
          <p className="mt-1 text-sm text-muted-foreground">Your previous FlyCab journeys</p>
        </div>

        {rides === null ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : rides.length === 0 ? (
          <div className="rounded-2xl border border-border/50 bg-card/50 p-12 text-center backdrop-blur-sm">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-accent/20">
              <Plane className="h-8 w-8 text-primary animate-float" />
            </div>
            <h2 className="text-lg font-semibold">No flights yet</h2>
            <p className="mt-2 text-sm text-muted-foreground">Book your first FlyCab to see it here.</p>
            <Button asChild className="mt-6 bg-gradient-to-r from-primary to-accent text-primary-foreground">
              <Link to="/dashboard">Book a flight</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {rides.map((r) => (
              <div key={r.id} className="rounded-xl border border-border/50 bg-card/50 p-5 backdrop-blur-sm transition-colors hover:border-primary/40">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="rounded-full bg-primary/15 px-2.5 py-0.5 text-xs font-semibold text-primary">
                        {TIER_LABEL[r.tier] ?? r.tier}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(r.created_at).toLocaleString()}
                      </span>
                    </div>

                    <div className="mt-3 flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-neon flex-shrink-0" />
                      <span className="truncate text-muted-foreground">{r.start_address}</span>
                      <ArrowRight className="h-3 w-3 flex-shrink-0 text-muted-foreground" />
                      <MapPin className="h-4 w-4 text-accent flex-shrink-0" />
                      <span className="truncate text-muted-foreground">{r.end_address}</span>
                    </div>

                    <p className="mt-2 text-xs text-muted-foreground">
                      Distance: <span className="font-medium text-foreground">{Number(r.distance_km).toFixed(2)} km</span>
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-2xl font-bold">₹{Number(r.price).toFixed(0)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
