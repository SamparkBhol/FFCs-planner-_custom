
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Trash2, Edit, Save, BarChart2, BrainCircuit } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from '@/components/ui/use-toast';

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

  const showToast = () => {
    toast({
      title: "🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀",
    });
  };

  return (
    <>
      <Helmet>
        <title>Task Manager - FFCS Planner AI</title>
        <meta name="description" content="Manage your course and professor selections for the upcoming semester." />
      </Helmet>
      <div className="space-y-8">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h1 className="text-3xl font-bold glow-text">Professor & Slot Planner</h1>
          <p className="text-gray-400">Keep a record of your desired courses and professors for course registration.</p>
        </motion.div>

        <Tabs defaultValue="manager">
            <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="manager">Task Manager</TabsTrigger>
                <TabsTrigger value="graph" onClick={showToast}>Analytics</TabsTrigger>
                <TabsTrigger value="ai" onClick={showToast}>AI Suggestions</TabsTrigger>
            </TabsList>
            <TabsContent value="manager">
                <Card className="glassmorphism">
                    <CardHeader>
                        <CardTitle>My Selections</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex gap-4">
                            <Input placeholder="Slot(s) (e.g., A1+TA1)" value={newTask.slot} onChange={(e) => setNewTask({ ...newTask, slot: e.target.value })} />
                            <Input placeholder="Professor(s)" value={newTask.professor} onChange={(e) => setNewTask({ ...newTask, professor: e.target.value })} />
                            <Button onClick={handleAddTask} className="bg-cyan-500 hover:bg-cyan-600 text-black">
                                <Plus className="w-4 h-4 mr-2" /> Add
                            </Button>
                        </div>
                        <div className="rounded-md border border-gray-700">
                          <Table>
                              <TableHeader>
                                  <TableRow>
                                      <TableHead className="text-white">Slot / Course</TableHead>
                                      <TableHead className="text-white">Professor(s)</TableHead>
                                      <TableHead className="text-right text-white">Actions</TableHead>
                                  </TableRow>
                              </TableHeader>
                              <TableBody>
                                  {tasks.map(task => (
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
                                  ))}
                              </TableBody>
                          </Table>
                        </div>
                    </CardContent>
                </Card>
            </TabsContent>
            <TabsContent value="graph">
                <Card className="glassmorphism flex flex-col items-center justify-center p-8 min-h-[400px]">
                    <BarChart2 className="w-16 h-16 text-cyan-500 mb-4" />
                    <h3 className="text-2xl font-bold">Coming Soon!</h3>
                    <p className="text-gray-400">Advanced analytics to visualize your schedule workload.</p>
                </Card>
            </TabsContent>
            <TabsContent value="ai">
                <Card className="glassmorphism flex flex-col items-center justify-center p-8 min-h-[400px]">
                    <BrainCircuit className="w-16 h-16 text-fuchsia-500 mb-4" />
                    <h3 className="text-2xl font-bold">Coming Soon!</h3>
                    <p className="text-gray-400">AI-powered suggestions to help you build a clash-free and balanced timetable.</p>
                </Card>
            </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default TaskManagerPage;
