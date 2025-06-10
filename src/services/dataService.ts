
interface StorageData {
  orders: any[];
  inventory: any[];
  prescriptions: any[];
  creditRequests: any[];
  notifications: any[];
  userPreferences: any;
  financialData: any;
}

class DataService {
  private static instance: DataService;
  private storagePrefix = 'bepawa_';
  
  static getInstance(): DataService {
    if (!DataService.instance) {
      DataService.instance = new DataService();
    }
    return DataService.instance;
  }

  // Generic storage methods
  setItem<T>(key: string, value: T): void {
    try {
      localStorage.setItem(this.storagePrefix + key, JSON.stringify(value));
      this.dispatchStorageEvent(key, value);
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
      throw new Error('Storage quota exceeded or unavailable');
    }
  }

  getItem<T>(key: string, defaultValue: T): T {
    try {
      const item = localStorage.getItem(this.storagePrefix + key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error('Failed to read from localStorage:', error);
      return defaultValue;
    }
  }

  removeItem(key: string): void {
    localStorage.removeItem(this.storagePrefix + key);
    this.dispatchStorageEvent(key, null);
  }

  // Specific data methods
  saveOrders(orders: any[]): void {
    this.setItem('orders', orders);
  }

  getOrders(): any[] {
    return this.getItem('orders', []);
  }

  saveInventory(inventory: any[]): void {
    this.setItem('inventory', inventory);
  }

  getInventory(): any[] {
    return this.getItem('inventory', []);
  }

  savePrescriptions(prescriptions: any[]): void {
    this.setItem('prescriptions', prescriptions);
  }

  getPrescriptions(): any[] {
    return this.getItem('prescriptions', []);
  }

  saveNotifications(notifications: any[]): void {
    this.setItem('notifications', notifications);
  }

  getNotifications(): any[] {
    return this.getItem('notifications', []);
  }

  // Backup and restore
  exportData(): string {
    const data: Partial<StorageData> = {
      orders: this.getOrders(),
      inventory: this.getInventory(),
      prescriptions: this.getPrescriptions(),
      creditRequests: this.getItem('creditRequests', []),
      notifications: this.getNotifications(),
      userPreferences: this.getItem('userPreferences', {}),
      financialData: this.getItem('financialData', {})
    };
    return JSON.stringify(data, null, 2);
  }

  importData(jsonData: string): void {
    try {
      const data: Partial<StorageData> = JSON.parse(jsonData);
      
      if (data.orders) this.saveOrders(data.orders);
      if (data.inventory) this.saveInventory(data.inventory);
      if (data.prescriptions) this.savePrescriptions(data.prescriptions);
      if (data.creditRequests) this.setItem('creditRequests', data.creditRequests);
      if (data.notifications) this.saveNotifications(data.notifications);
      if (data.userPreferences) this.setItem('userPreferences', data.userPreferences);
      if (data.financialData) this.setItem('financialData', data.financialData);
      
    } catch (error) {
      throw new Error('Invalid data format');
    }
  }

  clearAllData(): void {
    const keys = Object.keys(localStorage).filter(key => key.startsWith(this.storagePrefix));
    keys.forEach(key => localStorage.removeItem(key));
  }

  private dispatchStorageEvent(key: string, value: any): void {
    window.dispatchEvent(new CustomEvent('bepawa-storage-change', {
      detail: { key, value }
    }));
  }
}

export const dataService = DataService.getInstance();
