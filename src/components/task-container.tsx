'use client';

import * as React from 'react';
import type { Partnership, Task } from '@/types';
import { Button } from '@/components/ui/button';
import { PlusCircle, Plus, List, Calendar } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
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
  const [filter, setFilter] = React.useState<Filter>('all');
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

  const filteredTasks = React.useMemo(() => {
    if (filter === 'me') {
      return tasks.filter((task) => task.assignedTo === user?.uid);
    }
    if (filter === 'partner') {
      return tasks.filter((task) => task.assignedTo !== user?.uid);
    }
    return tasks;
  }, [tasks, filter, user?.uid]);

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
            tasks={filteredTasks}
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
            tasks={filteredTasks}
            partnership={partnership}
            onEditTask={handleOpenForm}
            onDeleteTask={onTaskDelete}
            onDayClick={(day) => setSelectedDay(day)}
        />
    }
    return <TaskList 
        tasks={filteredTasks} 
        partnership={partnership} 
        onTaskUpdate={onTaskUpdate} 
        onTaskDelete={onTaskDelete} 
        onEditTask={handleOpenForm}
      />
  }

  return (
    <div className="space-y-8 relative pb-20 md:pb-0">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <Tabs value={view} onValueChange={(value) => { setView(value as View); setSelectedDay(null); }} className="self-start md:self-center">
          <TabsList>
            <TabsTrigger value="list"><List className="mr-2 h-4 w-4 sm:hidden md:inline-block" />Lista</TabsTrigger>
            <TabsTrigger value="calendar"><Calendar className="mr-2 h-4 w-4 sm:hidden md:inline-block"/>Calendário</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex-grow flex justify-start md:justify-center">
          <RadioGroup defaultValue="all" onValueChange={(value: Filter) => setFilter(value)} className="flex items-center gap-4 md:gap-6">
              <div className="flex items-center space-x-2">
              <RadioGroupItem value="all" id="r-all" />
              <Label htmlFor="r-all" className="cursor-pointer">Todas</Label>
              </div>
              <div className="flex items-center space-x-2">
              <RadioGroupItem value="me" id="r-me" />
              <Label htmlFor="r-me" className="cursor-pointer">Minhas</Label>
              </div>
              <div className="flex items-center space-x-2">
              <RadioGroupItem value="partner" id="r-partner" />
              <Label htmlFor="r-partner" className="cursor-pointer">Dele(a)</Label>
              </div>
          </RadioGroup>
        </div>

        <Button onClick={() => handleOpenForm()} className="hidden md:inline-flex shadow-sm hover:shadow-md transition-shadow">
          <PlusCircle className="mr-2 h-4 w-4" />
          Nova Tarefa
        </Button>
      </div>
      
      <div className="mt-6">
        {renderContent()}
      </div>

      <Button onClick={() => handleOpenForm()} className="md:hidden fixed bottom-6 right-6 h-16 w-16 rounded-full shadow-lg z-30 flex items-center justify-center bg-primary hover:bg-primary/90">
            <Plus className="h-8 w-8 text-primary-foreground" />
      </Button>

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
