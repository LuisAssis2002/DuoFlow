
'use client';

import * as React from 'react';
import type { Partnership, Task } from '@/types';
import { Button } from '@/components/ui/button';
import { PlusCircle, Plus, List, Calendar } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TaskList } from './task-list';
import { TaskCalendar } from './task-calendar';
import { TaskForm } from './task-form';
import { DayView } from './day-view';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useAuth } from '@/hooks/use-auth';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { addDays, subDays } from 'date-fns';

interface TaskContainerProps {
  partnership: Partnership;
  onTaskAdd: (task: Omit<Task, 'id' | 'createdBy' | 'status'>) => Promise<void>;
  onTaskUpdate: (task: Task) => Promise<void>;
  onTaskDelete: (taskId: string) => Promise<void>;
}

type Filter = 'all' | 'me' | 'partner';
type View = 'list' | 'calendar';

export function TaskContainer({ partnership, onTaskAdd, onTaskUpdate, onTaskDelete }: TaskContainerProps) {
  const [tasks, setTasks] = React.useState<Task[]>([]);
  const [view, setView] = React.useState<View>('list');
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [editingTask, setEditingTask] = React.useState<Task | undefined>(undefined);
  const [selectedDay, setSelectedDay] = React.useState<Date | null>(null);
  const { user } = useAuth();
  
  React.useEffect(() => {
    if (!partnership?.id) return;
    const q = query(collection(db, "partnerships", partnership.id, "tasks"), orderBy("endDate", "asc"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const tasksData: Task[] = [];
      querySnapshot.forEach((doc) => {
        tasksData.push({ id: doc.id, ...doc.data() } as Task);
      });
      setTasks(tasksData);
    });

    return () => unsubscribe();
  }, [partnership?.id]);

  const handleOpenForm = (task?: Task) => {
    setEditingTask(task);
    setIsFormOpen(true);
  };
  
  const handleCloseForm = () => {
    setEditingTask(undefined);
    setIsFormOpen(false);
  };

  const renderContent = () => {
    if (view === 'calendar' && selectedDay) {
        return <DayView 
            selectedDay={selectedDay}
            tasks={tasks} // DayView will handle its own filtering
            partnership={partnership}
            onTaskUpdate={onTaskUpdate}
            onTaskDelete={onTaskDelete}
            onEditTask={handleOpenForm}
            onClose={() => setSelectedDay(null)}
            onNextDay={() => setSelectedDay(addDays(selectedDay, 1))}
            onPrevDay={() => setSelectedDay(subDays(selectedDay, 1))}
        />;
    }
    if (view === 'calendar') {
        return <TaskCalendar
            tasks={tasks}
            partnership={partnership}
            onEditTask={handleOpenForm}
            onDeleteTask={onTaskDelete}
            onDayClick={(day) => setSelectedDay(day)}
        />
    }
    return <TaskList 
        tasks={tasks} // TaskList will handle its own filtering
        partnership={partnership} 
        onTaskUpdate={onTaskUpdate} 
        onTaskDelete={onTaskDelete} 
        onEditTask={handleOpenForm}
      />
  }

  return (
    <div className="space-y-4 md:space-y-8 relative pb-20 md:pb-0">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 md:gap-6">
        <Tabs value={view} onValueChange={(value) => { setView(value as View); setSelectedDay(null); }} className="w-full md:w-auto">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="list"><List className="mr-2 h-4 w-4 sm:hidden md:inline-block" />Lista</TabsTrigger>
            <TabsTrigger value="calendar"><Calendar className="mr-2 h-4 w-4 sm:hidden md:inline-block"/>Calendário</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="hidden md:flex flex-grow justify-center">
            {/* Desktop filter placeholder - logic moved to lists */}
        </div>

        <Button onClick={() => handleOpenForm()} className="hidden md:inline-flex shadow-sm hover:shadow-md transition-shadow">
          <PlusCircle className="mr-2 h-4 w-4" />
          Nova Tarefa
        </Button>
      </div>
      
      <div className="mt-2 md:mt-6">
        {renderContent()}
      </div>

      <button onClick={() => handleOpenForm()} className="md:hidden fixed bottom-6 right-6 h-16 w-16 rounded-full shadow-lg z-30 flex items-center justify-center bg-gradient-to-br from-primary to-accent text-white transition-transform hover:scale-105 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" style={{boxShadow: '0 4px 20px -5px rgba(139, 92, 246, 0.6)'}}>
            <Plus className="h-8 w-8" strokeWidth={2.5}/>
      </button>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{editingTask ? 'Editar Tarefa' : 'Criar Nova Tarefa'}</DialogTitle>
            <DialogDescription>
              {editingTask ? 'Altere os detalhes da tarefa abaixo.' : 'Preencha os detalhes da nova tarefa para seu parceiro.'}
            </DialogDescription>
          </DialogHeader>
          <TaskForm
            task={editingTask}
            partnership={partnership}
            onSubmit={(data) => {
              if (editingTask) {
                onTaskUpdate({ ...editingTask, ...data });
              } else {
                onTaskAdd(data);
              }
              handleCloseForm();
            }}
            onCancel={handleCloseForm}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
