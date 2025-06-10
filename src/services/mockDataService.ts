
// Enhanced mock data service for the entire platform
export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  inStock: boolean;
  stock: number;
  minStock: number;
  supplier: string;
  expiryDate: string;
  manufacturer: string;
  dosage?: string;
  form?: string;
  prescription?: boolean;
  sku: string;
  batchNumber?: string;
  lastRestocked?: string;
  costPrice: number;
  margin: number;
}

export interface Order {
  id: string;
  userId: string;
  pharmacyId?: string;
  pharmacyName: string;
  items: Array<{
    id: string;
    name: string;
    quantity: number;
    price: number;
    sku: string;
  }>;
  total: number;
  status: 'pending' | 'confirmed' | 'packed' | 'shipped' | 'out-for-delivery' | 'delivered' | 'cancelled';
  paymentMethod: string;
  paymentStatus: 'pending' | 'paid' | 'partial' | 'overdue';
  createdAt: string;
  updatedAt: string;
  deliveryDate?: string;
  trackingNumber?: string;
  shippingAddress: string;
  notes?: string;
  urgency: 'normal' | 'urgent' | 'critical';
  supplierInfo?: {
    id: string;
    name: string;
    contact: string;
  };
}

export interface CreditRequest {
  id: string;
  pharmacyId: string;
  pharmacyName: string;
  requestedAmount: number;
  approvedAmount?: number;
  purpose: string;
  status: 'pending' | 'approved' | 'rejected' | 'under-review';
  createdAt: string;
  processedAt?: string;
  businessDocument?: string;
  financialHistory: number;
  creditScore: number;
  repaymentTerms?: string;
  interestRate?: number;
  adminNotes?: string;
}

export interface Prescription {
  id: string;
  patientName: string;
  patientPhone: string;
  patientAge: number;
  doctorName: string;
  doctorLicense: string;
  hospitalName: string;
  medications: Array<{
    name: string;
    dosage: string;
    frequency: string;
    duration: string;
    quantity: number;
    instructions: string;
  }>;
  status: 'pending' | 'reviewed' | 'processed' | 'ready' | 'dispensed' | 'rejected';
  uploadDate: string;
  processedDate?: string;
  imageUrl?: string;
  pharmacyNotes?: string;
  totalCost?: number;
  insuranceCovered?: boolean;
  priority: 'normal' | 'urgent';
}

export interface LabAppointment {
  id: string;
  patientName: string;
  patientPhone: string;
  patientAge: number;
  testType: string;
  testCategory: string;
  date: string;
  time: string;
  status: 'scheduled' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled' | 'no-show';
  priority: 'normal' | 'urgent' | 'critical';
  cost: number;
  doctorName?: string;
  referralNotes?: string;
  labNotes?: string;
  resultStatus?: 'pending' | 'ready' | 'delivered';
  fastingRequired: boolean;
  preparationInstructions?: string;
}

export interface InventoryAlert {
  id: string;
  productId: string;
  productName: string;
  alertType: 'low-stock' | 'out-of-stock' | 'expiring-soon' | 'expired';
  currentStock: number;
  minStock: number;
  expiryDate?: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  createdAt: string;
  resolved: boolean;
}

export interface FinancialTransaction {
  id: string;
  type: 'sale' | 'purchase' | 'refund' | 'credit' | 'payment';
  amount: number;
  description: string;
  date: string;
  orderId?: string;
  customerId?: string;
  supplierId?: string;
  paymentMethod: string;
  status: 'completed' | 'pending' | 'failed' | 'cancelled';
  reference: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  read: boolean;
  createdAt: string;
  actionUrl?: string;
  actionText?: string;
}

