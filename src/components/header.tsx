'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { HarmonyFlame } from './harmony-flame';
import { Flame, LogOut } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function AppHeader() {
  const { user, partnership, logout } = useAuth();
  
  const user1 = partnership?.members.find(m => m.id === user?.uid);
  const user2 = partnership?.members.find(m => m.id !== user?.uid);

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur-sm">
      <div className="container mx-auto flex h-20 items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <Flame className="h-8 w-8 text-accent" />
          <h1 className="text-2xl font-bold tracking-tight text-foreground">DuoFlow</h1>
        </div>
        {user && (
           <div className="flex items-center gap-6">
            {partnership && <HarmonyFlame partnership={partnership} />}
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
             <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={user.photoURL ?? ''} alt={user.displayName ?? ''} />
                    <AvatarFallback>{user.displayName?.charAt(0)}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
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
