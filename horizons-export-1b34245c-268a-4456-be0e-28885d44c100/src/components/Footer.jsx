import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, Mail, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <GraduationCap className="h-8 w-8 text-yellow-400" />
              <span className="font-bold text-xl">RMHS NHS</span>
            </div>
            <p className="text-gray-400 text-sm">
              Rolling Meadows High School National Honors Society - Building character, scholarship, leadership, and service.
            </p>
          </div>

          <div>
            <span className="font-semibold text-lg mb-4 block">Contact</span>
            <div className="space-y-2 text-gray-400 text-sm">
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4" />
                <span>Rolling Meadows High School</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span>Eileen.herbster@d214.org</span>
              </div>
            </div>
          </div>

          <div>
            <span className="font-semibold text-lg mb-4 block">Quick Links</span>
            <div className="space-y-2 text-gray-400 text-sm">
              <p>Four Pillars: Scholarship, Service, Leadership, Character</p>
              <Link to="/login" className="hover:text-yellow-400 transition-colors">Admin Login</Link>
              <a href="https://www.d214.org/rmhs" target="_blank" rel="noopener noreferrer" className="hover:text-yellow-400 transition-colors block">RMHS Official Website</a>
              <p className="text-xs mt-4">© 2025 RMHS National Honors Society. Developed by RMHS Coding Club.</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;