export class MockDataService {
  // Enhanced products with more comprehensive data
  static getProducts(): Product[] {
    return [
      {
        id: '1',
        name: 'Paracetamol 500mg Tablets',
        category: 'Pain Relief',
        price: 1200,
        costPrice: 800,
        margin: 33.3,
        description: 'Effective pain relief and fever reducer',
        inStock: true,
        stock: 500,
        minStock: 100,
        supplier: 'PharmaCorp Ltd',
        expiryDate: '2025-12-31',
        manufacturer: 'GlaxoSmithKline',
        dosage: '500mg',
        form: 'Tablets',
        prescription: false,
        sku: 'PAR-500-TAB',
        batchNumber: 'PC2024001',
        lastRestocked: '2024-05-15'
      },
      {
        id: '2',
        name: 'Amoxicillin 250mg Capsules',
        category: 'Antibiotics',
        price: 2500,
        costPrice: 1800,
        margin: 28.0,
        description: 'Broad-spectrum antibiotic for bacterial infections',
        inStock: true,
        stock: 45,
        minStock: 50,
        supplier: 'MediCorp International',
        expiryDate: '2025-08-15',
        manufacturer: 'Pfizer',
        dosage: '250mg',
        form: 'Capsules',
        prescription: true,
        sku: 'AMX-250-CAP',
        batchNumber: 'MC2024002',
        lastRestocked: '2024-06-01'
      },
      {
        id: '3',
        name: 'Ibuprofen 400mg Tablets',
        category: 'Pain Relief',
        price: 1800,
        costPrice: 1200,
        margin: 33.3,
        description: 'Anti-inflammatory and pain relief medication',
        inStock: true,
        stock: 300,
        minStock: 75,
        supplier: 'HealthSupply Co',
        expiryDate: '2025-10-20',
        manufacturer: 'Johnson & Johnson',
        dosage: '400mg',
        form: 'Tablets',
        prescription: false,
        sku: 'IBU-400-TAB',
        batchNumber: 'HS2024003',
        lastRestocked: '2024-05-20'
      },
      {
        id: '4',
        name: 'Metformin 500mg Tablets',
        category: 'Diabetes',
        price: 3200,
        costPrice: 2400,
        margin: 25.0,
        description: 'Diabetes management medication',
        inStock: true,
        stock: 150,
        minStock: 40,
        supplier: 'DiabetesCare Ltd',
        expiryDate: '2025-06-30',
        manufacturer: 'Novartis',
        dosage: '500mg',
        form: 'Tablets',
        prescription: true,
        sku: 'MET-500-TAB',
        batchNumber: 'DC2024004',
        lastRestocked: '2024-06-05'
      },
      {
        id: '5',
        name: 'Vitamin D3 1000IU Tablets',
        category: 'Vitamins',
        price: 2800,
        costPrice: 2000,
        margin: 28.6,
        description: 'Essential vitamin D supplement',
        inStock: true,
        stock: 400,
        minStock: 100,
        supplier: 'VitaHealth Ltd',
        expiryDate: '2026-03-15',
        manufacturer: 'Nature Made',
        dosage: '1000IU',
        form: 'Tablets',
        prescription: false,
        sku: 'VD3-1000-TAB',
        batchNumber: 'VH2024005',
        lastRestocked: '2024-05-25'
      },
      {
        id: '6',
        name: 'Cough Syrup 200ml',
        category: 'Respiratory',
        price: 1500,
        costPrice: 1000,
        margin: 33.3,
        description: 'Effective cough suppressant and expectorant',
        inStock: true,
        stock: 12,
        minStock: 25,
        supplier: 'RespiraCare',
        expiryDate: '2024-12-31',
        manufacturer: 'Benylin',
        dosage: '200ml',
        form: 'Syrup',
        prescription: false,
        sku: 'COU-200-SYR',
        batchNumber: 'RC2024006',
        lastRestocked: '2024-04-10'
      }
    ];
  }

