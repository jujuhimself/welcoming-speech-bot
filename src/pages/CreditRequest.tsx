
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { CreditCard } from "lucide-react";

const CreditRequest = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    amount: "",
    reason: "",
    repaymentPeriod: "",
    businessJustification: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    const creditRequest = {
      id: Date.now().toString(),
      pharmacyId: user?.id,
      pharmacyName: user?.pharmacyName,
      amount: parseFloat(formData.amount),
      reason: formData.reason,
      repaymentPeriod: formData.repaymentPeriod,
      businessJustification: formData.businessJustification,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    // Store credit request
    const existingRequests = JSON.parse(localStorage.getItem('bepawa_credit_requests') || '[]');
    existingRequests.push(creditRequest);
    localStorage.setItem('bepawa_credit_requests', JSON.stringify(existingRequests));

    toast({
      title: "Credit request submitted",
      description: "Your credit request has been submitted for review. You will be notified once it's processed.",
    });

    setIsSubmitting(false);
    navigate('/pharmacy');
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8 text-center">
            <CreditCard className="h-16 w-16 text-blue-600 mx-auto mb-4" />
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Request Credit</h1>
            <p className="text-gray-600 text-lg">Apply for business credit to grow your pharmacy</p>
          </div>

          <Card className="shadow-xl border-0">
            <CardHeader>
              <CardTitle className="text-2xl">Credit Application Form</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="amount" className="text-lg font-medium">Credit Amount (TZS)</Label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="Enter requested amount"
                    value={formData.amount}
                    onChange={(e) => handleInputChange('amount', e.target.value)}
                    required
                    className="h-12 text-lg"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="repaymentPeriod" className="text-lg font-medium">Repayment Period</Label>
                  <Select onValueChange={(value) => handleInputChange('repaymentPeriod', value)} required>
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="Select repayment period" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border shadow-lg">
                      <SelectItem value="30-days">30 Days</SelectItem>
                      <SelectItem value="60-days">60 Days</SelectItem>
                      <SelectItem value="90-days">90 Days</SelectItem>
                      <SelectItem value="6-months">6 Months</SelectItem>
                      <SelectItem value="12-months">12 Months</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reason" className="text-lg font-medium">Reason for Credit</Label>
                  <Select onValueChange={(value) => handleInputChange('reason', value)} required>
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="Select reason" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border shadow-lg">
                      <SelectItem value="inventory-expansion">Inventory Expansion</SelectItem>
                      <SelectItem value="seasonal-demand">Seasonal Demand</SelectItem>
                      <SelectItem value="emergency-stock">Emergency Stock</SelectItem>
                      <SelectItem value="business-growth">Business Growth</SelectItem>
                      <SelectItem value="cash-flow">Cash Flow Management</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="businessJustification" className="text-lg font-medium">Business Justification</Label>
                  <Textarea
                    id="businessJustification"
                    placeholder="Explain how this credit will benefit your pharmacy business..."
                    value={formData.businessJustification}
                    onChange={(e) => handleInputChange('businessJustification', e.target.value)}
                    required
                    rows={5}
                    className="text-lg"
                  />
                </div>

                <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                  <h3 className="font-semibold text-blue-900 mb-2">Credit Terms & Conditions</h3>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Interest rates start from 2% per month</li>
                    <li>• Credit limit based on your order history and business profile</li>
                    <li>• Approval process takes 2-3 business days</li>
                    <li>• Early repayment discounts available</li>
                  </ul>
                </div>

                <Button 
                  type="submit" 
                  className="w-full h-14 text-lg font-semibold"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting Request..." : "Submit Credit Request"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CreditRequest;
