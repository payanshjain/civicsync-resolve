import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, Mail, Phone, Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link, useNavigate } from "react-router-dom";
import api from "../lib/api";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [activeTab, setActiveTab] = useState("login");
  
  // Shared state for both login forms
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [signupEmail, setSignupEmail] = useState("");
  const [signupPhone, setSignupPhone] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupConfirmPassword, setSignupConfirmPassword] = useState("");
  
  const { toast } = useToast();
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/profile');
    }
  }, [isAuthenticated, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await api.post('/auth/login', { email: loginEmail, password: loginPassword });
      login(response.data.token, response.data.user);
      toast({ title: "Login Successful!", description: "Welcome back." });
      navigate('/profile');
    } catch (error: any) {
      toast({ title: "Login Failed", description: error.response?.data?.message || "Invalid credentials.", variant: "destructive" });
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (signupPassword !== signupConfirmPassword) {
      return toast({ title: "Password Mismatch", variant: "destructive" });
    }
    try {
      const response = await api.post('/auth/register', { email: signupEmail, phone: signupPhone, password: signupPassword });
      login(response.data.token, response.data.user);
      toast({ title: "Account Created!", description: "Welcome to CivicSync." });
      navigate('/profile');
    } catch (error: any) {
      toast({ title: "Signup Failed", description: error.response?.data?.message || "Could not create account.", variant: "destructive" });
    }
  };

  // Reusable Login Form Component
  const LoginForm = () => (
    <form onSubmit={handleLogin} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
          <Input id="email" type="email" placeholder="Enter your email" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} required className="pl-10" />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
          <Input id="password" type="password" placeholder="Enter your password" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} required className="pl-10" />
        </div>
      </div>
      <Button type="submit" className="w-full bg-gradient-civic hover:bg-primary-dark">Sign In</Button>
    </form>
  );

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Header remains the same */}
        <Card className="shadow-civic-strong backdrop-blur-sm bg-white/95">
           <CardHeader>
             <CardTitle className="text-center">Welcome</CardTitle>
             <CardDescription className="text-center">Sign in or create a new account</CardDescription>
           </CardHeader>
           <CardContent>
             {/* **MODIFICATION**: Added "Admin Login" tab */}
             <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
               <TabsList className="grid w-full grid-cols-3">
                 <TabsTrigger value="login">Citizen Sign In</TabsTrigger>
                 <TabsTrigger value="admin-login">Admin Login</TabsTrigger>
                 <TabsTrigger value="signup">Sign Up</TabsTrigger>
               </TabsList>
               
               <TabsContent value="login"><LoginForm /></TabsContent>
               <TabsContent value="admin-login"><LoginForm /></TabsContent>

               <TabsContent value="signup" className="space-y-4">
                 <form onSubmit={handleSignup} className="space-y-4">
                   {/* Signup form fields */}
                    <div className="space-y-2">
                      <Label htmlFor="signup-email">Email</Label>
                      <Input id="signup-email" type="email" placeholder="Enter your email" value={signupEmail} onChange={(e) => setSignupEmail(e.target.value)} required className="pl-10" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input id="phone" type="tel" placeholder="Enter your phone" value={signupPhone} onChange={(e) => setSignupPhone(e.target.value)} required className="pl-10" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-password">Password</Label>
                      <Input id="signup-password" type="password" placeholder="Create a password" value={signupPassword} onChange={(e) => setSignupPassword(e.target.value)} required className="pl-10" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirm Password</Label>
                      <Input id="confirm-password" type="password" placeholder="Confirm your password" value={signupConfirmPassword} onChange={(e) => setSignupConfirmPassword(e.target.value)} required className="pl-10" />
                    </div>
                    <Button type="submit" className="w-full bg-gradient-civic hover:bg-primary-dark">Create Account</Button>
                 </form>
               </TabsContent>
             </Tabs>
           </CardContent>
         </Card>
      </div>
    </div>
  );
}