  // Enhanced orders with complete lifecycle data
  static getOrders(): Order[] {
    return [
      {
        id: 'ORD-2024-001',
        userId: 'user1',
        pharmacyId: 'pharmacy1',
        pharmacyName: 'Mwalimu Pharmacy',
        items: [
          { id: '1', name: 'Paracetamol 500mg', quantity: 100, price: 1200, sku: 'PAR-500-TAB' },
          { id: '2', name: 'Amoxicillin 250mg', quantity: 50, price: 2500, sku: 'AMX-250-CAP' }
        ],
        total: 245000,
        status: 'pending',
        paymentMethod: 'credit',
        paymentStatus: 'pending',
        createdAt: '2024-06-10T10:30:00Z',
        updatedAt: '2024-06-10T10:30:00Z',
        trackingNumber: 'TRK001',
        shippingAddress: 'Kenyatta Avenue, Nairobi',
        urgency: 'urgent',
        supplierInfo: {
          id: 'sup1',
          name: 'PharmaCorp Ltd',
          contact: '+254701234567'
        }
      },
      {
        id: 'ORD-2024-002',
        userId: 'user2',
        pharmacyId: 'pharmacy2',
        pharmacyName: 'City Pharmacy',
        items: [
          { id: '3', name: 'Ibuprofen 400mg', quantity: 200, price: 1800, sku: 'IBU-400-TAB' }
        ],
        total: 360000,
        status: 'delivered',
        paymentMethod: 'mobile-money',
        paymentStatus: 'paid',
        createdAt: '2024-06-08T14:20:00Z',
        updatedAt: '2024-06-09T16:00:00Z',
        deliveryDate: '2024-06-09T16:00:00Z',
        trackingNumber: 'TRK002',
        shippingAddress: 'Kimathi Street, Nairobi',
        urgency: 'normal'
      },
      {
        id: 'ORD-2024-003',
        userId: 'user3',
        pharmacyId: 'pharmacy3',
        pharmacyName: 'HealthPoint Pharmacy',
        items: [
          { id: '4', name: 'Metformin 500mg', quantity: 100, price: 3200, sku: 'MET-500-TAB' },
          { id: '5', name: 'Vitamin D3 1000IU', quantity: 150, price: 2800, sku: 'VD3-1000-TAB' }
        ],
        total: 740000,
        status: 'shipped',
        paymentMethod: 'bank-transfer',
        paymentStatus: 'paid',
        createdAt: '2024-06-07T09:15:00Z',
        updatedAt: '2024-06-09T08:00:00Z',
        trackingNumber: 'TRK003',
        shippingAddress: 'Moi Avenue, Nairobi',
        urgency: 'normal',
        notes: 'Handle with care - temperature sensitive items'
      }
    ];
  }

  // Enhanced credit requests
  static getCreditRequests(): CreditRequest[] {
    return [
      {
        id: 'CR-001',
        pharmacyId: 'pharmacy1',
        pharmacyName: 'Mwalimu Pharmacy',
        requestedAmount: 5000000,
        approvedAmount: 3500000,
        purpose: 'Stock expansion for new branch',
        status: 'approved',
        createdAt: '2024-06-05T09:00:00Z',
        processedAt: '2024-06-07T14:30:00Z',
        businessDocument: 'business-license.pdf',
        financialHistory: 2500000,
        creditScore: 785,
        repaymentTerms: '12 months',
        interestRate: 12.5,
        adminNotes: 'Good payment history, approved with reduced amount'
      },
      {
        id: 'CR-002',
        pharmacyId: 'pharmacy3',
        pharmacyName: 'HealthPoint Pharmacy',
        requestedAmount: 2000000,
        purpose: 'Emergency stock replenishment',
        status: 'pending',
        createdAt: '2024-06-09T11:30:00Z',
        businessDocument: 'financial-statement.pdf',
        financialHistory: 1800000,
        creditScore: 720
      },
      {
        id: 'CR-003',
        pharmacyId: 'pharmacy4',
        pharmacyName: 'MediCare Central',
        requestedAmount: 8000000,
        purpose: 'Equipment purchase and renovation',
        status: 'under-review',
        createdAt: '2024-06-08T16:20:00Z',
        businessDocument: 'business-plan.pdf',
        financialHistory: 4200000,
        creditScore: 650,
        adminNotes: 'Requires additional documentation'
      }
    ];
  }

