
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { CreditCard, FileText, AlertCircle, CheckCircle, Clock } from "lucide-react";
import { useCreateCreditRequest, useCreditRequests, useCreditAccount } from "@/hooks/useCreditRequest";
import { useToast } from "@/hooks/use-toast";
import PageHeader from "@/components/PageHeader";

const CreditRequest = () => {
  const { toast } = useToast();
  const { data: creditRequests, isLoading: requestsLoading } = useCreditRequests();
  const { data: creditAccount } = useCreditAccount();
  const createCreditRequestMutation = useCreateCreditRequest();

  const [formData, setFormData] = useState({
    business_name: '',
    requested_amount: '',
    business_type: '',
    monthly_revenue: '',
    years_in_business: '',
    credit_purpose: '',
    documents: [] as string[]
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.business_name || !formData.requested_amount || !formData.business_type) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    createCreditRequestMutation.mutate({
      business_name: formData.business_name,
      requested_amount: parseFloat(formData.requested_amount),
      business_type: formData.business_type,
      monthly_revenue: parseFloat(formData.monthly_revenue || '0'),
      years_in_business: parseInt(formData.years_in_business || '0'),
      credit_purpose: formData.credit_purpose,
      documents: formData.documents
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'rejected': return <AlertCircle className="h-4 w-4 text-red-600" />;
      case 'under_review': return <Clock className="h-4 w-4 text-blue-600" />;
      default: return <Clock className="h-4 w-4 text-yellow-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'under_review': return 'bg-blue-100 text-blue-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  if (requestsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center">
        <div>Loading credit information...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="container mx-auto px-4 py-8">
        <PageHeader
          title="Credit Request"
          description="Apply for business credit to expand your operations"
          badge={{ text: "Financial Services", variant: "outline" }}
        />

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Credit Application Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Credit Application
                </CardTitle>
                <CardDescription>
                  Complete the form below to apply for business credit
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="business_name">Business Name *</Label>
                      <Input
                        id="business_name"
                        value={formData.business_name}
                        onChange={(e) => setFormData({ ...formData, business_name: e.target.value })}
                        placeholder="Enter your business name"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="requested_amount">Requested Amount (TZS) *</Label>
                      <Input
                        id="requested_amount"
                        type="number"
                        value={formData.requested_amount}
                        onChange={(e) => setFormData({ ...formData, requested_amount: e.target.value })}
                        placeholder="e.g., 5000000"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="business_type">Business Type *</Label>
                      <Select 
                        value={formData.business_type} 
                        onValueChange={(value) => setFormData({ ...formData, business_type: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select business type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pharmacy">Pharmacy</SelectItem>
                          <SelectItem value="wholesale">Wholesale</SelectItem>
                          <SelectItem value="retail">Retail</SelectItem>
                          <SelectItem value="laboratory">Laboratory</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="monthly_revenue">Monthly Revenue (TZS)</Label>
                      <Input
                        id="monthly_revenue"
                        type="number"
                        value={formData.monthly_revenue}
                        onChange={(e) => setFormData({ ...formData, monthly_revenue: e.target.value })}
                        placeholder="e.g., 2000000"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="years_in_business">Years in Business</Label>
                      <Input
                        id="years_in_business"
                        type="number"
                        value={formData.years_in_business}
                        onChange={(e) => setFormData({ ...formData, years_in_business: e.target.value })}
                        placeholder="e.g., 3"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="credit_purpose">Purpose of Credit</Label>
                    <Textarea
                      id="credit_purpose"
                      value={formData.credit_purpose}
                      onChange={(e) => setFormData({ ...formData, credit_purpose: e.target.value })}
                      placeholder="Describe how you plan to use the credit..."
                      rows={3}
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={createCreditRequestMutation.isPending}
                  >
                    {createCreditRequestMutation.isPending ? 'Submitting...' : 'Submit Credit Application'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Current Credit Account */}
            {creditAccount && (
              <Card>
                <CardHeader>
                  <CardTitle>Current Credit Account</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Credit Limit:</span>
                      <span className="font-semibold">TZS {creditAccount.credit_limit.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Available Credit:</span>
                      <span className="font-semibold text-green-600">TZS {creditAccount.available_credit.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Current Balance:</span>
                      <span className="font-semibold">TZS {creditAccount.current_balance.toLocaleString()}</span>
                    </div>
                    <Badge className={creditAccount.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                      {creditAccount.status}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Requirements */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Requirements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                    <span>Valid business registration</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                    <span>Tax identification number</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                    <span>3 months bank statements</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                    <span>Business financial statements</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Previous Applications */}
        {creditRequests && creditRequests.length > 0 && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Application History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {creditRequests.map((request) => (
                  <div key={request.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        {getStatusIcon(request.status)}
                        <h4 className="font-medium">{request.business_name}</h4>
                        <Badge className={getStatusColor(request.status)}>
                          {request.status.replace('_', ' ')}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">
                        Requested: TZS {request.requested_amount.toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-500">
                        Applied: {new Date(request.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default CreditRequest;
