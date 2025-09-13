'use client';

import * as React from 'react';
import { Flame, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
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
import { LiquidFlame } from './liquid-flame';
import { EvolvingFlame } from './evolving-flame';
import { HarmonyGarden } from './harmony-garden';

interface HarmonyFlameProps {
  partnership: Partnership;
}

const animationComponents = ['liquid', 'evolving', 'garden'] as const;
type AnimationType = typeof animationComponents[number];


export function HarmonyFlame({ partnership }: HarmonyFlameProps) {
  const [actualDays, setActualDays] = React.useState(0);
  const [simulatedDays, setSimulatedDays] = React.useState(0);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [currentAnimation, setCurrentAnimation] = React.useState<AnimationType>('liquid');

  const { toast } = useToast();
  const formRef = React.useRef<HTMLFormElement>(null);
  
  React.useEffect(() => {
    if (partnership.harmonyFlame.lastReset) {
      const now = new Date();
      const resetDate = new Date(partnership.harmonyFlame.lastReset);
      const days = differenceInDays(now, resetDate);
      setActualDays(days);
      setSimulatedDays(days); // Start simulation from actual days
    }
  }, [partnership.harmonyFlame.lastReset]);

  // Simulation effect to showcase animations
  React.useEffect(() => {
    const interval = setInterval(() => {
      setSimulatedDays(prevDays => (prevDays >= 100 ? 0 : prevDays + 1));
    }, 200); // Increase days every 200ms for demo

    return () => clearInterval(interval);
  }, []);

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
  
  const handleNextAnimation = () => {
      const currentIndex = animationComponents.indexOf(currentAnimation);
      const nextIndex = (currentIndex + 1) % animationComponents.length;
      setCurrentAnimation(animationComponents[nextIndex]);
  }

  const handlePrevAnimation = () => {
      const currentIndex = animationComponents.indexOf(currentAnimation);
      const prevIndex = (currentIndex - 1 + animationComponents.length) % animationComponents.length;
      setCurrentAnimation(animationComponents[prevIndex]);
  }

  const renderAnimation = () => {
    switch (currentAnimation) {
      case 'liquid':
        return <LiquidFlame days={simulatedDays} />;
      case 'evolving':
        return <EvolvingFlame days={simulatedDays} />;
      case 'garden':
        return <HarmonyGarden days={simulatedDays} />;
      default:
        return <LiquidFlame days={simulatedDays} />;
    }
  }

  return (
    <>
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={handlePrevAnimation} className="h-8 w-8">
            <ChevronLeft />
        </Button>

        <div className="flex items-center gap-3">
            {renderAnimation()}
            <div className="text-center w-20">
                <p className="font-headline text-4xl font-bold text-foreground">{actualDays}</p>
                <p className="text-xs text-muted-foreground">dias de harmonia</p>
            </div>
        </div>
        
        <Button variant="ghost" size="icon" onClick={handleNextAnimation} className="h-8 w-8">
            <ChevronRight />
        </Button>

        <Button variant="outline" size="sm" onClick={() => setIsDialogOpen(true)}>
          Resetar
        </Button>
      </div>
      
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