  // Enhanced prescriptions
  static getPrescriptions(): Prescription[] {
    return [
      {
        id: 'RX-001',
        patientName: 'John Mwangi',
        patientPhone: '+254701234567',
        patientAge: 45,
        doctorName: 'Dr. Sarah Hassan',
        doctorLicense: 'DL12345',
        hospitalName: 'Nairobi Hospital',
        medications: [
          {
            name: 'Amoxicillin 500mg',
            dosage: '500mg',
            frequency: '3 times daily',
            duration: '7 days',
            quantity: 21,
            instructions: 'Take with food'
          },
          {
            name: 'Paracetamol 500mg',
            dosage: '500mg',
            frequency: 'As needed for pain',
            duration: '5 days',
            quantity: 10,
            instructions: 'Do not exceed 8 tablets per day'
          }
        ],
        status: 'ready',
        uploadDate: '2024-06-10T08:30:00Z',
        processedDate: '2024-06-10T14:15:00Z',
        imageUrl: 'prescription1.jpg',
        totalCost: 31500,
        insuranceCovered: true,
        priority: 'normal',
        pharmacyNotes: 'Insurance verified, ready for collection'
      },
      {
        id: 'RX-002',
        patientName: 'Mary Wanjiku',
        patientPhone: '+254709876543',
        patientAge: 62,
        doctorName: 'Dr. Peter Kimani',
        doctorLicense: 'DL54321',
        hospitalName: 'Kenyatta Hospital',
        medications: [
          {
            name: 'Metformin 500mg',
            dosage: '500mg',
            frequency: '2 times daily',
            duration: '30 days',
            quantity: 60,
            instructions: 'Take with meals'
          }
        ],
        status: 'dispensed',
        uploadDate: '2024-06-09T15:45:00Z',
        processedDate: '2024-06-09T17:20:00Z',
        imageUrl: 'prescription2.jpg',
        totalCost: 192000,
        insuranceCovered: false,
        priority: 'normal'
      }
    ];
  }

  // Lab appointments
  static getLabAppointments(): LabAppointment[] {
    return [
      {
        id: 'LAB-001',
        patientName: 'David Kiprotich',
        patientPhone: '+254712345678',
        patientAge: 38,
        testType: 'Complete Blood Count (CBC)',
        testCategory: 'Hematology',
        date: '2024-06-12',
        time: '09:00',
        status: 'confirmed',
        priority: 'normal',
        cost: 3500,
        doctorName: 'Dr. James Mwangi',
        fastingRequired: false,
        preparationInstructions: 'No special preparation required'
      },
      {
        id: 'LAB-002',
        patientName: 'Grace Nyong\'o',
        patientPhone: '+254723456789',
        patientAge: 55,
        testType: 'Diabetes Panel',
        testCategory: 'Clinical Chemistry',
        date: '2024-06-12',
        time: '10:30',
        status: 'in-progress',
        priority: 'urgent',
        cost: 5200,
        doctorName: 'Dr. Susan Waweru',
        fastingRequired: true,
        preparationInstructions: 'Fast for 8-12 hours before test',
        resultStatus: 'pending'
      }
    ];
  }

  // Inventory alerts
  static getInventoryAlerts(): InventoryAlert[] {
    return [
      {
        id: 'ALT-001',
        productId: '2',
        productName: 'Amoxicillin 250mg Capsules',
        alertType: 'low-stock',
        currentStock: 45,
        minStock: 50,
        severity: 'medium',
        createdAt: '2024-06-10T09:00:00Z',
        resolved: false
      },
      {
        id: 'ALT-002',
        productId: '6',
        productName: 'Cough Syrup 200ml',
        alertType: 'low-stock',
        currentStock: 12,
        minStock: 25,
        severity: 'high',
        createdAt: '2024-06-09T15:30:00Z',
        resolved: false
      },
      {
        id: 'ALT-003',
        productId: '6',
        productName: 'Cough Syrup 200ml',
        alertType: 'expiring-soon',
        currentStock: 12,
        minStock: 25,
        expiryDate: '2024-12-31',
        severity: 'medium',
        createdAt: '2024-06-08T10:15:00Z',
        resolved: false
      }
    ];
  }

