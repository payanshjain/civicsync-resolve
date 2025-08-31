import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Eye, Edit, CheckCircle, Clock, AlertTriangle, FileText, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import api from "../lib/api";

// Define TypeScript types for our data
interface ReportStats {
  totalIssues: number;
  pending: number;
  inProgress: number;
  resolved: number;
}

interface Report {
  _id: string;
  category: string;
  address: string;
  createdAt: string;
  status: 'pending' | 'in-progress' | 'resolved';
  priority: 'low' | 'medium' | 'high';
  assignedTo: string;
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
  const { data: stats, isLoading: isLoadingStats } = useQuery({
    queryKey: ['reportStats'],
    queryFn: fetchReportStats
  });

  const { data: reports, isLoading: isLoadingReports } = useQuery({
    queryKey: ['allReports'],
    queryFn: fetchAllReports
  });

  // Helper functions for styling
  const getStatusColor = (status: string) => {
    // ... (same as before)
  };
  const getPriorityColor = (priority: string) => {
    // ... (same as before)
  };

  if (isLoadingStats || isLoadingReports) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
        <p className="ml-4 text-lg">Loading Dashboard Data...</p>
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

        {/* Stats Cards - Now with real data */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="shadow-civic">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Issues</CardTitle>
              <FileText className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalIssues ?? 0}</div>
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

        {/* Reports Table - Now with real data */}
        <Card className="shadow-civic-strong">
          <CardHeader>
            <CardTitle>Recent Issue Reports</CardTitle>
            <CardDescription>
              Manage and track all reported civic issues
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Category</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Assignee</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reports?.map((report) => (
                  <TableRow key={report._id}>
                    <TableCell className="font-medium">{report.category}</TableCell>
                    <TableCell>{report.address}</TableCell>
                    <TableCell>{new Date(report.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusColor(report.status) as any}>{report.status}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getPriorityColor(report.priority) as any}>{report.priority}</Badge>
                    </TableCell>
                    <TableCell>{report.assignedTo}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="icon"><Eye className="w-4 h-4" /></Button>
                        <Button variant="ghost" size="icon"><Edit className="w-4 h-4" /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}