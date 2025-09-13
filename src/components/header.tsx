import type { Partnership } from '@/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { HarmonyFlame } from './harmony-flame';
import { Flame } from 'lucide-react';

interface AppHeaderProps {
  partnership: Partnership;
}

export function AppHeader({ partnership }: AppHeaderProps) {
  const [user1, user2] = partnership.members;

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur-sm">
      <div className="container mx-auto flex h-20 items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <Flame className="h-8 w-8 text-accent" />
          <h1 className="text-2xl font-bold tracking-tight text-foreground">DuoFlow</h1>
        </div>
        <div className="flex items-center gap-6">
          <HarmonyFlame lastReset={partnership.harmonyFlame.lastReset} />
          <div className="flex items-center -space-x-2">
            <Avatar className="h-10 w-10 border-2 border-background">
              <AvatarImage src={user1.photoURL} alt={user1.displayName} data-ai-hint="person portrait" />
              <AvatarFallback>{user1.displayName.charAt(0)}</AvatarFallback>
            </Avatar>
            <Avatar className="h-10 w-10 border-2 border-background">
              <AvatarImage src={user2.photoURL} alt={user2.displayName} data-ai-hint="person portrait" />
              <AvatarFallback>{user2.displayName.charAt(0)}</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>
    </header>
  );
}
