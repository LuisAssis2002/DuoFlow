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

const formSchema = z.object({
  email: z.string().email({ message: 'Por favor, insira um e-mail válido.' }),
});

export function PairForm() {
  const { toast } = useToast();
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Em um aplicativo real, aqui você enviaria um convite para o e-mail do parceiro
    // e criaria um registro de parceria pendente no Firestore.
    console.log('Convite de pareamento simulado enviado para:', values.email);

    toast({
      title: 'Convite Enviado!',
      description: `Um convite foi enviado para ${values.email}. Você será redirecionado para o painel principal.`,
    });

    // Simula o redirecionamento após o sucesso
    setTimeout(() => {
        router.push('/');
    }, 2000);
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
                <Button type="submit" className="w-full">
                    Enviar Convite
                </Button>
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
