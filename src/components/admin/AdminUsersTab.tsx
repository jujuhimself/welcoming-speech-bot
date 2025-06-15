
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Settings } from "lucide-react";
import { UserAccount } from "@/pages/AdminDashboard";

interface Props {
  allUsers: UserAccount[];
  getRoleIcon: (role: string) => React.ReactNode;
  getStatusBadge: (status: string) => React.ReactNode;
}

const AdminUsersTab = ({
  allUsers,
  getRoleIcon,
  getStatusBadge,
}: Props) => (
  <Card>
    <CardHeader>
      <CardTitle>All User Accounts</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        {allUsers.map((user) => (
          <div key={user.id} className="flex justify-between items-center p-4 border rounded-lg">
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
            <div className="flex gap-2">
              <Button size="sm" variant="outline">
                <Eye className="h-4 w-4 mr-1" />
                View
              </Button>
              <Button size="sm" variant="outline">
                <Settings className="h-4 w-4 mr-1" />
                Manage
              </Button>
            </div>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);

export default AdminUsersTab;
