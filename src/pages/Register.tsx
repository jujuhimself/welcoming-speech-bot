import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Link, useNavigate } from "react-router-dom";
import { Package, ArrowLeft, ArrowRight } from "lucide-react";
import { useAuth, User } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import RoleSelector from "@/components/RoleSelector";

interface FormData {
  // Common fields
  name: string;
  email: string;
  password: string;
  phone: string;
  address: string;
  role: 'individual' | 'retail' | 'wholesale' | 'lab' | '';
  
  // Individual fields
  dateOfBirth: string;
  emergencyContact: string;
  
  // Retail pharmacy fields
  pharmacyName: string;
  licenseNumber: string;
  pharmacistName: string;
  
  // Wholesale fields
  businessName: string;
  businessLicense: string;
  taxId: string;
  
  // Lab fields
  labName: string;
  labLicense: string;
  specializations: string;
  operatingHours: string;
}

const Register = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    password: "",
    phone: "",
    address: "",
    role: "",
    dateOfBirth: "",
    emergencyContact: "",
    pharmacyName: "",
    licenseNumber: "",
    pharmacistName: "",
    businessName: "",
    businessLicense: "",
    taxId: "",
    labName: "",
    labLicense: "",
    specializations: "",
    operatingHours: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const { register } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleRoleSelect = (role: 'individual' | 'retail' | 'wholesale' | 'lab') => {
    setFormData(prev => ({ ...prev, role }));
  };

  const validateStep1 = () => {
    return formData.role !== '';
  };

  const validateStep2 = () => {
    return formData.name && formData.email && formData.password && formData.phone && formData.address;
  };

  const validateStep3 = () => {
    if (formData.role === 'individual') {
      return formData.dateOfBirth && formData.emergencyContact;
    } else if (formData.role === 'retail') {
      return formData.pharmacyName && formData.licenseNumber && formData.pharmacistName;
    } else if (formData.role === 'wholesale') {
      return formData.businessName && formData.businessLicense && formData.taxId;
    } else if (formData.role === 'lab') {
      return formData.labName && formData.labLicense && formData.specializations && formData.operatingHours;
    }
    return false;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) setStep(2);
    else if (step === 2 && validateStep2()) setStep(3);
    else if (step === 3 && validateStep3()) setStep(4);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!termsAccepted) {
      toast({
        title: "Terms required",
        description: "Please accept the terms and conditions to continue.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);

    // Prepare user data based on role
    const userData: Partial<User> & { password: string } = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      phone: formData.phone,
      address: formData.address,
      role: formData.role as any,
    };

    // Add role-specific fields
    if (formData.role === 'individual') {
      userData.dateOfBirth = formData.dateOfBirth;
      userData.emergencyContact = formData.emergencyContact;
    } else if (formData.role === 'retail') {
      userData.pharmacyName = formData.pharmacyName;
      userData.licenseNumber = formData.licenseNumber;
      userData.pharmacistName = formData.pharmacistName;
    } else if (formData.role === 'wholesale') {
      userData.businessName = formData.businessName;
      userData.businessLicense = formData.businessLicense;
      userData.taxId = formData.taxId;
    } else if (formData.role === 'lab') {
      userData.labName = formData.labName;
      userData.labLicense = formData.labLicense;
      userData.specializations = formData.specializations.split(',').map(s => s.trim());
      userData.operatingHours = formData.operatingHours;
    }

    const result = await register(userData);
    
    if (result.success) {
      toast({
        title: "Registration successful! 🎉",
        description: formData.role === 'individual' 
          ? "Welcome to BEPAWA! You can now sign in to your account."
          : "Your account has been created and is pending admin approval. You'll be notified once approved.",
      });
      navigate('/login');
    } else {
      toast({
        title: "Registration failed",
        description: result.error || "An error occurred during registration. Please try again.",
        variant: "destructive",
      });
    }

    setIsLoading(false);
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-2">Choose Your Account Type</h3>
              <p className="text-gray-600">Select the type of account that best describes you</p>
            </div>
            <RoleSelector selectedRole={formData.role} onRoleSelect={handleRoleSelect} />
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold mb-2">Basic Information</h3>
              <p className="text-gray-600">Tell us about yourself</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password *</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Create a strong password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  placeholder="+255 123 456 789"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="address">Address *</Label>
              <Textarea
                id="address"
                placeholder="Enter your complete address"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                required
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold mb-2">
                {formData.role === 'individual' && 'Personal Details'}
                {formData.role === 'retail' && 'Pharmacy Information'}
                {formData.role === 'wholesale' && 'Business Information'}
                {formData.role === 'lab' && 'Lab Information'}
              </h3>
              <p className="text-gray-600">Provide additional details for your account</p>
            </div>

            {formData.role === 'individual' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="emergencyContact">Emergency Contact *</Label>
                  <Input
                    id="emergencyContact"
                    placeholder="+255 987 654 321"
                    value={formData.emergencyContact}
                    onChange={(e) => handleInputChange('emergencyContact', e.target.value)}
                    required
                  />
                </div>
              </div>
            )}

            {formData.role === 'retail' && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="pharmacyName">Pharmacy Name *</Label>
                  <Input
                    id="pharmacyName"
                    placeholder="Enter pharmacy name"
                    value={formData.pharmacyName}
                    onChange={(e) => handleInputChange('pharmacyName', e.target.value)}
                    required
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="licenseNumber">License Number *</Label>
                    <Input
                      id="licenseNumber"
                      placeholder="PHA-2024-XXX"
                      value={formData.licenseNumber}
                      onChange={(e) => handleInputChange('licenseNumber', e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pharmacistName">Licensed Pharmacist *</Label>
                    <Input
                      id="pharmacistName"
                      placeholder="Dr. John Smith"
                      value={formData.pharmacistName}
                      onChange={(e) => handleInputChange('pharmacistName', e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            {formData.role === 'wholesale' && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="businessName">Business Name *</Label>
                  <Input
                    id="businessName"
                    placeholder="Enter business name"
                    value={formData.businessName}
                    onChange={(e) => handleInputChange('businessName', e.target.value)}
                    required
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="businessLicense">Business License *</Label>
                    <Input
                      id="businessLicense"
                      placeholder="WHS-2024-XXX"
                      value={formData.businessLicense}
                      onChange={(e) => handleInputChange('businessLicense', e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="taxId">Tax ID *</Label>
                    <Input
                      id="taxId"
                      placeholder="TAX123456789"
                      value={formData.taxId}
                      onChange={(e) => handleInputChange('taxId', e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            {formData.role === 'lab' && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="labName">Lab/Clinic Name *</Label>
                  <Input
                    id="labName"
                    placeholder="Enter lab or clinic name"
                    value={formData.labName}
                    onChange={(e) => handleInputChange('labName', e.target.value)}
                    required
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="labLicense">Lab License *</Label>
                    <Input
                      id="labLicense"
                      placeholder="LAB-2024-XXX"
                      value={formData.labLicense}
                      onChange={(e) => handleInputChange('labLicense', e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="operatingHours">Operating Hours *</Label>
                    <Input
                      id="operatingHours"
                      placeholder="8:00 AM - 6:00 PM"
                      value={formData.operatingHours}
                      onChange={(e) => handleInputChange('operatingHours', e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="specializations">Specializations *</Label>
                  <Textarea
                    id="specializations"
                    placeholder="Blood Tests, X-Ray, Ultrasound (comma separated)"
                    value={formData.specializations}
                    onChange={(e) => handleInputChange('specializations', e.target.value)}
                    required
                  />
                </div>
              </div>
            )}
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold mb-2">Review & Confirm</h3>
              <p className="text-gray-600">Please review your information and accept the terms</p>
            </div>

            <Card className="bg-gray-50">
              <CardContent className="p-4">
                <h4 className="font-semibold mb-3">Account Summary</h4>
                <div className="space-y-2 text-sm">
                  <div><span className="font-medium">Role:</span> {formData.role}</div>
                  <div><span className="font-medium">Name:</span> {formData.name}</div>
                  <div><span className="font-medium">Email:</span> {formData.email}</div>
                  <div><span className="font-medium">Phone:</span> {formData.phone}</div>
                  {formData.role === 'retail' && (
                    <div><span className="font-medium">Pharmacy:</span> {formData.pharmacyName}</div>
                  )}
                  {formData.role === 'wholesale' && (
                    <div><span className="font-medium">Business:</span> {formData.businessName}</div>
                  )}
                  {formData.role === 'lab' && (
                    <div><span className="font-medium">Lab:</span> {formData.labName}</div>
                  )}
                </div>
              </CardContent>
            </Card>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="terms"
                checked={termsAccepted}
                onCheckedChange={(checked) => setTermsAccepted(checked === true)}
              />
              <Label htmlFor="terms" className="text-sm">
                I accept the{" "}
                <Link to="#" className="text-primary-600 hover:underline">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link to="#" className="text-primary-600 hover:underline">
                  Privacy Policy
                </Link>
              </Label>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex items-center justify-center p-4">
      <Link 
        to="/" 
        className="absolute top-6 left-6 flex items-center text-primary-600 hover:text-primary-700 transition-colors"
      >
        <ArrowLeft className="h-5 w-5 mr-2" />
        Back to Home
      </Link>

      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-6">
            <img src="/logo.png" alt="Logo" className="h-12 w-auto mx-auto" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-700 to-primary-600 bg-clip-text text-transparent mb-2">
            Join BEPAWA
          </h1>
          <p className="text-gray-600">Create your account in a few simple steps</p>
        </div>

        {/* Progress Indicator */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-4">
            {[1, 2, 3, 4].map((stepNumber) => (
              <div key={stepNumber} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step >= stepNumber ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  {stepNumber}
                </div>
                {stepNumber < 4 && (
                  <div className={`w-12 h-0.5 mx-2 ${
                    step > stepNumber ? 'bg-primary-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <Card className="backdrop-blur-sm bg-white/90 border-0 shadow-2xl">
          <CardContent className="p-8">
            <form onSubmit={handleSubmit}>
              {renderStep()}
              
              <div className="flex justify-between mt-8">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep(Math.max(1, step - 1))}
                  disabled={step === 1}
                >
                  Previous
                </Button>
                
                {step < 4 ? (
                  <Button
                    type="button"
                    onClick={handleNext}
                    disabled={
                      (step === 1 && !validateStep1()) ||
                      (step === 2 && !validateStep2()) ||
                      (step === 3 && !validateStep3())
                    }
                  >
                    Next <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                ) : (
                  <Button 
                    type="submit" 
                    disabled={isLoading || !termsAccepted}
                  >
                    {isLoading ? "Creating account..." : "Create Account"}
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="text-center mt-6">
          <p className="text-gray-600">
            Already have an account?{" "}
            <Link to="/login" className="text-primary-600 hover:underline font-medium">
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
