import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { LogOut, Plane } from "lucide-react";

export function Navbar() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { location } = useRouterState();

  const handleSignOut = async () => {
    await signOut();
    navigate({ to: "/" });
  };

  const linkCls = (path: string) =>
    `text-sm font-medium transition-colors hover:text-primary ${
      location.pathname === path ? "text-primary" : "text-muted-foreground"
    }`;

  return (
    <header className="sticky top-0 z-40 border-b border-border/40 bg-background/70 backdrop-blur-xl">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent shadow-glow">
            <Plane className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold tracking-tight">
            Fly<span className="text-primary">Cab</span>
          </span>
        </Link>

        <nav className="flex items-center gap-6">
          {user && (
            <>
              <Link to="/dashboard" className={linkCls("/dashboard")}>
                Book
              </Link>
              <Link to="/history" className={linkCls("/history")}>
                History
              </Link>
            </>
          )}
          {user ? (
            <Button variant="ghost" size="sm" onClick={handleSignOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign out
            </Button>
          ) : (
            <>
              <Link to="/auth" className={linkCls("/auth")}>
                Sign in
              </Link>
              <Button asChild size="sm" className="bg-gradient-to-r from-primary to-accent text-primary-foreground hover:opacity-90">
                <Link to="/auth">Get started</Link>
              </Button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
