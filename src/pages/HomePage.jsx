
import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, Calendar, Book } from 'lucide-react';

const HomePage = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.3 }
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: 'spring', stiffness: 100 }
    },
  };

  return (
    <>
      <Helmet>
        <title>FFCS Planner AI - Home</title>
        <meta name="description" content="Welcome to the next-generation FFCS Timetable Planner. Build your schedule with AI assistance." />
      </Helmet>
      <div className="flex flex-col items-center justify-center text-center min-h-[calc(100vh-10rem)]">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          <motion.h1 
            className="text-5xl md:text-7xl font-extrabold bg-gradient-to-r from-cyan-400 to-fuchsia-500 bg-clip-text text-transparent"
            variants={itemVariants}
          >
            Reimagine Your Timetable
          </motion.h1>

          <motion.p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto" variants={itemVariants}>
            The ultimate FFCS planner is here. Use our AI-powered chatbot to build your schedule, manage tasks, and optimize your university life.
          </motion.p>
          
          <motion.div className="flex flex-col sm:flex-row gap-4 justify-center" variants={itemVariants}>
            <Link to="/timetable">
              <Button size="lg" className="bg-cyan-500 hover:bg-cyan-600 text-black font-bold shadow-lg shadow-cyan-500/20 w-full sm:w-auto">
                Launch Timetable Builder <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link to="/tasks">
              <Button size="lg" variant="outline" className="text-cyan-400 border-cyan-400 hover:bg-cyan-400/10 hover:text-cyan-300 w-full sm:w-auto">
                Open Task Manager <Book className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </motion.div>

          <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-12 max-w-4xl mx-auto" variants={containerVariants}>
            <motion.div className="p-6 rounded-lg glassmorphism text-left" variants={itemVariants}>
              <Calendar className="w-8 h-8 mb-4 text-cyan-400" />
              <h3 className="text-xl font-bold mb-2 text-white">Interactive Timetable</h3>
              <p className="text-gray-400">Visualize your week with a dynamic grid. Add courses via our chatbot and see your schedule update in real-time.</p>
            </motion.div>
            <motion.div className="p-6 rounded-lg glassmorphism text-left" variants={itemVariants}>
              <Book className="w-8 h-8 mb-4 text-fuchsia-500" />
              <h3 className="text-xl font-bold mb-2 text-white">Advanced Task Manager</h3>
              <p className="text-gray-400">Keep track of your preferred professors and course selections. Plan your ideal semester with ease.</p>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </>
  );
};

export default HomePage;
