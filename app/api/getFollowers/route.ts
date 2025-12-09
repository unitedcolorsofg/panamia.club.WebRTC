import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/connectdb';
import followers from '@/lib/model/followers';

async function getFollowers(userId: string) {
  await dbConnect();
  console.log(userId);

  const Followers = await followers.find({ userId: userId });

  if (Followers) {
    console.log(Followers);
  }
  return Followers;
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const userId = searchParams.get('userId');

  if (userId) {
    console.log(userId);
    try {
      const Followers = await getFollowers(userId.toString());
      return NextResponse.json(Followers);
    } catch (err: any) {
      return NextResponse.json(
        { error: "Error on '/api/getFollowers': " + err },
        { status: 400 }
      );
    }
  }

  return NextResponse.json(
    { error: 'Missing userId parameter' },
    { status: 400 }
  );
}
