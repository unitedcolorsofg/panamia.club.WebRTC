import { auth } from '@/auth';
import { redirect } from 'next/navigation';

export default async function SchedulePage() {
  const session = await auth();
  if (!session?.user?.email) {
    redirect('/api/auth/signin');
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">My Sessions</h1>
      <div className="bg-white p-6 rounded-lg border">
        <p className="text-gray-600">
          Sessions dashboard will be implemented in Phase 7. This will show:
        </p>
        <ul className="list-disc list-inside mt-4 space-y-2 text-gray-700">
          <li>Upcoming sessions (as mentor and mentee)</li>
          <li>Past sessions with notes access</li>
          <li>Join session button</li>
          <li>Cancel session functionality</li>
        </ul>
      </div>
    </div>
  );
}
