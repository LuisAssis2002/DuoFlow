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
import { resetHarmonyFlame, type ResetFormState } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { SubmitButton } from './submit-button';

interface HarmonyFlameProps {
  lastReset: string;
}

export function HarmonyFlame({ lastReset }: HarmonyFlameProps) {
  const [days, setDays] = React.useState(0);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);

  const { toast } = useToast();
  const formRef = React.useRef<HTMLFormElement>(null);

  const initialState: ResetFormState = { success: false, message: '' };
  const [state, formAction] = useFormState(resetHarmonyFlame, initialState);

  React.useEffect(() => {
    const now = new Date();
    const resetDate = new Date(lastReset);
    setDays(differenceInDays(now, resetDate));
  }, [lastReset]);

  React.useEffect(() => {
    if (state.success) {
      toast({
        title: 'Sucesso!',
        description: state.message,
      });
      setIsDialogOpen(false);
      formRef.current?.reset();
      // Em um aplicativo real, os dados seriam atualizados por um listener.
      // Aqui, podemos apenas reiniciar visualmente os dias.
      setDays(0);
    } else if (state.message && (state.error || !state.success)) {
        toast({
            title: 'Erro',
            description: state.message,
            variant: 'destructive',
        });
    }
  }, [state, toast]);

  const flameSize = Math.min(2.5 + days / 10, 6); // A chama cresce lentamente, tamanho máx h-6 w-6

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
              Esta ação reiniciará a contagem de dias. Descreva o motivo do reset. Isso será registrado para referência futura.
            </DialogDescription>
          </DialogHeader>

          <form action={formAction} ref={formRef} className="grid gap-4 py-4">
            <div className="grid w-full gap-1.5">
              <Label htmlFor="reason">Motivo do Reset</Label>
              <Textarea
                placeholder="Descreva brevemente o que aconteceu..."
                id="reason"
                name="reason"
                required
              />
              {typeof state.error === 'object' && state.error.reason && (
                <p className="text-sm font-medium text-destructive">{state.error.reason[0]}</p>
              )}
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancelar</Button>
              </DialogClose>
              <SubmitButton variant="destructive">Confirmar Reset</SubmitButton>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
