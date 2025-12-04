import { auth } from '@/auth';
import { redirect } from 'next/navigation';

export default async function BookSessionPage() {
  const session = await auth();
  if (!session?.user?.email) {
    redirect('/api/auth/signin');
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">Book a Session</h1>
      <div className="bg-white p-6 rounded-lg border">
        <p className="text-gray-600">
          Booking form will be implemented in Phase 7. This will include:
        </p>
        <ul className="list-disc list-inside mt-4 space-y-2 text-gray-700">
          <li>Calendar view with mentor's availability</li>
          <li>Time slot selection</li>
          <li>Topic input field</li>
          <li>Duration selection (15, 30, 60, 90, 120 minutes)</li>
          <li>Confirmation flow</li>
        </ul>
      </div>
    </div>
  );
}
