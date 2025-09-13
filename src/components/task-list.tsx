import type { Partnership, Task } from '@/types';
import { TaskCard } from './task-card';
import { subDays } from 'date-fns';

interface TaskListProps {
  tasks: Task[];
  partnership: Partnership;
  onTaskUpdate: (task: Task) => void;
  onTaskDelete: (taskId: string) => void;
}

export function TaskList({ tasks, partnership, onTaskUpdate, onTaskDelete }: TaskListProps) {
  const pendingTasks = tasks
    .filter((task) => task.status === 'Pendente')
    .sort((a, b) => new Date(a.endDate).getTime() - new Date(b.endDate).getTime());
  
  const thirtyDaysAgo = subDays(new Date(), 30);
  const completedTasks = tasks
    .filter((task) => 
        task.status === 'Concluída' && 
        task.completedAt && 
        new Date(task.completedAt) > thirtyDaysAgo
    )
    .sort((a, b) => new Date(b.completedAt!).getTime() - new Date(a.completedAt!).getTime());

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold mb-4">Pendentes</h2>
        {pendingTasks.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {pendingTasks.map((task) => (
              <TaskCard key={task.id} task={task} partnership={partnership} onTaskUpdate={onTaskUpdate} onTaskDelete={onTaskDelete} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted bg-card p-12 text-center">
            <p className="text-muted-foreground">Nenhuma tarefa pendente. Hora de relaxar ou criar uma nova!</p>
          </div>
        )}
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Concluídas (Últimos 30 dias)</h2>
        {completedTasks.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {completedTasks.map((task) => (
              <TaskCard key={task.id} task={task} partnership={partnership} onTaskUpdate={onTaskUpdate} onTaskDelete={onTaskDelete} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted bg-card p-12 text-center">
            <p className="text-muted-foreground">Nenhuma tarefa concluída recentemente.</p>
          </div>
        )}
      </div>
    </div>
  );
}
