'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { HarmonyFlame } from './harmony-flame';
import { LogOut, Bell, BellOff } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from '@/components/ui/dropdown-menu';
import { InvitationsDropdown } from './invitations-dropdown';
import { Inbox } from 'lucide-react';
import Image from 'next/image';
import { usePushNotifications } from '@/hooks/use-push-notifications';

export function AppHeader() {
  const { user, partnership, logout, invitations } = useAuth();
  const {
    isSubscribed,
    subscribe,
    unsubscribe,
    permissionStatus,
    isSupported,
  } = usePushNotifications();

  
  const user1 = partnership?.members.find(m => m.id === user?.uid);
  const user2 = partnership?.members.find(m => m.id !== user?.uid);
  const pendingInvitationsCount = invitations.length;
  
  const handleNotificationToggle = () => {
    if (isSubscribed) {
      unsubscribe();
    } else {
      subscribe();
    }
  };


  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto flex h-24 items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <Image src="/logo.png" alt="DuoFlow Logo" width={40} height={40} />
          <h1 className="hidden md:block text-2xl font-bold tracking-tighter text-primary">DuoFlow</h1>        </div>
        {user && (
           <div className="flex flex-grow items-center justify-center">
             {partnership && <HarmonyFlame partnership={partnership} />}
           </div>
        )}
        {user && (
           <div className="flex items-center gap-2 md:gap-4">

            {isSupported && permissionStatus === 'granted' && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleNotificationToggle}
                title={isSubscribed ? "Desativar Notificações" : "Ativar Notificações"}
              >
                {isSubscribed ? <Bell className="h-5 w-5" /> : <BellOff className="h-5 w-5 text-muted-foreground" />}
              </Button>
            )}

            {isSupported && permissionStatus !== 'granted' && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleNotificationToggle}
                title="Ativar Notificações"
              >
                <BellOff className="h-5 w-5" />
              </Button>
            )}
            
            {!partnership ? (
              <InvitationsDropdown>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Inbox className="h-5 w-5" />
                  {pendingInvitationsCount > 0 && (
                    <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-xs font-bold text-white">
                      {pendingInvitationsCount}
                    </span>
                  )}
                </Button>
              </InvitationsDropdown>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                   <button className="flex items-center -space-x-2 md:-space-x-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-full">
                      {user1 && (
                          <Avatar className="h-10 w-10 md:h-12 md:w-12 border-2 md:border-4 border-background">
                              <AvatarImage src={user1.photoURL} alt={user1.displayName} data-ai-hint="person portrait" />
                              <AvatarFallback>{user1.displayName.charAt(0)}</AvatarFallback>
                          </Avatar>
                      )}
                       {user2 && (
                          <Avatar className="h-10 w-10 md:h-12 md:w-12 border-2 md:border-4 border-background">
                              <AvatarImage src={user2.photoURL} alt={user2.displayName} data-ai-hint="person portrait" />
                              <AvatarFallback>{user2.displayName.charAt(0)}</AvatarFallback>
                          </Avatar>
                       )}
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-64" align="end" forceMount>
                   <DropdownMenuLabel>
                      <div className="flex flex-col space-y-1">
                          <p className="text-sm font-medium leading-none">{user.displayName}</p>
                          <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                      </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout} className="text-destructive focus:bg-destructive/10 focus:text-destructive">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sair</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
