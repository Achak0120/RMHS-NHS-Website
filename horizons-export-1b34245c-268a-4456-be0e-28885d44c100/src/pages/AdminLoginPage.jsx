import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAdminAuth } from '@/contexts/AdminAuthContext';

const AdminLoginPage = () => {
  const [password, setPassword] = useState('');
  const { login } = useAdminAuth();

  const handleLogin = (e) => {
    e.preventDefault();
    if (!login(password)) {
        setPassword('');
    }
  };

  return (
    <>
      <Helmet>
        <title>Admin Login - RMHS NHS</title>
      </Helmet>
      <div className="flex items-center justify-center min-h-[70vh] px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="bg-white rounded-xl shadow-2xl p-8">
            <div className="text-center mb-8">
              <div className="inline-block bg-purple-100 p-4 rounded-full mb-4">
                <Lock className="h-8 w-8 text-primary" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Login</h1>
              <p className="text-gray-600 mt-2">Please enter the password to manage content.</p>
            </div>
            
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="mt-1"
                />
              </div>

              <Button type="submit" size="lg" className="w-full">
                Enter Admin Mode
              </Button>
            </form>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default AdminLoginPage;