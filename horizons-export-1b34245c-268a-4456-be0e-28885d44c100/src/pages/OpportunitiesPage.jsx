import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Link as LinkIcon, Calendar, Clock, MapPin } from 'lucide-react';
import { Button, buttonVariants } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { supabase } from '@/lib/customSupabaseClient';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter, // Ensure DialogFooter is imported
  DialogClose
} from '@/components/ui/dialog';
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
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';


const OpportunityDialog = ({ isOpen, setIsOpen, opportunity, onSave, onNew }) => {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [spots, setSpots] = useState('');
  const [quicklinks, setQuicklinks] = useState('');
  const [isNew, setIsNew] = useState(false);

  useEffect(() => {
    if (opportunity) {
      setTitle(opportunity.title || '');
      setDate(opportunity.date || '');
      setTime(opportunity.time || '');
      setLocation(opportunity.location || '');
      setDescription(opportunity.description || '');
      setSpots(opportunity.spots_available || '');
      setQuicklinks(opportunity.quicklinks || '');
      setIsNew(false);
    } else {
        setTitle('');
        setDate('');
        setTime('');
        setLocation('');
        setDescription('');
        setSpots('');
        setQuicklinks('');
        setIsNew(true);
    }
  }, [opportunity, isOpen]);

  const handleSave = () => {
    if (!title.trim()) {
        alert("Title is required."); // Or a toast notification
        return;
    }

    const oppData = {
      title,
      date: date || null,
      time: time || null,
      location: location || null,
      description: description || null,
      spots_available: spots ? Number(spots) : null,
      quicklinks: quicklinks || null,
    };

    if (isNew) {
        onNew(oppData);
    } else {
        onSave({ ...opportunity, ...oppData });
    }
    setIsOpen(false);
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isNew ? 'Add New Opportunity' : 'Edit Opportunity'}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto pr-4">
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="title" className="text-right">Title <span className="text-destructive">*</span></Label>
                <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="date" className="text-right">Date</Label>
                <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="time" className="text-right">Time</Label>
                <Input id="time" value={time} onChange={(e) => setTime(e.target.value)} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="location" className="text-right">Location</Label>
                <Input id="location" value={location} onChange={(e) => setLocation(e.target.value)} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="description" className="text-right pt-2">Description</Label>
                <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="spots" className="text-right">Spots</Label>
                <Input id="spots" type="number" value={spots} onChange={(e) => setSpots(e.target.value)} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="quicklinks" className="text-right pt-2">Quick Links</Label>
                <Textarea id="quicklinks" value={quicklinks} onChange={(e) => setQuicklinks(e.target.value)} className="col-span-3" placeholder="Enter URLs, one per line" />
            </div>
        </div>
        <DialogFooter>
            <DialogClose asChild>
                <Button type="button" variant="secondary">Cancel</Button>
            </DialogClose>
            <Button onClick={handleSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};


const OpportunitiesPage = () => {
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { isAdmin } = useAdminAuth();
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentOpportunity, setCurrentOpportunity] = useState(null);

  const fetchOpportunities = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('opportunities')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast({
        variant: "destructive",
        title: "Error fetching opportunities",
        description: error.message,
      });
      setOpportunities([]);
    } else {
      setOpportunities(data);
    }
    setLoading(false);
  }, [toast]);

  useEffect(() => {
    fetchOpportunities();
  }, [fetchOpportunities]);
  
  const handleAddNew = () => {
    setCurrentOpportunity(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (opp) => {
    setCurrentOpportunity(opp);
    setIsDialogOpen(true);
  };

  const handleSave = async (opp) => {
    const { error } = await supabase.from('opportunities').update(opp).eq('id', opp.id);
    if (error) {
        toast({ variant: 'destructive', title: 'Update failed', description: error.message });
    } else {
        toast({ title: 'Success!', description: 'Opportunity has been updated.' });
        fetchOpportunities();
    }
  };
  
  const handleNew = async (oppData) => {
      const { error } = await supabase.from('opportunities').insert([oppData]);
      if (error) {
          toast({ variant: 'destructive', title: 'Creation failed', description: error.message });
      } else {
          toast({ title: 'Success!', description: 'New opportunity has been created.' });
          fetchOpportunities();
      }
  };

  const handleDelete = async (id) => {
    const { error } = await supabase.from('opportunities').delete().eq('id', id);
    if (error) {
        toast({ variant: 'destructive', title: 'Delete failed', description: error.message });
    } else {
        toast({ title: 'Deleted!', description: 'The opportunity has been removed.' });
        fetchOpportunities();
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone: 'UTC',
    });
  };

  const renderQuickLinks = (links) => {
    if (!links) return null;
    const linkArray = links.split('\n').filter(link => link.trim() !== '');
    if (linkArray.length === 0) return null;

    return (
        <div className="mt-4">
            <h4 className="font-semibold text-sm text-gray-800 mb-2">Quick Links:</h4>
            <div className="flex flex-wrap gap-2">
                {linkArray.map((link, index) => (
                    <a
                        key={index}
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={cn(buttonVariants({ variant: "outline", size: "sm" }), "bg-purple-50 hover:bg-purple-100 border-purple-200 text-primary")}
                    >
                        <LinkIcon className="mr-2 h-4 w-4" />
                        Link {index + 1}
                    </a>
                ))}
            </div>
        </div>
    );
  };

  return (
    <>
      <Helmet>
        <title>Volunteer Opportunities - RMHS National Honors Society</title>
        <meta name="description" content="Find and sign up for volunteer opportunities available to members of the RMHS National Honors Society." />
      </Helmet>

      <OpportunityDialog 
        isOpen={isDialogOpen}
        setIsOpen={setIsDialogOpen}
        opportunity={currentOpportunity}
        onSave={handleSave}
        onNew={handleNew}
      />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
              Volunteer Opportunities
            </h1>
            {isAdmin && (
              <Button onClick={handleAddNew}>
                <Plus className="mr-2 h-4 w-4" /> Add Opportunity
              </Button>
            )}
          </div>

          {loading ? (
            <p className="text-center text-gray-500">Loading opportunities...</p>
          ) : opportunities.length === 0 ? (
            <div className="text-center bg-white rounded-lg shadow-md p-12">
              <h3 className="text-xl font-semibold text-gray-800">No Opportunities Available</h3>
              <p className="text-gray-500 mt-2">Please check back soon for new volunteer events!</p>
            </div>
          ) : (
            <div className="space-y-6">
              {opportunities.map((opp) => (
                <motion.div
                  key={opp.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                  className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow overflow-hidden group"
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="text-xl font-bold text-gray-900 mb-1">{opp.title}</h3>
                            <div className="flex items-center text-sm text-gray-500 space-x-4 flex-wrap">
                                {opp.date && <span className="flex items-center"><Calendar className="mr-1.5 h-4 w-4" /> {formatDate(opp.date)}</span>}
                                {opp.time && <span className="flex items-center"><Clock className="mr-1.5 h-4 w-4" /> {opp.time}</span>}
                            </div>
                        </div>
                        {isAdmin && (
                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEdit(opp)}>
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
                                            <AlertDialogDescription>This will permanently delete this opportunity. This action cannot be undone.</AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction onClick={() => handleDelete(opp.id)} className={cn(buttonVariants({ variant: "destructive" }))}>Delete</AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </div>
                        )}
                    </div>
                    {opp.description && <p className="text-gray-700 mt-3">{opp.description}</p>}
                    {renderQuickLinks(opp.quicklinks)}
                    <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center text-sm">
                      <div className="text-gray-600">
                        {opp.location && <p className="flex items-center"><MapPin className="mr-1.5 h-4 w-4" /> {opp.location}</p>}
                      </div>
                      {opp.spots_available && (
                        <span className="bg-purple-100 text-primary font-semibold py-1 px-3 rounded-full">
                          {opp.spots_available} spots available
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </>
  );
};

export default OpportunitiesPage;