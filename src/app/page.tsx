import { Dashboard } from '@/components/dashboard';
import { getPartnershipData } from '@/lib/data';

export default async function Home() {
  const partnershipData = await getPartnershipData();

  return (
    <main>
      <Dashboard initialData={partnershipData} />
    </main>
  );
}
