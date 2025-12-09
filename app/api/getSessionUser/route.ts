import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import dbConnect from '@/lib/connectdb';
import user from '@/lib/model/user';
import { uniqueAffiliateCode } from '@/lib/server/user';

const getUserByEmail = async (email: string) => {
  await dbConnect();
  const User = await user.findOne({ email: email });
  return User;
};

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
    return NextResponse.json(
      { error: 'Email value required' },
      { status: 200 }
    );
  }

  const existingUser = await getUserByEmail(email);

  if (!existingUser) {
    console.log('getSessionUser:newUser');
    const newUser = new user({
      email: email,
      name: session.user?.name,
      status: {
        role: 'user',
        locked: null,
      },
      affiliate: {
        activated: false,
        code: await uniqueAffiliateCode(),
        accepted_tos: null,
        tier: 0,
        points: 0,
      },
      alternate_emails: [],
      zipCode: null,
    });

    try {
      await newUser.save();
      return NextResponse.json({ success: true, data: newUser });
    } catch (err) {
      return NextResponse.json(
        { error: 'Error creating user: ' + err },
        { status: 400 }
      );
    }
  }

  if (
    existingUser &&
    (typeof existingUser.affiliate === 'undefined' ||
      Object.keys(existingUser.affiliate).length === 0)
  ) {
    existingUser.set(
      'affiliate',
      {
        activated: false,
        code: await uniqueAffiliateCode(),
        accepted_tos: null,
        tier: 0,
        points: 0,
      },
      { strict: false }
    );
    await existingUser.save();
  }

  return NextResponse.json({ success: true, data: existingUser });
}

export const maxDuration = 5;
