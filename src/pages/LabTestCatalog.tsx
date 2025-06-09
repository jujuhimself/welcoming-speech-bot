
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { 
  TestTube, 
  Search, 
  Plus, 
  Edit,
  Trash2,
  Clock,
  DollarSign,
  Filter
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import { useToast } from "@/hooks/use-toast";

interface Test {
  id: string;
  name: string;
  code: string;
  category: string;
  price: number;
  duration: string; // e.g., "2-4 hours", "1-2 days"
  preparation: string;
  description: string;
  status: 'active' | 'inactive';
  sampleType: string; // e.g., "Blood", "Urine", "Saliva"
}

const LabTestCatalog = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [tests, setTests] = useState<Test[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [editingTest, setEditingTest] = useState<Test | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const form = useForm<Omit<Test, 'id'>>();

  useEffect(() => {
    if (!user || user.role !== 'lab') {
      navigate('/login');
      return;
    }

    // Sample test data
    const sampleTests: Test[] = [
      {
        id: '1',
        name: 'Complete Blood Count (CBC)',
        code: 'CBC001',
        category: 'Hematology',
        price: 25000,
        duration: '2-4 hours',
        preparation: 'No special preparation required',
        description: 'A complete blood count measures red and white blood cells, hemoglobin, hematocrit, and platelets.',
        status: 'active',
        sampleType: 'Blood'
      },
      {
        id: '2',
        name: 'Lipid Profile',
        code: 'LIP001',
        category: 'Clinical Chemistry',
        price: 35000,
        duration: '4-6 hours',
        preparation: 'Fasting for 12-14 hours required',
        description: 'Tests cholesterol levels including HDL, LDL, and triglycerides.',
        status: 'active',
        sampleType: 'Blood'
      },
      {
        id: '3',
        name: 'Urinalysis',
        code: 'URI001',
        category: 'Urinalysis',
        price: 15000,
        duration: '1-2 hours',
        preparation: 'Clean catch midstream urine sample',
        description: 'Examines urine for various cells and chemicals.',
        status: 'active',
        sampleType: 'Urine'
      },
      {
        id: '4',
        name: 'Thyroid Function Test (TFT)',
        code: 'TFT001',
        category: 'Endocrinology',
        price: 45000,
        duration: '6-8 hours',
        preparation: 'No special preparation required',
        description: 'Measures TSH, T3, and T4 hormone levels.',
        status: 'active',
        sampleType: 'Blood'
      },
      {
        id: '5',
        name: 'Hepatitis B Surface Antigen',
        code: 'HBV001',
        category: 'Serology',
        price: 30000,
        duration: '4-6 hours',
        preparation: 'No special preparation required',
        description: 'Screens for Hepatitis B virus infection.',
        status: 'active',
        sampleType: 'Blood'
      }
    ];

    setTests(sampleTests);
  }, [user, navigate]);

  const filteredTests = tests.filter(test => {
    const matchesSearch = test.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         test.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || test.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const categories = ["all", ...Array.from(new Set(tests.map(t => t.category)))];

  const handleSubmit = (data: Omit<Test, 'id'>) => {
    if (editingTest) {
      setTests(tests.map(test => 
        test.id === editingTest.id ? { ...data, id: editingTest.id } : test
      ));
      setEditingTest(null);
      toast({
        title: "Test Updated",
        description: `${data.name} has been updated successfully.`,
      });
    } else {
      const newTest: Test = { ...data, id: Date.now().toString() };
      setTests([...tests, newTest]);
      setIsAddDialogOpen(false);
      toast({
        title: "Test Added",
        description: `${data.name} has been added to the catalog.`,
      });
    }
    form.reset();
  };

  const handleDelete = (testId: string) => {
    const test = tests.find(t => t.id === testId);
    setTests(tests.filter(t => t.id !== testId));
    toast({
      title: "Test Deleted",
      description: `${test?.name} has been removed from the catalog.`,
    });
  };

  const getStatusColor = (status: string) => {
    return status === 'active' 
      ? 'bg-green-100 text-green-800' 
      : 'bg-red-100 text-red-800';
  };

  const TestForm = () => (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Test Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter test name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Test Code</FormLabel>
                <FormControl>
                  <Input placeholder="Enter test code" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <FormControl>
                  <Input placeholder="Enter category" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="sampleType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sample Type</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Blood, Urine" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price (TZS)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    placeholder="0" 
                    {...field} 
                    onChange={e => field.onChange(Number(e.target.value))} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="duration"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Duration</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., 2-4 hours" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="preparation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Preparation Instructions</FormLabel>
              <FormControl>
                <Input placeholder="Enter preparation requirements" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input placeholder="Enter test description" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <FormControl>
                <select 
                  {...field}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => {
              setEditingTest(null);
              setIsAddDialogOpen(false);
              form.reset();
            }}
          >
            Cancel
          </Button>
          <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
            {editingTest ? 'Update Test' : 'Add Test'}
          </Button>
        </div>
      </form>
    </Form>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Test Catalog</h1>
            <p className="text-gray-600 text-lg">Manage your laboratory test offerings</p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Add New Test
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New Test</DialogTitle>
              </DialogHeader>
              <TestForm />
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">Total Tests</p>
                  <p className="text-3xl font-bold">{tests.length}</p>
                </div>
                <TestTube className="h-8 w-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm">Active Tests</p>
                  <p className="text-3xl font-bold">{tests.filter(t => t.status === 'active').length}</p>
                </div>
                <TestTube className="h-8 w-8 text-green-200" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm">Categories</p>
                  <p className="text-3xl font-bold">{categories.length - 1}</p>
                </div>
                <Filter className="h-8 w-8 text-purple-200" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm">Avg. Price</p>
                  <p className="text-xl font-bold">
                    TZS {Math.round(tests.reduce((sum, t) => sum + t.price, 0) / tests.length || 0).toLocaleString()}
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-orange-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-wrap gap-4 items-center">
              <div className="flex-1 min-w-64">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search tests by name or code..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <select 
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-3 py-2 border rounded-md"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>
                      {cat === 'all' ? 'All Categories' : cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tests Table */}
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Test Details</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Sample Type</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTests.map((test) => (
                  <TableRow key={test.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{test.name}</div>
                        <div className="text-sm text-gray-500">{test.code}</div>
                        <div className="text-xs text-gray-400 mt-1">{test.description}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{test.category}</Badge>
                    </TableCell>
                    <TableCell>{test.sampleType}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4 text-gray-400" />
                        {test.duration}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium text-green-600">
                      TZS {test.price.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(test.status)}>
                        {test.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => {
                                setEditingTest(test);
                                form.reset(test);
                              }}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Edit Test</DialogTitle>
                            </DialogHeader>
                            <TestForm />
                          </DialogContent>
                        </Dialog>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleDelete(test.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LabTestCatalog;
