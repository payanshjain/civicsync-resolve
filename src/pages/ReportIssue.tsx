import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { MapPin, Upload, Loader2, Camera, Navigation, ChevronLeft, ChevronRight, Mic } from "lucide-react";
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

// Image compression function
const compressImage = (file: File, quality: number = 0.8): Promise<File> => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      const maxWidth = 1200;
      const maxHeight = 1200;
      let { width, height } = img;

      // Calculate new dimensions
      if (width > height) {
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }
      }

      canvas.width = width;
      canvas.height = height;

      ctx?.drawImage(img, 0, 0, width, height);

      canvas.toBlob((blob) => {
        if (blob) {
          const compressedFile = new File([blob], file.name, {
            type: file.type,
            lastModified: Date.now(),
          });
          resolve(compressedFile);
        }
      }, file.type, quality);
    };

    img.src = URL.createObjectURL(file);
  });
};

const createIssue = async (formData: FormData) => {
  const { data } = await api.post('/reports', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return data.data;
};

export default function ReportIssue() {
  const [currentStep, setCurrentStep] = useState(1);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [severity, setSeverity] = useState(3);
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [location, setLocation] = useState<{lat: number, lng: number} | null>(null);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [isCompressing, setIsCompressing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: createIssue,
    onSuccess: () => {
      toast({
        title: "Issue Reported Successfully! ✅",
        description: "Your report has been submitted to the authorities.",
      });
      queryClient.invalidateQueries({ queryKey: ['myIssues'] });
      navigate('/my-issues');
    },
    onError: (error: any) => {
      toast({
        title: "Submission Failed ❌",
        description: error.response?.data?.message || "Could not submit your report.",
        variant: "destructive",
      });
    },
  });

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsCompressing(true);
      console.log('🖼️ Original file size:', (file.size / 1024 / 1024).toFixed(2), 'MB');
      
      try {
        const compressedFile = await compressImage(file, 0.7);
        console.log('📦 Compressed file size:', (compressedFile.size / 1024 / 1024).toFixed(2), 'MB');
        
        setPhoto(compressedFile);
        
        const reader = new FileReader();
        reader.onload = (e) => {
          setPhotoPreview(e.target?.result as string);
        };
        reader.readAsDataURL(compressedFile);
        
        toast({
          title: "Photo Compressed & Added ✅",
          description: `File size reduced to ${(compressedFile.size / 1024 / 1024).toFixed(2)}MB`,
        });
      } catch (error) {
        console.error('❌ Image compression failed:', error);
        toast({
          title: "Compression Failed",
          description: "Using original image",
          variant: "destructive"
        });
        setPhoto(file);
      } finally {
        setIsCompressing(false);
      }
    }
  };

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      toast({
        title: "Geolocation Not Supported",
        description: "Your browser doesn't support location services.",
        variant: "destructive"
      });
      return;
    }

    setIsGettingLocation(true);
    console.log('🌍 Getting GPS location...');
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLocation({ lat: latitude, lng: longitude });
        setAddress(`${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);
        
        console.log('📍 GPS location acquired:', latitude, longitude);
        toast({
          title: "Location Acquired! 📍",
          description: "Your current location has been captured.",
        });
        setIsGettingLocation(false);
      },
      (error) => {
        console.error('❌ GPS error:', error);
        let errorMessage = "Failed to get your location.";
        switch(error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Location access denied. Please enable location services.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Location information unavailable.";
            break;
          case error.TIMEOUT:
            errorMessage = "Location request timed out.";
            break;
        }
        
        toast({
          title: "Location Error ❌",
          description: errorMessage,
          variant: "destructive"
        });
        setIsGettingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  const handleSubmit = () => {
    if (!category || !address || !description || !title) {
      return toast({
        title: "Missing Information",
        description: "Please fill out all required fields.",
        variant: "destructive"
      });
    }

    console.log('📤 Submitting report...');
    setUploadProgress(10);

    const formData = new FormData();
    formData.append('title', title);
    formData.append('category', category);
    formData.append('address', address);
    formData.append('description', description);
    formData.append('severity', severity.toString());
    
    if (photo) {
      console.log('📸 Adding photo to form data');
      formData.append('photo', photo);
      setUploadProgress(50);
    }
    
    if (location) {
      console.log('🌍 Adding GPS coordinates');
      formData.append('latitude', location.lat.toString());
      formData.append('longitude', location.lng.toString());
    }

    setUploadProgress(80);
    mutation.mutate(formData);
  };

  const nextStep = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const getSeverityLabel = (value: number) => {
    switch(value) {
      case 1: return 'Low';
      case 2: return 'Medium';
      case 3: return 'Medium priority';
      case 4: return 'High';
      case 5: return 'Critical';
      default: return 'Medium';
    }
  };

  const getExpectedTime = () => {
    const days = severity <= 2 ? '7-14' : severity <= 3 ? '3-7' : severity <= 4 ? '1-3' : '24 hours';
    return days;
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">Issue Details</h2>
              <p className="text-muted-foreground">Upload photos and set location</p>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Issue Title</Label>
                <Input
                  id="title"
                  placeholder="Brief description of the issue"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div>
                <Label>Photos/Videos</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  {photoPreview ? (
                    <div className="space-y-4">
                      <img src={photoPreview} alt="Preview" className="max-w-full h-48 object-cover rounded mx-auto" />
                      <p className="text-sm text-muted-foreground">
                        {photo && `${(photo.size / 1024 / 1024).toFixed(2)}MB`}
                      </p>
                    </div>
                  ) : (
                    <>
                      <Camera className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-lg">Click to upload or drag and drop</p>
                      <p className="text-sm text-muted-foreground">PNG, JPG, MP4 up to 10MB (Max 5 files)</p>
                    </>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    disabled={isCompressing}
                  />
                  {isCompressing && (
                    <div className="flex items-center justify-center mt-4">
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      <span>Compressing image...</span>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="location">Location</Label>
                <div className="flex gap-2">
                  <Input
                    id="location"
                    placeholder="Enter address or use GPS"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    onClick={handleGetLocation}
                    disabled={isGettingLocation}
                    className="bg-primary text-primary-foreground"
                  >
                    {isGettingLocation ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <MapPin className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">Categorization</h2>
              <p className="text-muted-foreground">AI will suggest the best category</p>
            </div>

            <div className="space-y-4">
              <div>
                <Label>Category</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select issue category" />
                  </SelectTrigger>
                  <SelectContent>
                    {issueCategories.map((cat) => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Issue Severity (1-5)</Label>
                <div className="space-y-4">
                  <Slider
                    value={[severity]}
                    onValueChange={(value) => setSeverity(value[0])}
                    max={5}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Low</span>
                    <span>Medium</span>
                    <span>High</span>
                    <span>Urgent</span>
                    <span>Critical</span>
                  </div>
                  <p>Current: Level {severity} - {getSeverityLabel(severity)}</p>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Expected Resolution Time</h3>
                <p className="text-sm text-blue-700">Based on category and severity: {getExpectedTime()}</p>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">Description</h2>
              <p className="text-muted-foreground">Describe the issue in detail</p>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <Label>Detailed Description</Label>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <Mic className="w-4 h-4 mr-1" />
                      Voice
                    </Button>
                    <Select defaultValue="English">
                      <SelectTrigger className="w-24">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="English">English</SelectItem>
                        <SelectItem value="Hindi">Hindi</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Textarea
                  placeholder="Describe the issue in detail... What happened? When did you notice it? How is it affecting you?"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={6}
                  className="resize-none"
                />
                <p className="text-sm text-muted-foreground">{description.length}/1000 characters</p>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-800 mb-2">Tips for better reports:</h3>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Include specific location details</li>
                  <li>• Mention when the issue started</li>
                  <li>• Describe how it affects daily life</li>
                  <li>• Add any relevant context</li>
                </ul>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">Review & Submit</h2>
              <p className="text-muted-foreground">Please review your report before submitting</p>
            </div>

            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                <div><strong>Title:</strong> {title}</div>
                <div><strong>Category:</strong> {category}</div>
                <div><strong>Severity:</strong> Level {severity} - {getSeverityLabel(severity)}</div>
                <div><strong>Location:</strong> {address}</div>
                <div><strong>Description:</strong> {description.substring(0, 100)}...</div>
                {photoPreview && (
                  <div>
                    <strong>Photo:</strong>
                    <img src={photoPreview} alt="Preview" className="w-20 h-20 object-cover rounded mt-1" />
                  </div>
                )}
              </div>

              {mutation.isPending && (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Uploading report...</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                      style={{width: `${uploadProgress}%`}}
                    ></div>
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-accent/20">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4">Report an Issue</h1>
            <p className="text-lg text-muted-foreground">
              Help us make your city better - report issues in 60 seconds
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm">Step {currentStep} of 4</span>
              <span className="text-sm">{Math.round((currentStep / 4) * 100)}% Complete</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-300" 
                style={{width: `${(currentStep / 4) * 100}%`}}
              ></div>
            </div>
          </div>

          {/* Step Content */}
          <Card className="shadow-civic-strong">
            <CardContent className="p-8">
              <div className="flex justify-between items-center mb-6">
                <div className="text-lg font-semibold">{currentStep}/4</div>
              </div>
              
              {renderStepContent()}
              
              {/* Navigation */}
              <div className="flex justify-between pt-8">
                <Button 
                  variant="outline" 
                  onClick={prevStep} 
                  disabled={currentStep === 1}
                  className="flex items-center gap-2"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </Button>
                
                {currentStep === 4 ? (
                  <Button 
                    onClick={handleSubmit}
                    disabled={mutation.isPending}
                    className="bg-gradient-to-r from-blue-500 to-blue-600 text-white flex items-center gap-2"
                  >
                    {mutation.isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4" />
                        Submit Report
                      </>
                    )}
                  </Button>
                ) : (
                  <Button 
                    onClick={nextStep}
                    className="bg-gradient-to-r from-blue-500 to-blue-600 text-white flex items-center gap-2"
                  >
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
