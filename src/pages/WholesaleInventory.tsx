
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import WholesaleInventoryTable from "@/components/WholesaleInventoryTable";

interface Product {
  id: string;
  name: string;
  category: string;
  sku: string;
  stock: number;
  minStock: number;
  maxStock: number;
  buyPrice: number;
  sellPrice: number;
  supplier: string;
  expiryDate: string;
  lastOrdered: string;
  status: 'in-stock' | 'low-stock' | 'out-of-stock' | 'expired';
}

const WholesaleInventory = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    if (!user || user.role !== 'wholesale') {
      navigate('/login');
      return;
    }

    // Sample inventory data
    const sampleProducts: Product[] = [
      {
        id: '1',
        name: 'Paracetamol 500mg Tablets',
        category: 'Pain Relief',
        sku: 'PAR-500-100',
        stock: 5000,
        minStock: 1000,
        maxStock: 10000,
        buyPrice: 25,
        sellPrice: 35,
        supplier: 'PharmaCorp Ltd',
        expiryDate: '2025-12-31',
        lastOrdered: '2024-05-15',
        status: 'in-stock'
      },
      {
        id: '2',
        name: 'Amoxicillin 250mg Capsules',
        category: 'Antibiotics',
        sku: 'AMX-250-50',
        stock: 800,
        minStock: 1000,
        maxStock: 5000,
        buyPrice: 45,
        sellPrice: 60,
        supplier: 'MediCorp International',
        expiryDate: '2025-08-15',
        lastOrdered: '2024-04-20',
        status: 'low-stock'
      }
    ];

    setProducts(sampleProducts);
  }, [user, navigate]);

  const handleUpdateProduct = (updatedProduct: Product) => {
    setProducts(products.map(product => 
      product.id === updatedProduct.id ? updatedProduct : product
    ));
  };

  const handleDeleteProduct = (productId: string) => {
    setProducts(products.filter(product => product.id !== productId));
  };

  const handleAddProduct = (newProductData: Omit<Product, 'id'>) => {
    const newProduct: Product = {
      ...newProductData,
      id: Date.now().toString(),
      lastOrdered: new Date().toISOString().split('T')[0]
    };
    setProducts([...products, newProduct]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Inventory Management</h1>
          <p className="text-gray-600 text-lg">Manage your wholesale product inventory</p>
        </div>

        <WholesaleInventoryTable 
          products={products}
          onUpdateProduct={handleUpdateProduct}
          onDeleteProduct={handleDeleteProduct}
          onAddProduct={handleAddProduct}
        />
      </div>
    </div>
  );
};

export default WholesaleInventory;
