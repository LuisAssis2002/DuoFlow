'use client';

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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Flame } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { SubmitButton } from './submit-button';

const formSchema = z.object({
  email: z.string().email({ message: 'Por favor, insira um e-mail válido.' }),
});

export function PairForm() {
  const { toast } = useToast();
  const router = useRouter();
  const { user } = useAuth();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!user) {
        toast({
            title: 'Erro',
            description: 'Você precisa estar logado para enviar um convite.',
            variant: 'destructive'
        });
        return;
    }

    if (user.email === values.email) {
      toast({
        title: 'Erro',
        description: 'Você não pode convidar a si mesmo.',
        variant: 'destructive',
      });
      return;
    }
    
    try {
        await addDoc(collection(db, 'invitations'), {
            from: {
                id: user.uid,
                displayName: user.displayName,
                photoURL: user.photoURL
            },
            toEmail: values.email,
            status: 'pending',
            createdAt: serverTimestamp()
        });

        toast({
          title: 'Convite Enviado!',
          description: `Um convite foi enviado para ${values.email}. Você será redirecionado para o painel principal.`,
        });

        setTimeout(() => {
            router.push('/');
        }, 2000);

    } catch (error) {
        console.error("Erro ao enviar convite: ", error);
        toast({
            title: 'Erro',
            description: 'Houve uma falha ao enviar o convite. Tente novamente.',
            variant: 'destructive'
        });
    }

  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="items-center text-center">
        <Flame className="h-10 w-10 text-accent" />
        <CardTitle className="text-2xl">Convidar seu parceiro</CardTitle>
        <CardDescription>
          Insira o e-mail do seu parceiro para conectá-lo ao DuoFlow.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>E-mail do parceiro</FormLabel>
                  <FormControl>
                    <Input placeholder="parceiro@gmail.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex flex-col gap-4">
                <SubmitButton className="w-full">
                    Enviar Convite
                </SubmitButton>
                <Button variant="outline" asChild>
                    <Link href="/">Voltar para o Painel</Link>
                </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
