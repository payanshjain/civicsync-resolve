import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, TrendingUp, MapPin, Clock, Users, AlertCircle, Calendar, FileText } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import api from "../lib/api";
import { useMemo } from "react";

interface Report {
  _id: string;
  category: string;
  status: string;
  createdAt: string;
  severity?: number;
  location?: {
    coordinates: [number, number];
  };
}

const fetchAllReports = async (): Promise<Report[]> => {
  const { data } = await api.get('/reports');
  return data.data;
};

const fetchReportStats = async () => {
  const { data } = await api.get('/reports/stats');
  return data.data;
};

export default function Analytics() {
  const { data: reports, isLoading } = useQuery({
    queryKey: ['analyticsReports'],
    queryFn: fetchAllReports
  });

  const { data: stats } = useQuery({
    queryKey: ['analyticsStats'],
    queryFn: fetchReportStats
  });

  // Calculate dynamic analytics from database
  const analytics = useMemo(() => {
    if (!reports) return null;

    // Category distribution
    const categoryStats = reports.reduce((acc, report) => {
      acc[report.category] = (acc[report.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const categoryData = Object.entries(categoryStats)
      .map(([name, count]) => ({
        name,
        count,
        percentage: Math.round((count / reports.length) * 100)
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5); // Top 5 categories

    // Monthly trend analysis
    const monthlyStats = reports.reduce((acc, report) => {
      const month = new Date(report.createdAt).toISOString().slice(0, 7); // YYYY-MM
      acc[month] = (acc[month] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const monthlyData = Object.entries(monthlyStats)
      .map(([month, count]) => ({ month, count }))
      .sort((a, b) => a.month.localeCompare(b.month))
      .slice(-6); // Last 6 months

    // Status distribution
    const statusStats = reports.reduce((acc, report) => {
      acc[report.status] = (acc[report.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Severity analysis
    const severityStats = reports
      .filter(report => report.severity)
      .reduce((acc, report) => {
        const level = report.severity!;
        acc[level] = (acc[level] || 0) + 1;
        return acc;
      }, {} as Record<number, number>);

    // Weekly trend
    const now = new Date();
    const weeklyData = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dayReports = reports.filter(report => {
        const reportDate = new Date(report.createdAt);
        return reportDate.toDateString() === date.toDateString();
      });
      return {
        day: date.toLocaleDateString('en-US', { weekday: 'short' }),
        count: dayReports.length
      };
    }).reverse();

    // High priority areas (based on location clustering)
    const locationClusters = reports
      .filter(report => report.location?.coordinates)
      .reduce((acc, report) => {
        const coords = report.location!.coordinates;
        const key = `${coords[1].toFixed(2)},${coords[0].toFixed(2)}`; // Rough clustering
        if (!acc[key]) {
          acc[key] = { count: 0, lat: coords[1], lng: coords[0] };
        }
        acc[key].count++;
        return acc;
      }, {} as Record<string, { count: number; lat: number; lng: number }>);

    const hotspots = Object.values(locationClusters)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    return {
      categoryData,
      monthlyData,
      statusStats,
      severityStats,
      weeklyData,
      hotspots,
      totalReports: reports.length,
      averagePerDay: Math.round(reports.length / 30), // Assuming 30 days
      resolutionRate: Math.round((statusStats.resolved / reports.length) * 100) || 0
    };
  }, [reports]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">No Data Available</h2>
          <p className="text-muted-foreground">Start by submitting some reports to see analytics.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">Analytics Dashboard</h1>
          <p className="text-lg text-muted-foreground">
            Comprehensive insights into civic issue reporting and resolution
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="shadow-civic">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-blue-600">{analytics.totalReports}</p>
                  <p className="text-sm text-muted-foreground">Total Reports</p>
                </div>
                <FileText className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-civic">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-green-600">{analytics.resolutionRate}%</p>
                  <p className="text-sm text-muted-foreground">Resolution Rate</p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-civic">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-orange-600">{analytics.averagePerDay}</p>
                  <p className="text-sm text-muted-foreground">Daily Average</p>
                </div>
                <Clock className="w-8 h-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-civic">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-purple-600">{analytics.hotspots.length}</p>
                  <p className="text-sm text-muted-foreground">Hotspot Areas</p>
                </div>
                <MapPin className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Category Distribution */}
          <Card className="shadow-civic-strong">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Issue Categories
              </CardTitle>
              <CardDescription>Distribution of reported issues by category</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.categoryData.map((item, index) => (
                  <div key={item.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: `hsl(${index * 60}, 70%, 50%)` }}
                      />
                      <span className="text-sm font-medium">{item.name}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold">{item.count}</div>
                      <div className="text-xs text-muted-foreground">{item.percentage}%</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Weekly Trend */}
          <Card className="shadow-civic-strong">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Weekly Trend
              </CardTitle>
              <CardDescription>Reports submitted in the last 7 days</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {analytics.weeklyData.map((item) => (
                  <div key={item.day} className="flex items-center justify-between">
                    <span className="text-sm font-medium w-12">{item.day}</span>
                    <div className="flex-1 mx-3">
                      <div className="bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full"
                          style={{ width: `${Math.max((item.count / Math.max(...analytics.weeklyData.map(d => d.count))) * 100, 5)}%` }}
                        />
                      </div>
                    </div>
                    <span className="text-sm font-bold w-8 text-right">{item.count}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Monthly Trend */}
          <Card className="shadow-civic-strong">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Monthly Trend
              </CardTitle>
              <CardDescription>Reports over the last 6 months</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {analytics.monthlyData.map((item) => (
                  <div key={item.month} className="flex items-center justify-between">
                    <span className="text-sm font-medium">{item.month}</span>
                    <div className="flex-1 mx-3">
                      <div className="bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full"
                          style={{ width: `${Math.max((item.count / Math.max(...analytics.monthlyData.map(d => d.count))) * 100, 5)}%` }}
                        />
                      </div>
                    </div>
                    <span className="text-sm font-bold">{item.count}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* High-Frequency Report Areas */}
          <Card className="shadow-civic-strong">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Hotspot Areas
              </CardTitle>
              <CardDescription>Areas with highest report frequency</CardDescription>
            </CardHeader>
            <CardContent>
              {analytics.hotspots.length > 0 ? (
                <div className="space-y-4">
                  {analytics.hotspots.map((hotspot, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                          <span className="text-xs font-bold text-red-600">{index + 1}</span>
                        </div>
                        <div>
                          <div className="text-sm font-medium">
                            Area {index + 1}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {hotspot.lat.toFixed(4)}, {hotspot.lng.toFixed(4)}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold text-red-600">{hotspot.count}</div>
                        <div className="text-xs text-muted-foreground">reports</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4">
                  <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">No location data available</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Status Overview */}
        <Card className="mt-8 shadow-civic-strong">
          <CardHeader>
            <CardTitle>Status Overview</CardTitle>
            <CardDescription>Current status distribution of all reports</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {Object.entries(analytics.statusStats).map(([status, count]) => {
                const percentage = Math.round((count / analytics.totalReports) * 100);
                const color = status === 'pending' ? 'orange' : status === 'in-progress' ? 'blue' : 'green';
                
                return (
                  <div key={status} className="text-center">
                    <div className={`text-3xl font-bold text-${color}-600 mb-2`}>{count}</div>
                    <div className="capitalize text-sm font-medium mb-2">{status.replace('-', ' ')}</div>
                    <div className={`text-xs text-${color}-600`}>{percentage}% of total</div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
