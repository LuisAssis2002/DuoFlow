'use client';

import * as React from 'react';
import type { Partnership, Task } from '@/types';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, ArrowLeft } from 'lucide-react';
import { format, isSameDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { TaskCard } from './task-card';
import { ClipboardList } from 'lucide-react';

interface DayViewProps {
  selectedDay: Date;
  tasks: Task[];
  partnership: Partnership;
  onTaskUpdate: (task: Task) => void;
  onTaskDelete: (taskId: string) => void;
  onEditTask: (task: Task) => void;
  onClose: () => void;
  onNextDay: () => void;
  onPrevDay: () => void;
}

export function DayView({
  selectedDay,
  tasks,
  partnership,
  onTaskUpdate,
  onTaskDelete,
  onEditTask,
  onClose,
  onNextDay,
  onPrevDay,
}: DayViewProps) {
  const tasksForDay = tasks.filter((task) => {
    if (!task.endDate) return false;
    const taskEndDate = new Date(task.endDate);
    if (task.type === 'Progressiva' && task.startDate) {
      const taskStartDate = new Date(task.startDate);
      return selectedDay >= taskStartDate && selectedDay <= taskEndDate;
    }
    return isSameDay(taskEndDate, selectedDay);
  });

  return (
    <div className="rounded-lg border bg-card p-4 md:p-6 animate-in fade-in-50">
      <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-4">
        <Button variant="ghost" onClick={onClose} className="self-start sm:self-center">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar ao Calendário
        </Button>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={onPrevDay}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-xl text-center font-bold capitalize w-48 sm:w-64">
            {format(selectedDay, "EEEE, dd 'de' MMMM", { locale: ptBR })}
          </h2>
          <Button variant="outline" size="icon" onClick={onNextDay}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {tasksForDay.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {tasksForDay.map((task) => (
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
        <div className="flex flex-col items-center justify-center rounded-lg bg-background p-12 text-center min-h-[40vh]">
          <div className="rounded-full bg-secondary p-4">
            <ClipboardList className="h-10 w-10 text-muted-foreground" />
          </div>
          <p className="mt-4 text-base text-muted-foreground">
            Nenhuma tarefa para este dia.
          </p>
        </div>
      )}
    </div>
  );
}
