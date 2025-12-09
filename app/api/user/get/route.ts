// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import dbConnect from '@/lib/connectdb';
import user from '@/lib/model/user';
import { unguardUser } from '@/lib/user';
import BrevoApi from '@/lib/brevo_api';
import { getBrevoConfig } from '@/config/brevo';

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

    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return NextResponse.json({
        success: true,
        data: unguardUser(existingUser),
      });
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
