
'use client';

import * as React from 'react';
import { Loader2 } from 'lucide-react';
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
import type { Partnership } from '@/types';
import { db } from '@/lib/firebase';
import { doc, updateDoc, addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { useFormStatus } from 'react-dom';

interface HarmonyFlameProps {
  partnership: Partnership;
}

export function HarmonyFlame({ partnership }: HarmonyFlameProps) {
  const [actualDays, setActualDays] = React.useState(0);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const { toast } = useToast();
  const formRef = React.useRef<HTMLFormElement>(null);
  
  React.useEffect(() => {
    if (partnership.harmonyFlame.lastReset) {
      const now = new Date();
      const resetDate = new Date(partnership.harmonyFlame.lastReset);
      const days = differenceInDays(now, resetDate);
      setActualDays(days);
    }
  }, [partnership.harmonyFlame.lastReset]);

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

  const getFlameColor = () => {
    if (actualDays >= 60) return 'hsl(var(--primary))'; // Dourado Final
    if (actualDays >= 30) return 'hsl(35, 90%, 55%)'; // Transição para Dourado
    return 'hsl(var(--accent))'; // Vermelho/Laranja inicial
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center text-center">
        <div className="relative mx-auto h-16 w-16">
          <div className="font-headline absolute left-1/2 top-[68%] z-10 -translate-x-1/2 -translate-y-1/2 text-3xl font-bold leading-none text-foreground">
            {actualDays}
          </div>
          <svg
            className="absolute left-0 top-0 h-full w-full"
            viewBox="260 140 500 872"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill={getFlameColor()}
              d="M514.025,1012.395c-32.019,0-62.303-6.131-90.014-18.224c-25.072-10.941-48.149-26.791-68.588-47.108   c-34.981-34.772-61.978-82.7-76.019-134.954c-10.302-38.341-11.697-80.119-4.035-120.817c7.646-40.612,23.995-78.519,47.28-109.62   c1.921-2.567,5.379-3.433,8.284-2.075c2.904,1.357,4.457,4.566,3.72,7.687c-6.974,29.529-5.526,58.726,4.077,82.212   c10.623,25.981,32.313,45.144,55.259,48.819c24.433,3.915,50.158-11.223,58.571-34.459c8.659-23.936,0.269-50.973-7.847-77.12   c-1.891-6.092-3.846-12.391-5.552-18.549c-14.574-52.57-11.019-111.402,10.012-165.659   c21.071-54.362,57.428-98.311,102.373-123.751c2.803-1.587,6.337-0.979,8.447,1.457c2.11,2.434,2.213,6.018,0.244,8.568   c-16.362,21.199-24.733,61.461-6.547,103.625c8.457,19.615,23.275,44.935,69.056,84.02c5.463,4.662,11.104,9.352,16.56,13.888   c22.907,19.047,46.595,38.742,65.681,63.287c27.289,35.1,45.541,81.588,52.784,134.439c6.619,48.3,3.369,97.927-9.15,139.741   c-14.482,48.368-42.005,88.918-79.592,117.267C627.391,996.472,575.24,1012.395,514.025,1012.395z"
            />
          </svg>
        </div>
        <h2 className="mt-0 text-xs font-normal uppercase tracking-widest text-muted-foreground">
          dias de harmonia
        </h2>
      </div>

      <Button variant="outline" size="sm" onClick={() => setIsDialogOpen(true)}>
        Resetar
      </Button>
      
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
