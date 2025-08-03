import React, { createContext, useContext, useState, ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
}

interface AuthResult {
  success: boolean;
  message?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<AuthResult>;
  register: (name: string, email: string, password: string) => Promise<AuthResult>;
  logout: () => void;
  isAuthenticated: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading] = useState(false);

  const login = async (email: string, password: string): Promise<AuthResult> => {
    try {
      if (email === 'demo@myshop.com' && password === 'demo123') {
        const demoUser: User = {
          id: '1',
          name: 'Demo User',
          email: 'demo@myshop.com',
          avatar: 'https://via.placeholder.com/100/2874F0/FFFFFF?text=DU'
        };
        setUser(demoUser);
        return { success: true };
      }
      return { success: false, message: 'Invalid credentials' };
    } catch {
      return { success: false, message: 'Login failed' };
    }
  };

  const register = async (name: string, email: string, _password: string): Promise<AuthResult> => {
    try {
      const newUser: User = {
        id: Date.now().toString(),
        name,
        email,
        avatar: `https://via.placeholder.com/100/2874F0/FFFFFF?text=${name.charAt(0).toUpperCase()}`
      };
      setUser(newUser);
      return { success: true };
    } catch {
      return { success: false, message: 'Registration failed' };
    }
  };

  const logout = () => {
    setUser(null);
  };

  const isAuthenticated = () => {
    return user !== null;
  };

  const value: AuthContextType = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export type { User, AuthResult };