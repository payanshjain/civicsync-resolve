import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Eye, Edit, CheckCircle, Clock, AlertTriangle, FileText, BarChart3, Settings } from "lucide-react";

const mockReports = [
  {
    id: "ISS-001",
    category: "Roads & Infrastructure",
    location: "Main St & Oak Ave",
    date: "2024-01-15",
    status: "pending",
    priority: "high",
    assignee: "Unassigned"
  },
  {
    id: "ISS-002",
    category: "Streetlights",
    location: "Park Avenue",
    date: "2024-01-14",
    status: "in-progress",
    priority: "medium",
    assignee: "John Smith"
  },
  {
    id: "ISS-003",
    category: "Sanitation & Waste",
    location: "Elm Street",
    date: "2024-01-13",
    status: "resolved",
    priority: "low",
    assignee: "Jane Doe"
  }
];

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("reports");

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
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Issues</CardTitle>
              <FileText className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">247</div>
              <p className="text-xs text-muted-foreground">
                +12% from last month
              </p>
            </CardContent>
          </Card>
          
          <Card className="shadow-civic">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <Clock className="w-4 h-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">23</div>
              <p className="text-xs text-muted-foreground">
                Awaiting assignment
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-civic">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">In Progress</CardTitle>
              <AlertTriangle className="w-4 h-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">45</div>
              <p className="text-xs text-muted-foreground">
                Being addressed
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-civic">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Resolved</CardTitle>
              <CheckCircle className="w-4 h-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">179</div>
              <p className="text-xs text-muted-foreground">
                This month
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="reports" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Reports
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="reports" className="space-y-6">
            <Card className="shadow-civic-strong">
              <CardHeader>
                <CardTitle>Issue Reports</CardTitle>
                <CardDescription>
                  Manage and track all reported civic issues
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Issue ID</TableHead>
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
                    {mockReports.map((report) => (
                      <TableRow key={report.id}>
                        <TableCell className="font-medium">{report.id}</TableCell>
                        <TableCell>{report.category}</TableCell>
                        <TableCell>{report.location}</TableCell>
                        <TableCell>{report.date}</TableCell>
                        <TableCell>
                          <Badge variant={getStatusColor(report.status) as any}>
                            {report.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getPriorityColor(report.priority) as any}>
                            {report.priority}
                          </Badge>
                        </TableCell>
                        <TableCell>{report.assignee}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm">
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <CheckCircle className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <Card className="shadow-civic-strong">
              <CardHeader>
                <CardTitle>Analytics Overview</CardTitle>
                <CardDescription>
                  Detailed analytics and reporting insights
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <BarChart3 className="w-16 h-16 text-primary mx-auto mb-4" />
                  <p className="text-muted-foreground">Analytics dashboard coming soon</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card className="shadow-civic-strong">
              <CardHeader>
                <CardTitle>System Settings</CardTitle>
                <CardDescription>
                  Configure system preferences and user management
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Settings className="w-16 h-16 text-primary mx-auto mb-4" />
                  <p className="text-muted-foreground">Settings panel coming soon</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}