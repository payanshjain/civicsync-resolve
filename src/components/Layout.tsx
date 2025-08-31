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

  return (
    <div className="min-h-screen bg-background">
      <nav className="bg-card border-b border-border shadow-civic sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-civic rounded-lg flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-foreground">CivicSync</span>
              </Link>
            </div>

            <div className="hidden md:flex items-center space-x-1">
              {visibleNavigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={cn(
                      "flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200",
                      isActive(item.href)
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
              {isAuthenticated ? (
                <Button variant="outline" size="sm" onClick={logout} className="flex items-center gap-2">
                  <LogOut className="w-4 h-4" />
                  Logout
                </Button>
              ) : (
                <Button variant="outline" size="sm" asChild>
                  <Link to="/login">Login</Link>
                </Button>
              )}
            </div>

            <div className="md:hidden flex items-center">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border bg-card">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {visibleNavigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center space-x-3 px-3 py-2 rounded-md text-base font-medium transition-colors",
                    isActive(item.href) ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </Link>
              ))}
              {isAuthenticated ? (
                <Button variant="outline" size="sm" onClick={() => { logout(); setMobileMenuOpen(false); }} className="ml-3 mt-2 w-[calc(100%-1.5rem)]">
                  Logout
                </Button>
              ) : (
                <Button variant="outline" size="sm" asChild className="ml-3 mt-2 w-[calc(100%-1.5rem)]">
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)}>Login</Link>
                </Button>
              )}
            </div>
          </div>
        )}
      </nav>
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}