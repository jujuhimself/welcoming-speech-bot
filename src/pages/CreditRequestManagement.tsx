
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  CreditCard, 
  DollarSign, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  Clock,
  FileText,
  User,
  Calendar
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CreditRequest {
  id: string;
  pharmacyId: string;
  pharmacyName: string;
  requestedAmount: number;
  purpose: string;
  status: 'pending' | 'approved' | 'rejected' | 'under-review';
  createdAt: string;
  businessDocument: string;
  financialHistory: number;
  creditScore: number;
  approvedAmount?: number;
  rejectionReason?: string;
  reviewNotes?: string;
}

const CreditRequestManagement = () => {
  const { toast } = useToast();
  const [requests, setRequests] = useState<CreditRequest[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<CreditRequest | null>(null);
  const [reviewNotes, setReviewNotes] = useState("");
  const [approvedAmount, setApprovedAmount] = useState<number>(0);

  useEffect(() => {
    // Mock data for credit requests
    const mockRequests: CreditRequest[] = [
      {
        id: "CR001",
        pharmacyId: "PH001",
        pharmacyName: "Dawa Pharmacy",
        requestedAmount: 5000000,
        purpose: "Inventory expansion for new location",
        status: "pending",
        createdAt: "2024-01-15T10:00:00Z",
        businessDocument: "business_license_001.pdf",
        financialHistory: 85,
        creditScore: 720
      },
      {
        id: "CR002",
        pharmacyId: "PH002",
        pharmacyName: "Afya Health Center",
        requestedAmount: 3000000,
        purpose: "Equipment purchase and renovation",
        status: "under-review",
        createdAt: "2024-01-14T14:30:00Z",
        businessDocument: "financial_statement_002.pdf",
        financialHistory: 92,
        creditScore: 680,
        reviewNotes: "Strong payment history, good location"
      },
      {
        id: "CR003",
        pharmacyId: "PH003",
        pharmacyName: "Mzuri Pharmacy",
        requestedAmount: 2000000,
        purpose: "Working capital for seasonal inventory",
        status: "approved",
        createdAt: "2024-01-13T09:15:00Z",
        businessDocument: "tax_clearance_003.pdf",
        financialHistory: 78,
        creditScore: 750,
        approvedAmount: 1800000,
        reviewNotes: "Approved with slightly reduced amount due to cash flow analysis"
      }
    ];
    setRequests(mockRequests);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'under-review': return 'bg-blue-100 text-blue-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return Clock;
      case 'under-review': return AlertTriangle;
      case 'approved': return CheckCircle;
      case 'rejected': return AlertTriangle;
      default: return FileText;
    }
  };

  const handleStatusUpdate = (requestId: string, newStatus: CreditRequest['status']) => {
    const updatedRequests = requests.map(request => {
      if (request.id === requestId) {
        return {
          ...request,
          status: newStatus,
          approvedAmount: newStatus === 'approved' ? approvedAmount : undefined,
          reviewNotes: reviewNotes || request.reviewNotes
        };
      }
      return request;
    });
    
    setRequests(updatedRequests);
    setSelectedRequest(null);
    setReviewNotes("");
    setApprovedAmount(0);
    
    toast({
      title: "Credit Request Updated",
      description: `Request ${requestId} has been ${newStatus}.`,
    });
  };

  const pendingCount = requests.filter(r => r.status === 'pending').length;
  const reviewCount = requests.filter(r => r.status === 'under-review').length;
  const approvedCount = requests.filter(r => r.status === 'approved').length;
  const totalRequested = requests.reduce((sum, r) => sum + r.requestedAmount, 0);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Credit Request Management</h1>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending Requests</p>
                <p className="text-2xl font-bold text-yellow-600">{pendingCount}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Under Review</p>
                <p className="text-2xl font-bold text-blue-600">{reviewCount}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Approved</p>
                <p className="text-2xl font-bold text-green-600">{approvedCount}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Requested</p>
                <p className="text-2xl font-bold text-primary-600">TZS {totalRequested.toLocaleString()}</p>
              </div>
              <DollarSign className="h-8 w-8 text-primary-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Credit Requests List */}
      <Card>
        <CardHeader>
          <CardTitle>Credit Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {requests.map((request) => {
              const StatusIcon = getStatusIcon(request.status);
              return (
                <div key={request.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="p-2 bg-primary-100 rounded-lg">
                        <StatusIcon className="h-6 w-6 text-primary-600" />
                      </div>
                      <div className="space-y-2">
                        <div>
                          <h3 className="font-semibold text-lg">{request.pharmacyName}</h3>
                          <p className="text-sm text-gray-600">Request ID: {request.id}</p>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-gray-600">Amount:</span>
                            <p className="font-medium">TZS {request.requestedAmount.toLocaleString()}</p>
                          </div>
                          <div>
                            <span className="text-gray-600">Purpose:</span>
                            <p className="font-medium">{request.purpose}</p>
                          </div>
                          <div>
                            <span className="text-gray-600">Credit Score:</span>
                            <p className="font-medium">{request.creditScore}</p>
                          </div>
                          <div>
                            <span className="text-gray-600">Created:</span>
                            <p className="font-medium">{new Date(request.createdAt).toLocaleDateString()}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge className={getStatusColor(request.status)}>
                        {request.status.replace('-', ' ').toUpperCase()}
                      </Badge>
                      {request.status === 'pending' || request.status === 'under-review' ? (
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => {
                                setSelectedRequest(request);
                                setApprovedAmount(request.requestedAmount);
                              }}
                            >
                              Review
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Review Credit Request - {request.pharmacyName}</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <label className="block text-sm font-medium mb-2">Requested Amount</label>
                                  <p className="text-lg font-semibold">TZS {request.requestedAmount.toLocaleString()}</p>
                                </div>
                                <div>
                                  <label className="block text-sm font-medium mb-2">Credit Score</label>
                                  <p className="text-lg font-semibold">{request.creditScore}</p>
                                </div>
                              </div>
                              
                              <div>
                                <label className="block text-sm font-medium mb-2">Purpose</label>
                                <p>{request.purpose}</p>
                              </div>

                              <div>
                                <label className="block text-sm font-medium mb-2">Approved Amount</label>
                                <Input
                                  type="number"
                                  value={approvedAmount}
                                  onChange={(e) => setApprovedAmount(Number(e.target.value))}
                                  placeholder="Enter approved amount"
                                />
                              </div>

                              <div>
                                <label className="block text-sm font-medium mb-2">Review Notes</label>
                                <Textarea
                                  value={reviewNotes}
                                  onChange={(e) => setReviewNotes(e.target.value)}
                                  placeholder="Add your review notes..."
                                  rows={3}
                                />
                              </div>

                              <div className="flex gap-3 pt-4">
                                <Button 
                                  onClick={() => handleStatusUpdate(request.id, 'approved')}
                                  className="bg-green-600 hover:bg-green-700"
                                >
                                  Approve
                                </Button>
                                <Button 
                                  onClick={() => handleStatusUpdate(request.id, 'rejected')}
                                  variant="destructive"
                                >
                                  Reject
                                </Button>
                                <Button 
                                  onClick={() => handleStatusUpdate(request.id, 'under-review')}
                                  variant="outline"
                                >
                                  Mark Under Review
                                </Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      ) : null}
                    </div>
                  </div>
                  {request.reviewNotes && (
                    <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-700">
                        <span className="font-medium">Notes:</span> {request.reviewNotes}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreditRequestManagement;
