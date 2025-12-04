import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Clock, Calendar, MapPin, FileText, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';

const VolunteerHoursPage = () => {
  const { toast } = useToast();
  const [submissions, setSubmissions] = useState([]);
  const [formData, setFormData] = useState({
    studentName: '',
    date: '',
    hours: '',
    organization: '',
    description: '',
  });

  useEffect(() => {
    const saved = localStorage.getItem('volunteerHours');
    if (saved) {
      setSubmissions(JSON.parse(saved));
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.studentName || !formData.date || !formData.hours || !formData.organization) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    const newSubmission = {
      id: Date.now(),
      ...formData,
      submittedAt: new Date().toISOString(),
    };

    const updated = [newSubmission, ...submissions];
    setSubmissions(updated);
    localStorage.setItem('volunteerHours', JSON.stringify(updated));

    toast({
      title: "Hours Submitted! 🎉",
      description: "Your volunteer hours have been recorded successfully.",
    });

    setFormData({
      studentName: '',
      date: '',
      hours: '',
      organization: '',
      description: '',
    });
  };

  const handleDelete = (id) => {
    const updated = submissions.filter(sub => sub.id !== id);
    setSubmissions(updated);
    localStorage.setItem('volunteerHours', JSON.stringify(updated));
    
    toast({
      title: "Submission Deleted",
      description: "The volunteer hours entry has been removed.",
    });
  };

  const totalHours = submissions.reduce((sum, sub) => sum + parseFloat(sub.hours || 0), 0);

  return (
    <>
      <Helmet>
        <title>Submit Volunteer Hours - RMHS National Honors Society</title>
        <meta name="description" content="Submit your volunteer hours for Rolling Meadows High School National Honors Society. Track your service contributions." />
      </Helmet>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Submit Volunteer Hours
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Log your community service hours to maintain your NHS membership requirements.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-lg p-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">Log Your Hours</h2>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <Label htmlFor="studentName">Student Name *</Label>
                    <Input
                      id="studentName"
                      value={formData.studentName}
                      onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                      placeholder="Enter your full name"
                      className="mt-1"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="date">Date of Service *</Label>
                      <Input
                        id="date"
                        type="date"
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="hours">Hours Completed *</Label>
                      <Input
                        id="hours"
                        type="number"
                        step="0.5"
                        min="0"
                        value={formData.hours}
                        onChange={(e) => setFormData({ ...formData, hours: e.target.value })}
                        placeholder="e.g., 2.5"
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="organization">Organization/Event *</Label>
                    <Input
                      id="organization"
                      value={formData.organization}
                      onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                      placeholder="Where did you volunteer?"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="description">Description of Service</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Briefly describe what you did..."
                      rows={4}
                      className="mt-1"
                    />
                  </div>

                  <Button type="submit" size="lg" className="w-full">
                    Submit Hours
                  </Button>
                </form>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-gradient-to-br from-primary to-yellow-500 text-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold mb-2">Total Hours Logged</h3>
                <div className="text-5xl font-bold mb-2">{totalHours.toFixed(1)}</div>
                <p className="text-purple-100 text-sm">Keep up the great work!</p>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Requirements</h3>
                <div className="space-y-3 text-sm text-gray-700">
                  <div className="flex items-start space-x-2">
                    <Clock className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <p>Members must complete a minimum of 20 hours per year</p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <Calendar className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <p>Submit hours within 30 days of completion</p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <FileText className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <p>Keep records of all volunteer activities</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {submissions.length > 0 && (
            <div className="mt-12">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Your Submissions</h2>
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Organization</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hours</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {submissions.map((sub) => (
                        <tr key={sub.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {new Date(sub.date).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">{sub.organization}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-primary">
                            {sub.hours} hrs
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-700 max-w-xs truncate">
                            {sub.description || '—'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(sub.id)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </>
  );
};

export default VolunteerHoursPage;