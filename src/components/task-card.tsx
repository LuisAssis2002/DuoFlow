'use client';

import type { Partnership, Task } from '@/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, Circle, MoreVertical, Trash2 } from 'lucide-react';
import { formatDistanceToNow, isPast } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

interface TaskCardProps {
  task: Task;
  partnership: Partnership;
  onTaskUpdate: (task: Task) => void;
  onTaskDelete: (taskId: string) => void;
}

const difficultyVariant: Record<Task['difficulty'], 'default' | 'secondary' | 'outline' | 'destructive'> = {
  Rotineira: 'outline',
  Fácil: 'secondary',
  Média: 'default',
  Difícil: 'destructive',
};

export function TaskCard({ task, partnership, onTaskUpdate, onTaskDelete }: TaskCardProps) {
  const assignedUser = partnership.members.find((m) => m.id === task.assignedTo);
  const isOverdue = isPast(new Date(task.endDate)) && task.status === 'Pendente';

  const handleToggleStatus = () => {
    const newStatus = task.status === 'Pendente' ? 'Concluída' : 'Pendente';
    const completedAt = newStatus === 'Concluída' ? new Date().toISOString() : null;
    onTaskUpdate({ ...task, status: newStatus, completedAt });
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
    <Card className={cn("flex flex-col transition-all hover:shadow-lg", task.status === 'Concluída' && 'bg-card/50 opacity-80')}>
      <CardHeader className="flex-row items-start justify-between">
        <div className="space-y-1.5">
          <CardTitle className="text-lg font-semibold">{task.title}</CardTitle>
          <CardDescription className={cn("text-xs", isOverdue && "text-destructive font-semibold")}>{timeText()}</CardDescription>
        </div>
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0">
                    <MoreVertical className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onTaskDelete(task.id)} className="text-destructive">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Excluir
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent className="flex-grow space-y-4">
        <p className="text-sm text-muted-foreground">{task.description}</p>
        <Badge variant={difficultyVariant[task.difficulty]}>{task.difficulty}</Badge>
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Avatar className="h-6 w-6">
            <AvatarImage src={assignedUser?.photoURL} alt={assignedUser?.displayName} data-ai-hint="person portrait" />
            <AvatarFallback>{assignedUser?.displayName.charAt(0)}</AvatarFallback>
          </Avatar>
          <span className="text-xs text-muted-foreground">{assignedUser?.displayName}</span>
        </div>
        <Button variant="ghost" size="sm" onClick={handleToggleStatus}>
          {task.status === 'Pendente' ? (
            <><Circle className="mr-2 h-4 w-4" /> Marcar como concluída</>
          ) : (
            <><CheckCircle className="mr-2 h-4 w-4 text-green-500" /> Concluída</>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
