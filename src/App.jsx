
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import MainLayout from '@/components/layout/MainLayout';
import HomePage from '@/pages/HomePage';
import TimetablePage from '@/pages/TimetablePage';
import TaskManagerPage from '@/pages/TaskManagerPage';

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="timetable" element={<TimetablePage />} />
          <Route path="tasks" element={<TaskManagerPage />} />
        </Route>
      </Routes>
      <Toaster />
    </>
  );
}

export default App;
