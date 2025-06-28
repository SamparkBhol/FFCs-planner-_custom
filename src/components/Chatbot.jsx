
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Bot, Plus, Trash, X } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { FFCS_SLOTS } from '@/data/ffcsSlots';

const Chatbot = ({ courses, setCourses }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [stage, setStage] = useState('menu');
  const [courseName, setCourseName] = useState('');
  const [slotsInput, setSlotsInput] = useState('');
  const [professor, setProfessor] = useState('');
  const { toast } = useToast();

  const resetState = () => {
    setStage('menu');
    setCourseName('');
    setSlotsInput('');
    setProfessor('');
  };

  const handleAddCourse = () => {
    const slotNames = slotsInput.toUpperCase().split('+').map(s => s.trim()).filter(Boolean);
    if (!courseName || slotNames.length === 0) {
      toast({ title: 'Error', description: 'Course Name and Slots are required.', variant: 'destructive' });
      return;
    }

    let allSlotsValid = true;
    const newCourseSlots = [];
    
    slotNames.forEach(slotName => {
      const ffcsSlotData = FFCS_SLOTS[slotName];
      if (!ffcsSlotData) {
        allSlotsValid = false;
        toast({ title: 'Invalid Slot', description: `Slot "${slotName}" is not a valid FFCS slot.`, variant: 'destructive' });
      } else {
        ffcsSlotData.forEach(s => {
          newCourseSlots.push({ name: slotName, ...s });
        });
      }
    });

    if (!allSlotsValid) return;

    const newCourse = {
      id: Date.now(),
      subject: courseName,
      professor: professor || 'N/A',
      slots: newCourseSlots,
      slotNames: slotNames
    };

    setCourses([...courses, newCourse]);
    toast({ title: 'Success!', description: `Course "${courseName}" added successfully.` });
    resetState();
  };

  const handleDeleteCourse = (courseId) => {
    setCourses(courses.filter(c => c.id !== courseId));
    toast({ title: 'Deleted', description: 'Course removed from timetable.', variant: 'destructive' });
  };

  const renderContent = () => {
    switch (stage) {
      case 'add':
        return (
          <div className="space-y-4 p-4">
            <h3 className="font-bold text-white">Add a New Course</h3>
            <Input placeholder="Course Name (e.g., Intro to AI)" value={courseName} onChange={e => setCourseName(e.target.value)} />
            <Input placeholder="Slots (e.g., A1+TA1)" value={slotsInput} onChange={e => setSlotsInput(e.target.value)} />
            <Input placeholder="Professor (Optional)" value={professor} onChange={e => setProfessor(e.target.value)} />
            <div className="flex gap-2">
              <Button onClick={handleAddCourse} className="w-full bg-cyan-500 hover:bg-cyan-600 text-black">Add Course</Button>
              <Button onClick={() => setStage('menu')} variant="ghost" className="w-full">Back</Button>
            </div>
          </div>
        );
      case 'delete':
        return (
          <div className="space-y-3 p-4">
            <h3 className="font-bold text-white">Delete a Course</h3>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {courses.length > 0 ? courses.map(course => (
                <div key={course.id} className="flex justify-between items-center bg-gray-700/50 p-2 rounded">
                  <div>
                    <p className="font-semibold">{course.subject}</p>
                    <p className="text-xs text-gray-400">{course.slotNames.join(' + ')}</p>
                  </div>
                  <Button onClick={() => handleDeleteCourse(course.id)} size="icon" variant="ghost"><Trash className="w-4 h-4 text-red-400" /></Button>
                </div>
              )) : <p className="text-gray-400 text-sm text-center">No courses to delete.</p>}
            </div>
            <Button onClick={() => setStage('menu')} variant="ghost" className="w-full">Back</Button>
          </div>
        );
      default: // 'menu'
        return (
          <div className="space-y-3 p-4">
            <p className="font-bold text-lg text-center text-white">How can I help you?</p>
            <Button onClick={() => setStage('add')} className="w-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 hover:bg-cyan-500/30">
              <Plus className="w-4 h-4 mr-2" /> Insert a new course
            </Button>
            <Button onClick={() => setStage('delete')} className="w-full bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30">
              <Trash className="w-4 h-4 mr-2" /> Delete an existing course
            </Button>
          </div>
        );
    }
  };

  return (
    <>
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.5, type: 'spring' }}
      >
        <Button onClick={() => setIsOpen(!isOpen)} size="icon" className="rounded-full w-16 h-16 bg-cyan-500 hover:bg-cyan-600 shadow-lg shadow-cyan-500/30">
          <AnimatePresence>
            {isOpen ? <X key="close" /> : <Bot key="bot" />}
          </AnimatePresence>
        </Button>
      </motion.div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.8 }}
            transition={{ type: 'spring', stiffness: 200, damping: 25 }}
            className="fixed bottom-24 right-6 z-40 w-[350px] rounded-lg glassmorphism shadow-2xl"
          >
            {renderContent()}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Chatbot;
