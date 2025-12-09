// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import dbConnect from '@/lib/connectdb';
import profile from '@/lib/model/profile';

interface ResponseData {
  error?: string;
  success?: boolean;
  msg?: string;
  data?: any[];
}

const getProfileByEmail = async (email: string) => {
  await dbConnect();
  const Profile = await profile.findOne({ email: email });
  return Profile;
};

export async function POST(request: NextRequest) {
  const body = await request.json();
  const session = await auth();

  if (!session) {
    return NextResponse.json({
      success: false,
      error: 'No user session available',
    });
  }
  const email = session.user?.email;
  if (!email) {
    return NextResponse.json(
      { success: false, error: 'No valid email' },
      { status: 200 }
    );
  }

  const { phone_number, pronouns } = body;
  console.log('phone_number', phone_number);
  console.log('pronouns', pronouns);

  const existingProfile = await getProfileByEmail(email);
  if (existingProfile) {
    if (phone_number) {
      existingProfile.phone_number = phone_number;
    }
    if (pronouns) {
      existingProfile.pronouns = pronouns;
    }
    try {
      existingProfile.save();
    } catch (e) {
      if (e instanceof Error) {
        console.log(e.message);
        return NextResponse.json(
          { success: false, error: e.message },
          { status: 500 }
        );
      }
    }
    return NextResponse.json(
      { success: true, data: existingProfile },
      { status: 200 }
    );
  }
  return NextResponse.json({ success: false, error: 'Could not find pofile' });
}
