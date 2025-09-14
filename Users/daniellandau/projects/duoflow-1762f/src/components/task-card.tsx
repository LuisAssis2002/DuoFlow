
'use client';

import type { Partnership, Task } from '@/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, Circle, MoreVertical, Pencil, Trash2 } from 'lucide-react';
import { formatDistanceToNow, isPast } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import * as React from 'react';

interface TaskCardProps {
  task: Task;
  partnership: Partnership;
  onTaskUpdate: (task: Task) => void;
  onTaskDelete: (taskId: string) => void;
  onEditTask: (task: Task) => void;
}

const difficultyVariant: Record<Task['difficulty'], 'default' | 'secondary' | 'outline' | 'destructive'> = {
  Rotineira: 'outline',
  Fácil: 'secondary',
  Média: 'default',
  Difícil: 'destructive',
};

const difficultyColorClasses: Record<Task['difficulty'], string> = {
  Rotineira: 'bg-blue-100 text-blue-800 border-blue-200',
  Fácil: 'bg-green-100 text-green-800 border-green-200',
  Média: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  Difícil: 'bg-red-100 text-red-800 border-red-200',
};

export function TaskCard({ task, partnership, onTaskUpdate, onTaskDelete, onEditTask }: TaskCardProps) {
  const assignedUser = partnership.members.find((m) => m.id === task.assignedTo);
  const isOverdue = isPast(new Date(task.endDate)) && task.status === 'Pendente';
  const [isCompleted, setIsCompleted] = React.useState(task.status === 'Concluída');

  React.useEffect(() => {
    setIsCompleted(task.status === 'Concluída');
  }, [task.status]);

  const handleToggleStatus = () => {
    const newStatus = isCompleted ? 'Pendente' : 'Concluída';
    const completedAt = newStatus === 'Concluída' ? new Date().toISOString() : null;
    
    // Optimistic update
    setIsCompleted(!isCompleted);
    
    // Simulate API call and potential move
    setTimeout(() => {
        onTaskUpdate({ ...task, status: newStatus, completedAt });
    }, 300); // Small delay to allow animation
  };

  const timeText = () => {
    if (task.status === 'Concluída') {
        if(task.completedAt) {
            return `Concluída ${formatDistanceToNow(new Date(task.completedAt), { addSuffix: true, locale: ptBR })}`;
        }
        return 'Concluída';
    }
    const distance = formatDistanceToNow(new Date(task.endDate), { addSuffix: true, locale: ptBR });
    return isOverdue ? `Atrasada ${distance}` : `Vence ${distance}`;
  };

  return (
    <Card className={cn(
        "flex flex-col transition-all duration-300", 
        isCompleted ? 'bg-card/60 opacity-70' : 'hover:shadow-lg',
        isCompleted && 'line-through'
    )}>
      <CardHeader className="flex-row items-start justify-between gap-4">
        <div className="space-y-1.5">
          <CardTitle className="text-lg leading-tight">{task.title}</CardTitle>
          <CardDescription className={cn("text-xs", isOverdue && "text-destructive font-semibold")}>{timeText()}</CardDescription>
        </div>
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0">
                    <MoreVertical className="h-5 w-5" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onEditTask(task)}>
                    <Pencil className="mr-2 h-4 w-4" />
                    Editar
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onTaskDelete(task.id)} className="text-destructive focus:bg-destructive/10 focus:text-destructive">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Excluir
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent className="flex-grow space-y-4">
        <p className="text-sm text-muted-foreground line-clamp-3">{task.description}</p>
        <Badge 
          variant="outline" 
          className={cn("capitalize", difficultyColorClasses[task.difficulty])}
        >
          {task.difficulty}
        </Badge>
      </CardContent>
      <CardFooter className="flex justify-between items-center border-t px-6 py-3 mt-4">
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={assignedUser?.photoURL} alt={assignedUser?.displayName} data-ai-hint="person portrait" />
            <AvatarFallback>{assignedUser?.displayName.charAt(0)}</AvatarFallback>
          </Avatar>
          <span className="text-sm font-medium">{assignedUser?.displayName}</span>
        </div>
        <button onClick={handleToggleStatus} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md p-2 -m-2">
          {isCompleted ? (
            <>
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span className="font-semibold">Concluída</span>
            </>
          ) : (
            <>
              <Circle className="h-5 w-5" />
              <span>Marcar como concluída</span>
            </>
          )}
        </button>
      </CardFooter>
    </Card>
  );
}
