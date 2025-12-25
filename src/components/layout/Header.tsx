import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Menu, X, Sparkles, User, LogOut } from "lucide-react";

const navigation = [
  { name: "Home", href: "/" },
  { name: "Create Board", href: "/create" },
  { name: "My Boards", href: "/my-boards", requiresAuth: true },
  { name: "Examples", href: "/examples" },
  { name: "How It Works", href: "/how-to-create" },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { user, logout, isLoading } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = async () => {
    await logout();
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full glass-effect">
      <nav className="container-wide flex h-16 items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 text-xl font-display font-semibold text-foreground transition-colors hover:text-primary"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Sparkles className="h-5 w-5" />
          </div>
          <span className="hidden sm:inline">VisionBoard</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex md:items-center md:gap-1">
          {navigation.map((item) => {
            if ('requiresAuth' in item && item.requiresAuth && !user) return null;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  isActive(item.href)
                    ? "bg-secondary text-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                }`}
              >
                {item.name}
              </Link>
            );
          })}
        </div>

        {/* CTA / User Menu */}
        <div className="hidden md:flex md:items-center md:gap-3">
          {!isLoading && (
            <>
              {user ? (
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-secondary text-sm">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="text-foreground max-w-[150px] truncate">
                      {user.email}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleLogout}
                    className="text-muted-foreground"
                  >
                    <LogOut className="h-4 w-4 mr-1" />
                    Sign Out
                  </Button>
                </div>
              ) : (
                <>
                  <Link to="/auth">
                    <Button variant="ghost" size="default">
                      Log In
                    </Button>
                  </Link>
                  <Link to="/create">
                    <Button variant="hero" size="default">
                      Start Creating
                    </Button>
                  </Link>
                </>
              )}
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          className="md:hidden inline-flex items-center justify-center rounded-lg p-2 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-background animate-fade-in">
          <div className="container-wide py-4 space-y-2">
            {navigation.map((item) => {
              if ('requiresAuth' in item && item.requiresAuth && !user) return null;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`block px-4 py-3 text-base font-medium rounded-lg transition-colors ${
                    isActive(item.href)
                      ? "bg-secondary text-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              );
            })}
            <div className="pt-4 border-t border-border space-y-2">
              {!isLoading && (
                <>
                  {user ? (
                    <>
                      <div className="flex items-center gap-2 px-4 py-2 text-sm text-muted-foreground">
                        <User className="h-4 w-4" />
                        <span className="truncate">{user.email}</span>
                      </div>
                      <Button
                        variant="outline"
                        size="lg"
                        className="w-full"
                        onClick={handleLogout}
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Sign Out
                      </Button>
                    </>
                  ) : (
                    <>
                      <Link to="/auth" onClick={() => setMobileMenuOpen(false)}>
                        <Button variant="outline" size="lg" className="w-full">
                          Log In
                        </Button>
                      </Link>
                      <Link to="/create" onClick={() => setMobileMenuOpen(false)}>
                        <Button variant="hero" size="lg" className="w-full">
                          Start Creating
                        </Button>
                      </Link>
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
