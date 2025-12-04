import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useToast } from '@/components/ui/use-toast';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { signIn, user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      navigate('/opportunities');
    }
  }, [user, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await signIn(email, password);
    if (!error) {
      toast({
        title: 'Login Successful! ✅',
        description: 'Welcome back! Redirecting you now...',
      });
      navigate('/opportunities');
    }
    setLoading(false);
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
              <p className="text-gray-600 mt-2">Please log in to manage opportunities.</p>
            </div>
            
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@example.com"
                  className="mt-1"
                  disabled={loading}
                />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="mt-1"
                  disabled={loading}
                />
              </div>
              <Button type="submit" size="lg" className="w-full" disabled={loading}>
                {loading ? 'Logging in...' : 'Enter Admin Mode'}
              </Button>
            </form>
             <p className="text-center text-sm text-gray-500 mt-6">
              Don't have an admin account? Please contact the NHS advisor.
            </p>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default LoginPage;