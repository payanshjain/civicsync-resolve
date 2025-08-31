import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, Calendar, Clock, CheckCircle, AlertCircle, Camera, Eye } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const mockUserIssues = [
  {
    id: 1,
    category: "Pan Masala Spitting & Stains",
    location: "MG Road Bus Stop",
    description: "Heavy pan masala stains on bus stop walls",
    status: "resolved",
    date: "2024-01-10",
    priority: "medium",
    progress: 100,
    assignedTo: "Sanitation Dept.",
    resolvedDate: "2024-01-18",
    beforeImage: "/placeholder-before.jpg",
    afterImage: "/placeholder-after.jpg",
    updates: [
      { date: "2024-01-18", message: "Issue resolved. Walls cleaned and anti-spitting signs installed.", status: "resolved" },
      { date: "2024-01-15", message: "Cleaning crew assigned. Work scheduled for this week.", status: "in-progress" },
      { date: "2024-01-11", message: "Issue reported and verified by field inspector.", status: "pending" }
    ]
  },
  {
    id: 2,
    category: "Roads & Potholes",
    location: "Brigade Road Junction",
    description: "Large pothole causing vehicle damage",
    status: "in-progress",
    date: "2024-01-12",
    priority: "high",
    progress: 60,
    assignedTo: "PWD Road Maintenance",
    updates: [
      { date: "2024-01-16", message: "Road repair work started. Expected completion in 2 days.", status: "in-progress" },
      { date: "2024-01-13", message: "Issue assigned to PWD Road Maintenance team.", status: "in-progress" },
      { date: "2024-01-12", message: "Issue reported and prioritized as high.", status: "pending" }
    ]
  },
  {
    id: 3,
    category: "Littering & Garbage Dumping",
    location: "Commercial Street",
    description: "Illegal garbage dumping near market area",
    status: "pending",
    date: "2024-01-15",
    priority: "medium",
    progress: 20,
    assignedTo: "BBMP Waste Management",
    updates: [
      { date: "2024-01-16", message: "Issue assigned to BBMP Waste Management team.", status: "pending" },
      { date: "2024-01-15", message: "Issue reported and under review.", status: "pending" }
    ]
  }
];

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

const getStatusIcon = (status: string) => {
  switch (status) {
    case "pending": return <AlertCircle className="w-4 h-4" />;
    case "in-progress": return <Clock className="w-4 h-4" />;
    case "resolved": return <CheckCircle className="w-4 h-4" />;
    default: return <AlertCircle className="w-4 h-4" />;
  }
};

export default function MyIssues() {
  const [selectedTab, setSelectedTab] = useState("all");

  const filteredIssues = mockUserIssues.filter(issue => {
    if (selectedTab === "all") return true;
    return issue.status === selectedTab;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-primary-light/20">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">My Reported Issues</h1>
          <p className="text-lg text-muted-foreground">
            Track the status and progress of your reported civic issues
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-4 mb-6">
          <Card className="shadow-civic">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-warning/20 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-warning" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">1</p>
                  <p className="text-sm text-muted-foreground">Pending</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-civic">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/20 rounded-lg">
                  <Clock className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">1</p>
                  <p className="text-sm text-muted-foreground">In Progress</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-civic">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-success/20 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-success" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">1</p>
                  <p className="text-sm text-muted-foreground">Resolved</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-civic">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-primary to-secondary rounded-lg">
                  <MapPin className="w-5 h-5 text-primary-foreground" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">3</p>
                  <p className="text-sm text-muted-foreground">Total Reports</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filter Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="mb-6">
          <TabsList className="grid w-full max-w-md grid-cols-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="in-progress">In Progress</TabsTrigger>
            <TabsTrigger value="resolved">Resolved</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Issues List */}
        <div className="space-y-6">
          {filteredIssues.map((issue) => (
            <Card key={issue.id} className="shadow-civic-strong">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {getStatusIcon(issue.status)}
                      {issue.category}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-2 mt-1">
                      <MapPin className="w-3 h-3" />
                      {issue.location}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant={getStatusColor(issue.status) as any}>
                      {issue.status}
                    </Badge>
                    <Badge variant={getPriorityColor(issue.priority) as any}>
                      {issue.priority}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-4">
                  <p className="text-foreground">{issue.description}</p>
                  
                  {/* Progress Bar */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="text-foreground font-medium">{issue.progress}%</span>
                    </div>
                    <Progress value={issue.progress} className="h-2" />
                  </div>
                  
                  {/* Issue Details */}
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Reported:</span>
                      <span className="text-foreground">{issue.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">Assigned to:</span>
                      <span className="text-foreground">{issue.assignedTo}</span>
                    </div>
                    {issue.resolvedDate && (
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-success" />
                        <span className="text-muted-foreground">Resolved:</span>
                        <span className="text-foreground">{issue.resolvedDate}</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Before/After Images for Resolved Issues */}
                  {issue.status === "resolved" && issue.beforeImage && issue.afterImage && (
                    <div className="space-y-3">
                      <h4 className="font-semibold text-foreground">Before & After</h4>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <p className="text-sm text-muted-foreground">Before</p>
                          <div className="w-full h-32 bg-gradient-to-br from-destructive/20 to-destructive/10 rounded-lg flex items-center justify-center">
                            <Camera className="w-8 h-8 text-destructive" />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <p className="text-sm text-muted-foreground">After</p>
                          <div className="w-full h-32 bg-gradient-to-br from-success/20 to-success/10 rounded-lg flex items-center justify-center">
                            <CheckCircle className="w-8 h-8 text-success" />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Updates Timeline */}
                  <div className="space-y-3">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" className="w-full">
                          <Eye className="w-4 h-4 mr-2" />
                          View Updates Timeline
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Issue Updates Timeline</DialogTitle>
                          <DialogDescription>
                            Track all updates and progress on issue #{issue.id}
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 max-h-96 overflow-y-auto">
                          {issue.updates.map((update, index) => (
                            <div key={index} className="flex gap-3 p-3 border border-border rounded-lg">
                              <div className="flex-shrink-0">
                                {getStatusIcon(update.status)}
                              </div>
                              <div className="flex-1">
                                <div className="flex justify-between items-start mb-1">
                                  <Badge variant={getStatusColor(update.status) as any} className="text-xs">
                                    {update.status}
                                  </Badge>
                                  <span className="text-xs text-muted-foreground">{update.date}</span>
                                </div>
                                <p className="text-sm text-foreground">{update.message}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}