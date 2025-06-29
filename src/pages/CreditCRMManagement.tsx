import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const CreditCRMManagement: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [accounts, setAccounts] = useState<any[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<any | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [search, setSearch] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newCustomer, setNewCustomer] = useState({ name: '', contact: '', credit_limit: '' });

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from('credit_accounts')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    if (!error) setAccounts(data || []);
  };

  const filteredAccounts = accounts.filter(acc =>
    acc.customer_name?.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    const { error } = await supabase.from('credit_accounts').insert({
      customer_name: newCustomer.name,
      contact_info: newCustomer.contact,
      credit_limit: Number(newCustomer.credit_limit),
      available_credit: Number(newCustomer.credit_limit),
      current_balance: 0,
      status: 'active',
      user_id: user.id,
    });
    if (error) {
      toast({ title: 'Error', description: 'Failed to add customer', variant: 'destructive' });
    } else {
      toast({ title: 'Customer added successfully' });
      setIsAddDialogOpen(false);
      setNewCustomer({ name: '', contact: '', credit_limit: '' });
      fetchAccounts();
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 w-full space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Credit / CRM Management</h2>
          <p className="text-gray-600">Manage customer credit accounts, requests, and CRM info</p>
        </div>
        <div className="flex gap-2">
          <Input
            placeholder="Search customers..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-64"
          />
          <Button onClick={() => setIsAddDialogOpen(true)}>
            Add Customer
          </Button>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Credit Accounts ({filteredAccounts.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Credit Limit</TableHead>
                <TableHead>Available</TableHead>
                <TableHead>Balance</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAccounts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                    No credit accounts found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredAccounts.map(acc => (
                  <TableRow key={acc.id}>
                    <TableCell>{acc.customer_name}</TableCell>
                    <TableCell>{acc.credit_limit}</TableCell>
                    <TableCell>{acc.available_credit}</TableCell>
                    <TableCell>{acc.current_balance}</TableCell>
                    <TableCell>
                      <Badge variant={acc.status === 'active' ? 'default' : 'secondary'}>
                        {acc.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button size="sm" variant="outline" onClick={() => { setSelectedAccount(acc); setShowDetails(true); }}>
                        Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Customer</DialogTitle>
          </DialogHeader>
          <form className="space-y-4" onSubmit={handleAddCustomer}>
            <div>
              <label className="block mb-1 font-medium">Customer Name</label>
              <Input value={newCustomer.name} onChange={e => setNewCustomer({ ...newCustomer, name: e.target.value })} required />
            </div>
            <div>
              <label className="block mb-1 font-medium">Contact Info</label>
              <Input value={newCustomer.contact} onChange={e => setNewCustomer({ ...newCustomer, contact: e.target.value })} required />
            </div>
            <div>
              <label className="block mb-1 font-medium">Credit Limit</label>
              <Input type="number" min={0} value={newCustomer.credit_limit} onChange={e => setNewCustomer({ ...newCustomer, credit_limit: e.target.value })} required />
            </div>
            <div className="flex gap-2">
              <Button type="submit" className="flex-1">Add Customer</Button>
              <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Account Details</DialogTitle>
          </DialogHeader>
          {selectedAccount && (
            <div className="space-y-4">
              <div>
                <strong>Customer:</strong> {selectedAccount.customer_name}
              </div>
              <div>
                <strong>Credit Limit:</strong> {selectedAccount.credit_limit}
              </div>
              <div>
                <strong>Available Credit:</strong> {selectedAccount.available_credit}
              </div>
              <div>
                <strong>Current Balance:</strong> {selectedAccount.current_balance}
              </div>
              <div>
                <strong>Status:</strong> {selectedAccount.status}
              </div>
              {/* TODO: Add CRM info, transaction history, grant/adjust credit, etc. */}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CreditCRMManagement; 