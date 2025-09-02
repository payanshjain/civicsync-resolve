import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { MapPin, Upload, Loader2, Camera, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import api from "@/lib/api";

const issueCategories = [
  "Roads & Potholes",
  "Water & Utilities", 
  "Sanitation & Waste",
  "Streetlights & Power",
  "Pan Masala Spitting & Stains",
  "Littering & Garbage Dumping",
  "Illegal Parking",
  "Noise Pollution",
  "Parks & Public Spaces",
  "Public Safety",
  "Drainage & Sewerage",
  "Illegal Construction",
  "Encroachment on Footpaths",
  "Other"
];

const createIssue = async (formData: FormData) => {
  const { data } = await api.post('/reports', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return data.data;
};

export default function ReportIssue() {
  const [category, setCategory] = useState("");
  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [gpsLocation, setGpsLocation] = useState<{lat: number, lng: number} | null>(null);
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  const { toast } = useToast();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: createIssue,
    onSuccess: () => {
      toast({
        title: "Issue Reported Successfully!",
        description: "Your report has been submitted and will be reviewed soon.",
      });
      queryClient.invalidateQueries({ queryKey: ['myIssues'] });
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

  // GPS Location Handler
  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      toast({
        title: "Geolocation Not Supported",
        description: "Your browser doesn't support GPS location services.",
        variant: "destructive"
      });
      return;
    }

    setIsGettingLocation(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setGpsLocation({ lat: latitude, lng: longitude });
        setAddress(`${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);
        setIsGettingLocation(false);
        toast({
          title: "Location Found!",
          description: "GPS coordinates have been added to your report.",
        });
      },
      (error) => {
        setIsGettingLocation(false);
        let message = "Unable to get your location.";
        switch (error.code) {
          case error.PERMISSION_DENIED:
            message = "Location access denied. Please enable location services.";
            break;
          case error.POSITION_UNAVAILABLE:
            message = "Location information unavailable.";
            break;
          case error.TIMEOUT:
            message = "Location request timed out.";
            break;
        }
        toast({
          title: "Location Error",
          description: message,
          variant: "destructive"
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000
      }
    );
  };

  // Photo Upload Handler
  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          title: "File Too Large",
          description: "Please select an image smaller than 5MB.",
          variant: "destructive"
        });
        return;
      }

      setPhoto(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPhotoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);

      toast({
        title: "Photo Added",
        description: "Image has been attached to your report.",
      });
    }
  };

  const removePhoto = () => {
    setPhoto(null);
    setPhotoPreview(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!category || !address || !description) {
      return toast({
        title: "Missing Information",
        description: "Please fill out all required fields.",
        variant: "destructive"
      });
    }

    const formData = new FormData();
    formData.append('category', category);
    formData.append('address', address);
    formData.append('description', description);
    
    if (photo) {
      formData.append('photo', photo);
    }
    
    if (gpsLocation) {
      formData.append('latitude', gpsLocation.lat.toString());
      formData.append('longitude', gpsLocation.lng.toString());
    }

    mutation.mutate(formData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-accent/20">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-4">Report a Civic Issue</h1>
            <p className="text-lg text-muted-foreground">
              Help improve your community by reporting issues that need attention
            </p>
          </div>

          <Card className="shadow-civic-strong">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Issue Details
              </CardTitle>
              <CardDescription>
                Provide detailed information about the issue you want to report
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Category Selection */}
                <div className="space-y-2">
                  <Label htmlFor="category">Issue Category *</Label>
                  <Select value={category} onValueChange={setCategory} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select an issue category" />
                    </SelectTrigger>
                    <SelectContent>
                      {issueCategories.map((cat) => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Location Input with GPS */}
                <div className="space-y-2">
                  <Label htmlFor="address">Location *</Label>
                  <div className="flex gap-2">
                    <Input
                      id="address"
                      type="text"
                      placeholder="Enter the location or address"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      required
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleGetLocation}
                      disabled={isGettingLocation}
                      className="flex items-center gap-2"
                    >
                      {isGettingLocation ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <MapPin className="w-4 h-4" />
                      )}
                      {isGettingLocation ? "Getting..." : "GPS"}
                    </Button>
                  </div>
                  {gpsLocation && (
                    <p className="text-sm text-success">
                      ✓ GPS coordinates: {gpsLocation.lat.toFixed(6)}, {gpsLocation.lng.toFixed(6)}
                    </p>
                  )}
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe the issue in detail. Include any relevant information that would help resolve it quickly."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    rows={4}
                    className="min-h-[100px]"
                  />
                </div>

                {/* Photo Upload */}
                <div className="space-y-2">
                  <Label htmlFor="photo">Add Photo (Optional)</Label>
                  <p className="text-sm text-muted-foreground">
                    A photo helps authorities understand the issue better
                  </p>
                  
                  {!photoPreview ? (
                    <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                      <input
                        id="photo"
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoChange}
                        className="hidden"
                      />
                      <label
                        htmlFor="photo"
                        className="flex flex-col items-center gap-2 cursor-pointer"
                      >
                        <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center">
                          <Camera className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">Click to upload a photo</p>
                          <p className="text-sm text-muted-foreground">PNG, JPG up to 5MB</p>
                        </div>
                      </label>
                    </div>
                  ) : (
                    <div className="relative">
                      <img
                        src={photoPreview}
                        alt="Issue preview"
                        className="w-full h-48 object-cover rounded-lg border"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        onClick={removePhoto}
                        className="absolute top-2 right-2"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={mutation.isPending}
                  className="w-full bg-gradient-civic hover:bg-primary-dark text-primary-foreground"
                >
                  {mutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Submitting Report...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 mr-2" />
                      Submit Issue Report
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Help Section */}
          <Card className="mt-6">
            <CardContent className="pt-6">
              <h3 className="font-semibold mb-3">Reporting Tips</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Be specific about the location and nature of the issue</li>
                <li>• Include photos when possible to help authorities understand the problem</li>
                <li>• Use GPS location for accurate positioning</li>
                <li>• Provide any relevant details that could help with resolution</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
