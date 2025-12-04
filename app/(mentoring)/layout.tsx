import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import Link from 'next/link';

export default async function MentoringLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect('/api/auth/signin');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-8">
              <Link href="/" className="font-bold text-xl">
                Pana Mia
              </Link>
              <Link
                href="/mentoring/discover"
                className="text-gray-600 hover:text-gray-900"
              >
                Discover
              </Link>
              <Link
                href="/mentoring/schedule"
                className="text-gray-600 hover:text-gray-900"
              >
                My Sessions
              </Link>
              <Link
                href="/mentoring/profile"
                className="text-gray-600 hover:text-gray-900"
              >
                Mentoring Profile
              </Link>
            </div>
            <div className="text-sm text-gray-600">{session.user.email}</div>
          </div>
        </div>
      </nav>
      <main className="container mx-auto py-8 px-4">{children}</main>
    </div>
  );
}
