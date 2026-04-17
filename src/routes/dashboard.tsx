import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/lib/auth";
import { Navbar } from "@/components/Navbar";
import { MapPicker, type LatLng } from "@/components/MapPicker";
import { Button } from "@/components/ui/button";
import { haversineKm, TIERS, type TierId } from "@/lib/distance";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, MapPin, Navigation, RotateCcw, Plane } from "lucide-react";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Book a flight — FlyCab" },
      { name: "description", content: "Pick start and destination on the map and book your flying taxi." },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [start, setStart] = useState<LatLng | null>(null);
  const [end, setEnd] = useState<LatLng | null>(null);
  const [tier, setTier] = useState<TierId>("premium");
  const [booking, setBooking] = useState(false);

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/auth" });
  }, [user, loading, navigate]);

  const handlePick = (point: LatLng) => {
    if (!start) setStart(point);
    else if (!end) setEnd(point);
    else {
      // both set — restart with new start
      setStart(point);
      setEnd(null);
    }
  };

  const distanceKm = useMemo(() => {
    if (!start || !end) return 0;
    return haversineKm(start.lat, start.lng, end.lat, end.lng);
  }, [start, end]);

  const selectedTier = TIERS.find((t) => t.id === tier)!;
  const fare = distanceKm * selectedTier.pricePerKm;

  const reset = () => {
    setStart(null);
    setEnd(null);
  };

  const book = async () => {
    if (!user || !start || !end) return;
    setBooking(true);
    const { error } = await supabase.from("rides").insert({
      user_id: user.id,
      start_lat: start.lat,
      start_lng: start.lng,
      start_address: `${start.lat.toFixed(4)}, ${start.lng.toFixed(4)}`,
      end_lat: end.lat,
      end_lng: end.lng,
      end_address: `${end.lat.toFixed(4)}, ${end.lng.toFixed(4)}`,
      distance_km: Number(distanceKm.toFixed(2)),
      tier,
      price: Number(fare.toFixed(2)),
    });
    setBooking(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success(`🛸 ${selectedTier.name} dispatched! Lift-off in ${selectedTier.eta} min.`);
    reset();
    navigate({ to: "/history" });
  };

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const step = !start ? "Tap the map to set your pickup point" : !end ? "Now tap your destination" : "Choose a tier and book your flight";

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_400px]">
          {/* Map */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold">Plan your flight</h1>
                <p className="text-sm text-muted-foreground">{step}</p>
              </div>
              {(start || end) && (
                <Button variant="ghost" size="sm" onClick={reset}>
                  <RotateCcw className="h-4 w-4 mr-2" /> Reset
                </Button>
              )}
            </div>
            <div className="h-[500px] lg:h-[calc(100vh-200px)] rounded-2xl border border-border/50 overflow-hidden shadow-glow">
              <MapPicker start={start} end={end} onPick={handlePick} />
            </div>
          </div>

          {/* Booking panel */}
          <div className="space-y-4">
            {/* Points */}
            <div className="rounded-2xl border border-border/50 bg-card/50 p-5 backdrop-blur-sm">
              <div className="flex items-start gap-3">
                <div className="mt-1 flex h-3 w-3 flex-shrink-0 items-center justify-center rounded-full" style={{ background: "oklch(0.85 0.2 195)", boxShadow: "0 0 10px oklch(0.85 0.2 195)" }} />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Pickup</p>
                  <p className="text-sm font-medium truncate">
                    {start ? `${start.lat.toFixed(4)}, ${start.lng.toFixed(4)}` : <span className="text-muted-foreground">Tap map…</span>}
                  </p>
                </div>
              </div>
              <div className="my-3 ml-1.5 h-6 w-px bg-border" />
              <div className="flex items-start gap-3">
                <div className="mt-1 flex h-3 w-3 flex-shrink-0 items-center justify-center rounded-full" style={{ background: "oklch(0.72 0.22 305)", boxShadow: "0 0 10px oklch(0.72 0.22 305)" }} />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Destination</p>
                  <p className="text-sm font-medium truncate">
                    {end ? `${end.lat.toFixed(4)}, ${end.lng.toFixed(4)}` : <span className="text-muted-foreground">Tap map…</span>}
                  </p>
                </div>
              </div>

              {distanceKm > 0 && (
                <div className="mt-4 flex items-center justify-between rounded-lg bg-secondary/50 px-3 py-2">
                  <span className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Navigation className="h-3.5 w-3.5" /> Flight distance
                  </span>
                  <span className="font-semibold text-primary">{distanceKm.toFixed(2)} km</span>
                </div>
              )}
            </div>

            {/* Tiers */}
            <div className="space-y-2">
              <p className="px-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">Select tier</p>
              {TIERS.map((t) => {
                const active = tier === t.id;
                const tierFare = distanceKm * t.pricePerKm;
                return (
                  <button
                    key={t.id}
                    onClick={() => setTier(t.id)}
                    className={`w-full rounded-xl border p-4 text-left transition-all ${
                      active
                        ? "border-primary bg-primary/10 shadow-glow"
                        : "border-border/50 bg-card/50 hover:border-border"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${active ? "bg-gradient-to-br from-primary to-accent" : "bg-secondary"}`}>
                          <Plane className={`h-5 w-5 ${active ? "text-primary-foreground" : "text-muted-foreground"}`} />
                        </div>
                        <div>
                          <p className="font-semibold">{t.name}</p>
                          <p className="text-xs text-muted-foreground">{t.tagline} · {t.eta} min ETA</p>
                        </div>
                      </div>
                      <div className="text-right">
                        {distanceKm > 0 ? (
                          <p className="font-bold">₹{tierFare.toFixed(0)}</p>
                        ) : (
                          <p className="text-sm font-medium">₹{t.pricePerKm}/km</p>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Book */}
            <Button
              size="lg"
              disabled={!start || !end || booking}
              onClick={book}
              className="w-full bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-glow hover:opacity-90 disabled:opacity-50"
            >
              {booking ? (
                <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Dispatching…</>
              ) : !start || !end ? (
                <><MapPin className="h-4 w-4 mr-2" /> Pick two points</>
              ) : (
                <>Book {selectedTier.name} · ₹{fare.toFixed(0)}</>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
