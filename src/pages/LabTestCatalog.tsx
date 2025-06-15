
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { TestTube, Search, Clock, DollarSign, Plus } from "lucide-react";

interface LabTest {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  duration: string;
  requirements: string[];
  available: boolean;
}

const LabTestCatalog = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const [tests] = useState<LabTest[]>([
    {
      id: '1',
      name: 'Complete Blood Count (CBC)',
      category: 'Hematology',
      description: 'Comprehensive analysis of blood cells including red blood cells, white blood cells, and platelets.',
      price: 25000,
      duration: '2-4 hours',
      requirements: ['Fasting not required', 'No special preparation needed'],
      available: true
    },
    {
      id: '2',
      name: 'Lipid Profile',
      category: 'Chemistry',
      description: 'Measures cholesterol and triglyceride levels to assess cardiovascular risk.',
      price: 35000,
      duration: '4-6 hours',
      requirements: ['12-hour fasting required', 'No alcohol 24 hours before test'],
      available: true
    },
    {
      id: '3',
      name: 'Liver Function Test (LFT)',
      category: 'Chemistry',
      description: 'Evaluates liver health by measuring enzymes, proteins, and bilirubin levels.',
      price: 40000,
      duration: '4-6 hours',
      requirements: ['8-hour fasting recommended', 'Avoid medications if possible'],
      available: true
    },
    {
      id: '4',
      name: 'Thyroid Function Test',
      category: 'Endocrinology',
      description: 'Measures thyroid hormones TSH, T3, and T4 to assess thyroid function.',
      price: 55000,
      duration: '1-2 days',
      requirements: ['No special preparation needed', 'Take medications as usual'],
      available: true
    },
    {
      id: '5',
      name: 'HIV Screening',
      category: 'Serology',
      description: 'Confidential HIV antibody testing with counseling services.',
      price: 15000,
      duration: '30 minutes',
      requirements: ['No fasting required', 'Counseling session included'],
      available: true
    },
    {
      id: '6',
      name: 'Malaria Test',
      category: 'Parasitology',
      description: 'Rapid diagnostic test for malaria parasites in blood.',
      price: 8000,
      duration: '15-30 minutes',
      requirements: ['No special preparation needed', 'Immediate results available'],
      available: true
    },
    {
      id: '7',
      name: 'Pregnancy Test',
      category: 'Hormones',
      description: 'Blood test to detect pregnancy hormone (beta-hCG).',
      price: 12000,
      duration: '2-4 hours',
      requirements: ['First morning urine sample preferred', 'No fasting required'],
      available: true
    },
    {
      id: '8',
      name: 'Blood Sugar (Glucose)',
      category: 'Chemistry',
      description: 'Measures blood glucose levels for diabetes screening and monitoring.',
      price: 5000,
      duration: '1 hour',
      requirements: ['8-hour fasting required for accurate results'],
      available: true
    }
  ]);

  const filteredTests = tests.filter(test => {
    const matchesSearch = test.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         test.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || test.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ['all', ...Array.from(new Set(tests.map(test => test.category)))];

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
                      <CardTitle className="text-lg">{test.name}</CardTitle>
                      <Badge variant="outline" className="mt-1">
                        {test.category}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">{test.description}</p>
                
                <div className="space-y-3 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <DollarSign className="h-4 w-4 text-green-600" />
                    <span className="font-semibold">TZS {test.price.toLocaleString()}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-blue-600" />
                    <span>Results in {test.duration}</span>
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="text-sm font-medium mb-2">Requirements:</h4>
                  <ul className="space-y-1">
                    {test.requirements.map((req, index) => (
                      <li key={index} className="text-xs text-gray-600 flex items-start gap-1">
                        <span className="text-blue-500 mt-1">•</span>
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex gap-2">
                  <Button className="flex-1" disabled={!test.available}>
                    <Plus className="h-4 w-4 mr-1" />
                    {test.available ? 'Book Test' : 'Unavailable'}
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
