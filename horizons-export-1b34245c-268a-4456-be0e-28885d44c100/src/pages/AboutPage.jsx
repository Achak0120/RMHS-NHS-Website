import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { BookOpen, Target, Users2 } from 'lucide-react';

const AboutPage = () => {
  return (
    <>
      <Helmet>
        <title>About NHS - RMHS National Honors Society</title>
        <meta name="description" content="Learn about the National Honors Society at Rolling Meadows High School, our mission, values, and what we stand for." />
      </Helmet>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            About National Honors Society
          </h1>
          
          <div className="prose prose-lg max-w-none">
            <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
              <div className="flex items-center space-x-3 mb-4">
                <BookOpen className="h-8 w-8 text-primary" />
                <h2 className="text-2xl font-semibold text-gray-900 m-0">What is NHS?</h2>
              </div>
              <p className="text-gray-700 leading-relaxed">
                The National Honor Society (NHS) is the nation's premier organization established to recognize outstanding high school students. More than just an honor roll, NHS serves to honor those students who have demonstrated excellence in the areas of Scholarship, Service, Leadership, and Character.
              </p>
              <p className="text-gray-700 leading-relaxed mt-4">
                At Rolling Meadows High School, our NHS chapter is dedicated to creating enthusiastic leaders who are committed to serving their school and community. We believe in fostering a culture of academic achievement while developing the character and leadership skills necessary for success in college and beyond.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
              <div className="flex items-center space-x-3 mb-4">
                <Target className="h-8 w-8 text-primary" />
                <h2 className="text-2xl font-semibold text-gray-900 m-0">Our Mission</h2>
              </div>
              <p className="text-gray-700 leading-relaxed">
                Our mission is to create enthusiasm for scholarship, stimulate a desire to render service, promote leadership, and develop character in students of Rolling Meadows High School. We strive to:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 mt-4 ml-4">
                <li>Recognize and encourage academic achievement</li>
                <li>Develop leadership skills through active participation</li>
                <li>Promote service to school and community</li>
                <li>Foster character development and ethical decision-making</li>
                <li>Create opportunities for personal and academic growth</li>
              </ul>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="flex items-center space-x-3 mb-4">
                <Users2 className="h-8 w-8 text-primary" />
                <h2 className="text-2xl font-semibold text-gray-900 m-0">What We Do</h2>
              </div>
              <p className="text-gray-700 leading-relaxed">
                NHS members at Rolling Meadows participate in a variety of activities throughout the year, including:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 mt-4 ml-4">
                <li>Community service projects and volunteer opportunities</li>
                <li>Tutoring and peer mentoring programs</li>
                <li>School events and leadership initiatives</li>
                <li>Fundraising for charitable causes</li>
                <li>Character-building workshops and seminars</li>
                <li>Collaboration with local organizations</li>
              </ul>
              <p className="text-gray-700 leading-relaxed mt-4">
                Through these activities, our members develop valuable skills, make lasting friendships, and make a positive impact on our school and community.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default AboutPage;