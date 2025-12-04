import React, { createContext, useState, useContext, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/customSupabaseClient';

const AdminAuthContext = createContext();

export const AdminAuthProvider = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const storedAdminState = sessionStorage.getItem('isAdmin');
    if (storedAdminState === 'true') {
      setIsAdmin(true);
    }
  }, []);

  const login = async (password) => {
    try {
      // We only need to verify the password, not change it.
      const { data, error } = await supabase.functions.invoke('manage-password', {
        body: { currentPassword: password },
      });

      if (error || data.error) {
        throw new Error(error?.message || data.error || 'Login failed');
      }

      setIsAdmin(true);
      sessionStorage.setItem('isAdmin', 'true');
      toast({
        title: 'Login Successful! ✅',
        description: 'Welcome, Admin! Redirecting you now...',
      });
      navigate('/admin-dashboard');
      return true;
    } catch (err) {
      toast({
        title: 'Login Failed',
        description: 'The password you entered is incorrect.',
        variant: 'destructive',
      });
      return false;
    }
  };

  const logout = () => {
    setIsAdmin(false);
    sessionStorage.removeItem('isAdmin');
    toast({
      title: 'Signed Out',
      description: 'You have successfully signed out of admin mode.',
    });
    navigate('/');
  };

  return (
    <AdminAuthContext.Provider value={{ isAdmin, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => useContext(AdminAuthContext);