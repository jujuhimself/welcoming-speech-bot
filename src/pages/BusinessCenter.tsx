
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  TrendingUp, 
  Users, 
  ShoppingCart, 
  DollarSign,
  BarChart3,
  FileText,
  Calendar,
  Settings
} from "lucide-react";

const BusinessCenter = () => {
  const businessMetrics = [
    {
      title: "Monthly Revenue",
      value: "TZS 2,450,000",
      change: "+12.5%",
      icon: <DollarSign className="h-6 w-6 text-green-600" />
    },
    {
      title: "Active Customers",
      value: "1,247",
      change: "+8.2%",
      icon: <Users className="h-6 w-6 text-blue-600" />
    },
    {
      title: "Orders This Month",
      value: "342",
      change: "+15.3%",
      icon: <ShoppingCart className="h-6 w-6 text-purple-600" />
    },
    {
      title: "Growth Rate",
      value: "23.4%",
      change: "+5.1%",
      icon: <TrendingUp className="h-6 w-6 text-orange-600" />
    }
  ];

  const businessTools = [
    {
      title: "Analytics Dashboard",
      description: "Comprehensive business insights and reporting",
      icon: <BarChart3 className="h-8 w-8 text-blue-600" />,
      action: "View Analytics"
    },
    {
      title: "Financial Reports",
      description: "Generate detailed financial statements",
      icon: <FileText className="h-8 w-8 text-green-600" />,
      action: "Generate Reports"
    },
    {
      title: "Schedule Management",
      description: "Manage appointments and schedules",
      icon: <Calendar className="h-8 w-8 text-purple-600" />,
      action: "Manage Schedule"
    },
    {
      title: "Business Settings",
      description: "Configure business preferences",
      icon: <Settings className="h-8 w-8 text-gray-600" />,
      action: "Open Settings"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Business Center</h1>
          <p className="text-gray-600 text-lg">Manage and grow your healthcare business</p>
        </div>

        {/* Business Metrics */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {businessMetrics.map((metric, index) => (
            <Card key={index} className="bg-white shadow-lg border-0">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  {metric.icon}
                  <span className="text-sm font-medium text-green-600">{metric.change}</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">{metric.value}</h3>
                <p className="text-gray-600 text-sm">{metric.title}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Business Tools */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl">Business Management Tools</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              {businessTools.map((tool, index) => (
                <div key={index} className="flex items-start gap-4 p-6 bg-gray-50 rounded-lg">
                  <div className="p-3 bg-white rounded-lg shadow-sm">
                    {tool.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-2">{tool.title}</h3>
                    <p className="text-gray-600 mb-4">{tool.description}</p>
                    <Button variant="outline" size="sm">
                      {tool.action}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <Button className="bg-blue-600 hover:bg-blue-700">
                Create New Order
              </Button>
              <Button variant="outline">
                Export Data
              </Button>
              <Button variant="outline">
                Schedule Appointment
              </Button>
              <Button variant="outline">
                Contact Support
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BusinessCenter;
