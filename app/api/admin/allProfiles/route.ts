// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import dbConnect from '@/lib/connectdb';
import user from '@/lib/model/user';
import { unguardUser } from '@/lib/user';
import BrevoApi from '@/lib/brevo_api';
import { getBrevoConfig } from '@/config/brevo';
import profile from '@/lib/model/profile';
import { unguardProfile } from '@/lib/profile';

interface ResponseData {
  error?: string;
  success?: boolean;
  msg?: string;
  data?: any[] | any;
}

const getUserByEmail = async (email: string) => {
  await dbConnect();
  return await user.findOne({ email: email });
};

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'No user session available' },
        { status: 401 }
      );
    }
    const email = session.user?.email;
    if (!email) {
      return NextResponse.json(
        { success: false, error: 'No valid email' },
        { status: 200 }
      );
    }
    const existingUser = await getUserByEmail(email);
    if (!(existingUser?.status?.role === 'admin')) {
      return NextResponse.json(
        { error: 'Not Authorized:admin' },
        { status: 401 }
      );
    }
    const allActiveProfiles = await profile.find({ active: true });
    const profiles = allActiveProfiles.map((guardedProfile) => {
      return {
        name: guardedProfile.name,
        email: guardedProfile.email,
        handle: guardedProfile.slug,
        phone: guardedProfile.phone_number ? guardedProfile.phone_number : '',
      };
    });
    if (allActiveProfiles) {
      return NextResponse.json(
        { success: true, data: profiles },
        { status: 200 }
      );
    }

    return NextResponse.json({ success: false, error: 'Could not find User' });
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      success: false,
      error: `Server Error ${error}`,
    });
  }
}

export const maxDuration = 5;
