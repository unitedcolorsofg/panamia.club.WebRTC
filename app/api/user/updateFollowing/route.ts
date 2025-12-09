// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import dbConnect from '@/lib/connectdb';
import user from '@/lib/model/user';
import { unguardUser } from '@/lib/user';

interface ResponseData {
  error?: string;
  success?: boolean;
  msg?: string;
  data?: any[] | any;
}

const getUserByEmail = async (email: string) => {
  await dbConnect();
  const User = await user.findOne({ email: email });
  return User;
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

  const { action, id } = body;
  console.log('id', id);

  const existingUser = await getUserByEmail(email);
  let msg = 'No action';
  if (existingUser) {
    const following = existingUser.following || [];
    const idIndex = following.indexOf(id);
    if (action == 'follow') {
      if (idIndex > -1) {
        msg = 'Already following';
      } else {
        following.push(id);
        msg = 'Followed';
        existingUser.set('following', following);
      }
    }

    if (action == 'unfollow') {
      if (idIndex > -1) {
        following.splice(idIndex, 1);
        msg = 'Unfollowed';
        existingUser.set('following', following);
      } else {
        msg = 'Already unfollowed';
      }
    }

    try {
      existingUser.save();
      console.log('updateFollowing:', msg);
    } catch (e) {
      if (e instanceof Error) {
        console.log(e.message);
        return NextResponse.json({
          success: false,
          error: e.message,
          msg: msg,
        });
      }
    }
    return NextResponse.json({
      success: true,
      data: unguardUser(existingUser),
      msg: msg,
    });
  }
  return NextResponse.json({
    success: false,
    error: 'Could not find pofile',
    msg: msg,
  });
}
