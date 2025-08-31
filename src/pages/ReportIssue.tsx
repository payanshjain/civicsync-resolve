import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { MapPin, Upload, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import api from "@/lib/api";

const issueCategories = [
  "Roads & Potholes", "Water & Utilities", "Sanitation & Waste", "Streetlights & Power",
  "Pan Masala Spitting & Stains", "Littering & Garbage Dumping", "Illegal Parking", "Noise Pollution",
  "Parks & Public Spaces", "Public Safety", "Drainage & Sewerage", "Illegal Construction",
  "Encroachment on Footpaths", "Other"
];

const createIssue = async (formData: { category: string; address: string; description: string; }) => {
  const { data } = await api.post('/reports', formData);
  return data.data;
};

export default function ReportIssue() {
  const [category, setCategory] = useState("");
  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: createIssue,
    onSuccess: () => {
      toast({
        title: "Issue Reported Successfully!",
        description: "Your report has been submitted.",
      });
      // Invalidate the 'myIssues' query to trigger a refetch on the MyIssues page
      queryClient.invalidateQueries({ queryKey: ['myIssues'] });
      // Redirect the user to see their list of issues
      navigate('/my-issues');
    },
    onError: (error: any) => {
      toast({
        title: "Submission Failed",
        description: error.response?.data?.message || "Could not submit your report.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!category || !address || !description) {
      return toast({ title: "Missing Information", description: "Please fill out all fields.", variant: "destructive" });
    }
    mutation.mutate({ category, address, description });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-light to-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card className="shadow-civic-strong">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">Report a Civic Issue</CardTitle>
              <CardDescription>Fill in the details below to submit your report.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="category">Issue Category</Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger><SelectValue placeholder="Select an issue category" /></SelectTrigger>
                    <SelectContent>
                      {issueCategories.map((cat) => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location / Address</Label>
                  <Input id="location" placeholder="Enter address or intersection" value={address} onChange={(e) => setAddress(e.target.value)} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" placeholder="Describe the issue in detail..." value={description} onChange={(e) => setDescription(e.target.value)} rows={4} />
                </div>

                <Button type="submit" className="w-full" disabled={mutation.isPending}>
                  {mutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
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
