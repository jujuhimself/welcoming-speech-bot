
import React, { createContext, useContext, useState, useEffect } from 'react';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'pharmacy';
  pharmacyName?: string;
  address?: string;
  isApproved?: boolean;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (userData: Partial<User> & { password: string }) => Promise<boolean>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Initialize demo users
const initializeDemoUsers = () => {
  const existingUsers = localStorage.getItem('bepawa_users');
  if (!existingUsers) {
    const demoUsers = [
      {
        id: '1',
        email: 'admin@test.com',
        password: 'password123',
        name: 'Admin User',
        role: 'admin',
        isApproved: true
      },
      {
        id: '2',
        email: 'pharmacy@test.com',
        password: 'password123',
        name: 'Pharmacy Demo',
        role: 'pharmacy',
        pharmacyName: 'Demo Pharmacy',
        address: 'Dar es Salaam, Tanzania',
        isApproved: true
      }
    ];
    localStorage.setItem('bepawa_users', JSON.stringify(demoUsers));
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initialize demo users on first load
    initializeDemoUsers();
    
    // Check for stored user on app load
    const storedUser = localStorage.getItem('bepawa_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Get users from localStorage
    const users = JSON.parse(localStorage.getItem('bepawa_users') || '[]');
    const foundUser = users.find((u: User & { password: string }) => 
      u.email === email && u.password === password
    );

    if (foundUser) {
      const { password: _, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      localStorage.setItem('bepawa_user', JSON.stringify(userWithoutPassword));
      setIsLoading(false);
      return true;
    }

    setIsLoading(false);
    return false;
  };

  const register = async (userData: Partial<User> & { password: string }): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulated registration logic
    const users = JSON.parse(localStorage.getItem('bepawa_users') || '[]');
    const newUser = {
      id: Date.now().toString(),
      ...userData,
      isApproved: userData.role === 'admin' ? true : false
    };
    
    users.push(newUser);
    localStorage.setItem('bepawa_users', JSON.stringify(users));
    
    setIsLoading(false);
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('bepawa_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
