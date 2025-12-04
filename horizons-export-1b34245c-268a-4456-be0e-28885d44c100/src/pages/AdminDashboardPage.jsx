import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { KeyRound, Eye, EyeOff, Check, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/customSupabaseClient';

const AdminDashboardPage = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [visiblePassword, setVisiblePassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [passwordCheck, setPasswordCheck] = useState('');
  
  const [isUpdating, setIsUpdating] = useState(false);
  const [isFetching, setIsFetching] = useState(false);

  const { toast } = useToast();

  const handleShowPassword = async (e) => {
    e.preventDefault();
    setIsFetching(true);
    setVisiblePassword('');
    
    try {
      const { data, error } = await supabase.functions.invoke('manage-password', {
        body: { currentPassword: passwordCheck },
      });

      if (error || data.error) {
        throw new Error(error?.message || data.error);
      }
      
      setVisiblePassword(data.password);
      setPasswordCheck('');
    } catch (err) {
      toast({
        variant: 'destructive',
        title: 'Access Denied',
        description: 'The password you entered is incorrect.',
      });
    } finally {
      setIsFetching(false);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast({ variant: 'destructive', title: 'Error', description: 'New passwords do not match.' });
      return;
    }
    if (!newPassword) {
        toast({ variant: 'destructive', title: 'Error', description: 'New password cannot be empty.' });
        return;
    }
    
    setIsUpdating(true);
    try {
        const { data, error } = await supabase.functions.invoke('manage-password', {
            body: { currentPassword, newPassword },
        });

        if (error || data.error) {
            throw new Error(error?.message || data.error);
        }

        toast({ title: 'Success!', description: 'Your password has been updated.' });
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setVisiblePassword('');
    } catch (err) {
        toast({
            variant: 'destructive',
            title: 'Update Failed',
            description: 'The "Current Password" you entered is incorrect.',
        });
    } finally {
        setIsUpdating(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Admin Dashboard - RMHS NHS</title>
      </Helmet>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* View Password Section */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="flex items-center space-x-3 mb-6">
                <KeyRound className="h-8 w-8 text-primary" />
                <h2 className="text-2xl font-semibold text-gray-900">View Current Password</h2>
              </div>
              <form onSubmit={handleShowPassword} className="space-y-4">
                <div>
                  <Label htmlFor="password-check">Enter Current Password to View</Label>
                  <Input id="password-check" type="password" value={passwordCheck} onChange={(e) => setPasswordCheck(e.target.value)} required />
                </div>
                <Button type="submit" className="w-full" disabled={isFetching}>
                  {isFetching ? 'Verifying...' : 'Show Password'}
                </Button>
              </form>
              {visiblePassword && (
                <div className="mt-6 bg-purple-50 p-4 rounded-lg flex items-center justify-between">
                  <span className="font-mono text-purple-800 break-all">{isPasswordVisible ? visiblePassword : '••••••••••'}</span>
                  <Button variant="ghost" size="icon" onClick={() => setIsPasswordVisible(!isPasswordVisible)}>
                    {isPasswordVisible ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </Button>
                </div>
              )}
            </div>

            {/* Change Password Section */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="flex items-center space-x-3 mb-6">
                <Check className="h-8 w-8 text-green-500" />
                <h2 className="text-2xl font-semibold text-gray-900">Change Admin Password</h2>
              </div>
              <form onSubmit={handleUpdatePassword} className="space-y-4">
                <div>
                  <Label htmlFor="current-password">Current Password</Label>
                  <Input id="current-password" type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required />
                </div>
                <div>
                  <Label htmlFor="new-password">New Password</Label>
                  <Input id="new-password" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
                </div>
                <div>
                  <Label htmlFor="confirm-password">Confirm New Password</Label>
                  <Input id="confirm-password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                </div>
                <Button type="submit" className="w-full" disabled={isUpdating}>
                  {isUpdating ? 'Updating...' : 'Update Password'}
                </Button>
              </form>
            </div>
          </div>
          
           <div className="mt-8 bg-green-50 border-l-4 border-green-400 text-green-800 p-4 rounded-lg">
                <div className="flex">
                    <div className="flex-shrink-0">
                        <Check className="h-5 w-5 text-green-500" />
                    </div>
                    <div className="ml-3">
                        <p className="text-sm">
                            <span className="font-semibold">All Set!</span> The password system is now permanently stored in your database. Any changes you make will be saved.
                        </p>
                    </div>
                </div>
            </div>

        </motion.div>
      </div>
    </>
  );
};

export default AdminDashboardPage;