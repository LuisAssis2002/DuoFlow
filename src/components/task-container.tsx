'use client';

import * as React from 'react';
import type { Partnership, Task, UserProfile } from '@/types';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { TaskList } from './task-list';
import { TaskCalendar } from './task-calendar';
import { TaskForm } from './task-form';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useAuth } from '@/hooks/use-auth';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface TaskContainerProps {
  partnership: Partnership;
  onTaskAdd: (task: Omit<Task, 'id' | 'createdBy'>) => Promise<void>;
  onTaskUpdate: (task: Task) => Promise<void>;
  onTaskDelete: (taskId: string) => Promise<void>;
}

type Filter = 'all' | 'me' | 'partner';

export function TaskContainer({ partnership, onTaskAdd, onTaskUpdate, onTaskDelete }: TaskContainerProps) {
  const [tasks, setTasks] = React.useState<Task[]>([]);
  const [filter, setFilter] = React.useState<Filter>('all');
  const [isFormOpen, setIsFormOpen] = React.useState(false);
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

  const handleOpenForm = () => setIsFormOpen(true);
  const handleCloseForm = () => setIsFormOpen(false);

  return (
    <div className="space-y-6">
      <Tabs defaultValue="list">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <TabsList>
            <TabsTrigger value="list">Lista</TabsTrigger>
            <TabsTrigger value="calendar">Calendário</TabsTrigger>
          </TabsList>

          <RadioGroup defaultValue="all" onValueChange={(value: Filter) => setFilter(value)} className="flex items-center gap-4">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="all" id="r-all" />
              <Label htmlFor="r-all">Todas</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="me" id="r-me" />
              <Label htmlFor="r-me">Minhas Tarefas</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="partner" id="r-partner" />
              <Label htmlFor="r-partner">Tarefas do Parceiro</Label>
            </div>
          </RadioGroup>

          <Button onClick={handleOpenForm}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Nova Tarefa
          </Button>
        </div>

        <TabsContent value="list" className="mt-6">
          <TaskList tasks={filteredTasks} partnership={partnership} onTaskUpdate={onTaskUpdate} onTaskDelete={onTaskDelete} />
        </TabsContent>
        <TabsContent value="calendar" className="mt-6">
          <TaskCalendar tasks={filteredTasks} partnership={partnership} />
        </TabsContent>
      </Tabs>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Criar Nova Tarefa</DialogTitle>
          </DialogHeader>
          <TaskForm
            partnership={partnership}
            onTaskCreated={(newTask) => {
              onTaskAdd(newTask);
              handleCloseForm();
            }}
            onCancel={handleCloseForm}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