  // Financial transactions
  static getFinancialTransactions(): FinancialTransaction[] {
    return [
      {
        id: 'TXN-001',
        type: 'sale',
        amount: 245000,
        description: 'Order ORD-2024-001 - Mwalimu Pharmacy',
        date: '2024-06-10T10:30:00Z',
        orderId: 'ORD-2024-001',
        customerId: 'pharmacy1',
        paymentMethod: 'credit',
        status: 'pending',
        reference: 'REF-001'
      },
      {
        id: 'TXN-002',
        type: 'sale',
        amount: 360000,
        description: 'Order ORD-2024-002 - City Pharmacy',
        date: '2024-06-08T14:20:00Z',
        orderId: 'ORD-2024-002',
        customerId: 'pharmacy2',
        paymentMethod: 'mobile-money',
        status: 'completed',
        reference: 'REF-002'
      },
      {
        id: 'TXN-003',
        type: 'purchase',
        amount: 150000,
        description: 'Stock purchase from PharmaCorp Ltd',
        date: '2024-06-07T11:00:00Z',
        supplierId: 'sup1',
        paymentMethod: 'bank-transfer',
        status: 'completed',
        reference: 'REF-003'
      }
    ];
  }

  // Notifications
  static getNotifications(userId: string): Notification[] {
    return [
      {
        id: 'NOT-001',
        userId: userId,
        title: 'Low Stock Alert',
        message: 'Amoxicillin 250mg Capsules is running low (45 units remaining)',
        type: 'warning',
        read: false,
        createdAt: '2024-06-10T09:00:00Z',
        actionUrl: '/inventory-management',
        actionText: 'View Inventory'
      },
      {
        id: 'NOT-002',
        userId: userId,
        title: 'Order Shipped',
        message: 'Order ORD-2024-003 has been shipped to HealthPoint Pharmacy',
        type: 'info',
        read: false,
        createdAt: '2024-06-09T08:00:00Z',
        actionUrl: '/orders',
        actionText: 'Track Order'
      },
      {
        id: 'NOT-003',
        userId: userId,
        title: 'Credit Request Approved',
        message: 'Credit request CR-001 has been approved for TZS 3,500,000',
        type: 'success',
        read: true,
        createdAt: '2024-06-07T14:30:00Z',
        actionUrl: '/credit-management',
        actionText: 'View Details'
      }
    ];
  }

  // Analytics data
  static getAnalyticsData() {
    return {
      sales: {
        daily: [
          { date: '2024-06-04', amount: 450000, orders: 12 },
          { date: '2024-06-05', amount: 520000, orders: 15 },
          { date: '2024-06-06', amount: 380000, orders: 9 },
          { date: '2024-06-07', amount: 680000, orders: 18 },
          { date: '2024-06-08', amount: 590000, orders: 14 },
          { date: '2024-06-09', amount: 720000, orders: 21 },
          { date: '2024-06-10', amount: 650000, orders: 16 }
        ],
        monthly: 15420000,
        growth: 12.5,
        totalOrders: 105,
        averageOrderValue: 146857
      },
      topProducts: [
        { name: 'Paracetamol 500mg', sales: 45000, revenue: 54000000, margin: 33.3 },
        { name: 'Amoxicillin 250mg', sales: 32000, revenue: 80000000, margin: 28.0 },
        { name: 'Ibuprofen 400mg', sales: 28000, revenue: 50400000, margin: 33.3 }
      ],
      customers: {
        total: 1247,
        active: 892,
        new: 67,
        retention: 78.5
      },
      inventory: {
        totalProducts: 156,
        lowStock: 12,
        outOfStock: 3,
        expiringSoon: 8,
        totalValue: 2850000
      }
    };
  }

  // Pharmacy directory
  static getPharmacies() {
    return [
      {
        id: 'pharmacy1',
        name: 'Mwalimu Pharmacy',
        address: 'Kenyatta Avenue, Nairobi',
        phone: '+254701234567',
        email: 'info@mwalimupharma.co.ke',
        rating: 4.8,
        distance: '0.5 km',
        isOpen: true,
        services: ['Prescription', 'OTC', 'Consultation', 'Delivery'],
        creditLimit: 5000000,
        outstandingBalance: 245000
      },
      {
        id: 'pharmacy2',
        name: 'City Pharmacy',
        address: 'Kimathi Street, Nairobi',
        phone: '+254709876543',
        email: 'contact@citypharma.co.ke',
        rating: 4.6,
        distance: '1.2 km',
        isOpen: true,
        services: ['Prescription', 'OTC', 'Insurance', 'Delivery'],
        creditLimit: 3000000,
        outstandingBalance: 0
      }
    ];
  }

