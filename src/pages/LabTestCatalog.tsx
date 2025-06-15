
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { TestTube, Search, Clock, DollarSign, Plus } from "lucide-react";
import { useLabTests, useCreateLabTest } from "@/hooks/useLab";
import { useToast } from "@/hooks/use-toast";
import type { LabTest } from "@/services/labService";

const LabTestCatalog = () => {
  const { toast } = useToast();
  const { data: tests, isLoading, error } = useLabTests();
  const createLabTestMutation = useCreateLabTest();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Get unique categories from tests
  const categories = ['all', ...Array.from(new Set(tests?.map(test => test.category) || []))];

  const filteredTests = (tests || []).filter(test => {
    const matchesSearch = test.test_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (test.description || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || test.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center">
        <div>Loading test catalog...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center">
        <div className="text-red-600">Error loading tests: {error.message}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Laboratory Test Catalog</h1>
          <p className="text-gray-600 text-lg">Browse available laboratory tests and services</p>
        </div>

        {/* Search and Filter */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search tests..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category}
                  </option>
                ))}
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Test Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTests.map((test) => (
            <Card key={test.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <TestTube className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{test.test_name}</CardTitle>
                      <Badge variant="outline" className="mt-1">
                        {test.category}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">{test.description || 'No description available'}</p>
                
                <div className="space-y-3 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <DollarSign className="h-4 w-4 text-green-600" />
                    <span className="font-semibold">TZS {test.price.toLocaleString()}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-blue-600" />
                    <span>Results in {test.turnaround_time_hours} hours</span>
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="text-sm font-medium mb-2">Sample Type:</h4>
                  <p className="text-xs text-gray-600">{test.sample_type}</p>
                  
                  {test.preparation_instructions && (
                    <>
                      <h4 className="text-sm font-medium mb-1 mt-2">Preparation:</h4>
                      <p className="text-xs text-gray-600">{test.preparation_instructions}</p>
                    </>
                  )}
                  
                  {test.normal_range && (
                    <>
                      <h4 className="text-sm font-medium mb-1 mt-2">Normal Range:</h4>
                      <p className="text-xs text-gray-600">{test.normal_range}</p>
                    </>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button className="flex-1" disabled={!test.is_active}>
                    <Plus className="h-4 w-4 mr-1" />
                    {test.is_active ? 'Book Test' : 'Unavailable'}
                  </Button>
                  <Button variant="outline" size="sm">
                    Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredTests.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <TestTube className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No tests found</h3>
              <p className="text-gray-600">
                {searchTerm || selectedCategory !== 'all' 
                  ? "No tests match your search criteria." 
                  : "No tests are currently available."}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default LabTestCatalog;
