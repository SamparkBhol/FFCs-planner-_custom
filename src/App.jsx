
import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import MainLayout from '@/components/layout/MainLayout';
import HomePage from '@/pages/HomePage';
import TimetablePage from '@/pages/TimetablePage';
import TaskManagerPage from '@/pages/TaskManagerPage';
import AnalyticsPage from '@/pages/AnalyticsPage';
import { AnimatePresence } from 'framer-motion';

function App() {
  const location = useLocation();
  return (
    <>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<HomePage />} />
            <Route path="timetable" element={<TimetablePage />} />
            <Route path="tasks" element={<TaskManagerPage />} />
            <Route path="analytics" element={<AnalyticsPage />} />
          </Route>
        </Routes>
      </AnimatePresence>
      <Toaster />
    </>
  );
}

export default App;
