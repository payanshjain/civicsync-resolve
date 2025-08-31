import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, Calendar, Clock, CheckCircle, AlertCircle, Camera, Eye, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";

// Define a type for our issue data for better type safety
interface Issue {
  _id: string;
  category: string;
  address: string;
  description: string;
  status: 'pending' | 'in-progress' | 'resolved';
  createdAt: string;
  priority: 'low' | 'medium' | 'high';
  assignedTo: string;
  // Add other fields from your backend model as needed
}

// Fetcher function for React Query
const fetchMyIssues = async (): Promise<Issue[]> => {
  const { data } = await api.get('/reports/my-reports');
  return data.data; // Our backend wraps data in a 'data' property
};

// Helper functions remain the same
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

  const { data: issues, isLoading, isError } = useQuery<Issue[]>({
    queryKey: ['myIssues'], // A unique key for this query
    queryFn: fetchMyIssues,  // The function that will fetch the data
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
        <p className="ml-4 text-lg">Loading your issues...</p>
      </div>
    );
  }

  if (isError || !issues) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg text-destructive">Failed to load issues. Please try again later.</p>
      </div>
    );
  }

  const filteredIssues = issues.filter(issue => {
    if (selectedTab === "all") return true;
    return issue.status === selectedTab;
  });

  const pendingCount = issues.filter(i => i.status === 'pending').length;
  const inProgressCount = issues.filter(i => i.status === 'in-progress').length;
  const resolvedCount = issues.filter(i => i.status === 'resolved').length;


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
                  <p className="text-2xl font-bold text-foreground">{pendingCount}</p>
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
                  <p className="text-2xl font-bold text-foreground">{inProgressCount}</p>
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
                  <p className="text-2xl font-bold text-foreground">{resolvedCount}</p>
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
                  <p className="text-2xl font-bold text-foreground">{issues.length}</p>
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
          {filteredIssues.length === 0 ? (
            <Card className="shadow-civic-strong">
              <CardContent className="p-8 text-center">
                <p className="text-muted-foreground">No issues found for this category.</p>
              </CardContent>
            </Card>
          ) : (
            filteredIssues.map((issue) => (
              <Card key={issue._id} className="shadow-civic-strong">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {getStatusIcon(issue.status)}
                        {issue.category}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-2 mt-1">
                        <MapPin className="w-3 h-3" />
                        {issue.address}
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
                   <p className="text-foreground mb-4">{issue.description}</p>
                   {/* More details can be added here from the 'issue' object */}
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}