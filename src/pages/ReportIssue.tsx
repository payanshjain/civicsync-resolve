import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { MapPin, Camera, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const issueCategories = [
  "Roads & Infrastructure", 
  "Water & Utilities", 
  "Sanitation & Waste", 
  "Streetlights", 
  "Parks & Recreation",
  "Public Safety",
  "Other"
];

export default function ReportIssue() {
  const [formData, setFormData] = useState({
    category: "",
    location: "",
    description: "",
    image: null as File | null,
  });
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simulate form submission
    toast({
      title: "Issue Reported Successfully!",
      description: "Your report has been submitted and will be reviewed by the appropriate department.",
    });
    
    // Reset form
    setFormData({
      category: "",
      location: "",
      description: "",
      image: null,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-light to-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-4">Report a Civic Issue</h1>
            <p className="text-lg text-muted-foreground">
              Help improve your community by reporting issues that need attention
            </p>
          </div>

          <Card className="shadow-civic-strong">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary" />
                Issue Details
              </CardTitle>
              <CardDescription>
                Please provide as much detail as possible to help us address the issue quickly
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="category">Issue Category</Label>
                  <Select value={formData.category} onValueChange={(value) => 
                    setFormData(prev => ({ ...prev, category: value }))
                  }>
                    <SelectTrigger>
                      <SelectValue placeholder="Select an issue category" />
                    </SelectTrigger>
                    <SelectContent>
                      {issueCategories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <div className="flex gap-2">
                    <Input
                      id="location"
                      placeholder="Enter address or intersection"
                      value={formData.location}
                      onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                      className="flex-1"
                    />
                    <Button type="button" variant="outline" size="icon">
                      <MapPin className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe the issue in detail..."
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="image">Upload Photo (Optional)</Label>
                  <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary transition-colors">
                    <Camera className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground mb-2">
                      Click to upload or drag and drop
                    </p>
                    <Input
                      id="image"
                      type="file"
                      accept="image/*"
                      onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.files?.[0] || null }))}
                      className="hidden"
                    />
                    <Button type="button" variant="outline" size="sm" onClick={() => 
                      document.getElementById('image')?.click()
                    }>
                      <Upload className="w-4 h-4 mr-2" />
                      Choose File
                    </Button>
                  </div>
                </div>

                <Button type="submit" className="w-full bg-gradient-civic hover:bg-primary-dark">
                  Submit Report
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}