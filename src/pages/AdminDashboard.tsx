import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Eye, Edit, CheckCircle, Clock, AlertTriangle, FileText, Loader2, MapPin, Calendar, Image as ImageIcon, Search, Filter } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import api from "../lib/api";

// Define TypeScript types
interface ReportStats {
  total: number;
  pending: number;
  inProgress: number;
  resolved: number;
}

interface Report {
  _id: string;
  title?: string;
  category: string;
  address: string;
  description: string;
  createdAt: string;
  status: 'pending' | 'in-progress' | 'resolved';
  priority?: 'low' | 'medium' | 'high';
  severity?: number;
  imageUrl?: string;
  location?: {
    type: string;
    coordinates: [number, number];
  };
  user: {
    _id: string;
    email: string;
    phone?: string;
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
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

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

  // Helper functions
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'in-progress':
        return 'default';
      case 'resolved':
        return 'success';
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

  const updateReportStatus = async (reportId: string, newStatus: string) => {
    try {
      await api.put(`/reports/${reportId}`, { status: newStatus });
      // Refetch data after update
      window.location.reload(); // Simple refresh, you can use React Query's invalidateQueries for better UX
    } catch (error) {
      console.error('Failed to update report status:', error);
    }
  };

  // Filter reports based on filters
  const filteredReports = reports?.filter(report => {
    const matchesStatus = statusFilter === 'all' || report.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || report.category === categoryFilter;
    const matchesSearch = searchQuery === '' || 
      report.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesStatus && matchesCategory && matchesSearch;
  }) || [];

  // Get unique categories for filter dropdown
  const categories = [...new Set(reports?.map(report => report.category) || [])];

  if (isLoadingStats || isLoadingReports) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-lg">Loading Dashboard Data...</p>
        </div>
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
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">Admin Dashboard</h1>
          <p className="text-lg text-muted-foreground">
            Manage civic issues and monitor city-wide reporting
          </p>
        </div>

        {/* Stats Cards - Dynamic Data */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="shadow-civic">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Issues</CardTitle>
              <FileText className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats?.total ?? 0}</div>
              <p className="text-xs text-muted-foreground">
                Total reports submitted
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-civic">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <Clock className="w-4 h-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{stats?.pending ?? 0}</div>
              <p className="text-xs text-muted-foreground">
                Awaiting review
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-civic">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">In Progress</CardTitle>
              <AlertTriangle className="w-4 h-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats?.inProgress ?? 0}</div>
              <p className="text-xs text-muted-foreground">
                Being worked on
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-civic">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Resolved</CardTitle>
              <CheckCircle className="w-4 h-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats?.resolved ?? 0}</div>
              <p className="text-xs text-muted-foreground">
                Successfully completed
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <div className="flex items-center space-x-2">
                <Search className="w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search reports..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-64"
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-muted-foreground" />
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40">
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

              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="text-sm text-muted-foreground">
                Showing {filteredReports.length} of {reports?.length || 0} reports
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Reports Table with Images */}
        <Card className="shadow-civic-strong">
          <CardHeader>
            <CardTitle>Issue Reports Management</CardTitle>
            <CardDescription>
              Review, update status, and manage all reported civic issues
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredReports && filteredReports.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Image</TableHead>
                      <TableHead>Issue Details</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Reporter</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredReports.map((report) => (
                      <TableRow key={report._id}>
                        {/* Image Column */}
                        <TableCell>
                          {report.imageUrl ? (
                            <div 
                              className="relative w-16 h-16 cursor-pointer"
                              onClick={() => setSelectedImage(report.imageUrl!)}
                            >
                              <img
                                src={report.imageUrl}
                                alt="Issue"
                                className="w-full h-full object-cover rounded-md hover:opacity-80 transition-opacity"
                              />
                              <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-black bg-opacity-50 rounded-md">
                                <Eye className="w-4 h-4 text-white" />
                              </div>
                            </div>
                          ) : (
                            <div className="w-16 h-16 bg-gray-100 rounded-md flex items-center justify-center">
                              <ImageIcon className="w-6 h-6 text-gray-400" />
                            </div>
                          )}
                        </TableCell>

                        {/* Issue Details */}
                        <TableCell>
                          <div className="space-y-1">
                            <p className="font-medium text-sm">
                              {report.title || report.category}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {report.category}
                            </p>
                            <p className="text-xs text-muted-foreground line-clamp-2">
                              {report.description}
                            </p>
                            {report.severity && (
                              <div className="text-xs">
                                Severity: Level {report.severity}
                              </div>
                            )}
                          </div>
                        </TableCell>

                        {/* Location */}
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-muted-foreground" />
                              <span className="text-xs">{report.address}</span>
                            </div>
                            {report.location?.coordinates && (
                              <div className="text-xs text-muted-foreground">
                                GPS: {report.location.coordinates[1].toFixed(4)}, {report.location.coordinates[0].toFixed(4)}
                              </div>
                            )}
                          </div>
                        </TableCell>

                        {/* Reporter */}
                        <TableCell>
                          <div className="text-sm">
                            <p className="font-medium">{report.user.email}</p>
                            {report.user.phone && (
                              <p className="text-xs text-muted-foreground">{report.user.phone}</p>
                            )}
                          </div>
                        </TableCell>

                        {/* Date */}
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-muted-foreground" />
                            <span className="text-sm">
                              {new Date(report.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </TableCell>

                        {/* Status */}
                        <TableCell>
                          <Select
                            value={report.status}
                            onValueChange={(value) => updateReportStatus(report._id, value)}
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue>
                                <Badge variant={getStatusColor(report.status) as any}>
                                  {report.status.replace('-', ' ')}
                                </Badge>
                              </SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="in-progress">In Progress</SelectItem>
                              <SelectItem value="resolved">Resolved</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>

                        {/* Priority */}
                        <TableCell>
                          {report.priority && (
                            <Badge variant={getPriorityColor(report.priority) as any}>
                              {report.priority}
                            </Badge>
                          )}
                        </TableCell>

                        {/* Actions */}
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
              </div>
            ) : (
              <div className="text-center py-8">
                <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Reports Found</h3>
                <p className="text-muted-foreground">
                  {searchQuery || statusFilter !== 'all' || categoryFilter !== 'all'
                    ? 'Try adjusting your filters or search query.'
                    : 'Reports will appear here once users start submitting them.'}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Image Modal */}
        {selectedImage && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedImage(null)}
          >
            <div className="relative max-w-4xl max-h-full">
              <img
                src={selectedImage}
                alt="Issue Detail"
                className="max-w-full max-h-full object-contain rounded-lg"
              />
              <Button
                variant="secondary"
                size="icon"
                className="absolute top-4 right-4"
                onClick={() => setSelectedImage(null)}
              >
                ×
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
