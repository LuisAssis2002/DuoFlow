'use client';

import * as React from 'react';
import type { Partnership, Task } from '@/types';
import { AppHeader } from '@/components/header';
import { TaskContainer } from '@/components/task-container';

interface DashboardProps {
  initialData: Partnership;
}

export function Dashboard({ initialData }: DashboardProps) {
  const [partnership, setPartnership] = React.useState<Partnership>(initialData);

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
        <TaskContainer
          partnership={partnership}
          onTaskAdd={handleTaskAdd}
          onTaskUpdate={handleTaskUpdate}
          onTaskDelete={handleTaskDelete}
        />
      </div>
    </div>
  );
}
