import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { User, Mail, Phone } from "lucide-react";

export default function Profile() {
  const { user } = useAuth();

  if (!user) {
    return <div>Loading profile...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card className="shadow-civic-strong">
            <CardHeader className="text-center">
              <User className="w-16 h-16 mx-auto mb-4 text-primary" />
              <CardTitle className="text-3xl">{user.role === 'admin' ? 'Administrator' : 'Citizen Profile'}</CardTitle>
              <CardDescription>Your account details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 text-lg">
              <div className="flex items-center gap-4 p-4 border rounded-lg">
                <Mail className="w-6 h-6 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{user.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 border rounded-lg">
                <Phone className="w-6 h-6 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="font-medium">{user.phone}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

