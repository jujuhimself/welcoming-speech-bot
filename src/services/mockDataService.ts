
// Mock data service for the entire platform
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
  }>;
  total: number;
  status: 'pending' | 'packed' | 'out-for-delivery' | 'delivered' | 'cancelled';
  paymentMethod: string;
  createdAt: string;
  deliveryDate?: string;
  trackingNumber?: string;
}

export interface CreditRequest {
  id: string;
  pharmacyId: string;
  pharmacyName: string;
  requestedAmount: number;
  purpose: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  businessDocument?: string;
  financialHistory: number;
}

export interface Prescription {
  id: string;
  patientName: string;
  patientPhone: string;
  doctorName: string;
  medications: Array<{
    name: string;
    dosage: string;
    frequency: string;
    duration: string;
  }>;
  status: 'pending' | 'processed' | 'ready' | 'delivered';
  uploadDate: string;
  imageUrl?: string;
}

export interface LabAppointment {
  id: string;
  patientName: string;
  patientPhone: string;
  testType: string;
  date: string;
  time: string;
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  priority: 'normal' | 'urgent';
  cost: number;
}

export class MockDataService {
  // Sample products
  static getProducts(): Product[] {
    return [
      {
        id: '1',
        name: 'Paracetamol 500mg Tablets',
        category: 'Pain Relief',
        price: 1200,
        description: 'Effective pain relief and fever reducer',
        inStock: true,
        stock: 500,
        minStock: 100,
        supplier: 'PharmaCorp Ltd',
        expiryDate: '2025-12-31',
        manufacturer: 'GlaxoSmithKline',
        dosage: '500mg',
        form: 'Tablets',
        prescription: false
      },
      {
        id: '2',
        name: 'Amoxicillin 250mg Capsules',
        category: 'Antibiotics',
        price: 2500,
        description: 'Broad-spectrum antibiotic for bacterial infections',
        inStock: true,
        stock: 200,
        minStock: 50,
        supplier: 'MediCorp International',
        expiryDate: '2025-08-15',
        manufacturer: 'Pfizer',
        dosage: '250mg',
        form: 'Capsules',
        prescription: true
      },
      {
        id: '3',
        name: 'Ibuprofen 400mg Tablets',
        category: 'Pain Relief',
        price: 1800,
        description: 'Anti-inflammatory and pain relief medication',
        inStock: true,
        stock: 300,
        minStock: 75,
        supplier: 'HealthSupply Co',
        expiryDate: '2025-10-20',
        manufacturer: 'Johnson & Johnson',
        dosage: '400mg',
        form: 'Tablets',
        prescription: false
      },
      {
        id: '4',
        name: 'Metformin 500mg Tablets',
        category: 'Diabetes',
        price: 3200,
        description: 'Diabetes management medication',
        inStock: true,
        stock: 150,
        minStock: 40,
        supplier: 'DiabetesCare Ltd',
        expiryDate: '2025-06-30',
        manufacturer: 'Novartis',
        dosage: '500mg',
        form: 'Tablets',
        prescription: true
      },
      {
        id: '5',
        name: 'Vitamin D3 1000IU Tablets',
        category: 'Vitamins',
        price: 2800,
        description: 'Essential vitamin D supplement',
        inStock: true,
        stock: 400,
        minStock: 100,
        supplier: 'VitaHealth Ltd',
        expiryDate: '2026-03-15',
        manufacturer: 'Nature Made',
        dosage: '1000IU',
        form: 'Tablets',
        prescription: false
      }
    ];
  }

  // Sample orders
  static getOrders(): Order[] {
    return [
      {
        id: 'ORD-2024-001',
        userId: 'user1',
        pharmacyId: 'pharmacy1',
        pharmacyName: 'Mwalimu Pharmacy',
        items: [
          { id: '1', name: 'Paracetamol 500mg', quantity: 100, price: 1200 },
          { id: '2', name: 'Amoxicillin 250mg', quantity: 50, price: 2500 }
        ],
        total: 245000,
        status: 'pending',
        paymentMethod: 'credit',
        createdAt: '2024-06-10T10:30:00Z',
        trackingNumber: 'TRK001'
      },
      {
        id: 'ORD-2024-002',
        userId: 'user2',
        pharmacyId: 'pharmacy2',
        pharmacyName: 'City Pharmacy',
        items: [
          { id: '3', name: 'Ibuprofen 400mg', quantity: 200, price: 1800 }
        ],
        total: 360000,
        status: 'delivered',
        paymentMethod: 'mobile-money',
        createdAt: '2024-06-08T14:20:00Z',
        deliveryDate: '2024-06-09T16:00:00Z',
        trackingNumber: 'TRK002'
      }
    ];
  }

