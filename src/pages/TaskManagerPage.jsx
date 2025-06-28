
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Trash2, Edit, Save, BarChart2, Download } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Link } from 'react-router-dom';

const TaskManagerPage = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ slot: '', professor: '' });
  const [editingId, setEditingId] = useState(null);
  const [editingTask, setEditingTask] = useState({ slot: '', professor: '' });
  const { toast } = useToast();

  useEffect(() => {
    const savedTasks = localStorage.getItem('ffcs-tasks');
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('ffcs-tasks', JSON.stringify(tasks));
  }, [tasks]);

  const handleAddTask = () => {
    if (!newTask.slot.trim() || !newTask.professor.trim()) {
      toast({ title: 'Error', description: 'Please fill in both slot and professor.', variant: 'destructive' });
      return;
    }
    setTasks([...tasks, { id: Date.now(), ...newTask }]);
    setNewTask({ slot: '', professor: '' });
    toast({ title: 'Success', description: 'Task added successfully.' });
  };

  const handleDeleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
    toast({ title: 'Success', description: 'Task deleted.', variant: 'destructive' });
  };

  const handleEditTask = (task) => {
    setEditingId(task.id);
    setEditingTask({ slot: task.slot, professor: task.professor });
  };
  
  const handleSaveTask = (id) => {
    setTasks(tasks.map(task => (task.id === id ? { ...task, ...editingTask } : task)));
    setEditingId(null);
    toast({ title: 'Success', description: 'Task updated.' });
  };

  const saveTasksToFile = () => {
    const fileContent = tasks.map(task => `Slot/Course: ${task.slot}\nProfessor(s): ${task.professor}\n------------------`).join('\n\n');
    const blob = new Blob([fileContent], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'ffcs_task_list.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast({ title: 'Success', description: 'Your task list has been saved.' });
  };

  return (
    <>
      <Helmet>
        <title>Task Manager - FFCS Planner</title>
        <meta name="description" content="Manage your course and professor selections for the upcoming semester." />
      </Helmet>
      <div className="space-y-8">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h1 className="text-3xl font-bold glow-text">Professor & Slot Planner</h1>
          <p className="text-gray-400">Keep a record of your desired courses and professors for course registration.</p>
        </motion.div>

        <Card className="glassmorphism">
            <CardHeader>
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle>My Selections</CardTitle>
                        <CardDescription>Add your preferred course slots and professors.</CardDescription>
                    </div>
                    <Button onClick={saveTasksToFile} variant="outline" className="text-cyan-400 border-cyan-400 hover:bg-cyan-400/10 hover:text-cyan-300">
                        <Download className="w-4 h-4 mr-2" /> Save to PC
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex flex-col md:flex-row gap-4">
                    <Input placeholder="Slot(s) (e.g., A1+TA1)" value={newTask.slot} onChange={(e) => setNewTask({ ...newTask, slot: e.target.value })} />
                    <Input placeholder="Professor(s)" value={newTask.professor} onChange={(e) => setNewTask({ ...newTask, professor: e.target.value })} />
                    <Button onClick={handleAddTask} className="bg-cyan-500 hover:bg-cyan-600 text-black">
                        <Plus className="w-4 h-4 mr-2" /> Add
                    </Button>
                </div>
                <div className="rounded-md border border-gray-700 max-h-96 overflow-y-auto">
                  <Table>
                      <TableHeader className="sticky top-0 bg-card/80 backdrop-blur-sm">
                          <TableRow>
                              <TableHead className="text-white">Slot / Course</TableHead>
                              <TableHead className="text-white">Professor(s)</TableHead>
                              <TableHead className="text-right text-white">Actions</TableHead>
                          </TableRow>
                      </TableHeader>
                      <TableBody>
                          {tasks.length > 0 ? tasks.map(task => (
                              <TableRow key={task.id}>
                                  <TableCell>
                                    {editingId === task.id ? <Input value={editingTask.slot} onChange={e => setEditingTask({...editingTask, slot: e.target.value})}/> : task.slot}
                                  </TableCell>
                                  <TableCell>
                                    {editingId === task.id ? <Input value={editingTask.professor} onChange={e => setEditingTask({...editingTask, professor: e.target.value})}/> : task.professor}
                                  </TableCell>
                                  <TableCell className="text-right">
                                      {editingId === task.id ? (
                                          <Button onClick={() => handleSaveTask(task.id)} size="icon" variant="ghost"><Save className="w-4 h-4 text-green-400" /></Button>
                                      ) : (
                                          <Button onClick={() => handleEditTask(task)} size="icon" variant="ghost"><Edit className="w-4 h-4 text-yellow-400" /></Button>
                                      )}
                                      <Button onClick={() => handleDeleteTask(task.id)} size="icon" variant="ghost"><Trash2 className="w-4 h-4 text-red-400" /></Button>
                                  </TableCell>
                              </TableRow>
                          )) : (
                            <TableRow>
                                <TableCell colSpan={3} className="text-center text-gray-500 py-8">
                                    No tasks yet. Add your first selection above!
                                </TableCell>
                            </TableRow>
                          )}
                      </TableBody>
                  </Table>
                </div>
            </CardContent>
        </Card>
      </div>
    </>
  );
};

export default TaskManagerPage;
