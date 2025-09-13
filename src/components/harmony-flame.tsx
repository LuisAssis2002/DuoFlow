'use client';

import * as React from 'react';
import { useFormState } from 'react-dom';
import { Flame } from 'lucide-react';
import { differenceInDays } from 'date-fns';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { getResetHarmonyFlameAdvice, resetHarmonyFlame, type AdviceFormState } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { SubmitButton } from './submit-button';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';

interface HarmonyFlameProps {
  lastReset: string;
}

export function HarmonyFlame({ lastReset }: HarmonyFlameProps) {
  const [days, setDays] = React.useState(0);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);

  const { toast } = useToast();
  const formRef = React.useRef<HTMLFormElement>(null);

  const initialState: AdviceFormState = {};
  const [state, formAction] = useFormState(getResetHarmonyFlameAdvice, initialState);

  React.useEffect(() => {
    const now = new Date();
    const resetDate = new Date(lastReset);
    setDays(differenceInDays(now, resetDate));
  }, [lastReset]);
  
  React.useEffect(() => {
    if (state.advice) {
      // Don't clear form on advice received, so user can re-submit
    } else if (state.error) {
      // Handle error display if needed
    }
  }, [state]);


  const handleConfirmReset = async () => {
    const result = await resetHarmonyFlame();
    if (result.success) {
      toast({
        title: 'Sucesso!',
        description: result.message,
      });
      setIsDialogOpen(false);
      formRef.current?.reset();
      // In a real app, the data would refetch via a listener.
      // Here we can just visually reset the days.
      setDays(0);
    } else {
      toast({
        title: 'Erro',
        description: result.message,
        variant: 'destructive',
      });
    }
  };

  const flameSize = Math.min(3 + days / 7, 8); // Flame grows slowly, max size h-8 w-8

  return (
    <>
      <div className="flex items-center gap-3">
        <Flame
          className="text-accent transition-all duration-500"
          style={{
            width: `${flameSize}rem`,
            height: `${flameSize}rem`,
            animation: days > 10 ? 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' : 'none',
          }}
        />
        <div className="text-center">
          <p className="font-headline text-4xl font-bold text-foreground">{days}</p>
          <p className="text-xs text-muted-foreground">dias de harmonia</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => setIsDialogOpen(true)}>
          Resetar
        </Button>
      </div>
      <style jsx>{`
        @keyframes pulse {
          50% {
            opacity: 0.8;
            transform: scale(1.1);
          }
        }
      `}</style>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Resetar a Chama da Harmonia?</DialogTitle>
            <DialogDescription>
              Esta ação reiniciará a contagem de dias. Antes de decidir, receba um conselho da nossa IA com base nos eventos recentes.
            </DialogDescription>
          </DialogHeader>
          
          {!state?.advice ? (
            <form action={formAction} ref={formRef} className="grid gap-4 py-4">
              <div className="grid w-full gap-1.5">
                <Label htmlFor="recentEvents">Eventos Recentes</Label>
                <Textarea
                  placeholder="Descreva brevemente o que aconteceu entre vocês..."
                  id="recentEvents"
                  name="recentEvents"
                  required
                />
                 {typeof state.error === 'object' && state.error.recentEvents && (
                   <p className="text-sm font-medium text-destructive">{state.error.recentEvents[0]}</p>
                 )}
              </div>
              <DialogFooter>
                <SubmitButton>Obter Conselho</SubmitButton>
              </DialogFooter>
            </form>
          ) : (
            <div className="space-y-4 py-4">
               <Alert>
                <Flame className="h-4 w-4" />
                <AlertTitle>Conselho da IA</AlertTitle>
                <AlertDescription>{state.advice}</AlertDescription>
              </Alert>
              <DialogFooter className="sm:justify-between">
                <Button variant="ghost" onClick={() => formAction(new FormData())}>Tentar novamente</Button>
                <div className="space-x-2">
                    <DialogClose asChild>
                        <Button variant="outline">Cancelar</Button>
                    </DialogClose>
                    <Button variant="destructive" onClick={handleConfirmReset}>Confirmar Reset</Button>
                </div>
              </DialogFooter>
            </div>
          )}

        </DialogContent>
      </Dialog>
    </>
  );
}
