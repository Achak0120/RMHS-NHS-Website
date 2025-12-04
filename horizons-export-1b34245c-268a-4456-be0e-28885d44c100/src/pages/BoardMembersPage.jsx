
import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Users, Plus, Edit, Trash2 } from 'lucide-react';
import { Button, buttonVariants } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { supabase } from '@/lib/customSupabaseClient';
import BoardMemberDialog from '@/components/BoardMemberDialog';
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

const BoardMembersPage = () => {
  const { toast } = useToast();
  const { isAdmin } = useAdminAuth();
  const [boardMembers, setBoardMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentMember, setCurrentMember] = useState(null);

  const fetchBoardMembers = useCallback(async () => {
    // Don't set loading to true here to avoid UI flashing during real-time updates
    // Only set loading if it's the initial fetch (array is empty)
    if (boardMembers.length === 0) setLoading(true);
    
    const { data, error } = await supabase
      .from('board_members')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) {
      toast({
        variant: "destructive",
        title: "Error fetching board members",
        description: error.message,
      });
    } else {
      setBoardMembers(data);
    }
    setLoading(false);
  }, [toast]); // Removed boardMembers.length dependency to prevent infinite loops if logic changes

  useEffect(() => {
    fetchBoardMembers();

    // Set up Realtime subscription
    const channel = supabase
      .channel('board-members-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'board_members',
        },
        (payload) => {
          console.log('Change received!', payload);
          fetchBoardMembers();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchBoardMembers]);

  const handleAddMember = () => {
    setCurrentMember(null);
    setIsDialogOpen(true);
  };

  const handleEditMember = (member) => {
    setCurrentMember(member);
    setIsDialogOpen(true);
  };

  const handleSaveMember = async (memberData) => {
    const { id, name, position, photo_url } = memberData;
    let error;

    const payload = { name, position, photo_url };

    if (id) {
      ({ error } = await supabase.from('board_members').update(payload).eq('id', id));
    } else {
      ({ error } = await supabase.from('board_members').insert(payload));
    }

    if (error) {
      toast({ variant: "destructive", title: "Save failed", description: error.message });
    } else {
      toast({ title: "Success!", description: `Board member has been ${id ? 'updated' : 'added'}.` });
      // No need to manually fetch here as the subscription will catch the change
    }
  };
  
  const handleDeleteMember = async (memberId) => {
    const { error } = await supabase.from('board_members').delete().eq('id', memberId);
    
    if (error) {
      toast({ variant: 'destructive', title: 'Delete Failed', description: error.message });
    } else {
      toast({ title: 'Deleted!', description: 'The board member has been removed.' });
      // No need to manually fetch here as the subscription will catch the change
    }
  };

  return (
    <>
      <Helmet>
        <title>Board Members - RMHS National Honors Society</title>
        <meta name="description" content="Meet the executive board members of the National Honors Society at Rolling Meadows High School." />
      </Helmet>
      
      <BoardMemberDialog 
        isOpen={isDialogOpen}
        setIsOpen={setIsDialogOpen}
        member={currentMember}
        onSave={handleSaveMember}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 sm:mb-0">
              Executive Board
            </h1>
            {isAdmin && (
              <Button onClick={handleAddMember}>
                <Plus className="h-4 w-4 mr-2"/>
                Add Board Member
              </Button>
            )}
          </div>
          
          {loading && boardMembers.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">Loading board members...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {boardMembers.length > 0 ? (
                boardMembers.map((member) => (
                  <div key={member.id} className="bg-white rounded-xl shadow-lg overflow-hidden group relative flex flex-col">
                    <div className="aspect-square w-full bg-gray-100 relative overflow-hidden">
                      {member.photo_url ? (
                        <img 
                          src={member.photo_url} 
                          alt={member.name} 
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-purple-100 text-purple-300">
                          <Users className="h-24 w-24" />
                        </div>
                      )}
                      
                      {isAdmin && (
                        <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 p-2 rounded-lg backdrop-blur-sm">
                          <Button variant="secondary" size="icon" className="h-8 w-8" onClick={() => handleEditMember(member)}>
                            <Edit className="h-4 w-4"/>
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="destructive" size="icon" className="h-8 w-8">
                                <Trash2 className="h-4 w-4"/>
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This will permanently delete {member.name} from the board.
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
                    </div>
                    
                    <div className="p-6 text-center flex-grow flex flex-col justify-center">
                      <h3 className="text-xl font-bold text-gray-900 mb-1">{member.name}</h3>
                      <p className="text-primary font-medium">{member.position}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-12 bg-white rounded-xl shadow-sm">
                   <p className="text-gray-500 text-lg">
                    {isAdmin 
                      ? "No board members added yet. Click 'Add Board Member' to get started!" 
                      : "The Executive Board list has not been posted yet. Please check back later!"}
                   </p>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </>
  );
};

export default BoardMembersPage;
