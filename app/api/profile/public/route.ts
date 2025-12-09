import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/connectdb';
import profile from '@/lib/model/profile';
import { unguardProfile } from '@/lib/profile';

async function getProfile(slug: string) {
  await dbConnect();
  const Profile = await profile.findOne({ slug: slug });
  return Profile;
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const handle = searchParams.get('handle');

  if (handle) {
    const existingProfile = await getProfile(handle.toLowerCase());
    if (existingProfile) {
      return NextResponse.json({
        success: true,
        data: unguardProfile(existingProfile),
      });
    }
  }

  return NextResponse.json({ success: true });
}

export const maxDuration = 5;
