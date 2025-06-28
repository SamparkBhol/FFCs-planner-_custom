
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import Timetable from '@/components/TimetableGrid';
import Chatbot from '@/components/Chatbot';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { RotateCcw } from 'lucide-react';

const TimetablePage = () => {
  const [courses, setCourses] = useState([]);
  const { toast } = useToast();

  useEffect(() => {
    const savedCourses = localStorage.getItem('ffcs-courses');
    if (savedCourses) {
      try {
        setCourses(JSON.parse(savedCourses));
      } catch (error) {
        console.error('Error loading saved courses:', error);
        setCourses([]);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('ffcs-courses', JSON.stringify(courses));
  }, [courses]);
  
  const allSlots = courses.flatMap(course => 
    course.slots.map(slot => ({ ...slot, subject: course.subject }))
  );

  const clearAllCourses = () => {
    setCourses([]);
    toast({
      title: "Timetable Cleared",
      description: "All courses have been removed.",
      variant: "destructive"
    });
  };

  return (
    <>
      <Helmet>
        <title>Timetable Builder - FFCS Planner AI</title>
        <meta name="description" content="Build your VIT University timetable using an AI-powered chatbot. Handle complex slot combinations with ease." />
      </Helmet>
      
      <div className="space-y-6">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex justify-between items-center"
        >
          <div>
            <h1 className="text-3xl font-bold glow-text">Timetable Builder</h1>
            <p className="text-gray-400">Use the chatbot to manage your courses and build your schedule.</p>
          </div>
          <Button onClick={clearAllCourses} variant="destructive" className="bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30">
            <RotateCcw className="w-4 h-4 mr-2" /> Reset Timetable
          </Button>
        </motion.div>

        <Timetable slots={allSlots} />
      </div>

      <Chatbot courses={courses} setCourses={setCourses} />
    </>
  );
};

export default TimetablePage;
