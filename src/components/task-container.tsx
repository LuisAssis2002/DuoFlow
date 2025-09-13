'use client';

import * as React from 'react';
import type { Partnership, Task, User } from '@/types';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { TaskList } from './task-list';
import { TaskCalendar } from './task-calendar';
import { TaskForm } from './task-form';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface TaskContainerProps {
  partnership: Partnership;
  onTaskAdd: (task: Task) => void;
  onTaskUpdate: (task: Task) => void;
  onTaskDelete: (taskId: string) => void;
}

type Filter = 'all' | 'me' | 'partner';

export function TaskContainer({ partnership, onTaskAdd, onTaskUpdate, onTaskDelete }: TaskContainerProps) {
  const [filter, setFilter] = React.useState<Filter>('all');
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  
  // Assuming 'user1' is the current user for demonstration purposes
  const currentUserId = partnership.members[0].id;

  const filteredTasks = React.useMemo(() => {
    if (filter === 'me') {
      return partnership.tasks.filter((task) => task.assignedTo === currentUserId);
    }
    if (filter === 'partner') {
      return partnership.tasks.filter((task) => task.assignedTo !== currentUserId);
    }
    return partnership.tasks;
  }, [partnership.tasks, filter, currentUserId]);

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