  // Sample credit requests
  static getCreditRequests(): CreditRequest[] {
    return [
      {
        id: 'CR-001',
        pharmacyId: 'pharmacy1',
        pharmacyName: 'Mwalimu Pharmacy',
        requestedAmount: 5000000,
        purpose: 'Stock expansion for new branch',
        status: 'pending',
        createdAt: '2024-06-05T09:00:00Z',
        businessDocument: 'business-license.pdf',
        financialHistory: 2500000
      },
      {
        id: 'CR-002',
        pharmacyId: 'pharmacy3',
        pharmacyName: 'HealthPoint Pharmacy',
        requestedAmount: 2000000,
        purpose: 'Emergency stock replenishment',
        status: 'approved',
        createdAt: '2024-06-03T11:30:00Z',
        businessDocument: 'financial-statement.pdf',
        financialHistory: 1800000
      }
    ];
  }

  // Sample prescriptions
  static getPrescriptions(): Prescription[] {
    return [
      {
        id: 'RX-001',
        patientName: 'John Mwangi',
        patientPhone: '+254701234567',
        doctorName: 'Dr. Sarah Hassan',
        medications: [
          {
            name: 'Amoxicillin 500mg',
            dosage: '500mg',
            frequency: '3 times daily',
            duration: '7 days'
          },
          {
            name: 'Paracetamol 500mg',
            dosage: '500mg',
            frequency: 'As needed for pain',
            duration: '5 days'
          }
        ],
        status: 'pending',
        uploadDate: '2024-06-10T08:30:00Z',
        imageUrl: 'prescription1.jpg'
      },
      {
        id: 'RX-002',
        patientName: 'Mary Wanjiku',
        patientPhone: '+254709876543',
        doctorName: 'Dr. Peter Kimani',
        medications: [
          {
            name: 'Metformin 500mg',
            dosage: '500mg',
            frequency: '2 times daily',
            duration: '30 days'
          }
        ],
        status: 'ready',
        uploadDate: '2024-06-09T15:45:00Z',
        imageUrl: 'prescription2.jpg'
      }
    ];
  }

  // Sample lab appointments
  static getLabAppointments(): LabAppointment[] {
    return [
      {
        id: 'LAB-001',
        patientName: 'David Kiprotich',
        patientPhone: '+254712345678',
        testType: 'Complete Blood Count (CBC)',
        date: '2024-06-12',
        time: '09:00',
        status: 'scheduled',
        priority: 'normal',
        cost: 3500
      },
      {
        id: 'LAB-002',
        patientName: 'Grace Nyong\'o',
        patientPhone: '+254723456789',
        testType: 'Diabetes Panel',
        date: '2024-06-12',
        time: '10:30',
        status: 'in-progress',
        priority: 'urgent',
        cost: 5200
      },
      {
        id: 'LAB-003',
        patientName: 'James Ochieng',
        patientPhone: '+254734567890',
        testType: 'Liver Function Test',
        date: '2024-06-11',
        time: '14:00',
        status: 'completed',
        priority: 'normal',
        cost: 4800
      }
    ];
  }

  // Analytics data
  static getAnalyticsData() {
    return {
      sales: {
        daily: [
          { date: '2024-06-01', amount: 450000 },
          { date: '2024-06-02', amount: 520000 },
          { date: '2024-06-03', amount: 380000 },
          { date: '2024-06-04', amount: 680000 },
          { date: '2024-06-05', amount: 590000 },
          { date: '2024-06-06', amount: 720000 },
          { date: '2024-06-07', amount: 650000 }
        ],
        monthly: 15420000,
        growth: 12.5
      },
      topProducts: [
        { name: 'Paracetamol 500mg', sales: 45000, revenue: 54000000 },
        { name: 'Amoxicillin 250mg', sales: 32000, revenue: 80000000 },
        { name: 'Ibuprofen 400mg', sales: 28000, revenue: 50400000 }
      ],
      customers: {
        total: 1247,
        active: 892,
        new: 67
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
        services: ['Prescription', 'OTC', 'Consultation', 'Delivery']
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
        services: ['Prescription', 'OTC', 'Insurance', 'Delivery']
      },
      {
        id: 'pharmacy3',
        name: 'HealthPoint Pharmacy',
        address: 'Moi Avenue, Nairobi',
        phone: '+254712345678',
        email: 'info@healthpoint.co.ke',
        rating: 4.7,
        distance: '2.1 km',
        isOpen: false,
        services: ['Prescription', 'OTC', 'Consultation']
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
        services: ['Blood Tests', 'Radiology', 'Pathology', 'Home Collection']
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
        services: ['Blood Tests', 'Microbiology', 'Genetics', 'Corporate Health']
      }
    ];
  }
}
