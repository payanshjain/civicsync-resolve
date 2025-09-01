import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MapPin, FileText, BarChart3, User, LogOut, Menu, X, Home } from "lucide-react";
import { useState, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useAuth } from "../context/AuthContext";

export function Layout({ children }: { children: ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { isAuthenticated, user, logout } = useAuth();

  // Debug logs to help troubleshoot admin access
  console.log('Layout - Current user:', user);
  console.log('Layout - User role:', user?.role);
  console.log('Layout - Is authenticated:', isAuthenticated);
  console.log('Layout - Is admin?', user?.role === 'admin');

  const isActive = (path: string) => location.pathname === path;

  const navigation = [
    { name: "Home", href: "/", icon: Home, show: true },
    { name: "Report Issue", href: "/report", icon: FileText, show: isAuthenticated },
    { name: "View Map", href: "/map", icon: MapPin, show: true },
    { name: "My Issues", href: "/my-issues", icon: FileText, show: isAuthenticated },
    { name: "My Profile", href: "/profile", icon: User, show: isAuthenticated },
    { name: "Dashboard", href: "/admin", icon: BarChart3, show: isAuthenticated && user?.role === 'admin' },
    { name: "Analytics", href: "/analytics", icon: BarChart3, show: isAuthenticated && user?.role === 'admin' },
  ];

  const visibleNavigation = navigation.filter(item => item.show);

  console.log('Layout - Visible navigation:', visibleNavigation.map(nav => nav.name));

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-civic">
              <MapPin className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold bg-gradient-civic bg-clip-text text-transparent">
              CivicSync
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {visibleNavigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    isActive(item.href)
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-2">
                <div className="hidden sm:block text-sm">
                  <p className="font-medium">{user?.email}</p>
                  <p className="text-xs text-muted-foreground capitalize">
                    {user?.role === 'admin' ? 'Administrator' : 'Citizen'}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={logout}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <Link to="/login">
                <Button variant="default" className="bg-gradient-civic hover:bg-primary-dark">
                  Sign In
                </Button>
              </Link>
            )}

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t">
            <div className="container py-4">
              <nav className="flex flex-col space-y-2">
                {visibleNavigation.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={cn(
                        "flex items-center space-x-3 px-3 py-3 rounded-md text-sm font-medium transition-colors",
                        isActive(item.href)
                          ? "bg-accent text-accent-foreground"
                          : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                      )}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}

                {/* Mobile User Info */}
                {isAuthenticated && (
                  <div className="mt-4 pt-4 border-t">
                    <div className="px-3 py-2">
                      <p className="font-medium text-sm">{user?.email}</p>
                      <p className="text-xs text-muted-foreground capitalize">
                        {user?.role === 'admin' ? 'Administrator' : 'Citizen'}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      onClick={logout}
                      className="w-full justify-start px-3 mt-2 text-muted-foreground hover:text-foreground"
                    >
                      <LogOut className="w-4 h-4 mr-3" />
                      Sign Out
                    </Button>
                  </div>
                )}
              </nav>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t bg-muted/50">
        <div className="container py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="flex h-6 w-6 items-center justify-center rounded bg-gradient-civic">
                  <MapPin className="h-4 w-4 text-primary-foreground" />
                </div>
                <span className="font-semibold">CivicSync</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Empowering citizens to improve their communities through transparent civic engagement.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-3">Platform</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/map" className="hover:text-foreground transition-colors">Issue Map</Link></li>
                <li><Link to="/report" className="hover:text-foreground transition-colors">Report Issue</Link></li>
                <li><Link to="/my-issues" className="hover:text-foreground transition-colors">My Reports</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-3">Support</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Community Guidelines</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-3">Legal</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Cookie Policy</a></li>
              </ul>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t text-center text-sm text-muted-foreground">
            <p>&copy; 2025 CivicSync. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
