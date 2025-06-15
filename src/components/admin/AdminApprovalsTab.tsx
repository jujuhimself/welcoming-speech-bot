
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShieldCheck, UserCheck, UserX, Eye, CheckCircle } from "lucide-react";
import { UserAccount } from "@/pages/AdminDashboard";

interface Props {
  pendingUsers: UserAccount[];
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  getRoleIcon: (role: string) => React.ReactNode;
  getStatusBadge: (status: string) => React.ReactNode;
}

const AdminApprovalsTab = ({
  pendingUsers,
  onApprove,
  onReject,
  getRoleIcon,
  getStatusBadge,
}: Props) => (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <ShieldCheck className="h-5 w-5" />
        Pending Account Approvals ({pendingUsers.length})
      </CardTitle>
    </CardHeader>
    <CardContent>
      {pendingUsers.length === 0 ? (
        <div className="text-center py-8">
          <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
          <p className="text-gray-600">No pending approvals</p>
        </div>
      ) : (
        <div className="space-y-4">
          {pendingUsers.map((user) => (
            <div key={user.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                  {getRoleIcon(user.role)}
                  <div>
                    <h4 className="font-semibold">{user.businessName || user.name}</h4>
                    <p className="text-sm text-gray-600">{user.email}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="capitalize">{user.role}</Badge>
                      {getStatusBadge(user.status)}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">Registered</p>
                  <p className="text-sm font-medium">{user.registeredAt}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  onClick={() => onApprove(user.id)}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <UserCheck className="h-4 w-4 mr-1" />
                  Approve
                </Button>
                <Button 
                  size="sm" 
                  variant="destructive"
                  onClick={() => onReject(user.id)}
                >
                  <UserX className="h-4 w-4 mr-1" />
                  Reject
                </Button>
                <Button size="sm" variant="outline">
                  <Eye className="h-4 w-4 mr-1" />
                  View Details
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </CardContent>
  </Card>
);

export default AdminApprovalsTab;
