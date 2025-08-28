import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { MapPin, FileText, Users, BarChart3, CheckCircle, Clock } from "lucide-react";
import heroImage from "@/assets/civic-hero.jpg";

const features = [
  {
    icon: FileText,
    title: "Easy Reporting",
    description: "Report civic issues quickly with our simple form and automatic location detection."
  },
  {
    icon: MapPin,
    title: "Interactive Map",
    description: "View all reported issues on an interactive city map with real-time updates."
  },
  {
    icon: BarChart3,
    title: "Analytics Dashboard",
    description: "Track resolution progress and gain insights into city-wide issue trends."
  },
  {
    icon: Users,
    title: "Community Driven",
    description: "Work together as a community to identify and resolve civic challenges."
  }
];

const stats = [
  { label: "Issues Resolved", value: "1,247", icon: CheckCircle },
  { label: "Active Citizens", value: "3,891", icon: Users },
  { label: "Avg Response Time", value: "2.3 days", icon: Clock },
  { label: "City Departments", value: "12", icon: BarChart3 }
];

const Index = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section 
        className="relative h-screen flex items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary-dark/80"></div>
        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in">
            Make Your City Better
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-white/90 animate-fade-in">
            Report civic issues, track their progress, and help build a stronger community together
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in">
            <Button 
              size="lg" 
              className="bg-white text-primary hover:bg-white/90 text-lg px-8 py-6"
              asChild
            >
              <Link to="/report">Report an Issue</Link>
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-white text-white hover:bg-white/10 text-lg px-8 py-6"
              asChild
            >
              <Link to="/map">View City Map</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-card">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <Card key={index} className="text-center shadow-civic hover:shadow-civic-strong transition-shadow">
                  <CardContent className="p-6">
                    <Icon className="w-8 h-8 text-primary mx-auto mb-3" />
                    <div className="text-3xl font-bold text-foreground mb-1">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              How CivicSync Works
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Our platform connects citizens with local government to identify, report, and resolve civic issues efficiently
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="shadow-civic hover:shadow-civic-strong transition-all duration-300 hover:scale-105">
                  <CardHeader>
                    <div className="w-12 h-12 bg-gradient-civic rounded-lg flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-hero text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Make a Difference?
          </h2>
          <p className="text-xl mb-8 text-white/90 max-w-2xl mx-auto">
            Join thousands of citizens already using CivicSync to improve their communities. 
            Report your first issue today!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-white text-primary hover:bg-white/90 text-lg px-8 py-6"
              asChild
            >
              <Link to="/report">Get Started</Link>
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-white text-white hover:bg-white/10 text-lg px-8 py-6"
              asChild
            >
              <Link to="/login">Sign In</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-civic rounded-lg flex items-center justify-center">
                <MapPin className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-foreground">CivicSync</span>
            </div>
            <div className="text-muted-foreground text-center md:text-right">
              <p>&copy; 2024 CivicSync. Making cities better, together.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
