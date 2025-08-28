import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, TrendingUp, MapPin, Clock, Users, AlertCircle } from "lucide-react";

const categoryData = [
  { name: "Roads & Infrastructure", count: 45, percentage: 35 },
  { name: "Streetlights", count: 32, percentage: 25 },
  { name: "Sanitation & Waste", count: 25, percentage: 20 },
  { name: "Water & Utilities", count: 15, percentage: 12 },
  { name: "Other", count: 10, percentage: 8 }
];

export default function Analytics() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-accent/20">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">Analytics Dashboard</h1>
          <p className="text-lg text-muted-foreground">
            Comprehensive insights into civic issue reporting and resolution
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="shadow-civic">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Resolution Time</CardTitle>
              <Clock className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">4.2 days</div>
              <p className="text-xs text-success">
                <TrendingUp className="w-3 h-3 inline mr-1" />
                15% faster than last month
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-civic">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Users</CardTitle>
              <Users className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,247</div>
              <p className="text-xs text-success">
                <TrendingUp className="w-3 h-3 inline mr-1" />
                +23% new registrations
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-civic">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Critical Issues</CardTitle>
              <AlertCircle className="w-4 h-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8</div>
              <p className="text-xs text-muted-foreground">
                Requiring immediate attention
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-civic">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Hotspot Areas</CardTitle>
              <MapPin className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">
                High-frequency report zones
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Issues by Category */}
          <Card className="shadow-civic-strong">
            <CardHeader>
              <CardTitle>Issues by Category</CardTitle>
              <CardDescription>
                Distribution of reported issues across different categories
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {categoryData.map((item) => (
                  <div key={item.name} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">{item.name}</span>
                      <span className="text-muted-foreground">{item.count} issues</span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div 
                        className="bg-gradient-civic h-2 rounded-full transition-all duration-300"
                        style={{ width: `${item.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Resolution Time Trends */}
          <Card className="shadow-civic-strong">
            <CardHeader>
              <CardTitle>Resolution Time Trends</CardTitle>
              <CardDescription>
                Average time to resolve issues over the past 6 months
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-gradient-to-br from-primary-light to-primary-light/50 rounded-lg h-64 flex items-center justify-center">
                <div className="text-center">
                  <BarChart3 className="w-16 h-16 text-primary mx-auto mb-4" />
                  <p className="text-muted-foreground">Interactive chart coming soon</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Connect to Supabase to enable analytics
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Heatmap */}
        <Card className="shadow-civic-strong">
          <CardHeader>
            <CardTitle>Issue Heatmap</CardTitle>
            <CardDescription>
              Geographic distribution of reported issues across the city
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-gradient-to-br from-accent/30 to-primary-light/30 rounded-lg h-96 flex items-center justify-center">
              <div className="text-center">
                <MapPin className="w-16 h-16 text-primary mx-auto mb-4" />
                <p className="text-muted-foreground">City heatmap will be displayed here</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Interactive map showing issue density by location
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}