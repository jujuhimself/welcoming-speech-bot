
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User, Store, Building2, Microscope } from 'lucide-react';

interface RoleSelectorProps {
  selectedRole: string;
  onRoleSelect: (role: 'individual' | 'retail' | 'wholesale' | 'lab') => void;
}

const RoleSelector = ({ selectedRole, onRoleSelect }: RoleSelectorProps) => {
  const roles = [
    {
      id: 'individual',
      title: 'Individual User',
      description: 'Buy medicine from retail pharmacies, upload prescriptions, and consult with AI',
      icon: User,
      features: ['Order medicines', 'Upload prescriptions', 'Health consultations', 'Order tracking']
    },
    {
      id: 'retail',
      title: 'Retail Pharmacy',
      description: 'Sell medicines to individuals and purchase stock from wholesalers',
      icon: Store,
      features: ['Sell to customers', 'Buy from wholesalers', 'Inventory management', 'Business analytics']
    },
    {
      id: 'wholesale',
      title: 'Wholesale Pharmacy',
      description: 'Supply medicines to retail pharmacies with bulk pricing and MOQ',
      icon: Building2,
      features: ['B2B sales', 'Bulk pricing & MOQ', 'Advanced inventory', 'Financial management']
    },
    {
      id: 'lab',
      title: 'Lab/Health Center',
      description: 'Offer diagnostic services, manage appointments, and share test results',
      icon: Microscope,
      features: ['Diagnostic tests', 'Appointment booking', 'Result management', 'Prescription routing']
    }
  ];

  return (
    <div className="grid md:grid-cols-2 gap-4">
      {roles.map((role) => {
        const Icon = role.icon;
        const isSelected = selectedRole === role.id;
        
        return (
          <Card 
            key={role.id}
            className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
              isSelected ? 'ring-2 ring-primary-500 bg-primary-50' : 'hover:bg-gray-50'
            }`}
            onClick={() => onRoleSelect(role.id as any)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${isSelected ? 'bg-primary-500 text-white' : 'bg-gray-100'}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <CardTitle className="text-lg">{role.title}</CardTitle>
                </div>
                {isSelected && <Badge variant="default">Selected</Badge>}
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-sm mb-3">{role.description}</p>
              <div className="space-y-1">
                {role.features.map((feature, index) => (
                  <div key={index} className="flex items-center text-sm text-gray-600">
                    <div className="w-1.5 h-1.5 bg-primary-500 rounded-full mr-2"></div>
                    {feature}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default RoleSelector;
