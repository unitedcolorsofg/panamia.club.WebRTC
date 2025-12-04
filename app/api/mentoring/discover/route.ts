import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import dbConnect from '@/lib/connectdb';
import Profile from '@/lib/model/profile';

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await dbConnect();

  const { searchParams } = new URL(request.url);
  const expertise = searchParams.get('expertise');
  const language = searchParams.get('language');
  const freeOnly = searchParams.get('freeOnly') === 'true';

  const query: any = {
    'mentoring.enabled': true,
    email: { $ne: session.user.email }, // Exclude self
  };

  if (expertise) {
    query['mentoring.expertise'] = expertise;
  }

  if (language) {
    query['mentoring.languages'] = language;
  }

  if (freeOnly) {
    query['mentoring.hourlyRate'] = { $lte: 0 };
  }

  const mentors = await Profile.find(query)
    .select('name email mentoring availability slug images')
    .limit(50);

  return NextResponse.json({ mentors });
}
