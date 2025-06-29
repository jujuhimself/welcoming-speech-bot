import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { MapPin, Search, Star, Clock, Phone, TestTube } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import EmptyState from "@/components/EmptyState";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Lab {
  id: string;
  name: string;
  location: string;
  rating: number;
  distance: string;
  isOpen: boolean;
  hours: string;
  phone: string;
  tests: string[];
}

const LabDirectory = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [labs, setLabs] = useState<Lab[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchLabs();
  }, []);

  const fetchLabs = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('id, name, business_name, region, city, phone, address, is_approved')
        .eq('role', 'lab')
        .eq('is_approved', true)
        .order('business_name');

      if (error) throw error;

      // Fetch available lab tests
      const { data: labTests, error: testsError } = await supabase
        .from('lab_tests')
        .select('test_name, category')
        .eq('is_active', true)
        .limit(10);

      const availableTests = labTests || [];

      const labData: Lab[] = (data || []).map((lab: any) => ({
        id: lab.id,
        name: lab.business_name || lab.name || 'Laboratory',
        location: lab.address || ((lab.city && lab.region) ? `${lab.city}, ${lab.region}` : 'Location not set'),
        rating: 4.5, // Default rating
        distance: 'N/A', // Would need location services for real distance
        isOpen: true, // Default to open
        hours: '7:00 AM - 6:00 PM', // Default hours
        phone: lab.phone || 'N/A',
        tests: availableTests.map((test: any) => test.test_name).slice(0, 5) // Show first 5 tests
      }));

      setLabs(labData);
    } catch (error) {
      console.error('Error fetching labs:', error);
      toast({
        title: "Error",
        description: "Failed to load laboratories",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filteredLabs = labs.filter(lab =>
    lab.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lab.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading laboratories...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="container mx-auto px-4 py-8">
        <PageHeader 
          title="Find Laboratories"
          description="Discover nearby laboratories and book your medical tests"
          badge={{ text: "Healthcare", variant: "outline" }}
        />

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              placeholder="Search by laboratory name or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-12 text-lg"
            />
          </div>
        </div>

        {/* Labs Grid */}
        {filteredLabs.length === 0 ? (
          <EmptyState
            title="No laboratories found"
            description={searchTerm 
              ? "No laboratories match your search criteria." 
              : "Laboratory directory will be populated as labs join the platform. Check back soon for available testing facilities in your area."}
            icon={<TestTube className="h-16 w-16" />}
            variant="card"
          />
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredLabs.map((lab) => (
              <Card key={lab.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{lab.name}</CardTitle>
                      <p className="text-gray-600 flex items-center mt-1">
                        <MapPin className="h-4 w-4 mr-1" />
                        {lab.location}
                      </p>
                      {lab.phone && lab.phone !== 'N/A' && (
                        <p className="text-gray-600 flex items-center mt-1">
                          <Phone className="h-4 w-4 mr-1" />
                          {lab.phone}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="ml-1 font-medium">{lab.rating}</span>
                      </div>
                      <p className="text-sm text-gray-500">{lab.distance}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Badge variant={lab.isOpen ? "default" : "secondary"}>
                        <Clock className="h-3 w-3 mr-1" />
                        {lab.isOpen ? "Open" : "Closed"}
                      </Badge>
                      <span className="text-sm text-gray-600">{lab.hours}</span>
                    </div>

                    <div>
                      <p className="text-sm font-medium mb-2">Available Tests:</p>
                      <div className="flex flex-wrap gap-1">
                        {lab.tests?.slice(0, 3).map((test: string, index: number) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {test}
                          </Badge>
                        ))}
                        {lab.tests?.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{lab.tests.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button size="sm" className="flex-1">
                        View Tests
                      </Button>
                      <Button size="sm" variant="outline">
                        <Phone className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LabDirectory;
