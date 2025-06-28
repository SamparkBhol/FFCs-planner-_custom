
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BarChart, Clock, BookOpen } from 'lucide-react';

const AnalyticsPage = () => {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const savedCourses = localStorage.getItem('ffcs-courses');
    if (savedCourses) {
      setCourses(JSON.parse(savedCourses));
    }
  }, []);

  const totalCourses = courses.length;
  const totalSlots = courses.reduce((acc, course) => acc + course.slotNames.length, 0);
  const theorySlots = courses.flatMap(c => c.slots).filter(s => s.type === 'theory').length;
  const labSlots = courses.flatMap(c => c.slots).filter(s => s.type === 'lab').length;
  
  const dailyHours = { MON: 0, TUE: 0, WED: 0, THU: 0, FRI: 0 };
  courses.flatMap(c => c.slots).forEach(s => {
      if (dailyHours[s.day] !== undefined) {
          dailyHours[s.day]++;
      }
  });

  const maxDailyHours = Math.max(...Object.values(dailyHours), 1);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring' } },
  };

  return (
    <>
      <Helmet>
        <title>Analytics - FFCS Planner</title>
        <meta name="description" content="Analyze your course selections and weekly workload." />
      </Helmet>
      <div className="space-y-8">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h1 className="text-3xl font-bold glow-text">Timetable Analytics</h1>
          <p className="text-gray-400">An overview of your current course selections.</p>
        </motion.div>

        {courses.length === 0 ? (
            <Card className="glassmorphism text-center py-16">
                <CardHeader>
                    <CardTitle>No Data to Analyze</CardTitle>
                    <CardDescription>Add some courses to your timetable to see your analytics here.</CardDescription>
                </CardHeader>
            </Card>
        ) : (
          <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div variants={itemVariants}>
              <Card className="glassmorphism h-full">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
                  <BookOpen className="w-4 h-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold text-cyan-400">{totalCourses}</div>
                  <p className="text-xs text-muted-foreground">Across {totalSlots} unique slots</p>
                </CardContent>
              </Card>
            </motion.div>
            <motion.div variants={itemVariants}>
              <Card className="glassmorphism h-full">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Total Weekly Hours</CardTitle>
                  <Clock className="w-4 h-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold text-fuchsia-400">{theorySlots + labSlots}</div>
                  <p className="text-xs text-muted-foreground">{theorySlots} Theory / {labSlots} Lab</p>
                </CardContent>
              </Card>
            </motion.div>
             <motion.div variants={itemVariants}>
                <Card className="glassmorphism h-full">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Theory vs Lab</CardTitle>
                    <BarChart className="w-4 h-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="flex items-center gap-4 mt-2">
                        <div className="w-full bg-gray-700 rounded-full h-4">
                            <motion.div 
                                className="bg-cyan-500 h-4 rounded-full"
                                style={{ width: `${(theorySlots / (theorySlots + labSlots)) * 100}%` }}
                                initial={{width: 0}}
                                animate={{width: `${(theorySlots / (theorySlots + labSlots || 1)) * 100}%`}}
                                transition={{duration: 1, ease: "easeOut"}}
                            ></motion.div>
                        </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">Ratio of theory to lab hours</p>
                </CardContent>
                </Card>
            </motion.div>

            <motion.div variants={itemVariants} className="md:col-span-3">
              <Card className="glassmorphism">
                <CardHeader>
                  <CardTitle>Daily Hour Distribution</CardTitle>
                  <CardDescription>Your academic workload throughout the week.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-5 gap-4 text-center">
                    {Object.entries(dailyHours).map(([day, hours]) => (
                      <div key={day} className="flex flex-col items-center gap-2">
                        <div className="w-full h-48 bg-gray-800 rounded-lg flex items-end">
                            <motion.div 
                                className="w-full bg-gradient-to-t from-cyan-500 to-purple-500 rounded-b-lg"
                                initial={{height: 0}}
                                animate={{height: `${(hours / maxDailyHours) * 100}%`}}
                                transition={{duration: 1, ease: [0.22, 1, 0.36, 1]}}
                            >
                                <div className="text-white font-bold relative -top-6">{hours}h</div>
                            </motion.div>
                        </div>
                        <p className="text-sm font-medium text-muted-foreground">{day}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </div>
    </>
  );
};

export default AnalyticsPage;
