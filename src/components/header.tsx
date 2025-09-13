'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { HarmonyFlame } from './harmony-flame';
import { LogOut, Settings } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { InvitationsDropdown } from './invitations-dropdown';
import { Inbox } from 'lucide-react';
import Image from 'next/image';

export function AppHeader() {
  const { user, partnership, logout, invitations } = useAuth();
  
  const user1 = partnership?.members.find(m => m.id === user?.uid);
  const user2 = partnership?.members.find(m => m.id !== user?.uid);
  const pendingInvitationsCount = invitations.length;

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur-sm">
      <div className="container mx-auto flex h-20 items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <Image src="/logo.png" alt="DuoFlow Logo" width={40} height={40} />
          <h1 className="text-2xl font-bold tracking-tight text-foreground">DuoFlow</h1>
        </div>
        {user && (
           <div className="flex items-center gap-6">
            {partnership && <HarmonyFlame partnership={partnership} />}
            {partnership && (
              <div className="flex items-center -space-x-2">
                  {user1 && (
                      <Avatar className="h-10 w-10 border-2 border-background">
                          <AvatarImage src={user1.photoURL} alt={user1.displayName} data-ai-hint="person portrait" />
                          <AvatarFallback>{user1.displayName.charAt(0)}</AvatarFallback>
                      </Avatar>
                  )}
                   {user2 && (
                      <Avatar className="h-10 w-10 border-2 border-background">
                          <AvatarImage src={user2.photoURL} alt={user2.displayName} data-ai-hint="person portrait" />
                          <AvatarFallback>{user2.displayName.charAt(0)}</AvatarFallback>
                      </Avatar>
                   )}
              </div>
            )}

            {!partnership && (
              <InvitationsDropdown>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Inbox className="h-6 w-6" />
                  {pendingInvitationsCount > 0 && (
                    <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                      {pendingInvitationsCount}
                    </span>
                  )}
                </Button>
              </InvitationsDropdown>
            )}

             <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Settings className="h-6 w-6" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                 <DropdownMenuItem disabled>
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user.displayName}</p>
                        <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                    </div>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={logout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sair</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>
    </header>
  );
}
