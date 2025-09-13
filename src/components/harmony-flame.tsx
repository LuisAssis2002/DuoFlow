'use client';

import * as React from 'react';
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
import { useToast } from '@/hooks/use-toast';
import { SubmitButton } from './submit-button';
import type { Partnership } from '@/types';
import { db } from '@/lib/firebase';
import { doc, updateDoc, addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { useFormStatus } from 'react-dom';

interface HarmonyFlameProps {
  partnership: Partnership;
}

export function HarmonyFlame({ partnership }: HarmonyFlameProps) {
  const [days, setDays] = React.useState(0);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);

  const { toast } = useToast();
  const formRef = React.useRef<HTMLFormElement>(null);
  
  React.useEffect(() => {
    if (partnership.harmonyFlame.lastReset) {
      const now = new Date();
      const resetDate = new Date(partnership.harmonyFlame.lastReset);
      setDays(differenceInDays(now, resetDate));
    }
  }, [partnership.harmonyFlame.lastReset]);


  const flameSize = Math.min(2.5 + days / 10, 6);

  async function handleReset(formData: FormData) {
    const reason = formData.get('reason') as string;
    if (!reason || reason.length < 10) {
        toast({
            title: 'Erro',
            description: 'Por favor, descreva o motivo com mais detalhes (mínimo 10 caracteres).',
            variant: 'destructive',
        });
        return;
    }

    try {
        const partnershipRef = doc(db, 'partnerships', partnership.id);
        await updateDoc(partnershipRef, {
            'harmonyFlame.lastReset': new Date().toISOString()
        });

        const resetsRef = collection(db, 'partnerships', partnership.id, 'resets');
        await addDoc(resetsRef, {
            reason,
            timestamp: serverTimestamp(),
        });
        
        toast({
            title: 'Sucesso!',
            description: 'A Chama da Harmonia foi reiniciada!',
        });
        setIsDialogOpen(false);
        formRef.current?.reset();

    } catch (error) {
        console.error(error);
        toast({
            title: 'Erro',
            description: 'Falha ao reiniciar a Chama da Harmonia.',
            variant: 'destructive',
        });
    }
  }
  
  const FormButton = () => {
    const { pending } = useFormStatus();
    return (
         <Button type="submit" disabled={pending} variant="destructive">
              {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Confirmar Reset
        </Button>
    )
  }

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

          <form action={handleReset} ref={formRef} className="grid gap-4 py-4">
            <div className="grid w-full gap-1.5">
              <Label htmlFor="reason">Motivo do Reset</Label>
              <Textarea
                placeholder="Descreva brevemente o que aconteceu..."
                id="reason"
                name="reason"
                required
              />
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">Cancelar</Button>
              </DialogClose>
              <FormButton />
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
