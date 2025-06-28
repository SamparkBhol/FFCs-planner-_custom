
import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Book, Calendar, Home, Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';

const navItems = [
  { path: '/', label: 'Home', icon: Home },
  { path: '/timetable', label: 'Timetable', icon: Calendar },
  { path: '/tasks', label: 'Task Manager', icon: Book },
];

const Header = () => {
  return (
    <motion.header 
      className="sticky top-0 z-50 glassmorphism"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 100, damping: 20 }}
    >
      <div className="container mx-auto px-4 h-20 flex justify-between items-center">
        <NavLink to="/" className="flex items-center gap-2">
          <motion.div whileHover={{ rotate: 360 }}>
            <Bot className="w-8 h-8 text-cyan-400" />
          </motion.div>
          <span className="text-xl font-bold glow-text">FFCS Planner AI</span>
        </NavLink>
        <nav className="hidden md:flex items-center gap-2">
          {navItems.map((item) => (
            <NavLink to={item.path} key={item.path}>
              {({ isActive }) => (
                <Button variant="ghost" className={`flex gap-2 ${isActive ? 'text-cyan-400' : 'text-gray-400 hover:text-white'}`}>
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </Button>
              )}
            </NavLink>
          ))}
        </nav>
        <div className="md:hidden">
          <Button variant="ghost" size="icon">
            <Bot className="w-6 h-6" />
          </Button>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
