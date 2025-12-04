import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import dbConnect from '@/lib/connectdb';
import Profile from '@/lib/model/profile';
import { ProfileForm } from './_components/profile-form';

export default async function EditProfilePage() {
  const session = await auth();
  if (!session?.user?.email) {
    redirect('/api/auth/signin');
  }

  await dbConnect();
  const profile = await Profile.findOne({ email: session.user.email });

  const initialData = profile?.mentoring
    ? {
        enabled: profile.mentoring.enabled,
        expertise: profile.mentoring.expertise || [],
        languages: profile.mentoring.languages || [],
        bio: profile.mentoring.bio || '',
        videoIntroUrl: profile.mentoring.videoIntroUrl || '',
        goals: profile.mentoring.goals || '',
        hourlyRate: profile.mentoring.hourlyRate || 0,
      }
    : undefined;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">Edit Mentoring Profile</h1>
      <ProfileForm initialData={initialData} />
    </div>
  );
}
