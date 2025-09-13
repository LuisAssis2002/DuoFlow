'use client';

import * as React from 'react';
import type { Task } from '@/types';
import { AppHeader } from '@/components/header';
import { TaskContainer } from '@/components/task-container';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Users, LogIn } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { db } from '@/lib/firebase';
import { doc, updateDoc, arrayUnion, arrayRemove, collection, addDoc, deleteDoc } from 'firebase/firestore';

export function Dashboard() {
    const { user, partnership, signIn } = useAuth();

    if (!user) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
                 <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted bg-card p-12 text-center">
                    <Users className="h-12 w-12 text-muted-foreground" />
                    <h2 className="mt-4 text-xl font-semibold">Bem-vindo ao DuoFlow</h2>
                    <p className="mt-2 text-sm text-muted-foreground">
                        Faça login para gerenciar tarefas com seu parceiro.
                    </p>
                    <Button onClick={signIn} className="mt-6">
                        <LogIn className="mr-2" />
                        Login com Google
                    </Button>
                </div>
            </div>
        )
    }

    const handleTaskUpdate = async (updatedTask: Task) => {
        if (!partnership) return;
        const taskRef = doc(db, 'partnerships', partnership.id, 'tasks', updatedTask.id);
        await updateDoc(taskRef, updatedTask);
    };

    const handleTaskAdd = async (newTask: Omit<Task, 'id' | 'createdBy'>) => {
        if (!partnership || !user) return;
        await addDoc(collection(db, 'partnerships', partnership.id, 'tasks'), {
            ...newTask,
            createdBy: user.uid
        });
    };

    const handleTaskDelete = async (taskId: string) => {
        if (!partnership) return;
        const taskRef = doc(db, 'partnerships', partnership.id, 'tasks', taskId);
        await deleteDoc(taskRef);
    };

    const partnershipReady = partnership && partnership.members.length > 1;

    return (
        <div className="flex min-h-screen w-full flex-col">
        <AppHeader />
        <div className="container mx-auto px-4 py-8">
            {partnershipReady ? (
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
