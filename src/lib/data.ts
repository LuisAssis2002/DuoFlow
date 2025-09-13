import type { Partnership } from '@/types';
import { subDays, addDays } from 'date-fns';

const now = new Date();

const mockData: Partnership = {
  id: 'partner123',
  members: [
    {
      id: 'user1',
      displayName: 'Alex',
      email: 'alex@example.com',
      photoURL: 'https://picsum.photos/seed/user1/100/100',
    },
    {
      id: 'user2',
      displayName: 'Ben',
      email: 'ben@example.com',
      photoURL: 'https://picsum.photos/seed/user2/100/100',
    },
  ],
  harmonyFlame: {
    lastReset: subDays(now, 27).toISOString(),
  },
  tasks: [
    {
      id: 'task1',
      title: 'Estudar para a prova de Cálculo',
      description: 'Revisar capítulos 3 e 4 do livro e fazer os exercícios propostos.',
      type: 'Progressiva',
      difficulty: 'Difícil',
      startDate: subDays(now, 2).toISOString(),
      endDate: addDays(now, 3).toISOString(),
      status: 'Pendente',
      assignedTo: 'user1',
      createdBy: 'user2',
    },
    {
      id: 'task2',
      title: 'Limpar o apartamento',
      description: 'Focar na cozinha e no banheiro, que estão mais críticos.',
      type: 'Única',
      difficulty: 'Média',
      endDate: addDays(now, 1).toISOString(),
      status: 'Pendente',
      assignedTo: 'user2',
      createdBy: 'user1',
    },
    {
      id: 'task3',
      title: 'Ir ao supermercado',
      description: 'Comprar itens da lista: pão, leite, ovos, frutas e legumes.',
      type: 'Única',
      difficulty: 'Fácil',
      endDate: now.toISOString(),
      status: 'Concluída',
      assignedTo: 'user1',
      createdBy: 'user1',
    },
     {
      id: 'task4',
      title: 'Passear com o cachorro',
      description: 'Leva o doguinho no parque por pelo menos 30 minutos.',
      type: 'Única',
      difficulty: 'Rotineira',
      endDate: subDays(now, 1).toISOString(),
      status: 'Concluída',
      assignedTo: 'user2',
      createdBy: 'user2',
    },
    {
      id: 'task5',
      title: 'Planejar viagem de férias',
      description: 'Pesquisar destinos, voos e hotéis para a viagem de fim de ano.',
      type: 'Única',
      difficulty: 'Média',
      endDate: addDays(now, 15).toISOString(),
      status: 'Pendente',
      assignedTo: 'user1',
      createdBy: 'user2',
    },
  ],
};

export async function getPartnershipData(): Promise<Partnership> {
  // In a real app, this would fetch data from Firebase
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockData);
    }, 500);
  });
}
