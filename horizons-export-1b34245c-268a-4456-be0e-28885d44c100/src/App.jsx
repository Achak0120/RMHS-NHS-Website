
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import HomePage from '@/pages/HomePage';
import AboutPage from '@/pages/AboutPage';
import MembershipPage from '@/pages/MembershipPage';
import MembersPage from '@/pages/MembersPage';
import BoardMembersPage from '@/pages/BoardMembersPage';
import OpportunitiesPage from '@/pages/OpportunitiesPage';
import AdminLoginPage from '@/pages/AdminLoginPage';
import AdminDashboardPage from '@/pages/AdminDashboardPage';
import ProtectedRoute from '@/components/ProtectedRoute';

function App() {
  return (
    <>
      <Helmet>
        <title>Rolling Meadows HS National Honors Society</title>
        <meta name="description" content="Official website of Rolling Meadows High School National Honors Society. Learn about membership, submit volunteer hours, and discover opportunities." />
      </Helmet>
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/membership" element={<MembershipPage />} />
            <Route path="/members" element={<MembersPage />} />
            <Route path="/board" element={<BoardMembersPage />} />
            <Route path="/opportunities" element={<OpportunitiesPage />} />
            <Route path="/login" element={<AdminLoginPage />} />
            <Route 
              path="/admin-dashboard" 
              element={
                <ProtectedRoute>
                  <AdminDashboardPage />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </main>
        <Footer />
      </div>
    </>
  );
}

export default App;
