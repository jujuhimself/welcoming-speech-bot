
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  logout: () => void;
}

const WholesalePendingApprovalNotice = ({ logout }: Props) => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-center">Pending Approval</CardTitle>
      </CardHeader>
      <CardContent className="text-center space-y-4">
        <Package className="h-16 w-16 text-yellow-500 mx-auto" />
        <p className="text-gray-600">
          Your wholesale account is pending admin approval. You'll receive an email notification once approved.
        </p>
        <Button onClick={logout} variant="outline">
          Back to Login
        </Button>
      </CardContent>
    </Card>
  </div>
);

export default WholesalePendingApprovalNotice;
