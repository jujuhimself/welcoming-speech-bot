
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import { Package, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast({
        title: "Missing information",
        description: "Please enter both email and password.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    const result = await login(email, password);
    
    if (result.success) {
      toast({
        title: "Welcome back! 🎉",
        description: "You've successfully logged into BEPAWA.",
      });
      
      // Navigate based on user role
      const user = JSON.parse(localStorage.getItem('bepawa_user') || '{}');
      switch (user.role) {
        case 'admin':
          navigate('/admin');
          break;
        case 'individual':
          navigate('/individual');
          break;
        case 'retail':
          navigate('/pharmacy');
          break;
        case 'wholesale':
          navigate('/wholesale');
          break;
        case 'lab':
          navigate('/lab');
          break;
        default:
          navigate('/');
      }
    } else {
      toast({
        title: "Login failed",
        description: result.error || "Please check your credentials and try again.",
        variant: "destructive",
      });
    }

    setIsLoading(false);
  };

  const fillDemoCredentials = (userType: string) => {
    const credentials = {
      individual: { email: 'individual@test.com', password: 'password123' },
      retail: { email: 'retail@test.com', password: 'password123' },
      wholesale: { email: 'wholesale@test.com', password: 'password123' },
      lab: { email: 'lab@test.com', password: 'password123' },
      admin: { email: 'admin@bepawa.com', password: 'admin123' }
    };
    
    const creds = credentials[userType as keyof typeof credentials];
    if (creds) {
      setEmail(creds.email);
      setPassword(creds.password);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-medical-pattern opacity-20"></div>
      
      {/* Back to Home */}
      <Link 
        to="/" 
        className="absolute top-6 left-6 flex items-center text-primary-600 hover:text-primary-700 transition-colors z-10"
      >
        <ArrowLeft className="h-5 w-5 mr-2" />
        Back to Home
      </Link>

      <div className="w-full max-w-md relative z-10">
        {/* Logo Section */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-gradient-to-br from-primary-600 to-primary-700 p-3 rounded-2xl shadow-lg">
              <Package className="h-10 w-10 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-700 to-primary-600 bg-clip-text text-transparent mb-2">
            Welcome Back to BEPAWA
          </h1>
          <p className="text-gray-600">Sign in to access your dashboard</p>
        </div>

        {/* Login Card */}
        <Card className="backdrop-blur-sm bg-white/90 border-0 shadow-2xl animate-slide-up">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-2xl font-semibold text-gray-900">Sign In</CardTitle>
            <CardDescription className="text-gray-600">
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700 font-medium">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 border-gray-200 focus:border-primary-500 focus:ring-primary-500"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-700 font-medium">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-12 border-gray-200 focus:border-primary-500 focus:ring-primary-500 pr-12"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember"
                    type="checkbox"
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label htmlFor="remember" className="ml-2 text-sm text-gray-600">
                    Remember me
                  </label>
                </div>
                <Link 
                  to="#" 
                  className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                >
                  Forgot password?
                </Link>
              </div>

              <Button 
                type="submit" 
                className="w-full h-12 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-semibold shadow-lg" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Signing in...
                  </div>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>
            
            <div className="mt-8 text-center">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500">New to BEPAWA?</span>
                </div>
              </div>
              
              <div className="mt-6">
                <Button variant="outline" asChild className="w-full h-12 border-2 border-primary-200 text-primary-700 hover:bg-primary-50">
                  <Link to="/register">
                    Create Your Account
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Demo Credentials */}
        <Card className="mt-6 bg-gray-50/80 backdrop-blur-sm border border-gray-200">
          <CardContent className="p-4">
            <p className="text-sm text-gray-600 font-medium mb-3">Demo Credentials - Click to auto-fill:</p>
            <div className="grid grid-cols-1 gap-2 text-xs">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => fillDemoCredentials('individual')}
                className="justify-start h-auto p-2 text-left"
              >
                <div>
                  <p className="font-medium text-gray-700">Individual User</p>
                  <p className="text-gray-600">individual@test.com | password123</p>
                </div>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => fillDemoCredentials('retail')}
                className="justify-start h-auto p-2 text-left"
              >
                <div>
                  <p className="font-medium text-gray-700">Retail Pharmacy</p>
                  <p className="text-gray-600">retail@test.com | password123</p>
                </div>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => fillDemoCredentials('wholesale')}
                className="justify-start h-auto p-2 text-left"
              >
                <div>
                  <p className="font-medium text-gray-700">Wholesale Pharmacy</p>
                  <p className="text-gray-600">wholesale@test.com | password123</p>
                </div>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => fillDemoCredentials('lab')}
                className="justify-start h-auto p-2 text-left"
              >
                <div>
                  <p className="font-medium text-gray-700">Lab/Health Center</p>
                  <p className="text-gray-600">lab@test.com | password123</p>
                </div>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => fillDemoCredentials('admin')}
                className="justify-start h-auto p-2 text-left"
              >
                <div>
                  <p className="font-medium text-gray-700">System Admin</p>
                  <p className="text-gray-600">admin@bepawa.com | admin123</p>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
