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
}

const difficultyColors: Record<Task['difficulty'], string> = {
  Rotineira: 'bg-blue-400',
  Fácil: 'bg-green-400',
  Média: 'bg-yellow-400',
  Difícil: 'bg-red-400',
};

export function TaskCalendar({ tasks, partnership, onEditTask, onDeleteTask }: TaskCalendarProps) {
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
            const taskEndDate = new Date(task.endDate);
            if (task.type === 'Progressiva' && task.startDate) {
                const taskStartDate = new Date(task.startDate);
                return day >= taskStartDate && day <= taskEndDate;
            }
            return isSameDay(taskEndDate, day);
          });
          
          return (
            <div
              key={day.toString()}
              className={cn(
                'relative flex h-28 flex-col border border-transparent bg-card p-2',
                !isSameMonth(day, currentDate) && 'text-muted-foreground opacity-50',
              )}
            >
              <span className="font-semibold">{format(day, 'd')}</span>
              <div className="mt-1 flex-grow space-y-1 overflow-y-auto">
                {tasksForDay.map(task => {
                    const assignedUser = partnership.members.find(m => m.id === task.assignedTo);
                    return (
                        <Popover key={task.id}>
                            <div className={cn(
                                "flex w-full items-center gap-2 rounded-md p-1 text-xs",
                                task.status === 'Concluída' ? 'bg-muted/60' : 'bg-secondary'
                            )}>
                                <PopoverTrigger asChild>
                                    <div className="flex-grow flex items-center gap-2 cursor-pointer">
                                        <div className={cn("h-2 w-2 flex-shrink-0 rounded-full", difficultyColors[task.difficulty])} />
                                        <p className="truncate">{task.title}</p>
                                    </div>
                                </PopoverTrigger>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-6 w-6 flex-shrink-0">
                                            <MoreVertical className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem onClick={() => onEditTask(task)}>
                                            <Pencil className="mr-2 h-4 w-4" />
                                            Editar
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => onDeleteTask(task.id)} className="text-destructive focus:bg-destructive/10 focus:text-destructive">
                                            <Trash2 className="mr-2 h-4 w-4" />
                                            Excluir
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                            <PopoverContent className="w-80">
                                <div className="space-y-4">
                                    <h4 className="font-semibold leading-none">{task.title}</h4>
                                    <p className="text-sm text-muted-foreground">{task.description}</p>
                                    <div className="flex items-center justify-between">
                                        <Badge variant={task.status === 'Concluída' ? 'secondary' : 'default'}>{task.status}</Badge>
                                        <div className="flex items-center gap-2">
                                            <Avatar className="h-6 w-6">
                                                <AvatarImage src={assignedUser?.photoURL} data-ai-hint="person portrait" />
                                                <AvatarFallback>{assignedUser?.displayName.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <span className="text-xs text-muted-foreground">{assignedUser?.displayName}</span>
                                        </div>
                                    </div>
                                </div>
                            </PopoverContent>
                        </Popover>
                    )
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
