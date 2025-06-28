
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Bot, Plus, Trash, X, Download, FileText } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { FFCS_SLOTS } from '@/data/ffcsSlots';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const Chatbot = ({ courses, setCourses, timetableRef }) => {
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
    if(courses.length <= 1) setStage('menu');
  };
  
  const downloadTimetablePDF = () => {
    if (timetableRef.current) {
      toast({ title: 'Generating PDF...', description: 'Please wait a moment.' });
      html2canvas(timetableRef.current, { backgroundColor: '#0D1117', scale: 2 }).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({ orientation: 'landscape', unit: 'px', format: [canvas.width, canvas.height] });
        pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
        pdf.save('ffcs-timetable.pdf');
        toast({ title: 'Success!', description: 'Timetable PDF has been downloaded.' });
      });
    } else {
       toast({ title: 'Error', description: 'Could not find timetable to download.', variant: 'destructive' });
    }
  };
  
  const downloadTasksPDF = () => {
     try {
      const savedTasks = localStorage.getItem('ffcs-tasks');
      const tasks = savedTasks ? JSON.parse(savedTasks) : [];
      if (tasks.length === 0) {
        toast({ title: 'No Tasks', description: 'Your task list is empty.', variant: 'destructive' });
        return;
      }
      
      const doc = new jsPDF();
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(20);
      doc.text('FFCS Task List', 105, 20, null, null, 'center');
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(12);
      
      let y = 40;
      tasks.forEach((task, index) => {
        if (y > 280) {
            doc.addPage();
            y = 20;
        }
        doc.setFont('helvetica', 'bold');
        doc.text(`Task #${index + 1}: ${task.slot}`, 14, y);
        y += 7;
        doc.setFont('helvetica', 'normal');
        doc.text(`Professor(s): ${task.professor}`, 14, y);
        y += 10;
        doc.line(14, y-5, 196, y-5);
        y+= 5;
      });

      doc.save('ffcs-task-list.pdf');
      toast({ title: 'Success!', description: 'Task List PDF has been downloaded.' });
    } catch(e) {
      toast({ title: 'Error', description: 'Could not generate tasks PDF.', variant: 'destructive' });
    }
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
            <div className="space-y-2 max-h-60 overflow-y-auto p-1">
              {courses.length > 0 ? courses.map(course => (
                <div key={course.id} className="flex justify-between items-center bg-gray-700/50 p-2 rounded">
                  <div>
                    <p className="font-semibold">{course.subject}</p>
                    <p className="text-xs text-gray-400">{course.slotNames.join(' + ')}</p>
                  </div>
                  <Button onClick={() => handleDeleteCourse(course.id)} size="icon" variant="ghost"><Trash className="w-4 h-4 text-red-400" /></Button>
                </div>
              )) : <p className="text-gray-400 text-sm text-center p-4">No courses to delete.</p>}
            </div>
            <Button onClick={() => setStage('menu')} variant="ghost" className="w-full">Back</Button>
          </div>
        );
      default: // 'menu'
        return (
          <div className="space-y-3 p-4">
            <p className="font-bold text-lg text-center text-white">How can I help you?</p>
            <Button onClick={() => setStage('add')} className="w-full justify-start bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 hover:bg-cyan-500/30">
              <Plus className="w-4 h-4 mr-2" /> Insert a new course
            </Button>
            <Button onClick={() => setStage('delete')} className="w-full justify-start bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30">
              <Trash className="w-4 h-4 mr-2" /> Delete an existing course
            </Button>
            <Button onClick={downloadTimetablePDF} className="w-full justify-start bg-purple-500/20 text-purple-300 border border-purple-500/30 hover:bg-purple-500/30">
              <Download className="w-4 h-4 mr-2" /> Download Timetable PDF
            </Button>
             <Button onClick={downloadTasksPDF} className="w-full justify-start bg-green-500/20 text-green-300 border border-green-500/30 hover:bg-green-500/30">
              <FileText className="w-4 h-4 mr-2" /> Download Task List PDF
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
        <Button onClick={() => setIsOpen(!isOpen)} size="icon" className="rounded-full w-16 h-16 bg-gradient-to-br from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 shadow-lg shadow-cyan-500/30">
          <AnimatePresence>
            {isOpen ? <motion.div key="close" initial={{rotate: -90, opacity: 0}} animate={{rotate: 0, opacity: 1}} exit={{rotate: 90, opacity: 0}}><X /></motion.div> : <motion.div key="bot" initial={{rotate: 90, opacity: 0}} animate={{rotate: 0, opacity: 1}} exit={{rotate: -90, opacity: 0}}><Bot /></motion.div>}
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
            className="fixed bottom-24 right-6 z-40 w-[350px] rounded-lg glassmorphism shadow-2xl overflow-hidden"
          >
            {renderContent()}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Chatbot;
