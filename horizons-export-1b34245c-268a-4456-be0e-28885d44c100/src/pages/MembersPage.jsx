
import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Users, Plus, Edit, Trash2 } from 'lucide-react';
import { Button, buttonVariants } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { supabase } from '@/lib/customSupabaseClient';
import MemberDialog from '@/components/MemberDialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const MembersPage = () => {
  const { toast } = useToast();
  const { isAdmin } = useAdminAuth();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentMember, setCurrentMember] = useState(null);

  const fetchMembers = useCallback(async () => {
    // Avoid flashing loading state on subsequent updates
    if (members.length === 0) setLoading(true);

    const { data, error } = await supabase
      .from('members')
      .select('*')
      .order('name', { ascending: true });

    if (error) {
      toast({
        variant: "destructive",
        title: "Error fetching members",
        description: error.message,
      });
    } else {
      setMembers(data);
    }
    setLoading(false);
  }, [toast]); // Removed members.length dependency

  useEffect(() => {
    fetchMembers();

    // Set up Realtime subscription
    const channel = supabase
      .channel('members-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'members',
        },
        (payload) => {
          console.log('Member change received!', payload);
          fetchMembers();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchMembers]);

  const handleAddNewMember = () => {
    setCurrentMember(null);
    setIsDialogOpen(true);
  };

  const handleEditMember = (member) => {
    setCurrentMember(member);
    setIsDialogOpen(true);
  };

  const handleSaveMember = async (memberData) => {
    const { id, name } = memberData;
    let error;

    if (!name || name.trim() === '') {
      toast({ variant: 'destructive', title: 'Invalid Name', description: 'Member name cannot be empty.' });
      return;
    }
    
    if (id) {
      // Update existing member
      ({ error } = await supabase.from('members').update({ name }).eq('id', id));
    } else {
      // Insert new member
      ({ error } = await supabase.from('members').insert({ name }));
    }

    if (error) {
      toast({ variant: "destructive", title: "Save failed", description: error.message });
    } else {
      toast({ title: "Success!", description: `Member has been ${id ? 'updated' : 'added'}.` });
      // Auto-update handled by subscription
    }
  };
  
  const handleDeleteMember = async (memberId) => {
    const { error } = await supabase.from('members').delete().eq('id', memberId);
    
    if (error) {
      toast({ variant: 'destructive', title: 'Delete Failed', description: error.message });
    } else {
      toast({ title: 'Deleted!', description: 'The member has been removed.' });
      // Auto-update handled by subscription
    }
  };

  return (
    <>
      <Helmet>
        <title>Members - RMHS National Honors Society</title>
        <meta name="description" content="Meet the members of the National Honors Society at Rolling Meadows High School." />
      </Helmet>
      
      <MemberDialog 
        isOpen={isDialogOpen}
        setIsOpen={setIsDialogOpen}
        member={currentMember}
        onSave={handleSaveMember}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 sm:mb-0">
              NHS Members
            </h1>
            {isAdmin && (
              <Button onClick={handleAddNewMember}>
                <Plus className="h-4 w-4 mr-2"/>
                Add New Member
              </Button>
            )}
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center space-x-3 mb-6">
              <Users className="h-8 w-8 text-primary" />
              <h2 className="text-2xl font-semibold text-gray-900">Current Inductees</h2>
            </div>
            
            {loading && members.length === 0 ? (
                <p className="text-center text-gray-500 py-4">Loading members...</p>
            ) : members.length > 0 ? (
                <ul className="divide-y divide-gray-200">
                {members.map((member) => (
                    <li key={member.id} className="flex justify-between items-center py-4 group">
                        <span className="text-lg text-gray-800">{member.name}</span>
                        {isAdmin && (
                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEditMember(member)}>
                                    <Edit className="h-4 w-4"/>
                                </Button>
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-destructive/10">
                                            <Trash2 className="h-4 w-4 text-destructive"/>
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                This will permanently delete "{member.name}" from the member list. This action cannot be undone.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction onClick={() => handleDeleteMember(member.id)} className={buttonVariants({ variant: "destructive" })}>Delete</AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </div>
                        )}
                    </li>
                ))}
                </ul>
            ) : (
                <p className="text-center text-gray-500 py-4">{isAdmin ? "No members added yet. Click 'Add New Member' to get started!" : "The member list has not been posted yet. Please check back later!"}</p>
            )}
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default MembersPage;
