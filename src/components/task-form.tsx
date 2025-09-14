'use client';

import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { Partnership, Task } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';

interface TaskFormProps {
  task?: Task;
  partnership: Partnership;
  onSubmit: (data: Omit<Task, 'id' | 'createdBy' | 'status' | 'completedAt'>) => void;
  onCancel: () => void;
}

const formSchema = z.object({
  title: z.string().min(3, { message: 'O título deve ter pelo menos 3 caracteres.' }),
  description: z.string().optional(),
  type: z.enum(['Única', 'Progressiva']),
  difficulty: z.enum(['Rotineira', 'Fácil', 'Média', 'Difícil']),
  assignedTo: z.string(),
  endDate: z.date({ required_error: 'A data final é obrigatória.' }),
  startDate: z.date().optional(),
}).refine(data => {
    if (data.type === 'Progressiva') {
        return !!data.startDate;
    }
    return true;
}, {
    message: "A data de início é obrigatória para tarefas progressivas.",
    path: ["startDate"],
}).refine(data => {
    if (data.type === 'Progressiva' && data.startDate) {
        return data.endDate >= data.startDate;
    }
    return true;
}, {
    message: "A data final deve ser igual ou posterior à data de início.",
    path: ["endDate"],
});

type FormValues = z.infer<typeof formSchema>;

export function TaskForm({ task, partnership, onSubmit, onCancel }: TaskFormProps) {
  const { toast } = useToast();
  const { user } = useAuth();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: task?.title ?? '',
      description: task?.description ?? '',
      type: task?.type ?? 'Única',
      difficulty: task?.difficulty ?? 'Fácil',
      assignedTo: task?.assignedTo ?? user?.uid,
      endDate: task ? new Date(task.endDate) : undefined,
      startDate: task?.startDate ? new Date(task.startDate) : undefined,
    },
  });
  
  React.useEffect(() => {
    if (task) {
      form.reset({
        title: task.title,
        description: task.description,
        type: task.type,
        difficulty: task.difficulty,
        assignedTo: task.assignedTo,
        endDate: new Date(task.endDate),
        startDate: task.startDate ? new Date(task.startDate) : undefined,
      });
    } else {
        form.reset({
            title: '',
            description: '',
            type: 'Única',
            difficulty: 'Fácil',
            assignedTo: user?.uid,
            endDate: undefined,
            startDate: undefined,
        });
    }
  }, [task, form, user]);

  const taskType = form.watch('type');

  function handleFormSubmit(values: FormValues) {
    const submissionData = {
        ...values,
        description: values.description ?? '',
        startDate: values.startDate ? values.startDate.toISOString() : null,
        endDate: values.endDate.toISOString(),
    };
    
    onSubmit(submissionData);
    
    toast({
      title: 'Sucesso!',
      description: `Tarefa "${values.title}" foi ${task ? 'atualizada' : 'criada'}.`,
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Título</FormLabel>
              <FormControl><Input placeholder="Ex: Comprar mantimentos" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição</FormLabel>
              <FormControl><Textarea placeholder="Detalhes sobre a tarefa..." {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Selecione o tipo" /></SelectTrigger></FormControl>
                    <SelectContent>
                      <SelectItem value="Única">Única</SelectItem>
                      <SelectItem value="Progressiva">Progressiva</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="difficulty"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dificuldade</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Selecione a dificuldade" /></SelectTrigger></FormControl>
                    <SelectContent>
                      <SelectItem value="Rotineira">Rotineira</SelectItem>
                      <SelectItem value="Fácil">Fácil</SelectItem>
                      <SelectItem value="Média">Média</SelectItem>
                      <SelectItem value="Difícil">Difícil</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
        </div>

        {taskType === 'Progressiva' && (
            <div className="grid grid-cols-2 gap-4">
                <FormField
                    control={form.control}
                    name="startDate"
                    render={({ field }) => (
                        <FormItem className="flex flex-col">
                        <FormLabel>Data de Início</FormLabel>
                        <Popover>
                            <PopoverTrigger asChild>
                            <FormControl>
                                <Button
                                variant={"outline"}
                                className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                                >
                                {field.value ? format(field.value, 'PPP', { locale: ptBR }) : <span>Escolha uma data</span>}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                            </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                            <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                            </PopoverContent>
                        </Popover>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name="endDate"
                    render={({ field }) => (
                        <FormItem className="flex flex-col">
                        <FormLabel>Data Final</FormLabel>
                        <Popover>
                            <PopoverTrigger asChild>
                            <FormControl>
                                <Button
                                variant={"outline"}
                                className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                                >
                                {field.value ? format(field.value, 'PPP', { locale: ptBR }) : <span>Escolha uma data</span>}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                            </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                            <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                            </PopoverContent>
                        </Popover>
                        <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
        )}

        {taskType === 'Única' && (
            <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                    <FormItem className="flex flex-col">
                    <FormLabel>Data Limite</FormLabel>
                    <Popover>
                        <PopoverTrigger asChild>
                        <FormControl>
                            <Button
                            variant={"outline"}
                            className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                            >
                            {field.value ? format(field.value, 'PPP', { locale: ptBR }) : <span>Escolha uma data</span>}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                        </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                        <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                        </PopoverContent>
                    </Popover>
                    <FormMessage />
                    </FormItem>
                )}
            />
        )}
        
        <FormField
          control={form.control}
          name="assignedTo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Atribuir para</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl><SelectTrigger><SelectValue placeholder="Selecione um membro" /></SelectTrigger></FormControl>
                <SelectContent>
                  {partnership.members.map((member) => (
                    <SelectItem key={member.id} value={member.id}>{member.displayName}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onCancel}>Cancelar</Button>
            <Button type="submit">{task ? 'Salvar Alterações' : 'Criar Tarefa'}</Button>
        </div>
      </form>
    </Form>
  );
}
