'use client';

import * as React from 'react';
import type { Partnership, Task } from '@/types';
import { AppHeader } from '@/components/header';
import { TaskContainer } from '@/components/task-container';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Users } from 'lucide-react';

interface DashboardProps {
  initialData: Partnership;
}

export function Dashboard({ initialData }: DashboardProps) {
  const [partnership, setPartnership] = React.useState<Partnership>(initialData);
  const isPaired = partnership && partnership.members.length > 1;

  const handleTaskUpdate = (updatedTask: Task) => {
    setPartnership((prev) => ({
      ...prev,
      tasks: prev.tasks.map((task) => (task.id === updatedTask.id ? updatedTask : task)),
    }));
  };

  const handleTaskAdd = (newTask: Task) => {
    setPartnership((prev) => ({
      ...prev,
      tasks: [...prev.tasks, newTask],
    }));
  };

  const handleTaskDelete = (taskId: string) => {
    setPartnership((prev) => ({
      ...prev,
      tasks: prev.tasks.filter((task) => task.id !== taskId),
    }));
  };
  
  // In a real app with Firebase, you'd use onSnapshot listeners here
  // to automatically update the state in real-time.

  return (
    <div className="flex min-h-screen w-full flex-col">
      <AppHeader partnership={partnership} />
      <div className="container mx-auto px-4 py-8">
        {isPaired ? (
            <TaskContainer
            partnership={partnership}
            onTaskAdd={handleTaskAdd}
            onTaskUpdate={handleTaskUpdate}
            onTaskDelete={handleTaskDelete}
            />
        ) : (
            <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted bg-card p-12 text-center">
                <Users className="h-12 w-12 text-muted-foreground" />
                <h2 className="mt-4 text-xl font-semibold">Você ainda não está pareado</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                    Para usar o DuoFlow, você precisa convidar seu parceiro.
                </p>
                <Button asChild className="mt-6">
                    <Link href="/pair">Convidar Parceiro</Link>
                </Button>
          </div>
        )}
      </div>
    </div>
  );
}
