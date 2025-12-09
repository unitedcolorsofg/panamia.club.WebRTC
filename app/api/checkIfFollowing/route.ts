import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/connectdb';
import followers from '@/lib/model/followers';

async function getFollowers(userId: string, followerId: string) {
  await dbConnect();
  const Followers = await followers.findOne({
    followerId: followerId,
    userId: userId,
  });
  if (Followers) {
    return true;
  } else {
    return false;
  }
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const userId = searchParams.get('userId');
  const followerId = searchParams.get('followerId');

  if (followerId && userId) {
    console.log(userId);
    try {
      const Followers = await getFollowers(userId, followerId);
      return NextResponse.json(Followers);
    } catch (err: any) {
      return NextResponse.json(
        { error: "Error on '/api/getFollowers': " + err },
        { status: 400 }
      );
    }
  }

  return NextResponse.json(
    { error: 'Missing required parameters' },
    { status: 400 }
  );
}
