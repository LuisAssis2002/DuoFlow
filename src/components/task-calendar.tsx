'use client';

import * as React from 'react';
import type { Partnership, Task } from '@/types';
import {
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  startOfMonth,
  startOfWeek,
  addMonths,
  subMonths,
} from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import { ChevronLeft, ChevronRight, MoreVertical, Pencil, Trash2 } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface TaskCalendarProps {
  tasks: Task[];
  partnership: Partnership;
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  onDayClick: (day: Date) => void;
}

const difficultyColors: Record<Task['difficulty'], string> = {
  Rotineira: 'bg-blue-400',
  Fácil: 'bg-green-400',
  Média: 'bg-yellow-400',
  Difícil: 'bg-red-400',
};

export function TaskCalendar({ tasks, partnership, onEditTask, onDeleteTask, onDayClick }: TaskCalendarProps) {
  const [currentDate, setCurrentDate] = React.useState(new Date());

  const firstDayOfMonth = startOfMonth(currentDate);
  const lastDayOfMonth = endOfMonth(currentDate);
  const calendarStart = startOfWeek(firstDayOfMonth);
  const calendarEnd = endOfWeek(lastDayOfMonth);
  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });
  const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  const handlePrevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const handleNextMonth = () => setCurrentDate(addMonths(currentDate, 1));

  return (
    <div className="rounded-lg border bg-card p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold capitalize">
          {format(currentDate, 'MMMM yyyy', { locale: ptBR })}
        </h2>
        <div className="space-x-2">
          <Button variant="outline" size="icon" onClick={handlePrevMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={handleNextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-px">
        {weekDays.map((day) => (
          <div key={day} className="text-center text-sm font-medium text-muted-foreground pb-2">
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 grid-rows-5 gap-px">
        {days.map((day) => {
          const tasksForDay = tasks.filter((task) => {
            if (!task.endDate) return false;
            const taskEndDate = new Date(task.endDate);
            if (task.type === 'Progressiva' && task.startDate) {
                const taskStartDate = new Date(task.startDate);
                return day >= taskStartDate && day <= taskEndDate;
            }
            return isSameDay(taskEndDate, day);
          });
          
          return (
            <button
              key={day.toString()}
              onClick={() => onDayClick(day)}
              className={cn(
                'relative flex h-28 flex-col border border-transparent bg-card p-2 text-left transition-colors hover:bg-secondary focus:z-10 focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent',
                !isSameMonth(day, currentDate) && 'text-muted-foreground opacity-50',
              )}
            >
              <span className="font-semibold">{format(day, 'd')}</span>
              <div className="mt-1 flex-grow space-y-1 overflow-y-auto">
                {tasksForDay.slice(0, 3).map(task => { // Limita a 3 tarefas para não sobrecarregar
                    return (
                        <div key={task.id} className={cn(
                            "flex w-full items-center gap-2 rounded-md p-1 text-xs",
                            task.status === 'Concluída' ? 'bg-muted/60' : 'bg-secondary'
                        )}>
                            <div className={cn("h-2 w-2 flex-shrink-0 rounded-full", difficultyColors[task.difficulty])} />
                            <p className="truncate">{task.title}</p>
                        </div>
                    )
                })}
                {tasksForDay.length > 3 && (
                     <div className="text-xs text-muted-foreground mt-1">
                        + {tasksForDay.length - 3} mais
                    </div>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
