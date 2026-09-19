import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User, UserRole } from '../types';
import { 
  DEMO_USER_PATIENT, 
  DEMO_USER_ADMIN, 
  DEMO_USER_DOCTOR, 
  DEMO_USER_REGISTRATION, 
  DEMO_USER_MEDICAL_RECORDS 
} from '../services/mockData';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

interface AuthContextType {
  user: User | null;
  role: UserRole;
  isAuthenticated: boolean;
  isLoading: boolean;
  otpSent: boolean;
  otpEmail: string;
  otpExpirySeconds: number;
  error: string | null;
  loginStep: 'ID_INPUT' | 'OTP_INPUT';
  
  sendOtp: (userId: string, email: string) => Promise<boolean>;
  verifyOtp: (otpCode: string) => Promise<boolean>;
  loginWithGoogle: () => Promise<void>;
  switchRole: (newRole: UserRole) => void;
  logout: () => void;
  clearError: () => void;
  resendOtp: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface PrototypeAccount {
  email: string;
  role: UserRole;
  user: User;
}

const PROTOTYPE_ACCOUNTS: Record<string, PrototypeAccount> = {
  'ADM-8821': {
    email: 'rithikakannan073@gmail.com',
    role: 'ADMIN',
    user: DEMO_USER_ADMIN
  },
  'ADM-8871': {
    email: 'rithikakannan073@gmail.com',
    role: 'ADMIN',
    user: DEMO_USER_ADMIN
  },
  'DOC-4012': {
    email: 'abc@gmail.com',
    role: 'DOCTOR',
    user: DEMO_USER_DOCTOR
  },
  'PT-1024': {
    email: 'vishalini@gmail.com',
    role: 'PATIENT',
    user: DEMO_USER_PATIENT
  },
  'REG-3091': {
    email: 'kswathi@gmail.com',
    role: 'REGISTRATION_STAFF',
    user: DEMO_USER_REGISTRATION
  },
  'MED-2098': {
    email: 'vanditha@gmail.com',
    role: 'MEDICAL_RECORDS_STAFF',
    user: DEMO_USER_MEDICAL_RECORDS
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(DEMO_USER_DOCTOR);
  const [role, setRole] = useState<UserRole>('DOCTOR');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [otpSent, setOtpSent] = useState<boolean>(false);
  const [otpEmail, setOtpEmail] = useState<string>('');
  const [pendingUserId, setPendingUserId] = useState<string>('');
  const [pendingAccount, setPendingAccount] = useState<PrototypeAccount | null>(null);
  const [otpExpirySeconds, setOtpExpirySeconds] = useState<number>(60);
  const [loginStep, setLoginStep] = useState<'ID_INPUT' | 'OTP_INPUT'>('ID_INPUT');
  const [error, setError] = useState<string | null>(null);

  // OTP Countdown timer
  useEffect(() => {
    let timer: any;
    if (loginStep === 'OTP_INPUT' && otpExpirySeconds > 0) {
      timer = setInterval(() => {
        setOtpExpirySeconds(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [loginStep, otpExpirySeconds]);

  const clearError = () => setError(null);

  const sendOtp = async (userId: string, email: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    try {
      const uIdNormalized = userId.trim().toUpperCase();
      const emailNormalized = email.trim().toLowerCase();

      if (!uIdNormalized || !emailNormalized) {
        throw new Error('Please enter both User ID and Email address.');
      }

      if (!emailNormalized.includes('@')) {
        throw new Error('Please enter a valid email address format.');
      }

      const account = PROTOTYPE_ACCOUNTS[uIdNormalized];

      if (!account || account.email.toLowerCase() !== emailNormalized) {
        throw new Error('Invalid User ID or Email. Please check your credentials and try again.');
      }

      setPendingUserId(uIdNormalized);
      setOtpEmail(account.email);
      setPendingAccount(account);

      if (isSupabaseConfigured) {
        const { error: sbError } = await supabase.auth.signInWithOtp({
          email: account.email,
          options: {
            shouldCreateUser: false
          }
        });
        if (sbError) {
          throw new Error(sbError.message);
        }
      } else {
        // Prototype mode fallback when live Supabase project is not connected
        console.log(`[Prototype Auth] Simulated OTP sent to ${account.email} for role ${account.role}`);
      }

      setOtpSent(true);
      setLoginStep('OTP_INPUT');
      setOtpExpirySeconds(60);
      setIsLoading(false);
      return true;
    } catch (err: any) {
      setError(err.message || 'Failed to send OTP code.');
      setIsLoading(false);
      return false;
    }
  };

  const resendOtp = async (): Promise<boolean> => {
    if (!otpEmail || !pendingUserId) return false;
    return sendOtp(pendingUserId, otpEmail);
  };

  const verifyOtp = async (otpCode: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    try {
      if (otpExpirySeconds <= 0) {
        throw new Error('OTP code has expired. Please click Resend OTP.');
      }

      if (!otpCode || otpCode.length < 6) {
        throw new Error('Please enter a complete 6-digit OTP code.');
      }

      if (isSupabaseConfigured) {
        const { error: sbError } = await supabase.auth.verifyOtp({
          email: otpEmail.trim(),
          token: otpCode.trim(),
          type: 'email'
        });

        if (sbError) {
          throw new Error("Invalid or expired OTP. Please check the code and try again.");
        }
      } else {
        // Prototype mode verification fallback
        console.log(`[Prototype Auth] Simulated OTP verified for ${otpEmail}`);
      }

      if (pendingAccount) {
        setUser(pendingAccount.user);
        setRole(pendingAccount.role);
      }

      setIsAuthenticated(true);
      setIsLoading(false);
      return true;
    } catch (err: any) {
      setError(err.message || 'Invalid or expired OTP. Please check the code and try again.');
      setIsLoading(false);
      return false;
    }
  };

  const loginWithGoogle = async () => {
    setIsLoading(true);
    setError(null);
    try {
      if (isSupabaseConfigured) {
        await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: { redirectTo: window.location.origin }
        });
      } else {
        await new Promise(r => setTimeout(r, 700));
        setUser(DEMO_USER_DOCTOR);
        setRole('DOCTOR');
        setIsAuthenticated(true);
      }
    } catch (err: any) {
      setError(err.message || 'Google authentication failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const switchRole = (newRole: UserRole) => {
    setRole(newRole);
    switch (newRole) {
      case 'ADMIN':
        setUser(DEMO_USER_ADMIN);
        break;
      case 'DOCTOR':
        setUser(DEMO_USER_DOCTOR);
        break;
      case 'PATIENT':
        setUser(DEMO_USER_PATIENT);
        break;
      case 'REGISTRATION_STAFF':
        setUser(DEMO_USER_REGISTRATION);
        break;
      case 'MEDICAL_RECORDS_STAFF':
        setUser(DEMO_USER_MEDICAL_RECORDS);
        break;
    }
  };

  const logout = () => {
    if (isSupabaseConfigured) {
      supabase.auth.signOut();
    }
    setUser(null);
    setIsAuthenticated(false);
    setLoginStep('ID_INPUT');
    setOtpSent(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        isAuthenticated,
        isLoading,
        otpSent,
        otpEmail,
        otpExpirySeconds,
        error,
        loginStep,
        sendOtp,
        verifyOtp,
        loginWithGoogle,
        switchRole,
        logout,
        clearError,
        resendOtp,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