  // Lab directory
  static getLabs() {
    return [
      {
        id: 'lab1',
        name: 'Lancet Kenya',
        address: 'Argwings Kodhek Road, Nairobi',
        phone: '+254703123456',
        email: 'info@lancet.co.ke',
        rating: 4.9,
        distance: '0.8 km',
        isOpen: true,
        services: ['Blood Tests', 'Radiology', 'Pathology', 'Home Collection'],
        equipment: ['Digital X-Ray', 'Ultrasound', 'ECG', 'Biochemistry Analyzer']
      },
      {
        id: 'lab2',
        name: 'Pathcare Kenya',
        address: 'Riverside Drive, Nairobi',
        phone: '+254704567890',
        email: 'contact@pathcare.co.ke',
        rating: 4.7,
        distance: '1.5 km',
        isOpen: true,
        services: ['Blood Tests', 'Microbiology', 'Genetics', 'Corporate Health'],
        equipment: ['PCR Machine', 'Flow Cytometer', 'Microscopes', 'Centrifuges']
      }
    ];
  }

  // Order lifecycle management
  static updateOrderStatus(orderId: string, newStatus: Order['status']) {
    const orders = this.getOrders();
    const orderIndex = orders.findIndex(order => order.id === orderId);
    if (orderIndex !== -1) {
      orders[orderIndex].status = newStatus;
      orders[orderIndex].updatedAt = new Date().toISOString();
      
      // Update localStorage
      localStorage.setItem('bepawa_orders', JSON.stringify(orders));
      
      // Create notification
      this.createNotification(orders[orderIndex].pharmacyId || 'system', {
        title: 'Order Status Updated',
        message: `Order ${orderId} status changed to ${newStatus}`,
        type: 'info'
      });
    }
  }

  // Create notification
  static createNotification(userId: string, notification: Omit<Notification, 'id' | 'userId' | 'read' | 'createdAt'>) {
    const notifications = JSON.parse(localStorage.getItem(`bepawa_notifications_${userId}`) || '[]');
    const newNotification: Notification = {
      id: `NOT-${Date.now()}`,
      userId,
      read: false,
      createdAt: new Date().toISOString(),
      ...notification
    };
    notifications.unshift(newNotification);
    localStorage.setItem(`bepawa_notifications_${userId}`, JSON.stringify(notifications.slice(0, 50))); // Keep last 50
  }

  // Inventory management
  static updateStock(productId: string, newStock: number) {
    const products = this.getProducts();
    const productIndex = products.findIndex(p => p.id === productId);
    if (productIndex !== -1) {
      products[productIndex].stock = newStock;
      products[productIndex].lastRestocked = new Date().toISOString();
      
      // Check for alerts
      if (newStock <= products[productIndex].minStock) {
        this.createInventoryAlert(productId, 'low-stock');
      }
    }
  }

  // Create inventory alert
  static createInventoryAlert(productId: string, alertType: InventoryAlert['alertType']) {
    const products = this.getProducts();
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const alerts = JSON.parse(localStorage.getItem('bepawa_inventory_alerts') || '[]');
    const newAlert: InventoryAlert = {
      id: `ALT-${Date.now()}`,
      productId,
      productName: product.name,
      alertType,
      currentStock: product.stock,
      minStock: product.minStock,
      expiryDate: product.expiryDate,
      severity: alertType === 'out-of-stock' ? 'critical' : 
                alertType === 'low-stock' && product.stock < product.minStock / 2 ? 'high' : 'medium',
      createdAt: new Date().toISOString(),
      resolved: false
    };
    
    alerts.unshift(newAlert);
    localStorage.setItem('bepawa_inventory_alerts', JSON.stringify(alerts));
  }
}
