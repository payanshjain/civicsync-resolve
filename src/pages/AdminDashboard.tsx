import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Eye, Edit, CheckCircle, Clock, AlertTriangle, FileText, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import api from "../lib/api";

// Define TypeScript types for our data
interface ReportStats {
  total: number;
  pending: number;
  inProgress?: number;
  resolved: number;
}

interface Report {
  _id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  createdAt: string;
  status: 'pending' | 'in-progress' | 'resolved';
  priority?: 'low' | 'medium' | 'high';
  userId: {
    email: string;
  };
}

// Fetcher functions for React Query
const fetchReportStats = async (): Promise<ReportStats> => {
  const { data } = await api.get('/reports/stats');
  return data.data;
};

const fetchAllReports = async (): Promise<Report[]> => {
  const { data } = await api.get('/reports');
  return data.data;
};

export default function AdminDashboard() {
  // Fetch stats and reports in parallel
  const { data: stats, isLoading: isLoadingStats, error: statsError } = useQuery({
    queryKey: ['reportStats'],
    queryFn: fetchReportStats,
    retry: 1
  });

  const { data: reports, isLoading: isLoadingReports, error: reportsError } = useQuery({
    queryKey: ['allReports'],
    queryFn: fetchAllReports,
    retry: 1
  });

  // Helper functions for styling
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'secondary';
      case 'in-progress':
        return 'default';
      case 'resolved':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'destructive';
      case 'medium':
        return 'default';
      case 'low':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  if (isLoadingStats || isLoadingReports) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
        <p className="ml-4 text-lg">Loading Dashboard Data...</p>
      </div>
    );
  }

  if (statsError || reportsError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-16 h-16 text-destructive mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Failed to Load Dashboard</h2>
          <p className="text-muted-foreground">
            Error loading dashboard data. Please check your connection and try again.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">Admin Dashboard</h1>
          <p className="text-lg text-muted-foreground">
            Manage civic issues and monitor city-wide reporting
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="shadow-civic">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Issues</CardTitle>
              <FileText className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.total ?? 0}</div>
            </CardContent>
          </Card>
          <Card className="shadow-civic">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <Clock className="w-4 h-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.pending ?? 0}</div>
            </CardContent>
          </Card>
          <Card className="shadow-civic">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">In Progress</CardTitle>
              <AlertTriangle className="w-4 h-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.inProgress ?? 0}</div>
            </CardContent>
          </Card>
          <Card className="shadow-civic">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Resolved</CardTitle>
              <CheckCircle className="w-4 h-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.resolved ?? 0}</div>
            </CardContent>
          </Card>
        </div>

        {/* Reports Table */}
        <Card className="shadow-civic-strong">
          <CardHeader>
            <CardTitle>Recent Issue Reports</CardTitle>
            <CardDescription>
              Manage and track all reported civic issues
            </CardDescription>
          </CardHeader>
          <CardContent>
            {reports && reports.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Reporter</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reports.map((report) => (
                    <TableRow key={report._id}>
                      <TableCell className="font-medium">
                        {report.title || 'Untitled Report'}
                      </TableCell>
                      <TableCell>{report.category || 'General'}</TableCell>
                      <TableCell>{report.location || 'Not specified'}</TableCell>
                      <TableCell>
                        {new Date(report.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusColor(report.status) as any}>
                          {report.status.replace('-', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell>{report.userId?.email || 'Anonymous'}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="icon">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Edit className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-8">
                <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Reports Yet</h3>
                <p className="text-muted-foreground">
                  Reports will appear here once users start submitting them.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
