import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import dbConnect from '@/lib/connectdb';
import profile from '@/lib/model/profile';

async function getProfile(email: string) {
  await dbConnect();
  const Profile = await profile.findOne({ email: email });
  return Profile;
}

export async function GET(request: NextRequest) {
  const session = await auth();

  if (!session) {
    return NextResponse.json(
      { error: 'No user session available' },
      { status: 401 }
    );
  }

  const email = session.user?.email
    ? (session.user?.email as string).toLowerCase()
    : null;

  if (!email) {
    return NextResponse.json({ error: 'No logged in user' }, { status: 200 });
  }

  const existingProfile = await getProfile(email);

  if (existingProfile) {
    return NextResponse.json({ success: true, data: existingProfile });
  }

  return NextResponse.json({ success: true });
}

export const maxDuration = 5;
