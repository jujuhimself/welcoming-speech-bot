
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { 
  CreditCard, 
  Plus, 
  Search, 
  FileText, 
  CheckCircle, 
  XCircle, 
  Clock,
  DollarSign,
  TrendingUp,
  Users
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { MockDataService, CreditRequest } from "@/services/mockDataService";
import { useToast } from "@/hooks/use-toast";

const CreditRequestManagement = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [creditRequests, setCreditRequests] = useState<CreditRequest[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isNewRequestOpen, setIsNewRequestOpen] = useState(false);
  const [newRequest, setNewRequest] = useState({
    requestedAmount: "",
    purpose: "",
    businessDocument: ""
  });

  useEffect(() => {
    // Load credit requests based on user role
    const requests = MockDataService.getCreditRequests();
    if (user?.role === 'retail') {
      // Pharmacy users see only their requests
      setCreditRequests(requests.filter(req => req.pharmacyId === user.id));
    } else if (user?.role === 'wholesale' || user?.role === 'admin') {
      // Wholesalers and admins see all requests
      setCreditRequests(requests);
    }
  }, [user]);

  const handleCreateRequest = () => {
    if (!newRequest.requestedAmount || !newRequest.purpose) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const request: CreditRequest = {
      id: `CR-${Date.now()}`,
      pharmacyId: user?.id || 'unknown',
      pharmacyName: user?.pharmacyName || user?.name || 'Unknown Pharmacy',
      requestedAmount: parseInt(newRequest.requestedAmount),
      purpose: newRequest.purpose,
      status: 'pending',
      createdAt: new Date().toISOString(),
      businessDocument: newRequest.businessDocument,
      financialHistory: Math.floor(Math.random() * 5000000)
    };

    setCreditRequests([request, ...creditRequests]);
    setIsNewRequestOpen(false);
    setNewRequest({ requestedAmount: "", purpose: "", businessDocument: "" });
    
    toast({
      title: "Credit Request Submitted",
      description: `Request for TZS ${parseInt(newRequest.requestedAmount).toLocaleString()} has been submitted for review.`
    });
  };

  const handleApproveRequest = (requestId: string) => {
    setCreditRequests(requests => 
      requests.map(req => 
        req.id === requestId ? { ...req, status: 'approved' as const } : req
      )
    );
    toast({
      title: "Request Approved",
      description: "Credit request has been approved successfully."
    });
  };

  const handleRejectRequest = (requestId: string) => {
    setCreditRequests(requests => 
      requests.map(req => 
        req.id === requestId ? { ...req, status: 'rejected' as const } : req
      )
    );
    toast({
      title: "Request Rejected",
      description: "Credit request has been rejected."
    });
  };

  const filteredRequests = creditRequests.filter(request => {
    const matchesSearch = request.pharmacyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.purpose.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || request.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'approved': return <CheckCircle className="h-4 w-4" />;
      case 'rejected': return <XCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const stats = {
    total: creditRequests.length,
    pending: creditRequests.filter(req => req.status === 'pending').length,
    approved: creditRequests.filter(req => req.status === 'approved').length,
    totalAmount: creditRequests.reduce((sum, req) => sum + req.requestedAmount, 0)
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Credit Management</h1>
            <p className="text-gray-600 text-lg">
              {user?.role === 'retail' ? 'Manage your credit requests' : 'Review and approve credit requests'}
            </p>
          </div>
          {user?.role === 'retail' && (
            <Dialog open={isNewRequestOpen} onOpenChange={setIsNewRequestOpen}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-5 w-5 mr-2" />
                  New Credit Request
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>New Credit Request</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="amount">Requested Amount (TZS)</Label>
                    <Input
                      id="amount"
                      type="number"
                      placeholder="Enter amount"
                      value={newRequest.requestedAmount}
                      onChange={(e) => setNewRequest(prev => ({ ...prev, requestedAmount: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="purpose">Purpose</Label>
                    <Textarea
                      id="purpose"
                      placeholder="Describe the purpose of this credit request"
                      value={newRequest.purpose}
                      onChange={(e) => setNewRequest(prev => ({ ...prev, purpose: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="document">Supporting Document (Optional)</Label>
                    <Input
                      id="document"
                      placeholder="Document reference"
                      value={newRequest.businessDocument}
                      onChange={(e) => setNewRequest(prev => ({ ...prev, businessDocument: e.target.value }))}
                    />
                  </div>
                  <Button onClick={handleCreateRequest} className="w-full">
                    Submit Request
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <Clock className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Approved</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.approved}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Amount</CardTitle>
              <DollarSign className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">TZS {stats.totalAmount.toLocaleString()}</div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search requests..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Credit Requests */}
        <Card>
          <CardHeader>
            <CardTitle>Credit Requests</CardTitle>
          </CardHeader>
          <CardContent>
            {filteredRequests.length === 0 ? (
              <div className="text-center py-12">
                <CreditCard className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No credit requests found</h3>
                <p className="text-gray-500 mb-6">
                  {user?.role === 'retail' 
                    ? "Create your first credit request to get started" 
                    : "No requests match your current filters"
                  }
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredRequests.map((request) => (
                  <div key={request.id} className="border rounded-lg p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="font-semibold text-lg">{request.pharmacyName}</h4>
                        <p className="text-gray-600">Request ID: {request.id}</p>
                        <p className="text-sm text-gray-500">
                          Submitted: {new Date(request.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge className={getStatusColor(request.status)}>
                        <div className="flex items-center gap-1">
                          {getStatusIcon(request.status)}
                          {request.status.toUpperCase()}
                        </div>
                      </Badge>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-600">Requested Amount</p>
                        <p className="font-bold text-lg">TZS {request.requestedAmount.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Financial History</p>
                        <p className="font-medium">TZS {request.financialHistory.toLocaleString()}</p>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <p className="text-sm text-gray-600 mb-1">Purpose</p>
                      <p className="text-gray-800">{request.purpose}</p>
                    </div>
                    
                    {request.businessDocument && (
                      <div className="mb-4">
                        <p className="text-sm text-gray-600 mb-1">Supporting Document</p>
                        <p className="text-blue-600">{request.businessDocument}</p>
                      </div>
                    )}
                    
                    {(user?.role === 'wholesale' || user?.role === 'admin') && request.status === 'pending' && (
                      <div className="flex gap-2">
                        <Button 
                          onClick={() => handleApproveRequest(request.id)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Approve
                        </Button>
                        <Button 
                          onClick={() => handleRejectRequest(request.id)}
                          variant="outline"
                          className="border-red-300 text-red-700 hover:bg-red-50"
                        >
                          <XCircle className="h-4 w-4 mr-2" />
                          Reject
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreditRequestManagement;
