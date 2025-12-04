import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Award, Users, Heart, Lightbulb, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const HomePage = () => {
  const pillars = [
    { icon: Award, title: 'Scholarship', description: 'Academic excellence and love of learning' },
    { icon: Heart, title: 'Service', description: 'Commitment to helping others' },
    { icon: Users, title: 'Leadership', description: 'Inspiring and guiding peers' },
    { icon: Lightbulb, title: 'Character', description: 'Integrity and ethical behavior' },
  ];

  return (
    <>
      <Helmet>
        <title>Home - RMHS National Honors Society</title>
        <meta name="description" content="Welcome to Rolling Meadows High School National Honors Society. Join us in building character, scholarship, leadership, and service." />
      </Helmet>

      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-yellow-400 to-white opacity-10"></div>
        
        <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Rolling Meadows High School
              <span className="block text-primary mt-2">National Honors Society</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Recognizing outstanding students who demonstrate excellence in scholarship, service, leadership, and character.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/membership">
                <Button size="lg" className="group">
                  Learn About Membership
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/opportunities">
                <Button size="lg" variant="outline">
                  View Opportunities
                </Button>
              </Link>
            </div>
          </motion.div>
        </section>

        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              The Four Pillars of NHS
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {pillars.map((pillar, index) => (
                <motion.div
                  key={pillar.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1, duration: 0.5 }}
                  className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
                >
                  <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                    <pillar.icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{pillar.title}</h3>
                  <p className="text-gray-600">{pillar.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>
      </div>
    </>
  );
};

export default HomePage;