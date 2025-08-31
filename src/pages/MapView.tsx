import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Filter, Eye, Calendar } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const mockIssues = [
  {
    id: 1,
    category: "Roads & Infrastructure",
    location: "Main St & Oak Ave",
    description: "Large pothole causing traffic issues",
    status: "pending",
    date: "2024-01-15",
    priority: "high"
  },
  {
    id: 2,
    category: "Streetlights",
    location: "Park Avenue",
    description: "Street light not working",
    status: "in-progress",
    date: "2024-01-14",
    priority: "medium"
  },
  {
    id: 3,
    category: "Sanitation & Waste",
    location: "Elm Street",
    description: "Overflowing trash bin",
    status: "resolved",
    date: "2024-01-13",
    priority: "low"
  }
];

export default function MapView() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "warning";
      case "in-progress": return "default";
      case "resolved": return "success";
      default: return "default";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "destructive";
      case "medium": return "warning";
      case "low": return "secondary";
      default: return "default";
    }
  };

  const filteredIssues = mockIssues.filter(issue => {
    if (selectedCategory !== "all" && issue.category !== selectedCategory) return false;
    if (selectedStatus !== "all" && issue.status !== selectedStatus) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-primary-light/20">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">City Issues Map</h1>
          <p className="text-lg text-muted-foreground">
            View all reported civic issues across the city
          </p>
        </div>

        {/* Filters */}
        <Card className="mb-6 shadow-civic">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-primary" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 flex-wrap">
              <div className="min-w-48">
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="Roads & Infrastructure">Roads & Infrastructure</SelectItem>
                    <SelectItem value="Streetlights">Streetlights</SelectItem>
                    <SelectItem value="Sanitation & Waste">Sanitation & Waste</SelectItem>
                    <SelectItem value="Water & Utilities">Water & Utilities</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="min-w-48">
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Map Placeholder */}
        <div className="grid lg:grid-cols-2 gap-6">
          <Card className="shadow-civic-strong">
            <CardHeader>
              <CardTitle>Interactive Map</CardTitle>
              <CardDescription>
                Click on markers to view issue details
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-gradient-to-br from-primary-light to-primary-light/50 rounded-lg h-96 flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="w-16 h-16 text-primary mx-auto mb-4" />
                  <p className="text-muted-foreground">Interactive map will be displayed here</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Connect to Supabase to enable map functionality
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Issues List */}
          <Card className="shadow-civic-strong">
            <CardHeader>
              <CardTitle>Recent Issues</CardTitle>
              <CardDescription>
                {filteredIssues.length} issues found
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {filteredIssues.map((issue) => (
                  <div key={issue.id} className="border border-border rounded-lg p-4 hover:bg-secondary/50 transition-colors">
                    <div className="flex gap-3">
                      {/* Placeholder Image */}
                      <div className="w-16 h-16 bg-gradient-to-br from-primary-light to-primary rounded-lg flex items-center justify-center flex-shrink-0">
                        <MapPin className="w-6 h-6 text-primary" />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex gap-2">
                            <Badge variant={getStatusColor(issue.status) as any}>
                              {issue.status}
                            </Badge>
                            <Badge variant={getPriorityColor(issue.priority) as any}>
                              {issue.priority}
                            </Badge>
                          </div>
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </div>
                        <h3 className="font-semibold text-foreground">{issue.category}</h3>
                        <p className="text-sm text-muted-foreground mb-2">
                          <MapPin className="w-3 h-3 inline mr-1" />
                          {issue.location}
                        </p>
                        <p className="text-sm text-foreground mb-2">{issue.description}</p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {issue.date}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}