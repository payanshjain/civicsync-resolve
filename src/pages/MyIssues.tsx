import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Eye, MapPin, Calendar, AlertCircle, CheckCircle, Clock, Image as ImageIcon } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import api from "../lib/api";

const fetchUserReports = async () => {
  const { data } = await api.get('/reports/my-reports');
  return data.data;
};

export default function MyIssues() {
  const { data: issues, isLoading, error } = useQuery({
    queryKey: ['myIssues'],
    queryFn: fetchUserReports
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'in-progress':
        return 'default';
      case 'resolved':
        return 'success';
      default:
        return 'secondary';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'in-progress':
        return <AlertCircle className="w-4 h-4" />;
      case 'resolved':
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading your issues...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-destructive mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Failed to load issues</h2>
          <p className="text-muted-foreground">Please try again later.</p>
        </div>
      </div>
    );
  }

  const pendingCount = issues?.filter(issue => issue.status === 'pending').length || 0;
  const inProgressCount = issues?.filter(issue => issue.status === 'in-progress').length || 0;
  const resolvedCount = issues?.filter(issue => issue.status === 'resolved').length || 0;

  const renderIssues = (filterStatus?: string) => {
    const filteredIssues = filterStatus 
      ? issues?.filter(issue => issue.status === filterStatus)
      : issues;

    if (!filteredIssues || filteredIssues.length === 0) {
      return (
        <div className="text-center py-12">
          <AlertCircle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No issues found for this category</h3>
          <p className="text-muted-foreground">Your reported issues will appear here once submitted.</p>
        </div>
      );
    }

    return (
      <div className="grid gap-6">
        {filteredIssues.map((issue) => (
          <Card key={issue._id} className="shadow-civic">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <CardTitle className="text-lg">{issue.title || issue.category}</CardTitle>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {issue.address}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(issue.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={getStatusColor(issue.status) as any} className="flex items-center gap-1">
                    {getStatusIcon(issue.status)}
                    {issue.status.replace('-', ' ')}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-muted-foreground">{issue.description}</p>
                
                {/* Display uploaded photo */}
                {issue.imageUrl && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <ImageIcon className="w-4 h-4" />
                      Attached Photo
                    </div>
                    <div className="relative">
                      <img 
                        src={issue.imageUrl} 
                        alt="Issue photo" 
                        className="w-full max-w-md h-48 object-cover rounded-lg border shadow-sm hover:shadow-lg transition-shadow cursor-pointer"
                        onClick={() => window.open(issue.imageUrl, '_blank')}
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-10 transition-all rounded-lg flex items-center justify-center opacity-0 hover:opacity-100">
                        <Eye className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between pt-4">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>Category: {issue.category}</span>
                    {issue.severity && <span>Severity: Level {issue.severity}</span>}
                  </div>
                  <Button variant="outline" size="sm">
                    <Eye className="w-4 h-4 mr-1" />
                    View Details
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-accent/20">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">My Issues</h1>
          <p className="text-lg text-muted-foreground">
            Track the status and progress of your reported civic issues
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="shadow-civic">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold">{pendingCount}</p>
                  <p className="text-sm text-muted-foreground">Pending</p>
                </div>
                <Clock className="w-8 h-8 text-warning" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-civic">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold">{inProgressCount}</p>
                  <p className="text-sm text-muted-foreground">In Progress</p>
                </div>
                <AlertCircle className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-civic">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold">{resolvedCount}</p>
                  <p className="text-sm text-muted-foreground">Resolved</p>
                </div>
                <CheckCircle className="w-8 h-8 text-success" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-civic">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold">{issues?.length || 0}</p>
                  <p className="text-sm text-muted-foreground">Total Reports</p>
                </div>
                <Eye className="w-8 h-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Issues List */}
        <Card className="shadow-civic-strong">
          <CardContent className="p-0">
            <Tabs defaultValue="all" className="w-full">
              <div className="px-6 pt-6">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="all">All Issues</TabsTrigger>
                  <TabsTrigger value="pending">Pending</TabsTrigger>
                  <TabsTrigger value="in-progress">In Progress</TabsTrigger>
                  <TabsTrigger value="resolved">Resolved</TabsTrigger>
                </TabsList>
              </div>

              <div className="p-6">
                <TabsContent value="all">
                  {renderIssues()}
                </TabsContent>
                <TabsContent value="pending">
                  {renderIssues('pending')}
                </TabsContent>
                <TabsContent value="in-progress">
                  {renderIssues('in-progress')}
                </TabsContent>
                <TabsContent value="resolved">
                  {renderIssues('resolved')}
                </TabsContent>
              </div>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
