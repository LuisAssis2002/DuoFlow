'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { HarmonyFlame } from './harmony-flame';
import { LogOut, Inbox, Settings } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { InvitationsDropdown } from './invitations-dropdown';

export function AppHeader() {
  const { user, partnership, logout, invitations } = useAuth();
  
  const user1 = partnership?.members.find(m => m.id === user?.uid);
  const user2 = partnership?.members.find(m => m.id !== user?.uid);
  const pendingInvitationsCount = invitations.length;

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur-sm">
      <div className="container mx-auto flex h-20 items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center">
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id="instagram-gradient-stroke" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#fdf497" />
                  <stop offset="45%" stopColor="#fd5949" />
                  <stop offset="60%" stopColor="#d6249f" />
                  <stop offset="90%" stopColor="#285aeb" />
                </linearGradient>
              </defs>
              <rect
                x="1.5"
                y="1.5"
                width="21"
                height="21"
                rx="5"
                stroke="url(#instagram-gradient-stroke)"
                strokeWidth="2"
              />
              <path
                d="M3 5a2 2 0 0 1 2-2h3.28a1 1 0 0 1 .94.68l1.54 4.62a1 1 0 0 0 .94.68h2.58a1 1 0 0 0 .94-.68l1.54-4.62a1 1 0 0 1 .94-.68H19a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z"
                stroke="url(#instagram-gradient-stroke)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                transform="scale(0.6) translate(4, 3)"
              />
              <path
                d="m12 12 2-10h-4l-2 10"
                stroke="url(#instagram-gradient-stroke)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                transform="scale(0.6) translate(4, 3)"
              />
            </svg>
          </div>
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
