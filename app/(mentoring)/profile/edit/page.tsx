import { auth } from '@/auth';
import { redirect } from 'next/navigation';

export default async function EditProfilePage() {
  const session = await auth();
  if (!session?.user?.email) {
    redirect('/api/auth/signin');
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">Edit Mentoring Profile</h1>
      <div className="bg-white p-6 rounded-lg border">
        <p className="text-gray-600">
          Profile editing form will be implemented in Phase 7. This includes:
        </p>
        <ul className="list-disc list-inside mt-4 space-y-2 text-gray-700">
          <li>Enable/disable mentoring</li>
          <li>Add expertise tags</li>
          <li>Select languages</li>
          <li>Set availability schedule</li>
          <li>Upload video introduction</li>
          <li>Set hourly rate</li>
        </ul>
      </div>
    </div>
  );
}
