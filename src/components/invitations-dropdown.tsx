'use client';

import * as React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/hooks/use-auth';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { Check, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface InvitationsDropdownProps {
  children: React.ReactNode;
}

export function InvitationsDropdown({ children }: InvitationsDropdownProps) {
  const { invitations, acceptInvitation, declineInvitation } = useAuth();
  const { toast } = useToast();

  const handleAccept = async (id: string) => {
    try {
        await acceptInvitation(id);
        toast({
            title: "Convite Aceito!",
            description: "Você e seu parceiro agora estão conectados."
        });
    } catch(e) {
        toast({
            title: "Erro",
            description: "Falha ao aceitar o convite.",
            variant: "destructive"
        });
    }
  };

  const handleDecline = async (id: string) => {
    try {
        await declineInvitation(id);
        toast({
            title: "Convite Recusado",
        });
    } catch (e) {
        toast({
            title: "Erro",
            description: "Falha ao recusar o convite.",
            variant: "destructive"
        });
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent className="w-80" align="end">
        <DropdownMenuLabel>Convites Pendentes</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {invitations.length > 0 ? (
          invitations.map((inv) => (
            <DropdownMenuItem key={inv.id} className="gap-3" onSelect={(e) => e.preventDefault()}>
              <Avatar>
                <AvatarImage src={inv.from.photoURL} />
                <AvatarFallback>{inv.from.displayName.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-grow">
                <p className="font-semibold">{inv.from.displayName}</p>
                <p className="text-xs text-muted-foreground">convidou você</p>
              </div>
              <div className="flex gap-2">
                <Button size="icon" className="h-8 w-8 bg-green-500 hover:bg-green-600" onClick={() => handleAccept(inv.id)}>
                  <Check className="h-4 w-4" />
                </Button>
                <Button variant="destructive" size="icon" className="h-8 w-8" onClick={() => handleDecline(inv.id)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </DropdownMenuItem>
          ))
        ) : (
          <p className="p-4 text-center text-sm text-muted-foreground">
            Nenhum convite pendente.
          </p>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
