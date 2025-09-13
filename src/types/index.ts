export type UserProfile = {
  id: string;
  displayName: string;
  email: string;
  photoURL: string;
};

export type Task = {
  id: string;
  title: string;
  description: string;
  type: 'Única' | 'Progressiva';
  difficulty: 'Rotineira' | 'Fácil' | 'Média' | 'Difícil';
  startDate?: string | null; // ISO string
  endDate: string; // ISO string
  status: 'Pendente' | 'Concluída';
  assignedTo: string; // userId
  createdBy: string; // userId
};

export type Partnership = {
  id: string;
  members: UserProfile[];
  harmonyFlame: {
    lastReset: string; // ISO string
  };
  tasks: Task[];
};

export type Invitation = {
    id: string;
    from: {
        id: string;
        displayName: string;
        photoURL: string;
    };
    toEmail: string;
    status: 'pending' | 'accepted' | 'declined';
    createdAt: any; // Firestore ServerTimestamp
}
