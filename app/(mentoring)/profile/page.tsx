import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import dbConnect from '@/lib/connectdb';
import Profile from '@/lib/model/profile';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default async function MentoringProfilePage() {
  const session = await auth();
  if (!session?.user?.email) {
    redirect('/api/auth/signin');
  }

  await dbConnect();
  const profile = await Profile.findOne({ email: session.user.email });

  const mentoringEnabled = profile?.mentoring?.enabled || false;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Mentoring Profile</h1>
        <Link href="/mentoring/profile/edit">
          <Button>Edit Profile</Button>
        </Link>
      </div>

      {!mentoringEnabled && (
        <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
          <p className="text-yellow-800">
            Your mentoring profile is not enabled. Edit your profile to start
            mentoring.
          </p>
        </div>
      )}

      {mentoringEnabled && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg border">
            <h2 className="text-xl font-semibold mb-4">Bio</h2>
            <p>{profile.mentoring.bio || 'No bio provided'}</p>
          </div>

          <div className="bg-white p-6 rounded-lg border">
            <h2 className="text-xl font-semibold mb-4">Expertise</h2>
            <div className="flex flex-wrap gap-2">
              {profile.mentoring.expertise?.map((skill: string) => (
                <span
                  key={skill}
                  className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border">
            <h2 className="text-xl font-semibold mb-4">Languages</h2>
            <div className="flex flex-wrap gap-2">
              {profile.mentoring.languages?.map((lang: string) => (
                <span
                  key={lang}
                  className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm"
                >
                  {lang}
                </span>
              ))}
            </div>
          </div>

          {profile.mentoring.videoIntroUrl && (
            <div className="bg-white p-6 rounded-lg border">
              <h2 className="text-xl font-semibold mb-4">
                Video Introduction
              </h2>
              <video
                src={profile.mentoring.videoIntroUrl}
                controls
                className="w-full"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
