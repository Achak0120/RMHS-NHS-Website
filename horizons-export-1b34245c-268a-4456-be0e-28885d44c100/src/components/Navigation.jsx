
import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Menu, X, LogOut, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAdminAuth } from '@/contexts/AdminAuthContext';

const navItems = [
  { path: '/', label: 'Home' },
  { path: '/about', label: 'About' },
  { path: '/membership', label: 'Membership' },
  { path: '/members', label: 'Members' },
  { path: '/board', label: 'Board' },
  { path: '/opportunities', label: 'Opportunities' },
];

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isAdmin, logout } = useAdminAuth();
  const navigate = useNavigate();

  const handleSignOut = () => {
    logout();
    setIsOpen(false);
  };

  const handleAdminClick = () => {
    navigate('/login');
    setIsOpen(false);
  };

  const handleDashboardClick = () => {
    navigate('/admin-dashboard');
    setIsOpen(false);
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-white/80 backdrop-blur-lg">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center space-x-3" onClick={() => setIsOpen(false)}>
            <img 
              src="https://horizons-cdn.hostinger.com/1b34245c-268a-4456-be0e-28885d44c100/88264f673915a720d60390de015089e4.jpg" 
              alt="National Honor Society Logo" 
              className="h-12 w-12 object-contain"
            />
            <span className="font-bold text-lg text-gray-900">RMHS NHS</span>
          </Link>

          <div className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `text-base font-medium transition-colors ${
                    isActive ? 'text-primary' : 'text-gray-600 hover:text-primary'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </div>

          <div className="hidden md:flex items-center space-x-2">
            {isAdmin ? (
              <>
                <Button onClick={handleDashboardClick} variant="ghost" size="sm">
                  <Settings className="h-4 w-4 mr-2" />
                  Dashboard
                </Button>
                <Button onClick={handleSignOut} variant="outline" size="sm">
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </>
            ) : (
              <Button onClick={handleAdminClick} size="sm">
                Admin
              </Button>
            )}
          </div>

          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-600 hover:text-gray-800">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="md:hidden bg-white/95 backdrop-blur-lg border-t"
        >
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `block px-3 py-2 rounded-md text-lg font-medium ${
                    isActive ? 'bg-purple-50 text-primary' : 'text-gray-700 hover:bg-gray-50'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
            <div className="pt-4 pb-2 px-3 border-t space-y-2">
              {isAdmin ? (
                <>
                  <Button onClick={handleDashboardClick} variant="outline" className="w-full">
                    <Settings className="h-4 w-4 mr-2" />
                    Admin Dashboard
                  </Button>
                  <Button onClick={handleSignOut} className="w-full">
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </Button>
                </>
              ) : (
                <Button onClick={handleAdminClick} className="w-full">
                  Admin Login
                </Button>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </header>
  );
};

export default Navigation;
