
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { FileText, Receipt, Calculator, CreditCard, Plus, Download, Edit, Trash2, DollarSign, TrendingUp, TrendingDown } from "lucide-react";
import Navbar from "@/components/Navbar";

const BusinessCenter = () => {
  const [invoices, setInvoices] = useState([
    {
      id: "INV-001",
      customerName: "ABC Medical Center",
      amount: 450000,
      date: "2024-06-01",
      dueDate: "2024-06-15",
      status: "paid",
      items: [
        { name: "Paracetamol 500mg", quantity: 100, price: 5000 },
        { name: "Amoxicillin 250mg", quantity: 20, price: 15000 }
      ]
    },
    {
      id: "INV-002", 
      customerName: "Health Plus Clinic",
      amount: 275000,
      date: "2024-06-05",
      dueDate: "2024-06-20",
      status: "pending",
      items: [
        { name: "Vitamin C 1000mg", quantity: 50, price: 8000 }
      ]
    }
  ]);

  const [receipts, setReceipts] = useState([
    {
      id: "REC-001",
      vendor: "PharmaCorp Ltd",
      amount: 1200000,
      date: "2024-06-01",
      category: "Inventory Purchase",
      description: "Monthly stock replenishment"
    },
    {
      id: "REC-002",
      vendor: "Tanzania Electric Company",
      amount: 85000,
      date: "2024-06-02",
      category: "Utilities",
      description: "Electricity bill - May 2024"
    }
  ]);

  const [expenses, setExpenses] = useState([
    {
      id: "EXP-001",
      description: "Office rent",
      amount: 500000,
      date: "2024-06-01",
      category: "Rent",
      paymentMethod: "bank"
    },
    {
      id: "EXP-002",
      description: "Staff salaries",
      amount: 800000,
      date: "2024-06-01",
      category: "Salaries",
      paymentMethod: "bank"
    }
  ]);

  const [payments, setPayments] = useState([
    {
      id: "PAY-001",
      type: "incoming",
      customer: "ABC Medical Center",
      amount: 450000,
      date: "2024-06-10",
      method: "bank",
      reference: "INV-001"
    },
    {
      id: "PAY-002",
      type: "outgoing",
      vendor: "PharmaCorp Ltd",
      amount: 1200000,
      date: "2024-06-01",
      method: "bank",
      reference: "PO-001"
    }
  ]);

  const [newInvoice, setNewInvoice] = useState({
    customerName: "",
    items: [{ name: "", quantity: 0, price: 0 }],
    dueDate: ""
  });

  const calculateTotal = (items: any[]) => {
    return items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
  };

  const financialSummary = {
    totalIncome: payments.filter(p => p.type === 'incoming').reduce((sum, p) => sum + p.amount, 0),
    totalExpenses: expenses.reduce((sum, e) => sum + e.amount, 0),
    pendingInvoices: invoices.filter(inv => inv.status === 'pending').reduce((sum, inv) => sum + inv.amount, 0),
    netProfit: 0
  };

  financialSummary.netProfit = financialSummary.totalIncome - financialSummary.totalExpenses;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Business Center</h1>
          <p className="text-gray-600 text-lg">Manage your pharmacy's financial operations</p>
        </div>

        {/* Financial Summary */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Income</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                TZS {financialSummary.totalIncome.toLocaleString()}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
              <TrendingDown className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                TZS {financialSummary.totalExpenses.toLocaleString()}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Invoices</CardTitle>
              <FileText className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                TZS {financialSummary.pendingInvoices.toLocaleString()}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
              <DollarSign className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${financialSummary.netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                TZS {financialSummary.netProfit.toLocaleString()}
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="invoices" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="invoices">Invoice Generator</TabsTrigger>
            <TabsTrigger value="receipts">Receipts</TabsTrigger>
            <TabsTrigger value="expenses">Expenses Tracker</TabsTrigger>
            <TabsTrigger value="payments">Payments Log</TabsTrigger>
          </TabsList>

          {/* Invoice Generator */}
          <TabsContent value="invoices" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  Invoice Management
                </CardTitle>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Create Invoice
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Create New Invoice</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label>Customer Name</Label>
                        <Input
                          value={newInvoice.customerName}
                          onChange={(e) => setNewInvoice({...newInvoice, customerName: e.target.value})}
                          placeholder="Enter customer name"
                        />
                      </div>
                      <div>
                        <Label>Due Date</Label>
                        <Input
                          type="date"
                          value={newInvoice.dueDate}
                          onChange={(e) => setNewInvoice({...newInvoice, dueDate: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label>Items</Label>
                        {newInvoice.items.map((item, index) => (
                          <div key={index} className="grid grid-cols-3 gap-2 mb-2">
                            <Input
                              placeholder="Product name"
                              value={item.name}
                              onChange={(e) => {
                                const updatedItems = [...newInvoice.items];
                                updatedItems[index].name = e.target.value;
                                setNewInvoice({...newInvoice, items: updatedItems});
                              }}
                            />
                            <Input
                              type="number"
                              placeholder="Quantity"
                              value={item.quantity || ''}
                              onChange={(e) => {
                                const updatedItems = [...newInvoice.items];
                                updatedItems[index].quantity = parseInt(e.target.value) || 0;
                                setNewInvoice({...newInvoice, items: updatedItems});
                              }}
                            />
                            <Input
                              type="number"
                              placeholder="Price"
                              value={item.price || ''}
                              onChange={(e) => {
                                const updatedItems = [...newInvoice.items];
                                updatedItems[index].price = parseInt(e.target.value) || 0;
                                setNewInvoice({...newInvoice, items: updatedItems});
                              }}
                            />
                          </div>
                        ))}
                        <Button
                          variant="outline"
                          onClick={() => setNewInvoice({
                            ...newInvoice,
                            items: [...newInvoice.items, { name: "", quantity: 0, price: 0 }]
                          })}
                        >
                          Add Item
                        </Button>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold">
                          Total: TZS {calculateTotal(newInvoice.items).toLocaleString()}
                        </p>
                      </div>
                      <Button className="w-full">Generate Invoice</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Invoice ID</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {invoices.map((invoice) => (
                      <TableRow key={invoice.id}>
                        <TableCell className="font-medium">{invoice.id}</TableCell>
                        <TableCell>{invoice.customerName}</TableCell>
                        <TableCell className="font-bold">TZS {invoice.amount.toLocaleString()}</TableCell>
                        <TableCell>{invoice.date}</TableCell>
                        <TableCell>{invoice.dueDate}</TableCell>
                        <TableCell>
                          <Badge variant={invoice.status === 'paid' ? 'default' : 'secondary'}>
                            {invoice.status.toUpperCase()}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm">
                              <Download className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Receipts Management */}
          <TabsContent value="receipts" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center">
                  <Receipt className="h-5 w-5 mr-2" />
                  Receipts Management
                </CardTitle>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Receipt
                </Button>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Receipt ID</TableHead>
                      <TableHead>Vendor</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {receipts.map((receipt) => (
                      <TableRow key={receipt.id}>
                        <TableCell className="font-medium">{receipt.id}</TableCell>
                        <TableCell>{receipt.vendor}</TableCell>
                        <TableCell className="font-bold">TZS {receipt.amount.toLocaleString()}</TableCell>
                        <TableCell>{receipt.date}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{receipt.category}</Badge>
                        </TableCell>
                        <TableCell className="max-w-xs truncate">{receipt.description}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm">
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
          </TabsContent>

          {/* Expenses Tracker */}
          <TabsContent value="expenses" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center">
                  <Calculator className="h-5 w-5 mr-2" />
                  Expenses Tracker
                </CardTitle>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Expense
                </Button>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Expense ID</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Payment Method</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {expenses.map((expense) => (
                      <TableRow key={expense.id}>
                        <TableCell className="font-medium">{expense.id}</TableCell>
                        <TableCell>{expense.description}</TableCell>
                        <TableCell className="font-bold">TZS {expense.amount.toLocaleString()}</TableCell>
                        <TableCell>{expense.date}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{expense.category}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">{expense.paymentMethod.toUpperCase()}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm">
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
          </TabsContent>

          {/* Payments Log */}
          <TabsContent value="payments" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center">
                  <CreditCard className="h-5 w-5 mr-2" />
                  Payments Log
                </CardTitle>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Record Payment
                </Button>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Payment ID</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Party</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Method</TableHead>
                      <TableHead>Reference</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {payments.map((payment) => (
                      <TableRow key={payment.id}>
                        <TableCell className="font-medium">{payment.id}</TableCell>
                        <TableCell>
                          <Badge variant={payment.type === 'incoming' ? 'default' : 'secondary'}>
                            {payment.type.toUpperCase()}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {payment.type === 'incoming' ? payment.customer : payment.vendor}
                        </TableCell>
                        <TableCell className={`font-bold ${payment.type === 'incoming' ? 'text-green-600' : 'text-red-600'}`}>
                          {payment.type === 'incoming' ? '+' : '-'}TZS {payment.amount.toLocaleString()}
                        </TableCell>
                        <TableCell>{payment.date}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{payment.method.toUpperCase()}</Badge>
                        </TableCell>
                        <TableCell>{payment.reference}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm">
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
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default BusinessCenter;
