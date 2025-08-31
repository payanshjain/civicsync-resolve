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
      <section className="relative bg-primary py-20 text-foreground">
        <div className="container mx-auto px-4 text-center max-w-4xl">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
            Report, view, or discuss local problems
          </h1>
          <p className="text-lg md:text-xl mb-8 opacity-80 animate-fade-in">
            (like graffiti, fly tipping, broken paving slabs, or street lighting)
          </p>
          
          <div className="max-w-2xl mx-auto mb-8 animate-fade-in">
            <div className="flex flex-col sm:flex-row gap-2">
              <input 
                type="text" 
                placeholder="Enter a nearby postcode, or street name and area:"
                className="flex-1 px-4 py-3 rounded-md border border-input bg-background text-foreground placeholder:text-muted-foreground"
              />
              <Button size="lg" className="bg-foreground text-background hover:bg-foreground/90 px-8">
                Go
              </Button>
            </div>
            <Button 
              variant="outline" 
              className="mt-4 border-foreground text-foreground hover:bg-foreground/10"
            >
              📍 Use my current location
            </Button>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in">
            <Button 
              size="lg" 
              className="bg-foreground text-background hover:bg-foreground/90 text-lg px-8 py-3"
              asChild
            >
              <Link to="/report">Report a Problem</Link>
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="border-foreground text-foreground hover:bg-foreground/10 text-lg px-8 py-3"
              asChild
            >
              <Link to="/map">View All Reports</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* How to Report Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            {/* Left Column - How to Report */}
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-8">
                How to report a problem
              </h2>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-lg">
                    1
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Enter a nearby postcode, or street name and area</h3>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-lg">
                    2
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Locate the problem on a map of the area</h3>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-lg">
                    3
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Enter details of the problem</h3>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-lg">
                    4
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">We send it to the council on your behalf</h3>
                  </div>
                </div>
              </div>
              
              {/* Stats */}
              <div className="mt-12 grid grid-cols-3 gap-6 text-center">
                <div>
                  <div className="text-3xl font-bold text-foreground">{stats[0].value}</div>
                  <div className="text-sm text-muted-foreground">{stats[0].label}</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-foreground">{stats[1].value}</div>
                  <div className="text-sm text-muted-foreground">Fixed in Past Month</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-foreground">{stats[2].value}</div>
                  <div className="text-sm text-muted-foreground">Updates on Reports</div>
                </div>
              </div>
            </div>
            
            {/* Right Column - Recent Reports */}
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-8">
                Recently reported problems
              </h2>
              <div className="space-y-4">
                <div className="border-l-4 border-primary pl-4 py-2">
                  <div className="text-sm text-muted-foreground mb-1">By roadside</div>
                  <div className="text-sm text-muted-foreground mb-2">09:51 today, last updated 09:51 today</div>
                  <h4 className="font-medium text-foreground">Sunken drain cover o/s 72 Chertsey Road</h4>
                </div>
                <div className="border-l-4 border-primary pl-4 py-2">
                  <div className="text-sm text-muted-foreground mb-2">09:46 today</div>
                  <h4 className="font-medium text-foreground">Manhole cover at entrance to Hancock drive is loose and rattles every time a vehicle goes over it has been like this for months</h4>
                </div>
                <div className="border-l-4 border-primary pl-4 py-2">
                  <div className="text-sm text-muted-foreground mb-1">09:45 today, last updated 10:04 today</div>
                  <h4 className="font-medium text-foreground">Street tree knocked over</h4>
                </div>
                <div className="border-l-4 border-primary pl-4 py-2">
                  <div className="text-sm text-muted-foreground mb-1">09:45 today, last updated 09:45 today</div>
                  <h4 className="font-medium text-foreground">Top of fulwood ave</h4>
                </div>
              </div>
            </div>
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
