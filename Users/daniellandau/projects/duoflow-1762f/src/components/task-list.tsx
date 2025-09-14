
'use client';

import * as React from 'react';
import type { Partnership, Task } from '@/types';
import { TaskCard } from './task-card';
import { subDays } from 'date-fns';
import { ClipboardList } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/use-auth';

interface TaskListProps {
  tasks: Task[];
  partnership: Partnership;
  onTaskUpdate: (task: Task) => void;
  onTaskDelete: (taskId: string) => void;
  onEditTask: (task: Task) => void;
}

type Filter = 'all' | 'me' | 'partner';

export function TaskList({ tasks, partnership, onTaskUpdate, onTaskDelete, onEditTask }: TaskListProps) {
  const [filter, setFilter] = React.useState<Filter>('all');
  const { user } = useAuth();
  
  const filteredTasks = React.useMemo(() => {
    if (filter === 'me') {
      return tasks.filter((task) => task.assignedTo === user?.uid);
    }
    if (filter === 'partner') {
      return tasks.filter((task) => task.assignedTo !== user?.uid);
    }
    return tasks;
  }, [tasks, filter, user?.uid]);
  
  const pendingTasks = filteredTasks
    .filter((task) => task.status === 'Pendente')
    .sort((a, b) => new Date(a.endDate).getTime() - new Date(b.endDate).getTime());
  
  const thirtyDaysAgo = subDays(new Date(), 30);
  const completedTasks = filteredTasks
    .filter((task) => 
        task.status === 'Concluída' && 
        task.completedAt && 
        new Date(task.completedAt) > thirtyDaysAgo
    )
    .sort((a, b) => new Date(b.completedAt!).getTime() - new Date(a.completedAt!).getTime());

  return (
    <div className="space-y-8">
      <div>
        <div className="mb-6 flex flex-col md:flex-row justify-between items-baseline gap-4">
          <h2 className="text-2xl font-semibold">Pendentes</h2>
          <RadioGroup value={filter} onValueChange={(value: Filter) => setFilter(value)} className="flex items-center gap-4 md:gap-6">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="all" id="r-all-pending" />
                <Label htmlFor="r-all-pending" className="cursor-pointer">Todas</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="me" id="r-me-pending" />
                <Label htmlFor="r-me-pending" className="cursor-pointer">Minhas</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="partner" id="r-partner-pending" />
                <Label htmlFor="r-partner-pending" className="cursor-pointer">Dele(a)</Label>
              </div>
          </RadioGroup>
        </div>

        {pendingTasks.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {pendingTasks.map((task) => (
              <TaskCard 
                key={task.id} 
                task={task} 
                partnership={partnership} 
                onTaskUpdate={onTaskUpdate} 
                onTaskDelete={onTaskDelete}
                onEditTask={onEditTask}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-lg bg-card shadow-sm p-12 text-center">
             <div className="rounded-full bg-secondary p-4">
                <ClipboardList className="h-10 w-10 text-primary" />
             </div>
            <p className="mt-4 text-base text-muted-foreground">Nenhuma tarefa pendente. Hora de relaxar ou criar uma nova!</p>
          </div>
        )}
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-6">Concluídas (Últimos 30 dias)</h2>
        {completedTasks.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {completedTasks.map((task) => (
              <TaskCard 
                key={task.id} 
                task={task} 
                partnership={partnership} 
                onTaskUpdate={onTaskUpdate} 
                onTaskDelete={onTaskDelete}
                onEditTask={onEditTask}
              />
            ))}
          </div>
        ) : (
           <div className="flex flex-col items-center justify-center rounded-lg bg-card shadow-sm p-12 text-center">
             <div className="rounded-full bg-secondary p-4">
                <ClipboardList className="h-10 w-10 text-primary" />
             </div>
            <p className="mt-4 text-base text-muted-foreground">Nenhuma tarefa concluída recentemente.</p>
          </div>
        )}
      </div>
    </div>
  );
}
