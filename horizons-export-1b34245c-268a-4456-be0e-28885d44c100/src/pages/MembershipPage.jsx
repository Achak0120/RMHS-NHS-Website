import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { CheckCircle2, FileText, Calendar, AlertCircle, Plus, Edit, Trash2 } from 'lucide-react';
import { Button, buttonVariants } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { supabase } from '@/lib/customSupabaseClient';
import DateManagementDialog from '@/components/DateManagementDialog';
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

const MembershipPage = () => {
  const { toast } = useToast();
  const { isAdmin } = useAdminAuth();
  const [importantDates, setImportantDates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState(null);

  const fetchDates = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('important_dates')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) {
      toast({
        variant: "destructive",
        title: "Error fetching dates",
        description: error.message,
      });
    } else {
      setImportantDates(data);
    }
    setLoading(false);
  }, [toast]);

  useEffect(() => {
    fetchDates();
  }, [fetchDates]);

  const handleApplicationClick = () => {
    toast({
      title: "Application Information",
      description: "🚧 This feature isn't implemented yet—but don't worry! You can ask your developers to learn more! 🚀",
    });
  };

  const handleAddNewDate = () => {
    setCurrentDate(null);
    setIsDialogOpen(true);
  };

  const handleEditDate = (date) => {
    setCurrentDate(date);
    setIsDialogOpen(true);
  };

  const handleSaveDate = async (date) => {
    const { id, ...updateData } = date;
    let error;

    if (id) {
      // Update existing date
      ({ error } = await supabase.from('important_dates').update(updateData).eq('id', id));
    } else {
      // Insert new date
      ({ error } = await supabase.from('important_dates').insert(updateData));
    }

    if (error) {
      toast({
        variant: "destructive",
        title: "Save failed",
        description: error.message,
      });
    } else {
      toast({
        title: "Success!",
        description: "Important date has been saved.",
      });
      fetchDates();
    }
  };
  
  const handleDeleteDate = async (dateId) => {
    const { error } = await supabase.from('important_dates').delete().eq('id', dateId);
    
    if (error) {
      toast({
        variant: 'destructive',
        title: 'Delete Failed',
        description: error.message,
      });
    } else {
      toast({
        title: 'Deleted!',
        description: 'The date has been removed.',
      });
      fetchDates();
    }
  };

  return (
    <>
      <Helmet>
        <title>Membership - RMHS National Honors Society</title>
        <meta name="description" content="Learn how to become a member of the National Honors Society at Rolling Meadows High School. Requirements, application process, and important dates." />
      </Helmet>
      
      <DateManagementDialog 
        isOpen={isDialogOpen}
        setIsOpen={setIsDialogOpen}
        date={currentDate}
        onSave={handleSaveDate}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Membership Information
          </h1>

          <div className="bg-purple-50 border-l-4 border-primary p-6 rounded-lg mb-8">
            <div className="flex items-start space-x-3">
              <AlertCircle className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-purple-900 mb-1">Important Note</h3>
                <p className="text-purple-800">
                  Membership in NHS is both an honor and a responsibility. Members are expected to maintain high standards in all four pillars throughout their membership.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <div className="flex items-center space-x-3 mb-6">
              <CheckCircle2 className="h-8 w-8 text-primary" />
              <h2 className="text-2xl font-semibold text-gray-900">Eligibility Requirements</h2>
            </div>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Academic Requirements</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                  <li>Must be a sophomore, junior, or senior</li>
                  <li>Minimum cumulative GPA of 3.5 (unweighted)</li>
                  <li>Must maintain this GPA throughout membership</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Service Requirements</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                  <li>Demonstrated commitment to community service</li>
                  <li>Minimum of 10 volunteer hours prior to application</li>
                  <li>Ongoing service participation required after induction</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Leadership & Character</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                  <li>Evidence of leadership in school or community activities</li>
                  <li>Demonstration of good character and citizenship</li>
                  <li>Positive recommendations from teachers</li>
                  <li>Clean disciplinary record</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <div className="flex items-center space-x-3 mb-6">
              <FileText className="h-8 w-8 text-primary" />
              <h2 className="text-2xl font-semibold text-gray-900">Application Process</h2>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="bg-purple-100 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-primary font-semibold">1</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Receive Invitation</h3>
                  <p className="text-gray-700">Eligible students will receive an invitation to apply based on their academic performance.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-purple-100 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-primary font-semibold">2</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Complete Application</h3>
                  <p className="text-gray-700">Fill out the application form detailing your service, leadership activities, and character examples.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-purple-100 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-primary font-semibold">3</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Faculty Review</h3>
                  <p className="text-gray-700">The NHS Faculty Council reviews all applications and makes selection decisions.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-purple-100 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-primary font-semibold">4</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Notification & Induction</h3>
                  <p className="text-gray-700">Selected students are notified and invited to the formal induction ceremony.</p>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t">
              <Button onClick={handleApplicationClick} size="lg" className="w-full sm:w-auto">
                Access Application Form
              </Button>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                    <Calendar className="h-8 w-8 text-primary" />
                    <h2 className="text-2xl font-semibold text-gray-900">Important Dates</h2>
                </div>
                {isAdmin && (
                    <Button onClick={handleAddNewDate} variant="outline" size="sm">
                        <Plus className="h-4 w-4 mr-2"/>
                        Add Date
                    </Button>
                )}
            </div>
            
            <div className="space-y-3 text-gray-700">
                {loading ? (
                    <p>Loading dates...</p>
                ) : importantDates.length > 0 ? (
                    importantDates.map((date) => (
                        <div key={date.id} className="flex justify-between items-center py-3 border-b group">
                            <span className="font-medium">{date.event_name}</span>
                            <div className="flex items-center gap-4">
                                <span className="text-primary font-semibold">{date.event_date}</span>
                                {isAdmin && (
                                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEditDate(date)}>
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
                                                        This will permanently delete this important date. This action cannot be undone.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                    <AlertDialogAction onClick={() => handleDeleteDate(date.id)} className={buttonVariants({ variant: "destructive" })}>Delete</AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-center text-gray-500 py-4">{isAdmin ? "No dates added yet. Click 'Add Date' to get started!" : "No important dates have been added yet. Please check back later!"}</p>
                )}
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default MembershipPage;